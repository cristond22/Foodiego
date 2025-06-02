// 📄 PaymentPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const [method, setMethod] = useState('cod');
    const [cardType, setCardType] = useState('visa');
    const navigate = useNavigate();

    const handlePayment = () => {
        if (method === 'card') {
            navigate('/verify');
        } else {
            navigate('/order-success');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Select Payment Method</h2>

            <label>
                <input
                    type="radio"
                    value="cod"
                    checked={method === 'cod'}
                    onChange={() => setMethod('cod')}
                />
                Cash on Delivery
            </label>

            <label>
                <input
                    type="radio"
                    value="card"
                    checked={method === 'card'}
                    onChange={() => setMethod('card')}
                />
                Pay with Card
            </label>

            {method === 'card' && (
                <div style={styles.cardForm}>
                    <label>Card Type:</label>
                    <select value={cardType} onChange={e => setCardType(e.target.value)}>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                    </select>
                    <input placeholder="Card Number" disabled value="1111 1111 1111 1111" />
                    <input placeholder="Name on Card" disabled value="Test User" />
                    <input placeholder="Expiry" disabled value="12/29" />
                    <input placeholder="CVV" disabled value="123" />
                </div>
            )}

            <button onClick={handlePayment} style={styles.button}>Proceed</button>
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
    cardForm: {
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '1rem'
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
    }
};

export default PaymentPage;
