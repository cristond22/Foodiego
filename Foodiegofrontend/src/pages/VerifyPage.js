import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerify = () => {
        if (otp === '221293') {
            navigate('/order-success');
        } else {
            alert('Invalid OTP. Please try again');
        }
    };

    return (
        <div style={styles.container}>
            <h2>OTP Verification</h2>
            <p>Enter the OTP sent to your dummy number</p>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleVerify} style={styles.button}>Verify</button>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '500px',
        margin: '0 auto',
        textAlign: 'center'
    },
    input: {
        padding: '10px',
        margin: '1rem 0',
        fontSize: '16px',
        width: '100%'
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
    }
};

export default VerifyPage;