const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { router: paymentRoutes, webhookHandler } = require("./routes/paymentRoutes");
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',  // for development
  'https://foodiegofrontend-297beknsh-cristons-projects-feb49d41.vercel.app'  // your Vercel frontend
]
// ✅ CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

// ✅ Stripe Webhook MUST use raw parser

app.post('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }), webhookHandler);

// ✅ Use express.json for all other routes
app.use(express.json());

// ✅ Route Imports
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// ✅ Route Use
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes); // for all non-webhook payment routes

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Failed:", err));

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
