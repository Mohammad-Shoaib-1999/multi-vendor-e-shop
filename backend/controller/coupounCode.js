const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const Shop = require("../model/shop");

router.post(
  "/create-coupoun-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await CoupounCode.find({
        name: req.body.name,
      });
      if (isCoupounCodeExists.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exist!", 400));
      }
      const coupounCode = await CoupounCode.create(req.body);
      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // const couponCodes = await CoupounCode.find({shopId:req.seller.id})

      const couponCodes = await CoupounCode.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponId = req.params.id;
      const couponData = await CoupounCode.findByIdAndDelete(couponId);
      if (!couponData) {
        return next(new ErrorHandler("Coupoun not found with this Id", 500));
      }
      res.status(201).json({
        success: true,
        message: "Coupon Deleted SuccessfullyP",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
module.exports = router;
