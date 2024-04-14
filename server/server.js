import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from 'jsonwebtoken';
import { connectDB } from "./config/db.js";
// import courseRoutes from "./routes/course.js";
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

const Chapter = mongoose.model('Chapter',
  {
    title: {
      type: String,
      required: true,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    lessons: [{
      title: {
        type: String,
        // required: true
      },
      videoUrl: {
        type: String,
        // required: true
      }
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  }
);

// Schema Creation for Course model
const Course = mongoose.model('Course',
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    small_description: {
      type: String,
      // required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
      // required: true,
    },
    category: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    rating: {
      type: Number,
      default: 4,
      // required: true,
    },
    chapters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    }],
    date: {
      type: Date,
      default: Date.now,
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
  }
);

// Creating API for getting all courses 
app.get("/api/allcourses", async (req, res) => {
  let courses = await Course.find({});
  console.log("All Courses Fetched ++");
  res.send(courses);
})


// Creating middlewara to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    res.status(401).send({ errors: 'Please authenticate using valid token' })
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: 'please authenticate using valid token' })
    }
  }
}

// endpoint for add Course
app.post('/api/addcourse', fetchUser, async (req, res) => {

  if (!req.user.id) {
    res.status(400).json({ success: false, errors: "error: " + error });
  }
  // console.log( req.body.title,req.user.id);
  try {
    const course = await Course.create({
      title: req.body.title,
      creator: req.user.id,
    });
    console.log(course);

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, errors: "error: " + error });
  }
})

// endpoint for add Course details
app.post('/api/addcoursedetails/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        small_description: req.body.small_description,
        chapters: req.body.chapters
      },
      { upsert: true, new: true }
    );

    if (course) {
      res.status(200).json({ success: true, course });
    } else {
      res.status(400).json({ success: false, errors: "Course not created" });
    }
  } catch (error) {
    console.error('Error adding course details:', error);
    res.status(500).json({ success: false, errors: "Error adding course details" });
  }
});

// endpoint for add Chapter    ***  9dima ***
app.post('/api/addchapter', async (req, res) => {
  try {
    const chapter = await Chapter.create({
      title: req.body.title,
    });

    if (chapter) {
      const course = await Course.findByIdAndUpdate(
        req.body.courseId,
        { $push: { chapters: chapter._id } },
        { new: true }
      ).populate('chapters');

      if (course) {
        // console.log('Updated course:', course);
        res.json({
          success: true,
          course,
        });
      } else {
        res.status(400).send({ success: false, errors: "Course not found" });
      }
    } else {
      res.status(400).send({ success: false, errors: "Chapter not created" });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: "Error: " + error });
  }
});

// endpoint for add Chapter details
app.post('/api/addchapterdetails', async (req, res) => {
  try {

    const chapter = await Chapter.findOneAndUpdate(
      { _id: req.body.id }, // Search condition
      { title: req.body.title, isFree: req.body.isFree, lessons: req.body.lessons }, // Document to create or replace
      { upsert: true, new: true });

    // console.log(chapter);

    if (chapter) {
      res.status(200).json({ success: true, chapter });
    } else {
      res.status(400).send({ success: false, errors: "Chapter not created" });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: "Error: " + error });
  }
});

// endpoint for delete Course
app.delete('/api/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findOneAndDelete({ _id: courseId });

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, error: 'Error deleting course' });
  }
});

// endpoint for delete Chapter
app.delete('/api/courses/:courseId/chapters/:chapterId', async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;

    // Delete the chapter based on the chapterId
    const deletedChapter = await Chapter.findOneAndDelete({ _id: chapterId });

    if (!deletedChapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    // Remove the chapterId from the chapters array in the Course document
    await Course.findByIdAndUpdate(courseId, { $pull: { chapters: chapterId } });

    res.status(200).json({ success: true, message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ success: false, error: 'Error deleting chapter' });
  }
});

// endpoint for get the Chapters by course ID
app.get('/api/chapters/:courseId', async (req, res) => {
  try {
    // Fetch chapters by courseId from the database
    const chapters = await Chapter.find({ courseId: req.params.courseId });
    console.log(chapters);

    res.json({ success: true, chapters });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ success: false, error: 'Error fetching chapters' });
  }
});

