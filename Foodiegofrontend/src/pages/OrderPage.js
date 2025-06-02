import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderPage.css';
import { FaPhoneAlt } from 'react-icons/fa';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);  // <--- Loading state
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);  // Start loading
        const res = await axios.get(`https://foodiego-f686.onrender.com/api/order/my-orders/${userId}`);
        console.log("response",res);
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
      } finally {
        setLoading(false);  // Stop loading no matter success or failure
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setLoading(false); // No user, so no loading needed
    }
  }, [userId]);

  if (loading) {
    return <div className="order-page"><p>Loading orders...</p></div>;
  }



  const filteredOrders = orders.filter(order => {
    console.log("Filtering Order:", orders, "Status:", order.status, "Current Filter:", filter);
    if (filter === 'All') return true;
    if (filter === 'Delivered') return order.status === 'completed';
    if (filter === 'In progress') return order.status === 'in-progress';
    if (filter === 'Cancelled') return order.status === 'cancelled';
    return false;
  });

  console.log("Filtered Orders:", filteredOrders);

  const toggleExpand = (orderId) => {
    console.log("Toggling expansion for Order ID:", orderId);
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  return (
    <div className="order-page">
      <div className="order-header">
        <h2>My Orders</h2>
        <div className="filters">
          {['All', 'In progress', 'Delivered', 'Cancelled'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => {
                console.log("Filter clicked:", f);
                setFilter(f);
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 && <p>No orders found.</p>}

      {filteredOrders.map(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        const isExpanded = expandedOrderId === order._id;
        

        console.log("Rendering Order:", order._id, "Expanded:", isExpanded);

        const statusColorMap = {
          completed: 'green',
          'in-progress': 'orange',
          cancelled: 'gray'
        };
        const statusColor = statusColorMap[order.status] || 'gray';

        return (
          <div className="order-card expanded-style" key={order._id}>
            <div className="order-top" onClick={() => toggleExpand(order._id)}>
              <span className={`status-badge ${statusColor}`}>
                {order.status === 'completed' ? 'Delivered' : order.status}
              </span>
              <span className="order-date">{date}</span>
            </div>

            <div className="order-main" onClick={() => toggleExpand(order._id)}>
              {order.items[0]?.foodId?.image && (
                <img src={order.items[0].foodId.image} alt="food item" className="product-thumb" />
              )}
              <div className="order-summary">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p>
                  {order.items[0]?.foodId?.name}
                  {order.items.length > 1 && (
                    <span className="more-items"> & {order.items.length - 1} more item(s)</span>
                  )}
                </p>
                <p><strong>₹</strong>{order.totalAmount.toFixed(2)}</p>
              </div>
              <div className="arrow">{isExpanded ? '▲' : '▼'}</div>
            </div>

            {isExpanded && (
              <div className="expanded-details invoice-style">
                <section className="delivery-info">
                  <h3>Order Delivered To</h3>
                  <p><strong>{order.shippingAddress?.name}</strong></p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state || ''} {order.shippingAddress?.zipCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                  <p><FaPhoneAlt /> {order.shippingAddress?.phone}</p>
                </section>

                <section className="order-items">
                  <h3>Order Details</h3>
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price (₹)</th>
                        <th>Subtotal (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => {
                        const price = item.foodId?.price || 0;
                        const subtotal = price * item.quantity;
                        return (
                          <tr key={i}>
                            <td>{item.foodId?.name}</td>
                            <td>{item.quantity}</td>
                            <td>{price.toFixed(2)}</td>
                            <td>{subtotal.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>

                <section className="payment-summary">
                  <h3>Payment Summary</h3>
                  <p><strong>Total Amount:</strong> ₹{order.paymentDetails.amount}</p>
                  <p><strong>Payment Method:</strong> {order.paymentDetails?.method}</p>
                  <p><strong>Order Status:</strong> {order.status === 'completed' ? 'Delivered' : order.status}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </section>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderPage;
