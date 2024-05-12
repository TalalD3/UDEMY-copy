import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from 'jsonwebtoken';
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/error.js";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import mongoose from "mongoose";
import bcrypt from "bcrypt";



// import User from "./models/Users.js";


dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
// app.use(cors(
//   {
//   origin: ["https://my-edu-flax.vercel.app"],
//   methods:["POST", "PUT", "DELETE", "GET"],
//   credentials: true,
// }
// ));
app.use(cors());

app.use(express.json());

const saltRounds = 10;

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
  role: {
    type: String,
    default: 'user'
  },
  picture: {
    type: String,
    default: 'https://jalshobaki.com/img/default_profile_image.png'
    // default: 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png'
  },
  bio: {
    type: String,
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
      default: false,
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
const Course = mongoose.model('Course', {
  title: {
    type: String,
    // required: true,
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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
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
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isPublish: {
    type: Boolean,
    default: false,
  },
});


// Schema Creation for Quiz model
const Quiz = mongoose.model('Quiz',
  {
    time: {
      type: Number,
      default: 60,
    },
    questions: [{
      question: {
        type: String,
      },
      hint: {
        type: String,
      },
      options: [{
        option: {
          type: String,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      }],
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  }
);

// Schema Creation for Progress model
const Progress = mongoose.model('Progress', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  chapterProgress: [{
    chapter: {
      type: Number,
    },
    lessonProgress: [{
      lesson: {
        type: Number,
      },
      isCompleted: {
        type: Boolean,
        default: false
      }
    }]
  }],
  progress: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Schema Creation for Order model
const Order = mongoose.model('Order', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

// Schema Creation for User model
const Comment = mongoose.model('Comment', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  rating: {
    type: Number,
    default: 4,
  },
  comment: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

app.get("/", (req, res) => {
  res.json('hello ')
})


// Creating API for getting all courses 
app.get("/api/allcourses", async (req, res) => {
  let courses = await Course.find({}).populate('creator');
  // console.log("All Courses Fetched ++");
  res.send(courses);
})

// Creating API for getting published courses 
app.get("/api/publishedcourses", async (req, res) => {
  let courses = await Course.find({ isPublish: true }).populate('creator');
  // console.log("All Courses Fetched ++");
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

// Endpoint to enroll in a course
app.post('/api/enroll-course', fetchUser, async (req, res) => {
  try {
    // Extract user ID and course ID from request body
    const { courseId } = req.body;

    const userId = req.user.id;

    // Check if the user and course exist
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add the course to the user's enrolled courses
    user.coursesEnrolled.push(courseId);
    await user.save();

    // Create a new order for the enrolled course
    const order = new Order({
      user: userId,
      course: courseId,
    });
    await order.save();

    // Return success response
    res.status(200).json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    // console.error("Error enrolling in course:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint for add Course
app.post('/api/addcourse', fetchUser, async (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ success: false, errors: "Error: User ID not provided" });
  }

  try {
    // Create the course
    const course = await Course.create({
      creator: req.user.id,
      title: req.body.title,
    });

    // Push the ID of the created course to the coursesCreated array of the user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      $push: { coursesCreated: course._id }
    }, { new: true });

    return res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ success: false, errors: "Internal Server Error" });
  }
});

// endpoint for add Course details
app.post('/api/addcoursedetails/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  try {
    let quizId;
    if (req.body.quiz) {
      const course = await Course.findById(courseId);
      if (course && course.quiz) {
        const quiz = await Quiz.findByIdAndUpdate(
          course.quiz._id,
          {
            time: req.body.quiz.time,
            questions: req.body.quiz.questions
          },
          { upsert: true, new: true }
        );
        quizId = quiz._id;
      } else {
        const quiz = await Quiz.create({
          time: req.body.quiz.time,
          questions: req.body.quiz.questions
        });
        quizId = quiz._id;
      }
    }
    const course = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        isPublish: req.body.isPublish,
        small_description: req.body.small_description,
        chapters: req.body.chapters,
        quiz: quizId
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


app.put('/api/change-publish/:courseId', async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId },
      {
        isPublish: req.body.isPublish,
      },
      { upsert: true, new: true }
    );

    if (course) {
      res.status(200).json({ success: true, course });
    } else {
      res.status(400).json({ success: false, errors: "Course not found" });
    }
  } catch (error) {
    console.error('Error adding course details:', error);
    res.status(500).json({ success: false, errors: "Error adding course details" });
  }
})

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

    // Find and delete the course
    const deletedCourse = await Course.findOneAndDelete({ _id: courseId });

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete all chapters related to the course
    await Chapter.deleteMany({ _id: { $in: deletedCourse.chapters } });

    // Remove the course from the coursesCreated array of the creator
    await User.updateOne(
      { _id: deletedCourse.creator },
      { $pull: { coursesCreated: courseId } }
    );

    // Remove the course from the coursesEnrolled array of all users
    await User.updateMany(
      { coursesEnrolled: courseId },
      { $pull: { coursesEnrolled: courseId } }
    );

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
    // console.log(chapters);

    res.json({ success: true, chapters });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ success: false, error: 'Error fetching chapters' });
  }
});

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

