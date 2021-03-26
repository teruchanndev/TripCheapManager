const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ticketsRoutes = require("./routes/tickets");
const postsRoutes = require("./routes/posts");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://huongnt:huongnt18021999@cluster0.gmqfm.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/tickets", ticketsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/user", usersRoutes);

module.exports = app;
