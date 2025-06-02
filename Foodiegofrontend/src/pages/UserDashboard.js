import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <p>Explore our menu and manage your orders.</p>
            <Link to="/menu"><button>View Menu</button></Link>
            <Link to="/orders"><button>My Orders</button></Link>
        </div>
    );
};

export default UserDashboard;