// Endpoint to get total orders by courseId
app.get('/api/orders-by-course/:courseId', async (req, res) => {
  try {
    // Extract the courseId from the request params
    const { courseId } = req.params;

    // Query the Order model to count total orders for the given courseId
    const totalOrders = await Order.countDocuments({ course: courseId });

    // Return the totalOrders as a response
    res.json({ totalOrders });
  } catch (error) {
    console.error('Error fetching total orders by courseId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// endpoint for get the course by courseID include chapter
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    // Fetch course by courseId from the database and populate the chapters
    const course = await Course.findById(req.params.courseId).populate('chapters').populate('quiz');

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
    // console.log(chapter);
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

// endpoint for submitting comment
app.post('/api/addComment', async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Find existing comment or create a new one
    let comment = await Comment.findOneAndUpdate(
      { course: req.body.course, user: req.body.user },
      { comment: req.body.comment, rating: req.body.rating },
      { new: true } // upsert: If no document matches the query, MongoDB will create a new document
    );

    // If a new comment is created, update the course
    if (!comment) {
      const newComment = await Comment.create({
        comment: req.body.comment,
        course: req.body.course,
        rating: req.body.rating,
        user: req.body.user,
      });

      await Course.findByIdAndUpdate(
        req.body.course,
        { $push: { comments: newComment._id } },
        { new: true }
      );
    }


    // Calculate average rating for the course
    const updatedCourse = await Course.findById(req.body.course).populate('comments');
    const ratings = updatedCourse.comments.map(comment => comment.rating);
    const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
    const roundedRating = Math.round(averageRating * 2) / 2;


    // Update course with the average rating
    const addRatingCourse = await Course.findByIdAndUpdate(
      req.body.course,
      { rating: roundedRating },
      { new: true }
    );


    res.json({
      success: true,
      course: addRatingCourse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error: ' + error });
  }
});

// app.post('/api/addComment', async (req, res) => {
//   try {
//     const course = await Course.findById(req.body.course);
//     if (!course) {
//       return res.status(404).json({ success: false, error: 'Course not found' });
//     }

//     const user = await User.findById(req.body.user);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     let comment = await Comment.findOneAndUpdate({ course: req.body.course, user: req.body.user }, {
//       comment: req.body.comment,
//       rating: req.body.rating,
//     });

//     if (comment) {
//       res.json({
//         success: true,
//         comment,
//       });
//     } else {
//       const newComment = await Comment.create({
//         comment: req.body.comment,
//         course: req.body.course,
//         rating: req.body.rating,
//         user: req.body.user,
//       });

//       if (newComment) {
//         const course = await Course.findByIdAndUpdate(
//           req.body.course,
//           { $push: { comments: comment._id } },
//           { new: true }
//         );

//         if (course) {
//           // console.log('Updated course:', course);
//           res.json({
//             success: true,
//             course,
//           });
//         }
//       } else {
//         res.status(500).json({ success: false, error: 'Error creating comment' });
//       }
//     }
//     // If no comment exists, create a new one
//   } catch (error) {
//     res.status(500).json({ success: false, errors: "Error: " + error });
//   }
// })

// endpoint for get the comments by courseID
app.get('/api/getcomments/:courseId', async (req, res) => {
  try {
    // Find the comments by id
    const comments = await Comment.find({ course: req.params.courseId }).populate('user');

    if (!comments) {
      return res.status(404).json({ success: false, error: 'comments not found' });
    }

    res.json({ success: true, comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ success: false, error: 'Error getting comments' });
  }
});

// endpoint for get the comments by courseID and userId
app.get('/api/getUserComment/:courseId/:userId', async (req, res) => {
  try {
    // Find the comments by id
    const comments = await Comment.find({ course: req.params.courseId, user: req.params.userId }).populate('user');

    if (!comments) {
      return res.status(404).json({ success: false, error: 'comments not found' });
    }

    res.json({ success: true, comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ success: false, error: 'Error getting comments' });
  }
});

// Endpoint to update chapter and lesson progress
app.put('/api/progress/user/:userId/course/:courseId/chapters/:chapterId/lessons/:lessonId', async (req, res) => {
  try {
    const { userId, courseId, chapterId, lessonId } = req.params;

    // Find the user's progress for the specified course
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await Progress.create({ user: userId, course: courseId });
    }

    // Find the chapter progress for the specified chapter
    let chapterProgress = progress.chapterProgress.find(chapter => chapter.chapter.toString() === chapterId);
    if (!chapterProgress) {
      // If chapter progress doesn't exist, create it
      chapterProgress = { chapter: chapterId, lessonProgress: [{ lesson: lessonId, isCompleted: true }] }; // Initialize lessonProgress with the lessonId
      progress.chapterProgress.push(chapterProgress);
    }

    // Find the lesson progress for the specified lesson
    let lessonProgress = chapterProgress.lessonProgress.find(lesson => lesson.lesson.toString() === lessonId);
    if (!lessonProgress) {
      // If lesson progress doesn't exist, create it
      lessonProgress = { lesson: lessonId, isCompleted: true };
      chapterProgress.lessonProgress.push(lessonProgress);
    } else {
      lessonProgress.isCompleted = true;
    }

    const course = await Course.findById(courseId).populate('chapters');
    // Calculate the total number of lessons in the course
    const totalLessonsOnCourse = course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
    let totalCompletedLessons = 0;
    for (const chapterProgress of progress.chapterProgress) {
      for (const lessonProgress of chapterProgress.lessonProgress) {
        if (lessonProgress.isCompleted) {
          totalCompletedLessons++;
        }
      }
    }


    progress.progress = (totalCompletedLessons / totalLessonsOnCourse) * 100;

    await progress.save();

    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, error: 'Error updating progress' });
  }
});

// Endpoint to get chapter and lesson progress
app.get('/api/getprogress/user/:userId/course/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    // Find the user's progress for the specified course
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      return res.json({ success: false, message: 'Progress with those course Id and user id not found' });
    }
    return res.json({ success: true, progress });

  } catch (error) {
    console.error('Error getting progress:', error);
    return res.status(500).json({ success: false, error: 'Error getting progress' });
  }
});



