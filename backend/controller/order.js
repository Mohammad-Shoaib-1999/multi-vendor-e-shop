const express = require("express")
const router = express.Router();
const Order = require("../model/order")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/ErrorHandler")
const {isAuthenticated,isSeller, isAdmin} = require("../middleware/auth");
const Shop = require("../model/shop");
const Product = require("../model/product");

router.post(
    "/create-order",
    catchAsyncErrors(async (req, res, next) => {
      try {
        // Destructure relevant data from the request body
        const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
  
        // Group cart items by shopId using a Map
        const shopItemsMap = new Map();
  
        // Loop through each item in the cart and group them by shopId
        for (const item of cart) {
          const shopId = item.shopId;
          if (!shopItemsMap.has(shopId)) {
            shopItemsMap.set(shopId, []);
          }
          shopItemsMap.get(shopId).push(item);
        }
  
        // Create an order for each shop
        const orders = [];
  
        // Iterate over the grouped shop items in the map
        for (const [shopId, items] of shopItemsMap) {
          // Create an order using the Order model with provided data
          const order = await Order.create({
            cart: items,
            shippingAddress,
            user,
            totalPrice,
            paymentInfo,
          });
  
          // Add the created order to the orders array
          orders.push(order);
        }
  
        // Respond with a success status and the created orders
        res.status(201).json({
          success: true,
          orders,
        });
      } catch (error) {
        // If any error occurs, handle it and pass it to the error handler middleware
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  

  router.get("/get-all-orders/:userId",catchAsyncErrors(async(req,res,next)=>{
    try {
      const orders = await Order.find({"user._id":req.params.userId}).sort({
        createdAt:-1
      })

      res.status(200).json({success:true,orders})
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));

    }
  }))

  router.get(
    "/get-seller-all-orders/:shopId",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const orders = await Order.find({
          "cart.shopId": req.params.shopId,
        }).sort({
          createdAt: -1,
        });
  
        res.status(200).json({
          success: true,
          orders,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

  // update order status for seller
  router.put(
    "/update-order-status/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const order = await Order.findById(req.params.id);
  
        if (!order) {
          return next(new ErrorHandler("Order not found with this id", 400));
        }
        if (req.body.status === "Transferred to delivery partner") {
          order.cart.forEach(async (o) => {
            await updateOrder(o._id, o.qty);
          });
        }
  
        order.status = req.body.status;
  
        if (req.body.status === "Delivered") {
          order.deliveredAt = Date.now();
          order.paymentInfo.status = "Succeeded";
          const serviceCharge = order.totalPrice * .10;
          await updateSellerInfo(order.totalPrice - serviceCharge);
        }
  
        await order.save({ validateBeforeSave: false });
  
        res.status(200).json({
          success: true,
          order,
        });
  
        async function updateOrder(id, qty) {
          const product = await Product.findById(id);

          product.stock -= qty;
          product.sold_out += qty;
  
          await product.save({ validateBeforeSave: false });
        }
  
        async function updateSellerInfo(amount) {
          const seller = await Shop.findById(req.seller.id);
        
          seller.availableBalance = amount;
  
          await seller.save();
        }
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
// give a refund ----- user

router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Find the order with the provided ID using the Order model
      const order = await Order.findById(req.params.id);

      // Check if the order was not found
      if (!order) {
        // If not found, create an error response and pass it to the error handler middleware
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      // Update the status of the order with the status from the request body
      order.status = req.body.status;

      // Save the updated order, ignoring validation before saving
      await order.save({ validateBeforeSave: false });

      // Respond with a success status, the updated order, and a success message
      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      // If an error occurs during the process, create an error response and pass it to the error handler middleware
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id", // PUT route to handle order refund success
  isSeller, // Middleware to check if the user is a seller
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Find the order by its ID
      const order = await Order.findById(req.params.id);

      if (!order) {
        // If order not found, return an error response
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      // Update the order status with the provided status from the request body
      order.status = req.body.status;

      // Save the updated order
      await order.save();

      // Return a success response with a message
      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      // If the order status is "Refund Success," update product quantities
      if (req.body.status === "Refund Success") {
        // Iterate through each item in the order's cart
        order.cart.forEach(async (o) => {
          // Call the updateOrder function to update product quantities
          await updateOrder(o._id, o.qty);
        });
      }

      // Async function to update product quantities based on item ID and quantity
      async function updateOrder(id, qty) {
        // Find the product by its ID
        const product = await Product.findById(id);

        // Increase the product's stock and decrease sold_out quantity
        product.stock += qty;
        product.sold_out -= qty;

        // Save the updated product
        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      // If any error occurs, return an error response
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
  module.exports = router