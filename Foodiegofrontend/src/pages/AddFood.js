import React, { useState } from "react";
import axios from "axios";
import "./AddFood.css"; // Create this CSS file for styling

const AddFood = () => {
    const [food, setFood] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
    });

    const handleChange = (e) => {
        setFood({ ...food, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://foodiego-f686.onrender.com/api/foods", food)
            .then(res => {
                alert("Food added successfully!");
                setFood({ name: "", price: "", description: "", image: "" });
            })
            .catch(err => alert("Error adding food"));
    };

    return (
        <div className="add-food-container">
            <h2>Add New Food</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Food Name" value={food.name} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price (₹)" value={food.price} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={food.description} onChange={handleChange} required />
                <input type="text" name="image" placeholder="Image URL" value={food.image} onChange={handleChange} required />
                <button type="submit">Add Food</button>
            </form>
        </div>
    );
};

export default AddFood;
