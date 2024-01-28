const Pizza = require("../models/pizzaModel");
const Restaurant = require("../models/restaurantListModel");

exports.getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { restaurant, type, size, base } = req.body;
    const pizza = new Pizza({ restaurant, type, size, base });
    await pizza.save();
    res.status(201).json({ message: "Order placed successfully", pizza });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderToUpdate = await Pizza.findOne({ _id: orderId });

    if (!orderToUpdate) {
      return res.status(404).json({ message: "Order not found" });
    }

    switch (orderToUpdate.status) {
      case "Order Placed":
        orderToUpdate.timeSpentAtOrderPlaced = Date.now();
        orderToUpdate.status = "Order In Making";
        break;
      case "Order In Making":
        orderToUpdate.timeSpentAtOrderInMaking = Date.now();
        orderToUpdate.status = "Order Ready";
        break;
      case "Order Ready":
        orderToUpdate.timeSpentAtOrderReady = Date.now();
        orderToUpdate.status = "Order Picked";
        break;
      default:
        break;
    }
    await orderToUpdate.save();

    return res.json({ message: "Order status updated successfully", order: orderToUpdate });
  } catch (error) {
    console.log("Error updating order status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Pizza.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Order Ready" || order.status === "Order Picked") {
      return res.status(400).json({ message: "Order cannot be canceled at this stage" });
    }

    order.status = "Cancelled";

    await order.save();

    return res.status(200).json({ message: "Order canceled successfully" });
  } catch (error) {
    console.log("Error canceling order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ restaurants });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Pizza.find();
    res.json({ orders });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
