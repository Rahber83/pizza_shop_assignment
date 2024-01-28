const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

router.get("/pizzas", pizzaController.getPizzas);
router.post("/place-order", pizzaController.placeOrder);
router.get("/get-orders", pizzaController.getOrders);
router.post("/cancel-order/:orderId", pizzaController.cancelOrder);
router.get("/get-restaurants", pizzaController.getRestaurant);
router.post("/update-order-status/:orderId", pizzaController.updateOrderStatus);

module.exports = router;
