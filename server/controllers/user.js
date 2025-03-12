const {signUpSchema, signInSchema} = require('../lib/validation/user');
const User = require('../models/user');
const {z} = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express');

const signUp= async(req, res) => {
    console.log(req.body);
    try{
        const {fullName,username,email,password} = signUpSchema.parse(req.body);

        const usernameExists = await User.findOne({username});
        if(usernameExists){
            return res.status(400).json({message: 'Username already exists'});
        }

        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: 'Email already exists'});
        }

        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        const user = new User({
            fullName,
            username,
            email,
            password: hashPassword,
        });

        const newUser = await user.save();

        const token = jwt.sign(
            {
                id:newUser._id,
                username:newUser.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            },
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });
        return res.status(201).json({message: 'User created'});

    } catch(error){
        console.log(error);
        if(error instanceof z.ZodError){
            return res.status(400).json({message: error.errors[0].message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
};

const signIn = async(req, res) => {
    try{
        const {username, password} = signInSchema.parse(req.body);

        const userExists = await User.findOne({username});

        if(!userExists) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const passwordMatch = await bcrypt.compare(password, userExists.password);

        if(!passwordMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {
                id: userExists._id,
                username: userExists.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            },
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });
        return res.status(201).json({message: 'User authenticated'});

    } catch(error){
        console.log(error);
        if(error instanceof z.ZodError){
            return res.status(400).json({message: error.errors[0].message});
        }

        return res.status(500).json({message: 'Internal server error'});
    }
};

const logOut = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({message: 'User logged out'});
};

const me = async(req, res) => {
    try {
        const {createdAt, email, fullName, username, _id, exp} = req.user;
        
        const user={
            createdAt,
            email,
            fullName,
            username,
            id: _id,
            tokenExpired: exp,
        };

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = {
    signUp,
    signIn,
    logOut,
    me,
};
