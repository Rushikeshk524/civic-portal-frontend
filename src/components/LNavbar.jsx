import { Link, useLocation } from "react-router-dom";
import "./LNavbar.css";
import logo from "../assets/logo.svg"

export default function LNavbar() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="logo-box">
        <img src={logo} alt='logo'/>
          
        </div>
        <span className="brand-name">CivicPortal</span>
      </Link>

      <div className="nav-links">
        <a href="#mission" className="nav-link">Mission</a>
        <a href="#features" className="nav-link">Features</a>
        <a href="#how" className="nav-link">How It Works</a>
        {!isLogin && (
          <Link to="/login" className="btn-navy">Sign In</Link>
        )}
      </div>
    </nav>
  );
}