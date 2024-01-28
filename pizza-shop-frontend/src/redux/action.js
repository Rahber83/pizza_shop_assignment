export const placeOrder = (orderDetails) => ({
  type: "PLACE_ORDER",
  payload: orderDetails,
});

export const cancelOrder = (orderId) => ({
  type: "CANCEL_ORDER",
  payload: orderId,
});

export const moveToNextStage = (orderId) => ({
  type: "MOVE_TO_NEXT_STAGE",
  payload: orderId,
});

export const setOrders = (orders) => ({
  type: "SET_ORDERS",
  payload: orders,
});
