const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const allowCors = require('./utils/allowCors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(allowCors);


// Routes
app.use(authRouter);


// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to your MongoDB!'))
    .catch((error) => console.error('Failed to connect to your MongoDB due to: ', error));

// Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// Server setup
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`App running on ${port}`);
});
