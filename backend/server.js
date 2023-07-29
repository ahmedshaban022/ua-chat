const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlwares/errMidlware");
const path = require("path");
dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/chat", require("./routes/chatRoute"));
app.use("/api/message", require("./routes/messageRoute"));

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("welcome to end point");
  });
}
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  console.log("Hello ,Server is running on port " + PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to Socket IO");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat users not defind!!!");

    chat.users.forEach((user) => {
      if (user === newMessageRecieved.sender._id) {
        return false;
      } else {
        socket.in(user).emit("message recived", newMessageRecieved);
      }
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
