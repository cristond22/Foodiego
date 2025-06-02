import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from '../assets/b20ecb52-31c2-4bcf-a188-3c3d25753b5c.webp';


const Navbar = () => {
    const location = useLocation(); // ✅ Declare only once
    const isHomeLikePage = location.pathname === '/' || location.pathname === '/home';
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart || {});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCartOpen, setCartOpen] = useState(false);
    const [pincodeConfirmed, setPincodeConfirmed] = useState(false);
    const token = localStorage.getItem('token');    
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);  
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        const storedRole = localStorage.getItem("role");
          // Hide elements if on '/' or '/home'
  

        if (storedName && storedRole) {
            dispatch({
                type: "LOGIN_USER",
                payload: {
                    name: storedName,
                    role: storedRole,
                    token: localStorage.getItem("token"),
                },
            });
        }
    }, [dispatch]);
    
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const confirmLogout = () => {
        localStorage.clear();
        dispatch({ type: "LOGOUT_USER" });
        setSidebarOpen(false);
        setShowLogoutConfirm(false);
        navigate("/login");
    };

    const handleLogout = () => setShowLogoutConfirm(true);

    const handleCartClick = () => {
        if (user?.role === 'admin') {
            navigate('/orders');
        } else {
            setCartOpen(!isCartOpen);
        }
    };

    const removeItemFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    };
    const updateItemQuantity = async (itemId, newQuantity) => {
  if (newQuantity <= 0) {
    removeItemFromCart(itemId);
  } else {
    try {
      const response = await fetch('https://foodiego-f686.onrender.com/api/cart/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`   // <-- add this line
  },
  body: JSON.stringify({ foodId: itemId, quantity: newQuantity }),
});
      const updatedCart = await response.json();
      const updatedItem = updatedCart.items.find(item => item.foodId._id === itemId);
      dispatch({ type: 'UPDATE_ITEM_QUANTITY',  payload: { itemId, quantity: updatedItem ? updatedItem.quantity : newQuantity } });
    } catch (error) {
      console.error('Failed to update quantity', error);
      alert('Error updating cart quantity');
    }
  }
};

  
    /*const updateItemQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItemFromCart(itemId);
        } else {
            dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { itemId, quantity: newQuantity } });
        }
    };*/
    const [pincode, setPincode] = useState('');
    const [currentLocation, setLocation] = useState({ district: '', state: '' });
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(null);

    // Calculate total quantity
    useEffect(() => {
        const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        let time = 30; // default
        if (totalQuantity >= 25) {
            time = 60;
        } else if (totalQuantity >= 20) {
            time = 55;
        } else if (totalQuantity >= 15) {
            time = 50;
        } else if (totalQuantity >= 10) {
            time = 45;
        } else if (totalQuantity >= 5) {
            time = 40;
        } else if (totalQuantity >= 3) {
            time = 35;
        } else if (totalQuantity >= 1) {
            time = 30;
        } else {
            time = 0;
        }
        setEstimatedDeliveryTime(time);
    }, [cart]);

    // Fetch city/state using pincode
    /*
    const fetchLocationByPincode = async (pin) => {
        try {
            const response = await axios.get(
                'https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd000001cdc3b564546246a772a26393094f5645&offset=0&limit=all&format=csv&format=json',
                {
                    params: {
                        'api-key': '579b464db66ec23bdd000001cdc3b564546246a772a26393094f5645',
                        format: 'json',
                        limit: 100000
                    },
                }
            );

            const matched = response.data.records.find(
                (entry) => entry.pincode === pin
            );

            if (matched) {
                setLocation({ district: matched.district, state: matched.statename });
                setPincodeConfirmed(true);
            } else {
                setLocation({ district: 'Not Found', state: 'N/A' });
                setPincodeConfirmed(false);
            }
        } catch (error) {
            console.error('Error fetching pincode data:', error);
            setLocation({ district: 'Error', state: 'Error' });
        }
    };
*/
    const handlePincodeChange = (e) => {
        const input = e.target.value;
        setPincode(input);
    };

    const checkDeliveryStatus = async () => {
        if (pincode.length === 6 && /^\d+$/.test(pincode)) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                if (data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setLocation({ district: postOffice.District, state: postOffice.State });
                    setPincodeConfirmed(true);
                } else {
                    setLocation({ district: 'Invalid Pincode', state: '' });
                    setPincodeConfirmed(false);
                }
            } catch (error) {
                console.error('Error fetching location:', error);
                setLocation({ district: '', state: '' });
                setPincodeConfirmed(false);
            }
        } else {
            setLocation({ district: 'Enter valid 6-digit pincode', state: '' });
            setPincodeConfirmed(false);
        }
    };
    const handleProceedToCheckout = () => {
    
    
        if (cart.items && cart.items.length > 0) {
          navigate('/checkout'); // Navigate to the Checkout page
        } else {
          alert('Your cart is empty!');
        }
      };
    return (
        <>
            
            <div style={styles.navbar}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="FoodieGo Logo" style={styles.logo} />
                     {/* Conditionally show welcome text */}
                {!isHomeLikePage && (
                    user?.name ? (
                        <span style={styles.userName} onClick={toggleSidebar}>
                            Welcome, {user.name} ⌄
                        </span>
                    ) : (
                        <span style={styles.userName} onClick={toggleSidebar}>Guest ⌄</span>
                    )
                )}
                </div>

                {user && user.name && user.role !== "admin" && !isHomeLikePage && (
                    <div style={styles.cartButtonContainer}>
                        <button onClick={handleCartClick} style={styles.cartButton}>
                            🛒 {cart?.items?.length || 0}
                        </button>
                    </div>
                )}
            </div>

            <div style={{
                ...styles.sidebar,
                left: isSidebarOpen ? '0' : '-100%',
                pointerEvents: isSidebarOpen ? 'auto' : 'none',
                visibility: isSidebarOpen ? 'visible' : 'hidden'
            }}>
                {user?.name && (
                    <>
                        <Link to="/home" style={styles.link} onClick={toggleSidebar}>Home</Link>
                        <Link to="/menu" style={styles.link} onClick={toggleSidebar}>Menu</Link>
                        <Link to="/my-orders" style={styles.link} onClick={toggleSidebar}>My Orders</Link>
                        
                       </>
                )}

                {user?.role === "admin" && (
                <>
                    <Link to="/add-food-admin" style={styles.link} onClick={toggleSidebar}>Add Food</Link>
                    <Link to="/orders" style={styles.link} onClick={toggleSidebar}>Orders</Link>
                    <Link to="/admin/dashboard" style={styles.link} onClick={toggleSidebar}>Admin Dashboard</Link> {/* 👈 Add this */}
                </>
            )}


                {user?.name ? (
                    <button style={styles.link} onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <Link to="/login" style={styles.link} onClick={toggleSidebar}>Login</Link>
                        <Link to="/signup" style={styles.link} onClick={toggleSidebar}>Sign Up</Link>
                        
                    </>
                )}
            </div>

            {showLogoutConfirm && (
                <div style={styles.confirmOverlay}>
                    <div style={styles.confirmBox}>
                        <p>Are you sure you want to logout?</p>
                        <button onClick={confirmLogout} style={styles.confirmBtn}>Yes</button>
                        <button onClick={() => setShowLogoutConfirm(false)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{
                ...styles.cartPanel,
                right: isCartOpen ? '0' : '-100%',
                pointerEvents: isCartOpen ? 'auto' : 'none',
                visibility: isCartOpen ? 'visible' : 'hidden'
            }}>
                <h3>Your Cart</h3>
                {cart?.items?.length === 0 ? (
                    <p>No items yet.</p>
                ) : (
                    <div>
                        {Array.isArray(cart.items) ? (
                            cart.items.map((item, index) => (
                                <div key={index} style={styles.cartItem}>
                                    <img
                                        src={item?.image || '/default-image.jpg'}
                                        alt={item?.name || 'Unnamed Item'}
                                        style={styles.cartItemImage}
                                    />
                                    <div style={styles.cartItemDetails}>
                                        <strong>{item?.name || 'Unnamed Item'}</strong>
                                        <div>Price: ₹{item?.price || 0}</div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                                            <button
                                                onClick={() => updateItemQuantity(item.foodId._id, item.quantity - 1)}
                                                style={styles.quantityBtn}
                                            >−</button>
                                            <span style={{
                                                fontSize: '18px',
                                                color: '#222', // darker for visibility
                                                padding: '0 8px',
                                            }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateItemQuantity(item.foodId._id, item.quantity + 1)}
                                                style={styles.quantityBtn}
                                            >+</button>
                                        </div>
                                        <div>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</div>

                                        <button
                                            onClick={() => removeItemFromCart(item.foodId._id)}
                                            style={styles.removeItemButton}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items in the cart</p>
                        )}
                    </div>
                )}
                {cart?.items?.length > 0 && (
                    <div style={styles.cartSummary}>
                        <hr />
                        <p><strong>Total price to be paid:</strong> ₹{cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>

                        <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ccc' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {pincodeConfirmed ? (
                                    <>
                                        <p style={{ color: 'green', fontWeight: 'bold' }}>
                                            ✅ We deliver to your location: {currentLocation.district}, {currentLocation.state}
                                        </p>
                                        <p>
                                            📍 Pincode: <strong>{pincode}</strong>
                                            <button
                                                onClick={() => {
                                                    setPincode('');
                                                    setPincodeConfirmed(false);
                                                    setLocation({ district: '', state: '' });
                                                }}
                                                style={styles.removePincodeButton}
                                            >
                                                Remove Pincode
                                            </button>
                                        </p>
                                        {estimatedDeliveryTime !== null && (
                                    <p><strong>Estimated delivery time:</strong> {estimatedDeliveryTime} mins</p>
                                )}
                                    </>
                                ) : (
                                    <div style={styles.pincodeSection}>
                                        <input
                                            type="text"
                                            value={pincode}
                                            onChange={handlePincodeChange}
                                            style={styles.pincodeInput}
                                            maxLength={6}
                                            placeholder="Enter Pincode"
                                        />
                                        <button onClick={checkDeliveryStatus} style={styles.pincodeBtn}>
                                            Check Delivery Status
                                        </button>
                                    </div>
                                )}

                                
                            </div>
                        </nav>
                        <button  onClick={handleProceedToCheckout}>Proceed to Checkout</button>
                    </div>
                )}
                <button onClick={() => setCartOpen(false)}>Close</button>
            </div>
        </>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#343a40',
        color: 'white',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        width: '50px',
        height: '50px',
    },
    userName: {
        marginLeft: '10px',
        cursor: 'pointer',
    },
    cartButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        zIndex: 9999,  
    },
    cartButton: {
        backgroundColor: '#f8f9fa',
        color: '#343a40',
        border: 'none',
        borderRadius: '5px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    sidebar: {
        position: 'absolute',
        top: '0',
        left: '-100%',
        width: '250px',
        height: '100%',
        backgroundColor: '#343a40',
        color: 'white',
        paddingTop: '60px',
        transition: 'left 0.3s ease-in-out',
        zIndex: 9999,  
    },
    link: {
        color: 'white',
        display: 'block',
        padding: '12px 16px',
        textDecoration: 'none',
    },
    cartPanel: {
        position: 'absolute',
        top: '0',
        right: '-100%',
        width: '350px',
        height: '100%',
        backgroundColor: '#f8f9fa',
        borderLeft: '1px solid #ccc',
        paddingTop: '20px',
        transition: 'right 0.3s ease-in-out',
        zIndex: 9999,  
    },
    cartItem: {
        display: 'flex',
        padding: '10px',
        borderBottom: '1px solid #ccc',
    },
    cartItemImage: {
        width: '80px',
        height: '80px',
        marginRight: '20px',
    },
    cartItemDetails: {
        flex: 1,
    },
    quantityBtn: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        fontSize: '18px',
        cursor: 'pointer',
    },
    removeItemButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
    cartSummary: {
        padding: '15px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #ccc',
    },
    pincodeSection: {
        display: 'flex',
        gap: '10px',
    },
    pincodeInput: {
        padding: '8px',
        width: '150px',
    },
    pincodeBtn: {
        padding: '8px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    removePincodeButton: {
        background: 'none',
        color: 'red',
        cursor: 'pointer',
        padding: '5px',
        border: 'none',
    },
    confirmOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
     
    },
    confirmBox: {
        backgroundColor: '#fff',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '5px',
    },
    confirmBtn: {
        padding: '8px 12px',
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    cancelBtn: {
        padding: '8px 12px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    }
};

export default Navbar;
