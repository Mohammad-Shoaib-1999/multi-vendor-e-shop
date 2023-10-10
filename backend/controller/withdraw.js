const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
// Define a POST route for creating withdraw requests
router.post(
    "/create-withdraw-request",
    // Middleware to check if the user is a seller
    isSeller,
    // Async route handler function with error handling
    catchAsyncErrors(async (req, res, next) => {
      try {
        // Extract the 'amount' from the request body
        const { amount } = req.body;
  
        // Create an object containing seller and amount information
        const data = {
          seller: req.seller, // Seller information obtained from req.seller
          amount,
        };
  
        try {
          // Try to send an email to the seller with withdrawal request details
          await sendMail({
            email: req.seller.email, // Seller's email
            subject: "Withdraw Request",
            message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3 to 7 days to process! `,
          });
  
          // If the email sending is successful, respond with success
          res.status(201).json({
            success: true,
          });
        } catch (error) {
          // If there's an error sending the email, handle it and pass it to the error middleware
          return next(new ErrorHandler(error.message, 500));
        }
  
        // Create a withdrawal record in the database
        const withdraw = await Withdraw.create(data);
  
        // Find the seller's shop using their _id
        const shop = await Shop.findById(req.seller._id);
  
        // Update the shop's available balance by subtracting the withdrawal amount
        shop.availableBalance = shop.availableBalance - amount;
  
        // Save the updated shop information in the database
        await shop.save();
  
        // Respond with success and the created withdrawal record
        res.status(201).json({
          success: true,
          withdraw,
        });
      } catch (error) {
        // Handle any other errors that may occur and pass them to the error middleware
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  

// get all withdraws --- admnin

router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;