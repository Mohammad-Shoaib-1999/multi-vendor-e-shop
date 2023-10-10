// Import required modules and dependencies
const Conversation = require("../model/conversation"); // Import Conversation model
const ErrorHandler = require("../utils/ErrorHandler"); // Import custom error handler
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Import middleware for handling async errors
const express = require("express"); // Import Express
const { isSeller, isAuthenticated } = require("../middleware/auth"); // Import custom authentication middleware
const router = express.Router(); // Create an instance of Express Router

// Route to create a new conversation
// router.post(
//   "/create-new-conversation",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { groupTitle, userId, sellerId } = req.body;

//       // Check if a conversation with the given groupTitle already exists
//       const isConversationExist = await Conversation.findOne({ groupTitle });

//       if (isConversationExist) {
//         // Return existing conversation if found
//         const conversation = isConversationExist;
//         res.status(201).json({
//           success: true,
//           conversation,
//         });
//       } else {
//         // Create a new conversation if it doesn't exist
//         const conversation = await Conversation.create({
//           members: [userId, sellerId],
//           groupTitle: groupTitle,
//         });

//         res.status(201).json({
//           success: true,
//           conversation,
//         });
//       }
//     } catch (error) {
//       // Handle errors and pass them to the error handling middleware
//       return next(new ErrorHandler(error.response.message), 500);
//     }
//   })
// );
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      console.log("Creating new conversation...");

      // Check if a conversation with the given groupTitle already exists
      const isConversationExist = await Conversation.findOne({ groupTitle });

      if (isConversationExist) {
        console.log("Conversation already exists:", isConversationExist);

        // Return existing conversation if found
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        console.log("Creating new conversation...");

        // Create a new conversation if it doesn't exist
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        console.log("New conversation created:", conversation);

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      console.error("Error creating conversation:", error);

      // Handle errors and pass them to the error handling middleware
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

// Route to get seller's conversations
// router.get(
//   "/get-all-conversation-seller/:id",
//   isSeller, // Middleware to check if the user is a seller
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       // Find conversations where the provided id is a member (seller)
//      // Retrieve conversations from the database based on the specified criteria and sort them by timestamps
// const conversations = await Conversation.find({
//     members: {
//       $in: [req.params.id], // Find conversations where the members array includes the user's ID from req.params
//     },
//   }).sort({ updatedAt: -1, createdAt: -1 }); // Sort the results by descending updatedAt and createdAt timestamps
  
//   // The retrieved and sorted conversations are now available in the 'conversations' array
  

//       res.status(201).json({
//         success: true,
//         conversations,
//       });
//     } catch (error) {
//       // Handle errors and pass them to the error handling middleware
//       return next(new ErrorHandler(error), 500);
//     }
//   })
// );

// Route to get seller's conversations
router.get(
  "/get-all-conversation-seller/:id",
  isSeller, // Middleware to check if the user is a seller
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Fetching seller's conversations...");

      // Find conversations where the provided id is a member (seller)
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      console.log("Seller's conversations:", conversations);

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      console.error("Error fetching seller's conversations:", error);

      // Handle errors and pass them to the error handling middleware
      return next(new ErrorHandler(error), 500);
    }
  })
);

// Route to get user's conversations
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated, // Middleware to check if the user is authenticated
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Fetching user's conversations...");

      // Find conversations where the provided id is a member (user)
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      console.log("User's conversations:", conversations);

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      console.error("Error fetching user's conversations:", error);

      // Handle errors and pass them to the error handling middleware
      return next(new ErrorHandler(error), 500);
    }
  })
);

// Route to get user's conversations
// router.get(
//   "/get-all-conversation-user/:id",
//   isAuthenticated, // Middleware to check if the user is authenticated
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       // Find conversations where the provided id is a member (user)
//       const conversations = await Conversation.find({
//         members: {
//           $in: [req.params.id],
//         },
//       }).sort({ updatedAt: -1, createdAt: -1 });

//       res.status(201).json({
//         success: true,
//         conversations,
//       });
//     } catch (error) {
//       // Handle errors and pass them to the error handling middleware
//       return next(new ErrorHandler(error), 500);
//     }
//   })
// );

// Route to update the last message in a conversation
// router.put(
//   "/update-last-message/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { lastMessage, lastMessageId } = req.body;

//       // Find and update the conversation's last message and last message ID
//       const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
//         lastMessage,
//         lastMessageId,
//       });

//       res.status(201).json({
//         success: true,
//         conversation,
//       });
//     } catch (error) {
//       // Handle errors and pass them to the error handling middleware
//       return next(new ErrorHandler(error), 500);
//     }
//   })
// );
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      console.log("Updating last message in conversation...");

      // Find and update the conversation's last message and last message ID
      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      console.log("Last message updated:", conversation);

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      console.error("Error updating last message:", error);

      // Handle errors and pass them to the error handling middleware
      return next(new ErrorHandler(error), 500);
    }
  })
);


module.exports = router; // Export the router with defined routes
