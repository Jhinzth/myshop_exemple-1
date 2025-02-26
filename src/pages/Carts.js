import React, { useState } from "react";

function Cart() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  const updateQuantity = (productId, amount) => {
    const updatedCart = cart.map((item) =>
      item.ProductID === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.ProductID !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((total, item) => total + item.Price * item.quantity, 0);

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
    // สามารถเพิ่มการเรียก API สำหรับ Checkout ได้ที่นี่
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shopping Cart</h2>
      {cart.length > 0 ? (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ddd", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>Product</th>
                <th style={{ padding: "10px" }}>Price</th>
                <th style={{ padding: "10px" }}>Quantity</th>
                <th style={{ padding: "10px" }}>Total</th>
                <th style={{ padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.ProductID} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{item.ProductName}</td>
                  <td style={{ padding: "10px" }}>${item.Price.toFixed(2)}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => updateQuantity(item.ProductID, -1)}>-</button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.ProductID, 1)}>+</button>
                  </td>
                  <td style={{ padding: "10px" }}>${(item.Price * item.quantity).toFixed(2)}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => removeFromCart(item.ProductID)} style={{ color: "red" }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ${totalAmount.toFixed(2)}</h3>
          <button
            onClick={handleCheckout}
            style={{
              background: "#007bff",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Checkout
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
