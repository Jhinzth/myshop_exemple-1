import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../assets/logo.png'; // นำเข้าโลโก้จากโฟลเดอร์ assets

function Home() {
  // สถานะสำหรับการ hover
  const [hoveredCard, setHoveredCard] = useState(null);

  // ฟังก์ชันเปลี่ยนสถานะเมื่อเมาส์ผ่าน
  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img
          src={logo} // ใช้โลโก้ที่นำเข้ามา
          alt="Logo"
          style={styles.logo}
        />
        <h1 style={styles.title}>Welcome to Duck Shop</h1>
        <p style={styles.subtitle}>Your one-stop shop for amazing products!</p>
      </div>
      <div style={styles.cardContainer}>
        <Link
          to="/products"
          style={{
            ...styles.card,
            ...(hoveredCard === 1 ? styles.cardHover : {}),
          }}
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>View Products</h3>
          <p>Browse our wide range of products</p>
        </Link>
        <Link
          to="/orders"
          style={{
            ...styles.card,
            ...(hoveredCard === 2 ? styles.cardHover : {}),
          }}
          onMouseEnter={() => handleMouseEnter(2)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>My Orders</h3>
          <p>Check your past and current orders</p>
        </Link>
        <Link
          to="/cart"
          style={{
            ...styles.card,
            ...(hoveredCard === 3 ? styles.cardHover : {}),
          }}
          onMouseEnter={() => handleMouseEnter(3)}
          onMouseLeave={handleMouseLeave}
        >
          <h3>My Cart</h3>
          <p>View items you have added to your cart</p>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    color: "#000",
    textAlign: "center",
    padding: "20px",
    backgroundImage: "url('https://via.placeholder.com/1920x1080')", // ใส่ URL ของรูปภาพพื้นหลังที่ต้องการ
    backgroundSize: "cover", // ให้ขนาดของภาพพอดีกับขนาดหน้าจอ
    backgroundPosition: "center", // จัดตำแหน่งภาพให้อยู่ตรงกลาง
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "100px", // เพิ่มระยะห่างจากขอบบน
  },
  logo: {
    width: "150px", // ขนาดของโลโก้
    marginBottom: "20px", // ระยะห่างระหว่างโลโก้กับหัวข้อ
  },
  title: {
    fontSize: "3rem",
    marginBottom: "15px",
    color: "#FFCC00", // สีเหลือง
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "30px",
    opacity: "0.8",
  },
  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    paddingBottom: "20px",
  },
  card: {
    width: "250px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    color: "#000",
    textDecoration: "none",
    borderRadius: "10px",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 8px rgba(81, 79, 3, 0.2)",
  },
  cardHover: {
    transform: "scale(1.05) translateY(-10px)", // ขยายการ์ดและยกขึ้น
    boxShadow: "0 8px 16px rgba(255, 255, 0, 0.3)", // เพิ่มเงาเมื่อเมาส์วาง
  },
};

export default Home;
