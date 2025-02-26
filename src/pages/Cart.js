import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../AuthContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchCartItems();
    } else {
      setError("Please login to view cart.");
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      if (!token) return setError("Unauthorized request.");

      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(response.data.cartItems || []);
      setError(
        response.data.cartItems.length > 0 ? "" : "No items in cart."
      );
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setError("Failed to fetch cart items.");
    }
  };

  const removeItem = async (cartID) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.CartID !== cartID));
    } catch (err) {
      console.error("Remove Item Error:", err);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    try {
      console.log("Sending Order Data:", cartItems); // ✅ Debug
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        { cartItems }, // ✅ ส่ง cartItems ไป Backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Checkout Success:", response.data);
      setCartItems([]); // ✅ เคลียร์ตะกร้า
      setError("");
      navigate("/orders"); // ✅ ไปที่หน้ารายการสั่งซื้อ
    } catch (err) {
      console.error("Checkout Error:", err);
      setError("Failed to checkout. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div className="container my-5 p-4 rounded shadow-lg" style={styles.card}>
        <h2 className="text-center fw-bold mb-4" style={styles.title}>
          Your Shopping Cart
        </h2>
        {error && <p className="alert alert-danger text-center">{error}</p>}

        {cartItems.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table table-hover" style={styles.table}>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.CartID}>
                      <td>{index + 1}</td>
                      <td>{item.ProductName || "Unknown"}</td>
                      <td>{item.Quantity}</td>
                      <td>{parseFloat(item.Price || 0).toLocaleString()} บาท</td>
                      <td>
                        {(
                          item.Quantity + parseFloat(item.Price || 0)
                        ).toLocaleString()}{" "}
                        บาท
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(item.CartID)}
                          style={styles.removeButton}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-3">
              <button
                className="btn btn-success px-4"
                onClick={handleCheckout}
                style={styles.checkoutButton}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted fs-5"></p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff", // เปลี่ยนจาก "#121212" เป็น "#ffffff"
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0",
    width: "100%", // Full width
    boxSizing: "border-box", // Ensure padding is included in width/height calculation
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

export default Cart;
