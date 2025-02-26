import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from './assets/logo.png';  // import logo

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (user) {
            fetchCartCount();
        }
    }, [user]);

    const fetchCartCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const items = response.data.cartItems || [];
            const totalQuantity = items.reduce((sum, item) => sum + item.Quantity, 0);
            setCartCount(totalQuantity);
        } catch (err) {
            console.error("Error fetching cart count:", err);
        }
    };

    const logoutHandler = () => {
        logout();
        setCartCount(0);
        navigate("/login");
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-warning bg-gradient shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-light d-flex align-items-center" to="/">
                        <img src={logo} alt="Shop Logo" style={{ width: "40px", height: "40px", marginRight: "10px" }} />
                        Duck Shop
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navMenu">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                            {user ? (
                                <>
                                    <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/payment">History</Link></li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cart">
                                            Cart {cartCount > 0 && <span className="badge bg-warning text-dark">{cartCount}</span>}
                                        </Link>
                                    </li>
                                    <li className="nav-item"><Link className="nav-link" to="/order-tracking">Track Order</Link></li>
                                    <li className="nav-item">
                                        <button onClick={logoutHandler} className="btn btn-outline-light ms-3">Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                    <li className="nav-item"><Link className="btn btn-outline-light ms-3" to="/register">Sign Up</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products updateCartCount={fetchCartCount} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart updateCartCount={fetchCartCount} />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
