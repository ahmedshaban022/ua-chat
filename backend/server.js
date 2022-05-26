const express = require("express");
const chats = require("./data/data");
const dotenv= require('dotenv');
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlwares/errMidlware");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to end point");
});

app.use('/api/user',require('./routes/userRoute'));
app.use('/api/chat',require('./routes/chatRoute'));
app.use('/api/message',require('./routes/messageRoute'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
