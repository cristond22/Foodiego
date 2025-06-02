import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAuth.css';

const AdminAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://foodiego-f686.onrender.com/api/auth/admin-login', { email, password });
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials!');
        }
    };

    return (
        <div className="admin-auth-container">
            <div className="admin-auth-card">
                <h2>Admin Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Admin Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;
