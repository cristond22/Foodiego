import React, { useEffect, useState, useRef } from 'react';
import './OrderSuccess.css';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const OrderSuccess = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const orderId = localStorage.getItem('order Id');
 
  // 🧾 Reference for PDF capture
  const pdfRef = useRef();
  useEffect(() => {
    // Read once from localStorage into state
    const storedFormData = JSON.parse(localStorage.getItem('orderFormData'));
    const storedCartItems = JSON.parse(localStorage.getItem('orderCartItems'));
    const storedTotalAmount = parseFloat(localStorage.getItem('orderTotalAmount') || 0);
    
    if (!storedFormData || !storedCartItems || storedCartItems.length === 0) {
      navigate('/');
      return;
    }

    setFormData(storedFormData);
    setCartItems(storedCartItems);
    setTotalAmount(storedTotalAmount);

    // Save snapshot after setting state
    const snapshot = {
      id:  orderId,
      formData: storedFormData,
      cartItems: storedCartItems,
      totalAmount: storedTotalAmount,
      createdAt: new Date().toISOString(),
    };

    const existingSnapshots = JSON.parse(localStorage.getItem('myOrderSnapshots')) || [];
    existingSnapshots.push(snapshot);
    localStorage.setItem('myOrderSnapshots', JSON.stringify(existingSnapshots));

    // Clear order data only after storing snapshot
    localStorage.removeItem('orderFormData');
    localStorage.removeItem('orderCartItems');
    localStorage.removeItem('orderTotalAmount');

    setIsSaved(true);
  }, [navigate]);
  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('order_invoice.pdf');
    });
  };
  if (!formData || cartItems.length === 0) return null;

  return (
    <div className="order-success-container">
    {/* 🧾 Save as PDF button */}
    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <button className="pdf-button" onClick={handleDownloadPDF}>Save as PDF</button>
      </div>

      {/* 📦 Everything wrapped in this will be in the PDF */}
      <div ref={pdfRef}>
      <h1>Order Placed</h1>
      <p>
        Thank you for your order <strong>{formData.firstName} {formData.lastName}</strong>, your order has been placed successfully.
      </p>

      <div className="order-box">
        <div className="info-block">
          <h3>Your Information</h3>
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.email}</p>
          <p>{formData.phone}</p>
        </div>

        <div className="info-block">
          <h3>Shipping Address</h3>
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}</p>
          <p>{formData.city} - {formData.zipCode}</p>
          <p>{formData.country}</p>
          <p>Mobile: {formData.phone}</p>
        </div>

        <div className="info-block">
          <h3>Payment Address</h3>
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}</p>
          <p>{formData.city} - {formData.zipCode}</p>
          <p>{formData.country}</p>
          <p>Mobile: {formData.phone}</p>
        </div>

        <div className="info-block">
          <h3>Payment Method</h3>
          <p>Card Payment</p>
        </div>

        <div className="product-summary">
          <h3>Number of Products: {cartItems.length}</h3>
          {cartItems.map(item => (
            <div key={item._id} className="product-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>{item.quantity} × ₹{item.price.toFixed(2)}</p>
              </div>
              <p>₹{(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
       
        <div className="price-summary">
          <p>Subtotal: ₹{(totalAmount - 100 - 110).toFixed(2)}</p>
          <p>Flat Shipping Rate: ₹100.00</p>
          <p>COD Charges 10%: ₹110.00</p>
          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
        </div>
        </div>
        <button className="continue-button" onClick={() => navigate('/')}>Continue</button>
      </div>
    </div>
  );
};

export default OrderSuccess;