import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar.js";
import FoodList from "./pages/FoodList.js";
import AddFoodAdmin from "./pages/AddFoodAdmin.js";
import HomePage from "./pages/HomePage.js";
import UserDashboard from "./pages/UserDashboard";
import AuthPage from "./pages/AuthPage";
import AdminFoodManagement from "./admin/AdminFoodManagement";
import Checkout from "./pages/Checkout"; // Import Checkout Page
import OrderSuccess from "./pages/OrderSuccess.js";
import OrderPage from './pages/OrderPage';
import ContactUs from "./pages/ContactUs.js";


import "./App.css";

// ✅ Protected Route Component for Role-Based Access
const ProtectedRoute = ({ element, allowedRoles }) => {
    const userRole = localStorage.getItem("role");
    if (allowedRoles.includes(userRole)) {
        return element;
    } else {
        return <Navigate to="/login" />;
    }
};



function App() {
    const [foods, setFoods] = useState([]);
    const dispatch = useDispatch();

    // ✅ Fetch food list on load
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axios.get("https://foodiego-f686.onrender.com/api/food");
                setFoods(response.data);
            } catch (error) {
                console.error("Error fetching foods:", error);
            }
        };

        fetchFoods();
    }, []);

    // ✅ Fetch cart if user is logged in
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://foodiego-f686.onrender.com/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch({ type: "SET_CART", payload: res.data });
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        };

        if (localStorage.getItem('token')) {
            fetchCart();
        }
    }, [dispatch]);

    return (
        <Router>
            <Navbar /> {/* ✅ No cart/setCart props needed */}

            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactUs />} />

                <Route path="/signup" element={<AuthPage isSignup={true} />} />
                <Route path="/login" element={<AuthPage isSignup={false} />} />
                <Route path="/menu" element={<FoodList foods={foods} />} />
                <Route path="/home" element={<HomePage />} />   
            
                <Route path="/checkout" element={
                    <ProtectedRoute element={<Checkout />} allowedRoles={["customer"]} />
                } />
                
                <Route path="/add-food-admin" element={
                    <ProtectedRoute element={<AddFoodAdmin />} allowedRoles={["admin"]} />
                } />
                <Route path="/user/dashboard" element={
                    <ProtectedRoute element={<UserDashboard />} allowedRoles={["customer"]} />
                } />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute element={<AdminFoodManagement />} allowedRoles={["admin"]} />
                } />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/my-orders" element={<OrderPage />} />
           

            </Routes>
        </Router>
    );
}

export default App;
