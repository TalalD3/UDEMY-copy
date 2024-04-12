import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from 'jsonwebtoken';
import { connectDB } from "./config/db.js";
import courseRoutes from "./routes/course.js";
// import login from "./routes/login.js";
// import signUp from "./routes/sign-up.js";
// import signUploadRoutes from "./routes/sign-upload.js";
import { errorHandler } from "./middlewares/error.js";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import mongoose from "mongoose";


// import User from "./models/Users.js";


dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.use("/api/addcourse", courseRoutes);
// app.use("/api/login", login);
// app.use("/api/signup", signUp);
// app.use("/api/sign-upload", signUploadRoutes);



// Schema Creation for User model
const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  coursesCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  date: {
    type: Date,
    default: Date.now,
  }
})

// endpoint for sign Up
app.post('/api/signup', async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "existing user found for same email address" })
  }
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

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

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errors: "error: " + error });
  }
})

// endpoint for login
app.post('/api/login', async (req, res) => {

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
    } else {
      res.json({ success: false, errors: "Wrong Password" })
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" })
  }

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

// endpoint for get the value of isTeacher
app.post('/api/isTeacher',fetchUser,async(req,res)=>{
  let user = await User.findById(req.user.id);
  res.json(user.isTeacher)
})

// endpoint for set the value of isTeacher
app.post('/api/setTeacher',fetchUser,async(req,res)=>{
  // let user = await User.findById(req.user.id);
  await User.findByIdAndUpdate(req.user.id,{isTeacher:true})
  res.send('you are now teacher post courses for free')
})


// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Route to handle chapter video uploads
app.post('/upload/video', upload.single('logo'), async (req, res) => {
  console.log('start upload');
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'images'
    });

    // Send Cloudinary response back to client
    res.json(result);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ error: 'Error uploading image to Cloudinary' });
  }
});

app.use(errorHandler);

// Listen to the requests
app.listen(port, () => {
  // connect to DB
  connectDB();
  console.log("Server started listening on port", port);
});