app.post('/api/signup', async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.json({ success: false, errors: "existing user found for same email address" })
  }
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
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
    const passCompare = bcrypt.compareSync(req.body.password, user.password);
    // const passCompare = req.body.password === user.password;
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

//endpoint for update user profile
app.post('/api/user/update', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, {
      username: req.body.username,
      bio: req.body.bio,
      picture: req.body.picture,
    }, { new: true })

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error });
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
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Error fetching user' });
  }
});

//endpoint for get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({ success: false, error: 'Users not found' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Error fetching user' });
  }
});

// endpoint for get the user Data
app.post('/api/getuserdata', fetchUser, async (req, res) => {
  let user = await User.findById(req.user.id).populate('coursesCreated').populate('coursesEnrolled');
  if (user) {
    res.status(200).send({ success: true, user });
  } else {
    res.send({ success: false });
  }
})




// endpoint for getting total order numbers
app.get('/api/countorders', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    console.error("Error counting total orders:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to count total users
app.get('/api/countusers', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    console.error("Error counting total users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to count total courses
app.get('/api/countcourses', async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    res.json({ totalCourses });
  } catch (error) {
    console.error("Error counting total courses:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to count total teachers
app.get('/api/count-teachers', async (req, res) => {
  try {
    const teachersCount = await User.aggregate([
      {
        $match: { role: 'teacher' } // Filter users with role 'teacher'
      },
      {
        $group: {
          _id: null, // Group all documents
          totalTeachers: { $sum: 1 } // Count the number of documents
        }
      }
    ]);

    // If there are no teachers found, return 0 as the count
    const count = teachersCount.length > 0 ? teachersCount[0].totalTeachers : 0;

    res.json({ totalTeachers: count });
  } catch (error) {
    console.error('Error counting teachers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to count total admins
app.get('/api/count-admins', async (req, res) => {
  try {
    const adminCount = await User.aggregate([
      {
        $match: { role: 'admin' } // Filter users with role 'teacher'
      },
      {
        $group: {
          _id: null, // Group all documents
          totalAdmins: { $sum: 1 } // Count the number of documents
        }
      }
    ]);

    // If there are no teachers found, return 0 as the count
    const count = adminCount.length > 0 ? adminCount[0].totalAdmins : 0;

    res.json({ totalAdmins: count });
  } catch (error) {
    console.error('Error counting teachers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get total users per month
app.get('/api/countusers-per-month', async (req, res) => {
  try {
    const usersPerMonth = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          totalUsers: { $sum: 1 }
        }
      }
    ]);
    res.json(usersPerMonth);
  } catch (error) {
    console.error("Error fetching total users per month:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get total users per month
// app.get('/api/countusers-per-month', async (req, res) => {
//   try {
//     const usersPerMonth = await User.aggregate([
//       {
//         $group: {
//           _id: {
//             month: { $month: '$createdAt' },
//             year: { $year: '$createdAt' }
//           },
//           totalUsers: { $sum: 1 }
//         }
//       }
//     ]);
//     res.json(usersPerMonth);
//   } catch (error) {
//     console.error("Error fetching total users per month:", error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// Endpoint to get total courses per month
app.get('/api/countcourses-per-month', async (req, res) => {
  try {
    const coursesPerMonth = await Course.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          totalCourses: { $sum: 1 }
        }
      }
    ]);
    res.json(coursesPerMonth);
  } catch (error) {
    console.error("Error fetching total courses per month:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get total orders per month
app.get('/api/countorders-per-month', async (req, res) => {
  try {
    const ordersPerMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          totalOrders: { $sum: 1 }
        }
      }
    ]);
    res.json(ordersPerMonth);
  } catch (error) {
    console.error("Error fetching total orders per month:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get the number of orders for each category
app.get('/api/orders-per-category', async (req, res) => {
  try {
    const ordersPerCategory = await Order.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $group: {
          _id: '$courseInfo.category',
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          totalOrders: 1,
          _id: 0
        }
      }
    ]);

    // Send the orders per category in the response
    res.json(ordersPerCategory);
  } catch (error) {
    console.error("Error fetching orders per category:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/orders-per-course', async (req, res) => {
  try {
    const ordersPerCourse = await Order.aggregate([
      {
        $group: {
          _id: '$course',
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses', // Assuming your course collection is named 'courses'
          localField: '_id',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      {
        $lookup: {
          from: 'users', // Assuming your user collection is named 'users'
          localField: 'courseDetails.creator',
          foreignField: '_id',
          as: 'creatorDetails'
        }
      },
      {
        $project: {
          _id: 0,
          courseId: '$_id',
          courseName: { $arrayElemAt: ['$courseDetails.title', 0] },
          totalOrders: 1,
          creatorName: { $arrayElemAt: ['$creatorDetails.username', 0] } // Get the username of the creator
        }
      }
    ]);

    res.json(ordersPerCourse);
  } catch (error) {
    console.error('Error fetching number of orders per course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get total courses per category
app.get('/api/total-courses-per-category', async (req, res) => {
  try {
    const totalCoursesPerCategory = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          totalCourses: { $sum: 1 }
        }
      }
    ]);
    res.json(totalCoursesPerCategory);
  } catch (error) {
    console.error("Error fetching total courses per category:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// endpoint for get the value of role
app.post('/api/getrole', fetchUser, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (user) {
      res.status(200).send({ success: true, role: user.role });
    } else {
      res.send({ success: false, role: 'user' });
    }
  } catch (error) {
    console.log('Error fetching role:', error);
  }
})

// endpoint for set the user a role
app.put('/api/change-role/:userId', async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  try {
    // Find the user by ID and update their role
    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// endpoint for get the user
app.post('/api/userEnrollCourse/:courseId', fetchUser, async (req, res) => {
  try {
    // console.log(req.params.courseId);
    const user = await User.findOne({ _id: req.user.id, coursesEnrolled: { $in: [req.params.courseId] } });
    if (user) {
      res.status(200).send({ success: true, user });
    } else {
      res.send({ success: false, message: 'User not enrolled in the course' });
    }
  } catch (error) {
    console.error('Error checking user enrollment:', error);
    res.status(500).send({ success: false, error: 'Internal Server Error' });
  }
});

// endpoint for set the value of isTeacher
app.post('/api/setTeacher', fetchUser, async (req, res) => {
  // let user = await User.findById(req.user.id);
  await User.findByIdAndUpdate(req.user.id, { role: 'teacher' })
  res.send('you are now teacher, post courses for free')
})

// endpoint for set the value of isTeacher
app.post('/api/setAdmin', fetchUser, async (req, res) => {
  // let user = await User.findById(req.user.id);
  await User.findByIdAndUpdate(req.user.id, { role: 'admin' })
  res.send('you are now teacher, post courses for free')
})


// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Route to handle chapter video uploads
app.post('/upload/video', upload.single('logo'), async (req, res) => {
  // console.log('start upload');
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
