const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const ticketsRoutes = require("./routes/tickets");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/user");
const customerRoutes = require("./routes/customers");
const citiesRoutes = require("./routes/cities")
const cartRoutes = require("./routes/carts");
const orderRoutes = require("./routes/orders");
const emailRoutes = require("./routes/emails");

const app = express();

mongoose
  .connect(
    "mongodb+srv://huongnt:"+ process.env.MONGO_ATLAS_PW +"@cluster0.gmqfm.mongodb.net/node-angular?retryWrites=true&w=majority"
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
app.use("/api/categories", categoriesRoutes);
app.use("/api/city", citiesRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/email", emailRoutes);
module.exports = app;
