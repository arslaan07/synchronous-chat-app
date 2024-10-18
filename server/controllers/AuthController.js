const userModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const fs = require('fs');

const maxAge = 3 * 24 * 60 * 60 * 1000; 
const createToken = (email, password) => {
    return jwt.sign({ email, password}, process.env.JWT_KEY, { expiresIn: maxAge / 1000 });
}
module.exports.signup  = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).send("Please provide email and password");
        }
        let user = await userModel.findOne({ email });
        if(user) {
            return res.status(400).send("User already exists");
        }
        user = await userModel.create({ email, password });
        let token = createToken(email, password);
        res.cookie("jwt", token, {
            httpOnly: true,
            expires: new Date(Date.now() + maxAge),
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", // Lax for development
        })
        return res.status(201).send({ user });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).send("Please provide email and password");
        }
        let user = await userModel.findOne({ email });
        if(!user) {
            return res.status(404).send("Email or password is incorrect");
        }
        const auth = await bcrypt.compare(password, user.password);
        if(!auth) {
            return res.status(400).send("Password is incorrect");
        }
        let token = createToken(email, password);
        res.cookie("jwt", token, {
            httpOnly: true,
            expires: new Date(Date.now() + maxAge),
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", // Lax for development
        })
        return res.status(200).send({ message: "User logged in successfully", user });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports.getUserInfo = async (req, res) => {
    try {
       console.log(req.userId);
       let user = await userModel.findById(req.userId);
       console.log(user)
       return res.status(200).send({ user });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}
module.exports.updateProfile = async (req, res) => {
    try {
    //    console.log(req.userId);
       const { firstName, lastName, color } = req.body;
       if(!firstName || !lastName) {
        return res.status(400).send("Please provide first name and last name");
       }
       let user = await userModel.findByIdAndUpdate(req.userId, {firstName, lastName, color, profileSetup: true },     
        {
          new: true, 
          runValidators: true
         });
    //    console.log(user)
       return res.status(200).send({ user });
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
}

module.exports.addProfileImage = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).send("Please upload an image");
        }
        const image = req.file
        const imagePath = image.path.replace(/\\/g, '/')
        // console.log(image)
        let user = await userModel.findByIdAndUpdate(req.userId, { image: imagePath }, { new: true, runValidators: true} )
        await user.save()
        return res.status(200).send({ message: "Image uploaded successfully", user });

    } catch (error) {
        console.log("error from add profile image", error)
    }
}

module.exports.deleteProfileImage = async (req, res) => {
    try {
        let user = await userModel.findById(req.userId);
        fs.unlinkSync(user.image);  // Delete the old image file
        await userModel.findByIdAndUpdate(req.userId, {image: null}, { new: true, runValidators: true} )
        await user.save()
        return res.status(200).send({ message: "Image deleted successfully", user });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}