// app.post('/api/addchapter', async (req, res) => {

//   // console.log( req.body.title,req.user.id);
//   try {
//     const chapter = await Chapter.create({
//       title: req.body.title,
//     });
//     // console.log(chapter);

//     if (chapter) {

//       // const course = await Course.findByIdAndUpdate(req.body.courseId, { $push: { chapters: chapter._id } }, { new: true }).populate('Chapter');
//       const course = await Course.findByIdAndUpdate(
//         req.body.courseId,
//         { $push: { chapters: chapter._id } },
//         { new: true }
//       ).populate('chapters');

//       // .then(updatedCourse => {
//       //   console.log('Updated course:', updatedCourse);
//       // })
//       // .catch(error => {
//       //   console.error('Error updating course:', error);
//       // });
//       console.log('Updated course:', course);
//       if (course) {
//         res.json({
//           success: true,
//           course,
//         });
//       } else {
//         res.status(400).send({ success: false, errors: "course dosnt found" });
//       }
//     } else {
//       res.status(400).send({ success: false, errors: "chapter dosnt create" });

//     }

//   } catch (error) {
//     res.status(500).json({ success: false, errors: "error: " + error });
//   }
// })

// app.post('/api/addcourse', fetchUser, async (req, res) => {

//   const { title, description, small_description, image, category, price, chapter } = req.body;

//   if (!req.user.id) {
//     res.status(400);
//     return next(new Error("please login first"));
//   }

//   try {
//     const course = await Course.create({
//       title,
//       description,
//       small_description,
//       creator: req.user.id,
//       image,
//       category,
//       price,
//       chapter
//     });

//     res.status(200).json({
//       success: true,
//       course,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, errors: "error: " + error });
//   }
// })

app.post('/api/getCoursebyId', async (req, res) => {
  // console.log(req.body.courseId);
  const course = await Course.findById(req.body.courseId);
  if (course) {
    // res.send(course);
    res.status(200).send({ success: true, course: course });
  } else {
    res.status(400).send({ success: false, errors: "not found course" });
  }
})

// endpoint for get the course by courseID include chapter
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    // Fetch course by courseId from the database and populate the chapters
    const course = await Course.findById(req.params.courseId).populate('chapters');

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: 'Error fetching course' });
  }
});

// endpoint for get the Chapter by chapter ID
app.get('/api/chapter/:chapterId', async (req, res) => {
  try {
    // Find the chapter by id
    const chapter = await Chapter.findById(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ success: false, error: 'Chapter not found' });
    }
    console.log(chapter);
    res.json({ success: true, chapter });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ success: false, error: 'Error fetching chapter' });
  }
});

app.post('/api/getMyCourseById', fetchUser, async (req, res) => {
  // console.log(req.body.courseId);
  const course = await Course.findById(req.body.courseId);

  if (course) {

    if (course.creator == req.user.id) {
      res.status(200).send({ success: true, course: course });
    }
    else {
      res.status(400).send({ success: false, errors: "wtf bro you are not the creator" });
    }
    // res.send(course);
  } else {
    res.status(400).send({ success: false, errors: "not found course" });
  }
})

// app.use("/api/login", login);
// app.use("/api/signup", signUp);
// app.use("/api/sign-upload", signUploadRoutes);




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

//endpoint for get user information by id
app.get('/api/users/:userId', async (req, res) => {
  try {
    // Find the user by id
    // console.log(req.params.userId);
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // res.status(200).json({ success: true, user });
    res.status(200).json( user );
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Error fetching user' });
  }
});


// endpoint for get the value of isTeacher
app.post('/api/isTeacher', fetchUser, async (req, res) => {
  let user = await User.findById(req.user.id);
  if (user) {
    res.status(200).send({ success: true, isTeacher: user.isTeacher });
  } else {
    res.status(400).send({ success: false, isTeacher: false });
  }
})

// endpoint for set the value of isTeacher
app.post('/api/setTeacher', fetchUser, async (req, res) => {
  // let user = await User.findById(req.user.id);
  await User.findByIdAndUpdate(req.user.id, { isTeacher: true })
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