const port = 5000;
import express from 'express';
// const express = require('express');
const app = express();
import mongoose from 'mongoose';
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// const path = require('path');
// const cors = require('cors');
import cors from 'cors';

// const fetch = require('node-fetch');
import fetch from 'node-fetch';

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

// DataBase connection with mongoDB
mongoose.connect("mongodb://localhost:27017/MyEdu");
// mongoose.connect("mongodb+srv://mohamedabd:mohamed123@cluster0.h5mr3w8.mongodb.net/first_commerce");
// mongoose.connect("mongodb+srv://mohamed:Mohamed_123@cluster0.z75ov2g.mongodb.net/e-commerce");

// API Creation
app.get("/", (req, res) => {
    res.send("Express app is runing !")
})

// Schema for Creating Courses
const Course = mongoose.model('Course', {
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isPublish: {
        type: Boolean,
        default: false,
    },
})

app.post('/addcourse', async (req, res) => {
    let courses = await Course.find({});
    let id;
    if (courses.length > 0) {
        let last_course_array = courses.slice(-1);
        // console.log(last_course_array);
        let last_course = last_course_array[0];
        id = last_course.id + 1;
    } else {
        id = 1;
    }

    const course = new Course({
        id: id,
        title: req.body.title,
        image: req.body.image,
        category: req.body.category,
        price: req.body.price,
    })
    console.log(course);
    await course.save();
    console.log("saved");
    res.json({
        success: true,
        title: req.body.title,
    })
})

// Creating API to delete course
app.post("/removecourse", async (req, res) => {
    await Course.findOneAndDelete({ id: req.body.id });
    console.log('removed');
    res.json({
        success: true,
        title: req.body.title
    })
})

// Creating API for getting all courses 
app.get("/allcourses", async (req, res) => {
    let courses = await Course.find({});
    console.log("All Courses Fetched ++");
    res.send(courses);
})


// Schema Creation for User model
const User = mongoose.model('User', {
    title: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    cartData: Object,
    date: {
        type: Date,
        default: Date.now,
    }
})

// Creating Endpoint for regestring Users
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found for same email address" })
    }
    let cart = {};
    for (let index = 0; index < 300; index++) {
        cart[index] = 0
    }
    const user = new User({
        title: req.body.title,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();
    const data = {
        user: {
            id: user.id,
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        token
    })
})

// Creation endpoint for user login
app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({
                success: true,
                token
            })
        }else{
            res.json({success:false,errors:"Wrong Password"})
        }
    }else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// Creating endpoint for newCollection data
app.get('/newcollection',async(req,res)=>{
    let course = await Course.find({});
    let newCollection = course.slice(1).slice(-8);
    console.log('newCollection Fetched');
    res.send(newCollection);
})

// Creating endpoint for popular in women data
app.get('/popularinwomen',async(req,res)=>{
    let course = await Course.find({category:'women'});
    let popular_in_women = course.slice(0,4);
    console.log('popular in women Fetched');
    res.send(popular_in_women);
})

// Creating middlewara to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({errors:'Please authenticate using valid token'})
    }else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:'please authenticate using valid token'})
        }
    }
}

// Creating endpoint for add courses in cart
app.post('/addtocart',fetchUser,async(req,res)=>{
    let userData = await User.findById(req.user.id);
    userData.cartData[req.body.itemId]+=1;
    await User.findByIdAndUpdate(req.user.id,{cartData:userData.cartData})
    res.send('Added');
})

// Creating endpoint to remove courses from cart
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userData = await User.findById(req.user.id);
    if(userData.cartData[req.body.itemId]>0)
        userData.cartData[req.body.itemId]-=1;
    await User.findByIdAndUpdate(req.user.id,{cartData:userData.cartData})
    res.send('removed');
})

// Creating endpoint to get cartData
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData = await User.findById(req.user.id);
    res.json(userData.cartData)
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Runing on port " + port);
    } else {
        console.log("Error : " + error);
    }
})

