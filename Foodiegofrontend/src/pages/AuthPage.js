import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./AuthPage.css";
import logo from '../assets/b20ecb52-31c2-4bcf-a188-3c3d25753b5c.webp';
const AuthPage = ({ isSignup }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({ name: "", email: "", password: "", role: "customer" });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (isSignup) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(user.password)) {
                setError("Password must be at least 8 characters long and include one uppercase letter, one number, and one special character.");
                return;
            }
        }

        const baseURL = "https://foodiego-f686.onrender.com";
        const endpoint = isSignup 
            ? `${baseURL}/api/auth/register` 
            : `${baseURL}/api/auth/login`;

        const payload = isSignup 
            ? user 
            : { email: user.email, password: user.password };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong");

            // ✅ Only store token & update Redux if it's a login
            if (!isSignup) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("name", data.name);
                localStorage.setItem("userId", data.userId);
                dispatch({
                    type: "LOGIN_USER",
                    payload: {
                        name: data.name,
                        role: data.role,
                        token: data.token,
                    },
                });
            }

            // ✅ Navigate based on role
            navigate(data.role === "admin" ? "/admin/dashboard" : "/menu");

        } catch (err) {
            console.error("❌ Auth error:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            {isSignup && (
                <div className="welcome-section">
                    <img src={logo} alt="Welcome to Foodiego" className="welcome-image" />
                    <h2>Welcome to Foodiego!</h2>
                    <p>"Good food, good mood! Sign up now and enjoy delicious meals at your fingertips."</p>
                </div>
            )}
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <div className="password-container">
                        <input type="text" name="name" placeholder="Full Name" value={user.name} onChange={handleChange} required />
                    </div>
                )}

                <div className="password-container">
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                </div>

                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Password" 
                        value={user.password} 
                        onChange={handleChange} 
                        required 
                    />
                    <span className="eye-icon" onClick={togglePasswordVisibility}>
                        {showPassword ? "🙈" : "👁️"}
                    </span>
                </div>

                {isSignup && (
                    <select name="role" onChange={handleChange} value={user.role}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                )}

                <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
            </form>
        </div>
    );
};

export default AuthPage;
