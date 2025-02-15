require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const googleAuthRoutes = require("./routes/googleAuthRoute");
const authRoutes = require('./routes/authRoutes');

const dataRoutes = require('./routes/dataRoutes');
const emailProcessingRoutes = require('./routes/emailProcessingRoutes'); 
// Create Express app
const app = express();

// Debug logging
console.log('Starting server...');
console.log('Environment check:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Set up routes (BEFORE starting the server)
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);

app.use('/api/data', dataRoutes);
app.use('/api/email', emailProcessingRoutes);

// Connect to MongoDB and Start Server
console.log('Attempting database connection...');
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });
