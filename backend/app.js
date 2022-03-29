
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const phonesRoutes = require("./routes/phones");
const orderRoute = require("./routes/order");


const app = express();

mongoose.connect('mongodb+srv://bill:public55@cluster0.zcvy6.mongodb.net/item_catalog?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch(() => {
    console.log('connection failed');
  })

app.use(express.json());
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT")
  next();
});

app.use("/api/phones", phonesRoutes);
app.use("/api/order", orderRoute);

module.exports = app;
