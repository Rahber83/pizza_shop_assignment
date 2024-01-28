import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { moveToNextStage } from "../redux/action";
import { Button, Card, CardBody, CardText } from "reactstrap";
import { FaClock, FaRegHandPointRight, FaHourglassHalf, FaHotel, FaRegGrinStars } from "react-icons/fa";
import "./PizzaStagePage.css";

const PizzaStagePage = ({ orders, moveToNextStage }) => {
  const [ordersByStage, setOrdersByStage] = useState({
    "Order Placed": [],
    "Order In Making": [],
    "Order Ready": [],
    "Order Picked": [],
  });

  const [timeSpent, setTimeSpent] = useState({});

  useEffect(() => {
    fetchOrdersFromBackend();
  }, [orders]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeSpent = {};

      Object.keys(ordersByStage).forEach((stage) => {
        ordersByStage[stage].forEach((order) => {
          if (!updatedTimeSpent[order._id]) {
            updatedTimeSpent[order._id] = calculateTimeSpent(order);
          }
        });
      });

      setTimeSpent(updatedTimeSpent);
    }, 1000);

    return () => clearInterval(interval);
  }, [ordersByStage]);

  const fetchOrdersFromBackend = () => {
    axios
      .get("http://localhost:5000/get-orders")
      .then((response) => {
        categorizeOrdersByStage(response.data.orders);
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  };

  const categorizeOrdersByStage = (fetchedOrders) => {
    const categorizedOrders = {
      "Order Placed": [],
      "Order In Making": [],
      "Order Ready": [],
      "Order Picked": [],
    };

    fetchedOrders.forEach((order) => {
      if (order.status && categorizedOrders[order.status]) {
        categorizedOrders[order.status].push(order);
      }
    });

    setOrdersByStage(categorizedOrders);
  };

  const handleMoveToNextStage = (orderId, currentStage) => {
    axios
      .post(`http://localhost:5000/update-order-status/${orderId}`)
      .then((response) => {
        moveToNextStage(orderId);
        fetchOrdersFromBackend();
      })
      .catch((error) => {
        console.log("Error updating order status:", error);
      });
  };

  const renderOrders = (stage) => {
    return (
      <>
        <div className="order-stage" key={stage}>
          <h3 className="outlined-heading">{stage}</h3>
          {ordersByStage[stage]
            .filter((order) => order.status !== "Cancelled")
            .map((order) => (
              <Card key={order._id} className={`order-details ${getColorBasedOnTime(order)}`}>
                <CardBody
                  className="status-box"
                  style={{ backgroundColor: getColorBasedOnTime(order) === "red-card" ? "red" : "" }}
                >
                  <CardText>
                    <span style={{ fontSize: "13px" }}>ID: {order._id}</span>
                  </CardText>
                  <CardText className="status-box">
                    <FaHourglassHalf /> Status: {order.status}
                  </CardText>
                  <div>
                    <CardText className="status-box">
                      <FaHotel style={{ color: "blue" }} /> Restaurant name:{" "}
                      <span className="restaurant-name">{order.restaurant}</span>
                    </CardText>
                  </div>

                  {order.status !== "Order Picked" && order.status !== "Order Ready" && (
                    <div className="distance">
                      <CardText className="status-box">
                        <FaClock /> Time Spent: <span className="restaurant-name">{timeSpent[order._id]}</span>
                      </CardText>
                    </div>
                  )}
                  {order.status === "Order In Making" && (
                    <div className="distance">
                      <CardText className="status-box">
                        <FaClock style={{ color: "yellow" }} /> Order Placed Time:{" "}
                        <span className="restaurant-name">
                          {calculateElapsedTime(order.createdAt, order.timeSpentAtOrderPlaced)}
                        </span>
                      </CardText>
                    </div>
                  )}
                  {order.status === "Order Ready" && (
                    <>
                      <div className="distance">
                        <CardText className="status-box">
                          <FaClock style={{ color: "yellow" }} /> Order Placed Time:{" "}
                          <span className="restaurant-name">
                            {calculateElapsedTime(order.createdAt, order.timeSpentAtOrderPlaced)}
                          </span>
                        </CardText>
                      </div>
                      <div className="distance">
                        <CardText className="status-box">
                          <FaClock style={{ color: "orangered" }} /> Order Making Time:{" "}
                          <span className="restaurant-name">
                            {calculateElapsedTime(order.timeSpentAtOrderPlaced, order.timeSpentAtOrderInMaking)}
                          </span>
                        </CardText>
                      </div>
                    </>
                  )}
                  {order.status === "Order Picked" && (
                    <>
                      <div className="distance">
                        <CardText className="status-box">
                          <FaClock style={{ color: "yellow" }} /> Order Placed Time:{" "}
                          <span className="restaurant-name">
                            {calculateElapsedTime(order.createdAt, order.timeSpentAtOrderPlaced)}
                          </span>
                        </CardText>
                      </div>
                      <div className="distance">
                        <CardText className="status-box">
                          <FaClock style={{ color: "orangered" }} /> Order Making Time:{" "}
                          <span className="restaurant-name">
                            {calculateElapsedTime(order.timeSpentAtOrderPlaced, order.timeSpentAtOrderInMaking)}
                          </span>
                        </CardText>
                      </div>
                      <CardText className="status-box">
                        <span className="distance">
                          <FaRegGrinStars style={{ fontSize: "30px", color: "limegreen", marginLeft: "85px" }} />
                        </span>
                      </CardText>
                    </>
                  )}
                  {order.status !== "Order Picked" && (
                    <div className="distance-next-button">
                      <Button
                        style={{ marginLeft: "60px" }}
                        className="status-box"
                        color="primary"
                        outline
                        onClick={() => handleMoveToNextStage(order._id, stage)}
                      >
                        <FaRegHandPointRight /> Next
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
        </div>
      </>
    );
  };

  const calculateTimeSpent = (order) => {
    if (!order.createdAt) {
      return "";
    }

    let startTime;
    let endTime;

    switch (order.status) {
      case "Order In Making":
        startTime = order.timeSpentAtOrderPlaced || order.createdAt;
        endTime = new Date();
        break;
      case "Order Ready":
        startTime = order.timeSpentAtOrderInMaking || order.timeSpentAtOrderPlaced;
        endTime = new Date();
        break;
      case "Order Picked":
        startTime = order.timeSpentAtOrderInMaking;
        endTime = order.timeSpentAtOrderReady;
        break;
      default:
        startTime = order.createdAt;
        endTime = new Date();
    }

    const elapsedTimeInSeconds = Math.floor((endTime - new Date(startTime)) / 1000);
    const minutes = Math.floor(elapsedTimeInSeconds / 60);
    const seconds = elapsedTimeInSeconds % 60;

    return `${minutes > 0 ? `${minutes} min` : ""} ${seconds} sec`;
  };

  const calculateElapsedTime = (startTime, endTime) => {
    if (!startTime) {
      return "";
    }
    const endTimeToUse = endTime || new Date();
    const elapsedTimeInSeconds = Math.floor((new Date(endTimeToUse) - new Date(startTime)) / 1000);
    const minutes = Math.floor(elapsedTimeInSeconds / 60);
    const seconds = elapsedTimeInSeconds % 60;

    return `${minutes > 0 ? `${minutes} min` : ""} ${seconds} sec`;
  };

  const getColorForOrderPlaced = (order) => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - new Date(order.createdAt)) / 1000);

    if (order.lastStatus !== order.status) {
      order.lastStatus = order.status;
      order.lastUpdateTime = now;
      return "";
    }

    if (order.size === "Small" && order.status === "Order Placed" && elapsedSeconds > 180) {
      order.lastUpdateTime = now;
      return "red-card";
    } else if (order.size === "Medium" && order.status === "Order Placed" && elapsedSeconds > 240) {
      order.lastUpdateTime = now;
      return "red-card";
    } else if (order.size === "Large" && order.status === "Order Placed" && elapsedSeconds > 300) {
      order.lastUpdateTime = now;
      return "red-card";
    }
    return "";
  };

  const getColorForOrderInMaking = (order) => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - new Date(order.timeSpentAtOrderPlaced)) / 1000);

    if (order.lastStatus !== order.status) {
      order.lastStatus = order.status;
      order.lastUpdateTime = now;
      return "";
    }

    if (order.size === "Small" && order.status === "Order In Making" && elapsedSeconds > 180) {
      order.lastUpdateTime = now;
      return "red-card";
    } else if (order.size === "Medium" && order.status === "Order In Making" && elapsedSeconds > 240) {
      order.lastUpdateTime = now;
      return "red-card";
    } else if (order.size === "Large" && order.status === "Order In Making" && elapsedSeconds > 300) {
      order.lastUpdateTime = now;
      return "red-card";
    }
    return "";
  };

  const getColorBasedOnTime = (order) => {
    if (order.status === "Order Placed") {
      return getColorForOrderPlaced(order);
    } else if (order.status === "Order In Making") {
      return getColorForOrderInMaking(order);
    }
    return "";
  };

  return (
    <>
      <div className="pizza-stage-page">{Object.keys(ordersByStage).map((stage) => renderOrders(stage))}</div>
    </>
  );
};

const mapStateToProps = (state) => ({
  orders: state.orders,
});

const mapDispatchToProps = {
  moveToNextStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PizzaStagePage);
