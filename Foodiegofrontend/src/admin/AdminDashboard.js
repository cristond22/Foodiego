import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [foods, setFoods] = useState([]);
    const [newFood, setNewFood] = useState({ name: '', price: '', stock: '', image: '' });

    useEffect(() => {
        axios.get('https://foodiego-f686.onrender.com/api/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.error("Error fetching foods:", err));
    }, []);

    const handleAddFood = () => {
        axios.post('https://foodiego-f686.onrender.com/api/foods', newFood)
            .then(res => setFoods([...foods, res.data]))
            .catch(err => console.error("Error adding food:", err));
    };

    const handleDeleteFood = (id) => {
        axios.delete(`https://foodiego-f686.onrender.com/api/foods/${id}`)
            .then(() => setFoods(foods.filter(food => food._id !== id)))
            .catch(err => console.error("Error deleting food:", err));
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="add-food-form">
                <input type="text" placeholder="Food Name" onChange={e => setNewFood({ ...newFood, name: e.target.value })} />
                <input type="number" placeholder="Price" onChange={e => setNewFood({ ...newFood, price: e.target.value })} />
                <input type="number" placeholder="Stock" onChange={e => setNewFood({ ...newFood, stock: e.target.value })} />
                <input type="text" placeholder="Image URL" onChange={e => setNewFood({ ...newFood, image: e.target.value })} />
                <button onClick={handleAddFood}>Add Food</button>
            </div>
            <div className="food-list">
                {foods.map(food => (
                    <div key={food._id} className="food-item">
                        <img src={food.image || 'https://via.placeholder.com/150'} alt={food.name} />
                        <h3>{food.name}</h3>
                        <p>Price: ₹{food.price}</p>
                        <p>Stock: {food.stock}</p>
                        <button onClick={() => handleDeleteFood(food._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
