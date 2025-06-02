import React, { useState } from "react";
import axios from "axios";
import "./AddFoodAdmin.css"; // Create or update this CSS file for styling

const AddFoodAdmin = () => {
    const [food, setFood] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        stock: "", // Added stock option
    });

    const handleChange = (e) => {
        setFood({ ...food, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://foodiego-f686.onrender.com/api/food", food)
            .then(res => {
                console.log(res);  // Log the response to debug
                alert("Food added successfully!");
                setFood({ name: "", price: "", description: "", image: "", stock: "" });
            })
            .catch(err => {
                console.error(err);  // Log the error to debug
                alert("Error adding food");
            });
    };

    return (
        <div className="add-food-container">
            <h2>Add New Food Item</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Food Name" value={food.name} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price (₹)" value={food.price} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={food.description} onChange={handleChange} required />
                <input type="text" name="image" placeholder="Image URL" value={food.image} onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock Quantity" value={food.stock} onChange={handleChange} required />
                <button type="submit">Add Food</button>
            </form>
        </div>
    );
};

export default AddFoodAdmin;
