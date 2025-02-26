import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderID, setSelectedOrderID] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const orderID = searchParams.get("orderID");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderID && !paymentDetails) {
      fetchPaymentDetails(orderID);
    }
  }, [orderID]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.orders.length > 0) {
        setOrders(response.data.orders);
        setError("");
      } else {
        setError("No orders found.");
      }
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPaymentDetails = async (orderID) => {
    if (!orderID) return;
    setLoadingPayment(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/payments/${orderID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.OrderID) {
        setPaymentDetails(response.data);
        setError("");
      } else {
        setError("No payment record found.");
        setPaymentDetails(null);
      }
    } catch (err) {
      setError("Payment details not found for this order.");
      setPaymentDetails(null);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedOrderID) {
      setError("Please select an Order ID to proceed.");
      return;
    }

    try {
      const selectedOrder = orders.find(
        (o) => o.OrderID === parseInt(selectedOrderID)
      );

      if (!selectedOrder) {
        setError("Order not found.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/payments",
        {
          OrderID: selectedOrderID,
          PaymentMethod: "Credit Card",
          Amount: selectedOrder.TotalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaymentDetails({
        PaymentID: response.data.PaymentID || "NEW",
        OrderID: selectedOrderID,
        PaymentMethod: "Credit Card",
        Amount: selectedOrder.TotalPrice,
        PaymentDate: new Date().toLocaleString(),
        Status: "Completed",
      });

      alert("Payment Successful!");
    } catch (err) {
      setError("Payment failed. Please try again.");
    }
  };

  const uniqueOrders = Array.from(
    new Set(orders.map((order) => order.OrderID))
  ).map((orderID) => orders.find((order) => order.OrderID === orderID));

  return (
    <div style={styles.background}>
      <div className="container-fluid p-4" style={styles.card}>
        <h2 className="text-center fw-bold mb-4" style={styles.title}>
          Payment History
        </h2>

        {error && <p className="alert alert-danger text-center">{error}</p>}

        {loadingOrders ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="mb-4 text-center">
            <label className="fw-bold" style={{ color: "#000" }}>
              Select Order ID:{" "}
            </label>
            <select
              className="form-select w-50 mx-auto"
              value={selectedOrderID}
              onChange={(e) => {
                setSelectedOrderID(e.target.value);
                fetchPaymentDetails(e.target.value);
              }}
            >
              <option value="">-- Select Order --</option>
              {uniqueOrders.map((order, index) => (
                <option key={`${order.OrderID}-${index}`} value={order.OrderID}>
                  Order {order.OrderID} -{" "}
                  {new Date(order.OrderDate).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {loadingPayment && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Payment History Table */}
        <div className="mt-4">
          {paymentDetails ? (
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th scope="col">Payment ID</th>
                  <th scope="col">Order ID</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Payment Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{paymentDetails.PaymentID}</td>
                  <td>{paymentDetails.OrderID}</td>
                  <td>{paymentDetails.PaymentMethod}</td>
                  <td>{parseFloat(paymentDetails.Amount).toLocaleString()} บาท</td>
                  <td>{paymentDetails.PaymentDate}</td>
                  <td>
                    <span
                      className="badge"
                      style={getStatusStyle(paymentDetails.Status)}
                    >
                      {paymentDetails.Status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <button className="btn btn-success" onClick={handlePayment}>
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return {
        backgroundColor: "#2a9d8f",
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
      };
    case "Pending":
      return {
        backgroundColor: "#ff9900",
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
      };
    default:
      return {
        backgroundColor: "#ddd",
        color: "black",
        padding: "8px 12px",
        borderRadius: "5px",
      };
  }
};

const styles = {
  background: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    color: "#000",
    width: "100%",
    maxWidth: "1200px", // ปรับขนาดให้เต็มหน้าจอได้
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#ffcc00", // Yellow title
    fontSize: "2.5rem", // Increased font size for bigger title
    fontWeight: "bold",
    textAlign: "center", // Center align
    marginBottom: "30px", // Add space below the title
    textTransform: "uppercase", // Make the title uppercase for emphasis
  },
  table: {
    backgroundColor: "#ffffff", // เปลี่ยนเป็นสีขาว
    color: "#000", // เปลี่ยนสีตัวอักษรเป็นสีดำ
    borderRadius: "10px",
  },
};

export default PaymentHistory;
