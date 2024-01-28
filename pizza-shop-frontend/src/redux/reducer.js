const initialState = {
  orders: [],
};

const pizzaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PLACE_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case "CANCEL_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };

    case "SET_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };

    case "MOVE_TO_NEXT_STAGE":
      return state;

    default:
      return state;
  }
};

export default pizzaReducer;
