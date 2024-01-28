// models/Pizza.js
const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  restaurant: String,
  type: String,
  size: String,
  base: String,
  status: { type: String, default: "Order Placed" },
  timeSpentAtOrderPlaced: { type: Date },
  timeSpentAtOrderInMaking: { type: Date },
  timeSpentAtOrderReady: { type: Date },
  timeSpentAtOrderPicked: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = Pizza;
