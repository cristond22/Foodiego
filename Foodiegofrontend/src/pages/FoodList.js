import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './FoodList.css';

const FoodList = () => {
    const [foods, setFoods] = useState([]);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Optional debug: safely access cart
    const cartItems = useSelector(state => state.cart?.items || []);
    const user = useSelector(state => state.user);

    useEffect(() => {
        axios.get('https://foodiego-f686.onrender.com/api/food')
            .then(res => setFoods(res.data))
            .catch(err => console.error("Error fetching foods:", err));
    }, []);

    const addToCart = async (food) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("⚠️ Please log in to add items to cart.");
            navigate("/login");
            return;
        }

        if (food.stock <= 0) {
            alert("This item is out of stock.");
            return;
        }

        try {
            const res = await axios.post(
                "https://foodiego-f686.onrender.com/api/cart/add",
                {
                    foodId: food._id,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Dispatch normalized cart item to Redux
            dispatch({
                type: "ADD_ITEM_TO_CART",
                payload: {
                    foodId: {
                        _id: food._id,
                    },
                    name: food.name,
                    price: food.price,
                    image: food.image,
                    quantity: 1,
                },
            });

            setMessage(`${food.name} added to cart successfully!`);
            setTimeout(() => setMessage(""), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
                navigate("/login");
            } else {
                alert("Failed to add item to cart. Try again later.");
            }
        }
    };

    const completeOrder = () => {
        navigate('/order');
    };

    return (
        <div className="food-list-container">
            <header className="App-header">
                <h1>Welcome to FoodieGo</h1>
                <p>Your favorite food, delivered fast.</p>
            </header>
            <h2>Menu</h2>
            {message && <p className="success-message">{message}</p>}
            <div className="food-container">
                {foods.length > 0 ? (
                    foods.map(food => (
                        <div key={food._id} className={`food-card ${food.stock === 0 ? 'out-of-stock' : ''}`}>
                            <img
                                src={food.image || 'https://via.placeholder.com/150'}
                                alt={food.name}
                                className="food-image"
                            />
                            <h3>{food.name}</h3>
                            <p>{food.description}</p>
                            <p>Price: ₹{food.price}</p>
                            <p className={food.stock === 0 ? "stock-text out" : "stock-text in"}>
                                {food.stock > 0 ? `Stock: ${food.stock}` : "Out of Stock"}
                            </p>
                            <button onClick={() => addToCart(food)} disabled={food.stock === 0}>
                                {food.stock > 0 ? "Add to Cart" : "Out of Stock"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Loading foods...</p>
                )}
            </div>
        </div>
    );
};

export default FoodList;
