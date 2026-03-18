import { Link, useLocation } from "react-router-dom";
import "./LNavbar.css";
import logo from "../assets/logo.svg";

export default function LNavbar() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <nav className="lnav">
      <Link to="/" className="lnav-brand">
        <img src={logo} className="lnav-logo" alt="logo" />
        <span className="lnav-name">Public<span>Watch</span></span>
      </Link>

      <div className="lnav-links">
        <a href="#mission" className="lnav-link">Mission</a>
        <a href="#features" className="lnav-link">Features</a>
        <a href="#how" className="lnav-link">How It Works</a>
        {!isLogin && (
          <Link to="/login" className="lnav-cta">Sign In</Link>
        )}
      </div>
    </nav>
  );
}