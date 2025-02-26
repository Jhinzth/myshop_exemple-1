import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Spinner, Button, Modal, Form } from "react-bootstrap";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Credit Card");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.orders.length === 0) {
        setError("No orders found.");
      } else {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.OrderID]) {
      acc[order.OrderID] = [];
    }
    acc[order.OrderID].push(order);
    return acc;
  }, {});

  const openPaymentModal = (orderID, totalPrice) => {
    setSelectedOrderID(orderID);
    setSelectedTotalPrice(totalPrice);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const paymentData = {
      OrderID: selectedOrderID,
      PaymentMethod: selectedPaymentMethod,
      Amount: selectedTotalPrice,
    };

    setPaymentProcessing(true);
    try {
      await axios.post("http://localhost:5000/api/payments", paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Payment Successful!");
      setShowPaymentModal(false);
      fetchOrders();
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <Container fluid className="mt-5" style={styles.container}>
      <h2 className="text-center mb-4" style={styles.title}>My Orders</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead style={{ backgroundColor: "#000", color: "#fff" }}>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#fff", color: "#000" }}>
            {Object.keys(groupedOrders).map((orderID) => {
              const orderGroup = groupedOrders[orderID];
              const totalPrice = orderGroup.reduce((sum, order) => sum + parseFloat(order.TotalPrice), 0);
              return (
                <tr key={orderID}>
                  <td>{orderID}</td>
                  <td>{new Date(orderGroup[0].OrderDate).toLocaleString()}</td>
                  <td>{totalPrice.toLocaleString()} บาท</td>
                  <td>
                    {orderGroup[0].Status === "Pending" ? (
                      <span className="badge bg-warning text-dark">Pending</span>
                    ) : (
                      <span className="badge bg-success">Paid</span>
                    )}
                  </td>
                  <td>
                    {orderGroup.map((order) => (
                      <div key={order.ProductID}>
                        <p>{order.ProductName} x {order.Quantity}</p>
                      </div>
                    ))}
                  </td>
                  <td>
                    {orderGroup[0].Status === "Pending" ? (
                      <Button variant="success" onClick={() => openPaymentModal(orderGroup[0].OrderID, totalPrice)}>
                        Pay Now
                      </Button>
                    ) : (
                      <span className="text-muted">Already Paid</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Order ID: {selectedOrderID}</p>
          <p>Total: {selectedTotalPrice?.toLocaleString()} บาท</p>
          <Form.Group>
            <Form.Label>Choose Payment Method</Form.Label>
            <Form.Select value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
              <option value="Credit Card">💳 Credit Card</option>
              <option value="PayPal">📱 PayPal</option>
              <option value="Bank Transfer">🏦 Bank Transfer</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handlePayment} disabled={paymentProcessing}>
            {paymentProcessing ? "Processing..." : "Confirm Payment"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

const styles = {
  container: {
    backgroundColor: "#f8f9fa", // White background
    color: "#000", // Black text color
    minHeight: "100vh",
    padding: "60px 20px 20px", // Adjusted padding to move content down
    width: "100%",
  },
  title: {
    color: "#ffcc00", // Yellow title
    fontSize: "2.5rem", // Increased font size for bigger title
    fontWeight: "bold",
    textAlign: "center", // Center align
    marginBottom: "30px", // Add space below the title
    textTransform: "uppercase", // Make the title uppercase for emphasis
  },
};

export default Orders;
