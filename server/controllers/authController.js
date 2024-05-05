const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const createError = require('../utils/appErrors');
const Product = require('../models/productModel');
const mongoose = require('mongoose');


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



 //Uploading products
exports.upload = async (req, res, next) => {
        try {
            const newUpload = await Product.create({
                ...req.body,
            });
    
            res.status(201).json({
                status: 'success',
                message: 'Product uploaded successfully!',
                upload: {
                    _id: newUpload._id,
                    item: newUpload.item,
                    price: newUpload.price,
                    description: newUpload.description,
                    createdBy: newUpload.createdBy,
                    createdByEmail: newUpload.createdByEmail,
                    createdByNumber: newUpload.createdByNumber,
                    image: newUpload.image,
                    createdByID : newUpload.createdByID,
                },
            });
        } catch (error) {
            return next(new createError('Error: ', error));
        }
}

//Getting all products
exports.getProducts = async (req, res, next) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            status: 'success',
            message: 'got products successfully',
            products,
        })
    }catch (error){
        return next(new createError('Error:', error))
    }
}

exports.getProductByUser = async (req, res, next) => {
    try {
        const { createdByID } = req.query;

        if (!createdByID) {
            return next(new Error('createdBy field is required!'));
        }

        const products = await Product.find({ createdByID });

        res.status(200).json({
            status: 'success',
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return next(new Error('userId field is required!'));
        }

        const objectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(objectId);

        if(!user){
            res.status(400).json({
                message: 'no user found',
            });
        }
        

        const { name, email, number } = user;

        res.status(200).json({
            status: 'success',
            message: 'User fetched successfully',
            user: { name, email, number },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
    }
};


exports.deleteItem = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Find and delete the product
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
            deletedProduct,
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};

exports.editItem = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const existingProduct = await Product.findById(productId);

        const updatedFields = {};
        if (req.body.item && req.body.item !== existingProduct.item) {
            updatedFields.item = req.body.item;
        }
        if (req.body.price && req.body.price !== existingProduct.price) {
            updatedFields.price = req.body.price;
        }
        if (req.body.description && req.body.description !== existingProduct.description) {
            updatedFields.description = req.body.description;
        }
        if (req.body.image && req.body.image !== existingProduct.image) {
            updatedFields.image = req.body.image;
        }
        


        if (Object.keys(updatedFields).length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No changes detected. Product information remains unchanged.',
                existingProduct,
            });
        }

        Object.assign(existingProduct, updatedFields);


        await existingProduct.save();

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            updatedProduct: existingProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        next(error);
    }
};

exports.editUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const { name, email, number, password } = req.body;

        const existingUser = await User.findById(userId);

        const updatedFields = {};
        if (name && name !== existingUser.name) {
            updatedFields.name = name;
        }
        if (email && email !== existingUser.email) {
            updatedFields.email = email;
        }
        if (number && number !== existingUser.number) {
            updatedFields.number = number;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updatedFields.password = hashedPassword;
        }

        if (Object.keys(updatedFields).length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No changes detected. User information remains unchanged.',
                user: existingUser,
            });
        }

        Object.assign(existingUser, updatedFields);
        await existingUser.save();

        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            user: existingUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
        next(error);
    }
};




    
