const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const createError = require('../utils/appErrors');


// Registering
exports.signup = async (req, res, next) => {
    try{

        // check if email already used
        const existingEmail = await User.findOne({email: req.body.email});

        if(existingEmail){
            return next(new createError("Email already taken!"));
        }

        // check if number already used
        const existingNumber = await User.findOne({ number: req.body.number });

        if(existingNumber){
            return next(new createError('Number already taken!'));
        }


        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        //add Token to user
        const token = jwt.sign({_id: newUser._id}, process.env.JWT_TOKEN, {
            expiresIn: '1d',
        })

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully!',
            token,
            user:{
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                number: newUser.number,
            },
        });

    } catch (error) {
        next(error);
    }

};


//Logging in
exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) return next(new createError('User not found! Please Sign up!', 404));
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return next(new createError('Incorrect email or password!', 401));
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_TOKEN, {
            expiresIn: '1d',
        });

        res.status(200).json({
            status:'success',
            token,
            message:'Logged in successfully!',
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            }
        })

    }catch (error){
        return next(new createError('Error: ', error));
    }
   

};