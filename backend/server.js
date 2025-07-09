console.log('Starting backend server...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

console.log('Connecting to:', process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'https://restaurantreservation-system.netlify.app', // your Netlify site URL
    'http://localhost:5173' // for local development
  ],
  credentials: true // only if you use cookies/auth
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model('User', userSchema);

// Booking model
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  guests: String,
  restaurant: String,
  username: String,
  timestamp: String,
});
const Booking = mongoose.model('Booking', bookingSchema);

// Restaurant model
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: String,
  photo: { type: String, required: true },
  email:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  menu: [{ item: String, price: String }],
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, isAdmin: !!isAdmin });
    await user.save();
    res.status(201).json({ msg: 'User created' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password, isAdmin } = req.body;
  try {
    console.log('Login attempt:', email, password, isAdmin);
    const user = await User.findOne({ email, isAdmin: !!isAdmin });
    console.log('User found:', user);
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ msg: 'Booking saved', booking });
  } catch (err) {
    res.status(500).json({ msg: 'Booking failed' });
  }
});

// Get bookings for a user
app.get('/api/bookings', async (req, res) => {
  const { username } = req.query;
  try {
    const query = username ? { username } : {};
    const bookings = await Booking.find(query);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bookings' });
  }
});

// Get bookings for a specific restaurant
app.get('/api/bookings/restaurant/:restaurantName', async (req, res) => {
  try {
    const bookings = await Booking.find({ restaurant: req.params.restaurantName });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bookings for restaurant' });
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete booking' });
  }
});

// Edit booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: 'Booking updated', booking: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update booking' });
  }
});

// Add restaurant
app.post('/api/restaurants', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const restaurant = new Restaurant({ ...req.body, password: hashedPassword });
    await restaurant.save();
    res.status(201).json({ msg: 'Restaurant created', restaurant });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create restaurant' });
  }
});

// Restaurant login
app.post('/api/restaurants/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) return res.status(400).json({ msg: 'Invalid credentials' });
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    res.json({ restaurant });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed' });
  }
});

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ restaurants });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch restaurants' });
  }
});

// Get all users (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

// Delete user by ID (admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete user' });
  }
});

// Delete restaurant by ID (admin only)
app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete restaurant' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
