"use client"

import type React from "react"
import { Link } from "react-router-dom"
import "./Home.css"
import { ChevronRight, Calendar, CreditCard, Clock, MapPin, Users, CheckCircle, QrCode, QrCodeIcon } from "lucide-react"

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Book Sports Facilities with Ease</h1>
          <p>
            Access UTM's premium sports facilities online. Book courts, fields, and equipment for your next sporting
            activity.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
              Login <ChevronRight size={18} />
            </Link>
            <Link to="/reg" className="secondary-button">
              Registration
            </Link>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="image/Untitled design (1).jpg" alt="UTM Sports Facilities" className="hero-image" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Our Booking System</h2>
          <p>Simple, fast, and convenient way to reserve sports facilities</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Clock />
            </div>
            <h3>24/7 Booking</h3>
            <p>Book anytime, anywhere without having to visit the sports office</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Calendar />
            </div>
            <h3>Real-time Availability</h3>
            <p>See up-to-date availability of all facilities before booking</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <QrCodeIcon />
            </div>
            <h3>Easy Payment</h3>
            <p>Secure online QR payment for quick transactions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Users />
            </div>
            <h3>Group Bookings</h3>
            <p>Easily book facilities for teams and group activities</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Book your favorite sports facility in 3 simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Choose Facility</h3>
            <p>Browse and select from our wide range of available sports facilities</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Select Time Slot</h3>
            <p>Pick your preferred date and time based on real-time availability</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Confirm & Pay</h3>
            <p>Complete your booking with our secure payment system</p>
          </div>
        </div>
        <div className="cta-container">
          <Link to="/search" className="primary-button large">
            Start Booking Now
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What UTM students Says</h2>
          <p>Feedback from students and faculty who use our booking system</p>
        </div>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "The online booking system has made it so much easier to reserve basketball courts. No more waiting in
                line at the sports office!"
              </p>
            </div>
            <div className="testimonial-author">
              <img src="image/student-1.jpg" alt="Student" className="author-image" />
              <div className="author-details">
                <h4>Mohannad jebril</h4>
                <p>Network Student</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "As the captain of the tennis team, I can now book practice sessions for the whole semester in advance.
                Extremely convenient!"
              </p>
            </div>
            <div className="testimonial-author">
              <img src="image/student-2.jpg" alt="Student" className="author-image" />
              <div className="author-details">
                <h4>Saleem</h4>
                <p>Tennis Team Captain</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "The real-time availability feature helps me find open slots for swimming practice without having to
                call the facility manager."
              </p>
            </div>
            <div className="testimonial-author">
              <img src="image/faculty.jpg" alt="Faculty Member" className="author-image" />
              <div className="author-details">
                <h4>Faiz</h4>
                <p>Faculty Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Sports Facilities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Monthly Bookings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Booking Availability</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Book Your Next Sports Activity?</h2>
          <p>Join thousands of UTM students and faculty who use our platform for hassle-free facility booking</p>
          <div className="cta-features">
            <div className="cta-feature">
              <CheckCircle size={20} />
              <span>Instant Confirmation</span>
            </div>
            <div className="cta-feature">
              <CheckCircle size={20} />
              <span>Secure Payment</span>
            </div>
            <div className="cta-feature">
              <CheckCircle size={20} />
              <span>Easy Cancellation</span>
            </div>
          </div>
          <Link to="/search" className="primary-button large">
            Book Now <ChevronRight size={18} />
          </Link>
        </div>
        <div className="cta-image-container">
          <img src="image/sports-activity.jpg" alt="Sports Activity" className="cta-image" />
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="image/LOGO-UTM.png" alt="UTM Logo" className="footer-logo-image" />
            <span>UTM Sports Facility</span>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/search">Book Facility</Link>
                </li>
                <li>
                  <Link to="/facilities">Our Facilities</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Facilities</h3>
              <ul>
                <li>
                  <Link to="/search?facility=basketball">Basketball Courts</Link>
                </li>
                <li>
                  <Link to="/search?facility=tennis">Tennis Courts</Link>
                </li>
                <li>
                  <Link to="/search?facility=football">Football Fields</Link>
                </li>
                <li>
                  <Link to="/search?facility=swimming">Swimming Pool</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Support</h3>
              <ul>
                <li>
                  <Link to="/faq">FAQs</Link>
                </li>
                <li>
                  <Link to="/rules">Rules & Regulations</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact</h3>
              <ul className="contact-info">
                <li>
                  <MapPin size={16} /> Sports Complex, UTM Johor Bahru
                </li>
                <li>
                  <Clock size={16} /> Mon-Fri: 8:00 AM - 10:00 PM
                </li>
                <li>
                  <a href="tel:+60123456789">+60 12-345 6789</a>
                </li>
                <li>
                  <a href="mailto:sports@utm.my">sports@utm.my</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UTM Sports Facility. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
