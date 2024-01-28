import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { setOrders } from "../redux/action";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CancelModalPopup from "../shared/CancelModalPopup";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import "./PizzaMainPage.css";
import { FaBoxOpen, FaPizzaSlice } from "react-icons/fa";
import PizzaStagePage from "./PizzaStagePage";

const PizzaMainPage = ({ orders, setOrders }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  const initialValues = {
    type: "",
    size: "",
    base: "",
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    size: Yup.string().required("Size is required"),
    base: Yup.string().required("Base is required"),
  });

  const onSubmit = (values, { resetForm }) => {
    axios
      .post("http://localhost:5000/place-order", values)
      .then((response) => {
        fetchOrdersFromBackend();
        resetForm();
        setShowOrderForm(false);
      })
      .catch((error) => {
        console.log("Error placing order:", error);
      });
  };
  useEffect(() => {
    fetchOrdersFromBackend();
    fetchRestaurants();
  }, []);
  const fetchOrdersFromBackend = () => {
    axios
      .get("http://localhost:5000/get-orders")
      .then((response) => {
        setOrders(response.data.orders);
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  };

  const fetchRestaurants = () => {
    axios
      .get("http://localhost:5000/get-restaurants")
      .then((response) => {
        setRestaurants(response.data.restaurants);
      })
      .catch((error) => {
        console.log("Error fetching restaurants:", error);
      });
  };

  const formatElapsedTime = (elapsedSeconds) => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes} minutes and ${seconds} seconds`;
  };

  const calculateRemainingTime = (order) => {
    const elapsedSeconds = Math.floor((Date.now() - new Date(order.createdAt)) / 1000);

    switch (order.status) {
      case "Order Placed":
        return `Currently in Order Placed status`;
      case "Order In Making":
        return `${formatElapsedTime(elapsedSeconds)} since Order Placed`;
      case "Order Ready":
        return `${formatElapsedTime(elapsedSeconds)} since Order Placed`;
      case "Order Picked":
        const timeSpent = Math.floor((new Date(order.timeSpentAtOrderReady) - new Date(order.createdAt)) / 1000);
        return `Total Time: ${formatElapsedTime(timeSpent)} since Order Placed`;
      default:
        return "";
    }
  };

  const handleCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    axios
      .post(`http://localhost:5000/cancel-order/${cancelOrderId}`)
      .then((response) => {
        fetchOrdersFromBackend();
      })
      .catch((error) => {
        console.log("Error canceling order:", error);
      });

    setShowCancelConfirmation(false);
  };

  const sortedOrders = [...orders];

  if (sortBy === "ByDelay") {
    sortedOrders.sort((a, b) => {
      const statusOrder = {
        "Order Placed": 1,
        "Order In Making": 2,
        "Order Ready": 3,
        "Order Picked": 4,
      };

      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      return timeA - timeB;
    });
  }

  return (
    <>
      <PizzaStagePage />
      <div className="main-display">
        <h2 style={{ fontFamily: "cursive", marginBottom: "15px" }}>
          <FaPizzaSlice /> Pizza Status
          <UncontrolledDropdown className="filter">
            <DropdownToggle caret color="dark">
              Filter
            </DropdownToggle>
            <DropdownMenu dark>
              <DropdownItem onClick={() => setSortBy("ByDelay")}>By Delay</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </h2>

        <div className="table-responsive">
          <Table bordered striped>
            <thead className="thead-light">
              <tr>
                <th scope="col">Order Id</th>
                <th scope="col">Stage</th>
                <th scope="col">Total time spent (time from order placed)</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order._id} className={order.status === "Order Ready" ? "table-success" : ""}>
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>{calculateRemainingTime(order)}</td>
                  <td>
                    {(order.status === "Order Placed" || order.status === "Order In Making") && (
                      <Button color="danger" outline onClick={() => handleCancelOrder(order._id)}>
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tbody>
              <tr>
                <td colSpan="4" className="total-delivered">
                  Total orders delivered: {orders.filter((order) => order.status === "Order Picked").length}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td colSpan="4" className="total-delivered">
                  Total orders Cancelled: {orders.filter((order) => order.status === "Cancelled").length}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="order-button-container">
          <Button color="primary" outline onClick={() => setShowOrderForm(true)}>
            <FaBoxOpen style={{ marginRight: "5px", fontSize: "25px" }} />
            Order Pizza
          </Button>
        </div>
        <Modal isOpen={showOrderForm} toggle={() => setShowOrderForm(!showOrderForm)}>
          <ModalHeader toggle={() => setShowOrderForm(!showOrderForm)}>Order Form</ModalHeader>
          <ModalBody>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              <Form>
                <FormGroup className="mb-3">
                  <Label for="restaurant">Restaurant</Label>
                  <Field as="select" name="restaurant" className="form-control">
                    <option value="" label="Select Restaurant" />
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant.name} label={restaurant.name} />
                    ))}
                  </Field>
                  <ErrorMessage name="restaurant" component="div" className="error-message" />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="type">Type</Label>
                  <Field as="select" name="type" className="form-control">
                    <option value="" label="Select Type" />
                    <option value="Veg" label="Veg" />
                    <option value="Non-Veg" label="Non-Veg" />
                  </Field>
                  <ErrorMessage name="type" component="div" className="error-message" />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="size">Size</Label>
                  <Field as="select" name="size" className="form-control">
                    <option value="" label="Select Size" />
                    <option value="Large" label="Large" />
                    <option value="Medium" label="Medium" />
                    <option value="Small" label="Small" />
                  </Field>
                  <ErrorMessage name="size" component="div" className="error-message" />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="base">Base</Label>
                  <Field as="select" name="base" className="form-control">
                    <option value="" label="Select Base" />
                    <option value="Thin" label="Thin" />
                    <option value="Thick" label="Thick" />
                  </Field>
                  <ErrorMessage name="base" component="div" className="error-message" />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Button type="submit" color="primary">
                    Place Order
                  </Button>
                </FormGroup>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
        <CancelModalPopup
          isOpen={showCancelConfirmation}
          onCancel={() => setShowCancelConfirmation(false)}
          onConfirm={handleCancelConfirmation}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  orders: state.orders,
});

const mapDispatchToProps = {
  setOrders,
};

export default connect(mapStateToProps, mapDispatchToProps)(PizzaMainPage);
