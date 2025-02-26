import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Products = ({ updateCartCount }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("Unauthorized access. Please login.");
            return;
        }

        axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProducts(res.data.products))
        .catch(() => setError("Failed to load products."));
    }, [token]);

    const handleAddToCart = async (product) => {
        if (!user) {
            setError("You must be logged in to add items to the cart.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/cart",
                { ProductID: product.ProductID, Quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Item added to cart!");
            updateCartCount(); // ✅ Update cart count in Navbar
        } catch (err) {
            setError("Error adding item.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Products</h2>
            {success && <p className="alert alert-success text-center">{success}</p>}
            {error && <p className="alert alert-danger text-center">{error}</p>}
            <div className="row">
                {products.map((p) => (
                    <div key={p.ProductID} className="col-lg-4 col-md-6 mb-4">
                        <div style={styles.productCard}>
                            <div className="card-body text-center">
                                <h5 style={styles.productName}>{p.ProductName}</h5>
                                <p style={styles.label}>{p.Description}</p>
                                <p style={styles.price}>{parseFloat(p.Price).toLocaleString()} บาท</p>
                                <button style={styles.button} onClick={() => handleAddToCart(p)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa", // White background
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0",
    overflow: "auto", // Enable full page scrolling
  },
  card: {
    backgroundColor: "#ffffff", // White card background
    color: "#000", // Black text
    maxWidth: "1000px",
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
  productCard: {
    backgroundColor: "#ffffff", // White product card
    borderRadius: "10px",
    padding: "15px",
    color: "#000",
  },
  productName: {
    color: "#000", // Yellow product name
  },
  price: {
    color: "#dc3545", // Red price text
  },
  label: {
    color: "#000", // Black label text
  },
  button: {
    backgroundColor: "#28a745", // Green button for Add to Cart
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Products;
