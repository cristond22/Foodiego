const fs = require('fs');
const path = require('path');

// Define model and route templates
const models = {
    Food: `const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    imageUrl: String,
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
});

module.exports = mongoose.model('Food', foodSchema);
`,
    User: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
`
};

const routes = {
    foodRoutes: `const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food items
router.get('/', async (req, res) => {
    const foods = await Food.find();
    res.json(foods);
});

// Create a new food item
router.post('/', async (req, res) => {
    const { name, price, category, imageUrl, restaurantId } = req.body;
    const newFood = new Food({ name, price, category, imageUrl, restaurantId });
    await newFood.save();
    res.status(201).json(newFood);
});

module.exports = router;
`,
    authRoutes: `const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
`
};

// Function to create files
const createFile = (dir, fileName, content) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Created: ${filePath}`);
    } else {
        console.log(`⚠️ Already exists: ${filePath}`);
    }
};

// Generate model and route files
Object.entries(models).forEach(([name, content]) => createFile('models', `${name}.js`, content));
Object.entries(routes).forEach(([name, content]) => createFile('routes', `${name}.js`, content));

console.log('🚀 Setup Complete!');
