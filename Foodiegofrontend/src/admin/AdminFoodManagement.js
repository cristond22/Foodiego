import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
    const [foods, setFoods] = useState([]);
    const [editingFood, setEditingFood] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = () => {
        axios.get('https://foodiego-f686.onrender.com/api/food')
            .then(res => setFoods(res.data))
            .catch(err => console.error("Error fetching foods:", err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingFood(prev => ({ ...prev, [name]: value }));
    };

    const updateFood = () => {
        if (!editingFood || !editingFood._id) return;

        axios.put(`https://foodiego-f686.onrender.com/api/food/${editingFood._id}`, editingFood, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            fetchFoods();
            setEditingFood(null);
        })
        .catch(err => console.error("Error updating food:", err));
    };

    const deleteFood = (id) => {
        axios.delete(`https://foodiego-f686.onrender.com/api/food/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => fetchFoods())
        .catch(err => console.error("Error deleting food:", err));
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Admin Panel - Edit/Delete Food Items</h2>
            </div>

            {editingFood && (
                <div className="edit-food-form">
                    <h3>Edit Food</h3>
                    <input type="text" name="name" placeholder="Name" value={editingFood.name} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={editingFood.description} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price" value={editingFood.price} onChange={handleChange} />
                    <input type="number" name="stock" placeholder="Stock" value={editingFood.stock} onChange={handleChange} />
                    <input type="text" name="image" placeholder="Image URL" value={editingFood.image} onChange={handleChange} />
                    <button onClick={updateFood}>Update Food</button>
                    <button onClick={() => setEditingFood(null)}>Cancel</button>
                </div>
            )}

            <div className="admin-food-list">
                {foods.map(food => (
                    <div key={food._id} className="admin-food-card">
                        <img className="admin-food-card img" src={food.image || 'https://via.placeholder.com/100'} alt={food.name} />
                        <h4>{food.name}</h4>
                        <p>{food.description}</p>
                        <p>Price: ₹{food.price}</p>
                        <p>Stock: {food.stock}</p>
                        <button className="edit-btn" onClick={() => setEditingFood(food)}>Edit</button>
                        <button className="delete-btn" onClick={() => deleteFood(food._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;
