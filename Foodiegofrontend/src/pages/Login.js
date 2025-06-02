import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("https://foodiego-f686.onrender.com/api/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            if (res.data.role === "admin") {
                navigate("/admin/dashboard"); // Redirect Admin
            } else {
                navigate("/menu"); // Redirect Customer
            }
        } catch (error) {
            alert("Login failed! " + (error.response?.data?.message || "Please try again"));
        }
    };

    return (
        <div className="login-container">
            <h2>Login to FoodieGo</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
