import { Link } from "react-router-dom";
import LNavbar from "../components/LNavbar";
import "./LandingPage.css";
import logo from "../assets/logo.svg";
import locationIcon from "../assets/location.svg";
import trackingIcon from "../assets/tracking.svg";
import communityIcon from "../assets/community.svg";

export default function LandingPage() {
  return (
    <div className="landing">
      <LNavbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <span className="tag-pill">Your Community · Your Voice</span>
              <h1>
                Connecting citizens to their{" "}
                <em>local government</em>
              </h1>
              <p className="lead">
                CivicPortal is a unified platform that makes it simple to report
                issues, track requests, attend meetings, and participate in city
                decisions.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn-gold">Get Started Free</Link>
                <a href="#features" className="btn btn-outline">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="mission" id="mission">
        <div className="container">
          <p className="section-label">Our Mission</p>
          <h2>Why CivicPortal exists</h2>
          <div className="mission-grid">
            <blockquote className="mission-quote">
              "Democracy works best when people can participate — and
              participation requires access, visibility, and trust."
            </blockquote>
            <div className="mission-points">
              {[
                {
                  n: "1",
                  title: "Reduce friction between residents and government",
                  desc: "Filing a complaint shouldn't feel like navigating a maze. We make civic action as easy as sending a message.",
                },
                {
                  n: "2",
                  title: "Make public services radically transparent",
                  desc: "Every request and decision is tracked openly. No more wondering if your complaint was received — or forgotten.",
                },
                {
                  n: "3",
                  title: "Build a record of community accountability",
                  desc: "We help local governments measure and improve their own responsiveness over time.",
                },
              ].map((p) => (
                <div className="mission-point" key={p.n}>
                  <div className="mp-num">{p.n}</div>
                  <div>
                    <strong className="mp-title">{p.title}</strong>
                    <span className="mp-desc">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <p className="section-label">What We Do</p>
            <h2>Everything your community needs</h2>
            <p className="section-sub">
              From reporting a broken streetlight to shaping your city's budget
              — your single window into local government.
            </p>
          </div>
          <div className="features-grid">

            <div className="feature-card">
              <div className="feat-icon">
                <img src={locationIcon} alt="Issue Reporting" />
              </div>
              <h3>Issue Reporting</h3>
              <p>Snap a photo, drop a pin, and submit. Report potholes, broken lights, or drainage problems in under 60 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feat-icon">
                <img src={trackingIcon} alt="Real-Time Tracking" />
              </div>
              <h3>Real-Time Tracking</h3>
              <p>Follow your request from submission to resolution. Get notified at every stage so you always know what's happening.</p>
            </div>

            <div className="feature-card">
              <div className="feat-icon">
                <img src={communityIcon} alt="Community Forums" />
              </div>
              <h3>Community Forums</h3>
              <p>Discuss local issues with neighbors and build consensus before decisions reach the council floor.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how">
        <div className="container">
          <div className="section-header">
            <p className="section-label">How It Works</p>
            <h2>Simple by design</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <span className="step-num">{s.n}</span>
                <strong className="step-title">{s.title}</strong>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <p className="section-label">Get Started Today</p>
          <h2>Be part of a more responsive city</h2>
          <p className="section-sub">
            Join thousands of residents already making their voices heard and
            their streets better.
          </p>
          <Link to="/login" className="btn-gold">Create Your Free Account</Link>
        </div>
      </section>

      <footer className="footer" />
    </div>
  );
}

const STEPS = [
  { n: "1", title: "Create Your Account", desc: "Sign up in seconds using your email or government-issued ID." },
  { n: "2", title: "Find Your Ward",       desc: "We locate your area so you only see what's relevant to your neighborhood." },
  { n: "3", title: "Report & Engage",      desc: "Submit issues, join discussions, or attend meetings — all from one place." },
  { n: "4", title: "Track Every Update",   desc: "Get notified as your requests move through the system to resolution." },
];