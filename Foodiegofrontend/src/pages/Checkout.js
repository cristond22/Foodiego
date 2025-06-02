import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // <-- fixed import syntax (no braces)
import './Checkout.css';

const stripePromise = loadStripe('pk_test_51RHLPMECiBaqurG9MpaTJrg00O4ijAQitWRWOMoc3Jww9PT77a06KjrFC8n3IwHnT5VNs14GkLzOY1HHejwhp9zc00clhSgEVN');

const Checkout = () => {
  console.log('Checkout rendered')
  const navigate = useNavigate();

  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [countries, setCountries] = useState([]);
  const [phoneCode, setPhoneCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
    city: '',
    phone: '',
    allowMarketing: false,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json');
        setCountries(res.data);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = name === 'phone' ? value.replace(/\D/g, '') : value;

    if (name === 'country') {
      const selectedData = countries.find(c => c.name === value);
      setPhoneCode(selectedData ? selectedData.dial_code : '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue
    }));
  };

  const isFormValid = () => {
    const { email, country, firstName, lastName, address, zipCode, city, phone } = formData;
    return email && country && firstName && lastName && address && zipCode && city && phone;
  };

  const user = useSelector(state => state.user);
  const emailFromState = useSelector(state => state.email); // if you store email separately

  // Decode user ID from JWT token if available
  let userId;
  if (user?.token) {
    try {
      const decoded = jwtDecode(user.token);
      console.log('Decoded JWT payload:', decoded);
      userId = decoded.id || decoded._id;
      console.log('User ID extracted:', userId);
    } catch (err) {
      console.error('Failed to decode JWT token', err);
    }
  }

  const handleStripeCheckout = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }

    // Save form data before redirect (optional)
    localStorage.setItem('orderFormData', JSON.stringify(formData));
    localStorage.setItem('orderCartItems', JSON.stringify(cartItems));
    localStorage.setItem('orderTotalAmount', totalAmount.toString());

    try {
      const stripe = await stripePromise;
      const response = await axios.post('https://foodiego-f686.onrender.com/api/payment/create-checkout-session', {
        cartItems,
        userId,
        email: formData.email || emailFromState, // Use email from form or redux
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        }   
      });

      const sessionId = response.data.id;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Stripe Checkout error:", err);
      alert("Stripe checkout failed.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="left">
        <div className="billing-container">
          <form className="billing-form" onSubmit={e => e.preventDefault()}>
            <h2>Billing Information</h2>

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

            <label>Country</label>
            <select name="country" value={formData.country} onChange={handleInputChange} required>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>{country.name}</option>
              ))}
            </select>

            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />

            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="10 Church Street - apt 4"
              required
            />

            <div className="zip-city">
              <div>
                <label>Zip Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
              </div>
              <div>
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
            </div>

            <label>Phone</label>
            <div className="phone-input">
              <span>{phoneCode}</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="marketing-optin">
              <label>
                <input
                  type="checkbox"
                  name="allowMarketing"
                  checked={formData.allowMarketing}
                  onChange={handleInputChange}
                />
                I allow Foodiego to send me marketing emails.
              </label>
            </div>

            <button type="button" onClick={handleStripeCheckout}>Checkout with Stripe</button>
          </form>
        </div>
      </div>

      <div className="right">
        {cartItems.map(item => (
          <div key={item._id} className="order-item">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <strong>{item.name}</strong> x {item.quantity}<br />
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
        <hr />
        <h4>Total: ₹{totalAmount}</h4>
      </div>
    </div>
  );
};

export default Checkout;
