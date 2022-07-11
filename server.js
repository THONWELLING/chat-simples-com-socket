const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, "public")));

let connectedUsers = [];

io.on("connection", (socket) => {
  console.log("Detected A Connection...");

  socket.on("join-request", (userName) => {
    socket.userName = userName;
    connectedUsers.push(userName);
    console.log(connectedUsers);

    socket.emit("user-ok", connectedUsers);
    socket.broadcast.emit("list-update", {
      joined: userName,
      list: connectedUsers,
    });
  });

  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter((u) => u != socket.userName);
    console.log(connectedUsers);

    socket.broadcast.emit("list-update", {
      left: socket.userName,
      list: connectedUsers,
    });
  });
});
