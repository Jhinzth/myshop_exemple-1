import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { fullName, email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Error registering. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label" style={styles.label}>Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="fullName" 
              placeholder="Enter your full name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={styles.label}>Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={styles.label}>Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            style={styles.button}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    backgroundColor: "#ffffff", // White background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  registerBox: {
    backgroundColor: "#f8f9fa", // Light gray background for contrast
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
  title: {
    color: "#333", // Dark color for the title
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  label: {
    color: "#333", // Dark color for the labels
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#f1c40f", // เปลี่ยนเป็นสีเหลือง
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default Register;