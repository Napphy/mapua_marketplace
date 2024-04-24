const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
require('dotenv').config();



const app = express();

// Middleware
app.use(cors({
    origin: ["https://marketplace-frontend-blue.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
}));


// Set CORS headers for all responses
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://marketplace-frontend-blue.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});




app.use(express.json())

// Routes
app.use(authRouter);

//DB Connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to your MongoDB!'))
.catch((error) => console.error('Failed to connect to your MongoDB due to: ', error));

//Global
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

//Server stuff
port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`App running on ${port}`);
})