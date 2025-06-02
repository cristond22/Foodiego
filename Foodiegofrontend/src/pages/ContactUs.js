import React from 'react';
import './ContactUs.css';
import bgImage from '../assets/image-group-v2-bg.2406051253550.jpg'; 
const ContactUs = () => {
  return (
    <div className="contact-page"style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}>
      <h1 className="contact-title">Contact Us</h1>

      <div className="contact-container">
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="name">Your Name</label>
          <input id="name" type="text" placeholder="Enter your name" required />

          <label htmlFor="email">Your Email</label>
          <input id="email" type="email" placeholder="Enter your email" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" rows="6" placeholder="Write your message here..." required></textarea>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>

        <div className="contact-info">
          <h2>Criston Dsouza</h2>
          <p>📍 Gopalpura 5th main 2nd Cross</p>
          <p> Santhekattte, Udupi, Karnataka, India - 576105</p>
          <p>📧 <a href="mailto:cristondsouza81@gmail.com">cristondsouza81@gmail.com</a></p>
          <p>📞 <a href="tel:+918073270581">+91-8073270581</a></p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
