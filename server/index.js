const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
require('dotenv').config();



const app = express();

// Middleware
const corsOptions = {
    origin: ['https://marketplace-frontend-blue.vercel.app'],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    headers: ['X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version']
};

app.use(cors(corsOptions));
app.use(express.json())

// Routes
app.use('/api/auth', authRouter);

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