// const socketIO = require("socket.io");
// const http = require("http");
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// require("dotenv").config({
//   path: "./.env",
// });

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello world from socket server!");
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (receiverId) => {
//   return users.find((user) => user.userId === receiverId);
// };

// // Define a message object with a seen property
// const createMessage = ({ senderId, receiverId, text, images }) => ({
//   senderId,
//   receiverId,
//   text,
//   images,
//   seen: false,
// });

// io.on("connection", (socket) => {
//   // when connect
//   console.log(`a user is connected`);

//   // take userId and socketId from user
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

//   // send and get message
//   const messages = {}; // Object to track messages sent to each user

//   socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
//     const message = createMessage({ senderId, receiverId, text, images });

//     const user = getUser(receiverId);

//     // Store the messages in the `messages` object
//     if (!messages[receiverId]) {
//       messages[receiverId] = [message];
//     } else {
//       messages[receiverId].push(message);
//     }

//     // send the message to the recevier
//     io.to(user?.socketId).emit("getMessage", message);
//     console.log("Message sent:", message);

//   });

//   socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
//     const user = getUser(senderId);

//     // update the seen flag for the message
//     if (messages[senderId]) {
//       const message = messages[senderId].find(
//         (message) =>
//           message.receiverId === receiverId && message.id === messageId
//       );
//       if (message) {
//         message.seen = true;

//         // send a message seen event to the sender
//         io.to(user?.socketId).emit("messageSeen", {
//           senderId,
//           receiverId,
//           messageId,
//         });
//       }
//       console.log("Message seen by sender:", message);
//     }

//   });

//   // update and get last message
//   socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
//     console.log("Updating last message:", lastMessage);

//     io.emit("getLastMessage", {
//       lastMessage,
//       lastMessagesId,
//     });
//   });

//   //when disconnect
//   socket.on("disconnect", () => {
//     console.log(`a user disconnected!`);
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });

// server.listen(process.env.PORT || 4000, () => {
//   console.log(`server is running on port ${process.env.PORT }`);
// });

const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config({
  path: "./.env",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

let users = [];

const addUser = (userId, socketId) => {
  // Use Array.some() to check if a user with the same userId already exists
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// Define a message object with a seen property
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  console.log(`A user is connected`);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });

    const user = getUser(receiverId);

    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    io.to(user?.socketId).emit("getMessage", message);
    console.log("Message sent:", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    if (messages[senderId]) {
      const message = messages[senderId].find(
        // Corrected property name from 'id' to 'receiverId'
        (message) =>
          message.receiverId === receiverId && message.receiverId === messageId
      );

      if (message) {
        message.seen = true;
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }

      console.log("Message seen by sender:", message);
    }
  });

  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    console.log("Updating last message:", lastMessage);
    io.emit("getLastMessage", {
      lastMessage,
      lastMessagesId,
    });
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
