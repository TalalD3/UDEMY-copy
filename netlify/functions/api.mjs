import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import serverless from "serverless-http";

// ─── Express App & Router ────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();
const saltRounds = 10;

// multer – use /tmp for serverless environments
const upload = multer({ dest: "/tmp/uploads/" });

// ─── MongoDB Connection (cached across warm lambda invocations) ──
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// ─── Mongoose Models ────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  picture: { type: String, default: "https://jalshobaki.com/img/default_profile_image.png" },
  bio: { type: String },
  coursesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  date: { type: Date, default: Date.now },
});

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  lessons: [{ title: { type: String }, videoUrl: { type: String } }],
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  date: { type: Date, default: Date.now },
});

const CourseSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  small_description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  image: { type: String },
  category: { type: String },
  price: { type: Number },
  rating: { type: Number, default: 4 },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  date: { type: Date, default: Date.now },
  isPublish: { type: Boolean, default: false },
});

const QuizSchema = new mongoose.Schema({
  time: { type: Number, default: 60 },
  questions: [{
    question: { type: String },
    hint: { type: String },
    options: [{ option: { type: String }, isCorrect: { type: Boolean, default: false } }],
  }],
  date: { type: Date, default: Date.now },
});

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  chapterProgress: [{
    chapter: { type: Number },
    lessonProgress: [{ lesson: { type: Number }, isCompleted: { type: Boolean, default: false } }],
  }],
  progress: { type: Number, default: 0 },
  completedAt: { type: Date, default: null },
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  date: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  rating: { type: Number, default: 4 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

// Guard model recompilation in warm serverless lambdas
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", ChapterSchema);
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
const Progress = mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

// ─── Cloudinary Config ──────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Auth Middleware ────────────────────────────────────────────
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "please authenticate using valid token" });
  }
};

// ─── Ensure DB Connection Middleware ───────────────────────────
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── API Routes (Defined on Router) ─────────────────────────────

router.get("/", (req, res) => {
  res.json({ message: "My-Edu API is running" });
});

// All courses
router.get("/allcourses", async (req, res) => {
  try {
    const courses = await Course.find({}).populate("creator");
    res.send(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Published courses
router.get("/publishedcourses", async (req, res) => {
  try {
    const courses = await Course.find({ isPublish: true }).populate("creator");
    res.send(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in course
router.post("/enroll-course", fetchUser, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!course) return res.status(404).json({ error: "Course not found" });

    user.coursesEnrolled.push(courseId);
    await user.save();

    const order = new Order({ user: userId, course: courseId });
    await order.save();

    res.status(200).json({ message: "Enrolled in course successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add course
router.post("/addcourse", fetchUser, async (req, res) => {
  if (!req.user.id) return res.status(400).json({ success: false, errors: "Error: User ID not provided" });
  try {
    const course = await Course.create({ creator: req.user.id, title: req.body.title });
    await User.findByIdAndUpdate(req.user.id, { $push: { coursesCreated: course._id } }, { new: true });
    return res.json({ success: true, course });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({ success: false, errors: "Internal Server Error" });
  }
});

// Add course details
router.post("/addcoursedetails/:courseId", async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId },
      {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        isPublish: req.body.isPublish,
        small_description: req.body.small_description,
        chapters: req.body.chapters,
      },
      { upsert: true, new: true }
    );
    if (course) res.status(200).json({ success: true, course });
    else res.status(400).json({ success: false, errors: "Course not created" });
  } catch (error) {
    console.error("Error adding course details:", error);
    res.status(500).json({ success: false, errors: "Error adding course details" });
  }
});

// Change publish status
router.put("/change-publish/:courseId", async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId },
      { isPublish: req.body.isPublish },
      { upsert: true, new: true }
    );
    if (course) res.status(200).json({ success: true, course });
    else res.status(400).json({ success: false, errors: "Course not found" });
  } catch (error) {
    res.status(500).json({ success: false, errors: "Error adding course details" });
  }
});

// Add chapter
router.post("/addchapter", async (req, res) => {
  try {
    const chapter = await Chapter.create({ title: req.body.title });
    if (chapter) {
      const course = await Course.findByIdAndUpdate(
        req.body.courseId,
        { $push: { chapters: chapter._id } },
        { new: true }
      ).populate("chapters");
      if (course) res.json({ success: true, course });
      else res.status(400).send({ success: false, errors: "Course not found" });
    } else {
      res.status(400).send({ success: false, errors: "Chapter not created" });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: "Error: " + error });
  }
});

// Add chapter details
router.post("/addchapterdetails", async (req, res) => {
  try {
    let quizId;
    if (req.body.quiz) {
      const chapter = await Chapter.findById(req.body.id);
      if (chapter && chapter.quiz) {
        const quiz = await Quiz.findByIdAndUpdate(
          chapter.quiz,
          { time: req.body.quiz.time, questions: req.body.quiz.questions },
          { upsert: true, new: true }
        );
        quizId = quiz._id;
      } else {
        const quiz = await Quiz.create({
          time: req.body.quiz.time,
          questions: req.body.quiz.questions,
        });
        quizId = quiz._id;
      }
    }
    const chapter = await Chapter.findOneAndUpdate(
      { _id: req.body.id },
      { title: req.body.title, isFree: req.body.isFree, lessons: req.body.lessons, quiz: quizId },
      { upsert: true, new: true }
    );
    if (chapter) res.status(200).json({ success: true, chapter });
    else res.status(400).send({ success: false, errors: "Chapter not created" });
  } catch (error) {
    res.status(500).json({ success: false, errors: "Error: " + error });
  }
});

// Delete Course
router.delete("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const deletedCourse = await Course.findOneAndDelete({ _id: courseId });
    if (!deletedCourse) return res.status(404).json({ success: false, message: "Course not found" });

    await Chapter.deleteMany({ _id: { $in: deletedCourse.chapters } });
    await User.updateOne({ _id: deletedCourse.creator }, { $pull: { coursesCreated: courseId } });
    await User.updateMany({ coursesEnrolled: courseId }, { $pull: { coursesEnrolled: courseId } });

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting course" });
  }
});

// Delete Chapter
router.delete("/courses/:courseId/chapters/:chapterId", async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const deletedChapter = await Chapter.findOneAndDelete({ _id: chapterId });
    if (!deletedChapter) return res.status(404).json({ success: false, message: "Chapter not found" });

    await Course.findByIdAndUpdate(courseId, { $pull: { chapters: chapterId } });
    res.status(200).json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting chapter" });
  }
});

// Get chapters by course ID
router.get("/chapters/:courseId", async (req, res) => {
  try {
    const chapters = await Chapter.find({ courseId: req.params.courseId });
    res.json({ success: true, chapters });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching chapters" });
  }
});

// Get course by ID
router.post("/getCoursebyId", async (req, res) => {
  const course = await Course.findById(req.body.courseId);
  if (course) res.status(200).send({ success: true, course });
  else res.status(400).send({ success: false, errors: "not found course" });
});

// Get total orders by courseId
router.get("/orders-by-course/:courseId", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ course: req.params.courseId });
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get course by courseID with populated chapters
router.get("/courses/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "chapters",
      populate: { path: "quiz" },
    });
    if (!course) return res.status(404).json({ success: false, error: "Course not found" });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching course" });
  }
});

// Get chapter by ID
router.get("/chapter/:chapterId", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId).populate("quiz");
    if (!chapter) return res.status(404).json({ success: false, error: "Chapter not found" });
    res.json({ success: true, chapter });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching chapter" });
  }
});

// Get my course by ID
router.post("/getMyCourseById", fetchUser, async (req, res) => {
  const course = await Course.findById(req.body.courseId);
  if (course) {
    if (course.creator == req.user.id) res.status(200).send({ success: true, course });
    else res.status(400).send({ success: false, errors: "Unauthorized: not creator" });
  } else {
    res.status(400).send({ success: false, errors: "not found course" });
  }
});

// Add comment
router.post("/addComment", async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) return res.status(404).json({ success: false, error: "Course not found" });
    const user = await User.findById(req.body.user);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let comment = await Comment.findOneAndUpdate(
      { course: req.body.course, user: req.body.user },
      { comment: req.body.comment, rating: req.body.rating },
      { new: true }
    );

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

    const updatedCourse = await Course.findById(req.body.course).populate("comments");
    const ratings = updatedCourse.comments.map((c) => c.rating);
    const averageRating = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
    const roundedRating = Math.round(averageRating * 2) / 2;
    const addRatingCourse = await Course.findByIdAndUpdate(
      req.body.course,
      { rating: roundedRating },
      { new: true }
    );
    res.json({ success: true, course: addRatingCourse });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error: " + error });
  }
});

// Get comments by courseID
router.get("/getcomments/:courseId", async (req, res) => {
  try {
    const comments = await Comment.find({ course: req.params.courseId }).populate("user");
    if (!comments) return res.status(404).json({ success: false, error: "comments not found" });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error getting comments" });
  }
});

// Get all comments
router.get("/getAllComments", async (req, res) => {
  try {
    const comments = await Comment.find({}).populate("user");
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user comment
router.get("/getUserComment/:courseId/:userId", async (req, res) => {
  try {
    const comments = await Comment.find({
      course: req.params.courseId,
      user: req.params.userId,
    }).populate("user");
    if (!comments) return res.status(404).json({ success: false, error: "comments not found" });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error getting comments" });
  }
});

// Progress update
router.put("/progress/user/:userId/course/:courseId/chapters/:chapterId/lessons/:lessonId", async (req, res) => {
  try {
    const { userId, courseId, chapterId, lessonId } = req.params;
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) progress = await Progress.create({ user: userId, course: courseId });

    let chapterProgress = progress.chapterProgress.find((ch) => ch.chapter.toString() === chapterId);
    if (!chapterProgress) {
      chapterProgress = { chapter: chapterId, lessonProgress: [{ lesson: lessonId, isCompleted: true }] };
      progress.chapterProgress.push(chapterProgress);
    }

    let lessonProgress = chapterProgress.lessonProgress.find((l) => l.lesson.toString() === lessonId);
    if (!lessonProgress) {
      lessonProgress = { lesson: lessonId, isCompleted: true };
      chapterProgress.lessonProgress.push(lessonProgress);
    } else {
      lessonProgress.isCompleted = true;
    }

    const course = await Course.findById(courseId).populate("chapters");
    const totalLessonsOnCourse = course.chapters.reduce((total, ch) => total + ch.lessons.length, 0);
    let totalCompletedLessons = 0;
    for (const cp of progress.chapterProgress) {
      for (const lp of cp.lessonProgress) {
        if (lp.isCompleted) totalCompletedLessons++;
      }
    }
    progress.progress = (totalCompletedLessons / totalLessonsOnCourse) * 100;
    await progress.save();
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating progress" });
  }
});

// Get progress
router.get("/getprogress/user/:userId/course/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) return res.json({ success: false, message: "Progress not found" });
    return res.json({ success: true, progress });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error getting progress" });
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.email });
    if (check) return res.json({ success: false, errors: "existing user found for same email address" });

    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, errors: "error: " + error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passCompare = bcrypt.compareSync(req.body.password, user.password);
      if (passCompare) {
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, process.env.JWT_SECRET);
        return res.json({ success: true, token });
      }
      return res.json({ success: false, errors: "Wrong Password" });
    }
    return res.json({ success: false, errors: "Wrong Email Id" });
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
});

// User profile update
router.post("/user/update", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.id,
      { username: req.body.username, bio: req.body.bio, picture: req.body.picture },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching user" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) return res.status(404).json({ success: false, error: "Users not found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching users" });
  }
});

// Get user data
router.post("/getuserdata", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("coursesCreated").populate("coursesEnrolled");
    if (user) res.status(200).send({ success: true, user });
    else res.send({ success: false });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics & Counts
router.get("/countorders", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/countusers", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/countcourses", async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    res.json({ totalCourses });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/count-teachers", async (req, res) => {
  try {
    const teachersCount = await User.aggregate([
      { $match: { role: "teacher" } },
      { $group: { _id: null, totalTeachers: { $sum: 1 } } },
    ]);
    res.json({ totalTeachers: teachersCount.length > 0 ? teachersCount[0].totalTeachers : 0 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/count-admins", async (req, res) => {
  try {
    const adminCount = await User.aggregate([
      { $match: { role: "admin" } },
      { $group: { _id: null, totalAdmins: { $sum: 1 } } },
    ]);
    res.json({ totalAdmins: adminCount.length > 0 ? adminCount[0].totalAdmins : 0 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/countusers-per-month", async (req, res) => {
  try {
    const usersPerMonth = await User.aggregate([
      { $group: { _id: { month: { $month: "$date" }, year: { $year: "$date" } }, totalUsers: { $sum: 1 } } },
    ]);
    res.json(usersPerMonth);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/countcourses-per-month", async (req, res) => {
  try {
    const coursesPerMonth = await Course.aggregate([
      { $group: { _id: { month: { $month: "$date" }, year: { $year: "$date" } }, totalCourses: { $sum: 1 } } },
    ]);
    res.json(coursesPerMonth);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/countorders-per-month", async (req, res) => {
  try {
    const ordersPerMonth = await Order.aggregate([
      { $group: { _id: { month: { $month: "$date" }, year: { $year: "$date" } }, totalOrders: { $sum: 1 } } },
    ]);
    res.json(ordersPerMonth);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders-per-category", async (req, res) => {
  try {
    const ordersPerCategory = await Order.aggregate([
      { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseInfo" } },
      { $unwind: "$courseInfo" },
      { $group: { _id: "$courseInfo.category", totalOrders: { $sum: 1 } } },
      { $project: { category: "$_id", totalOrders: 1, _id: 0 } },
    ]);
    res.json(ordersPerCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders-per-course", async (req, res) => {
  try {
    const ordersPerCourse = await Order.aggregate([
      { $group: { _id: "$course", totalOrders: { $sum: 1 } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "courseDetails" } },
      { $lookup: { from: "users", localField: "courseDetails.creator", foreignField: "_id", as: "creatorDetails" } },
      { $project: { _id: 0, courseId: "$_id", courseName: { $arrayElemAt: ["$courseDetails.title", 0] }, totalOrders: 1, creatorName: { $arrayElemAt: ["$creatorDetails.username", 0] } } },
    ]);
    res.json(ordersPerCourse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/total-courses-per-category", async (req, res) => {
  try {
    const totalCoursesPerCategory = await Course.aggregate([
      { $group: { _id: "$category", totalCourses: { $sum: 1 } } },
    ]);
    res.json(totalCoursesPerCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getrole", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) res.status(200).send({ success: true, role: user.role });
    else res.send({ success: false, role: "user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/change-role/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { role: req.body.newRole }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.post("/userEnrollCourse/:courseId", fetchUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, coursesEnrolled: { $in: [req.params.courseId] } });
    if (user) res.status(200).send({ success: true, user });
    else res.send({ success: false, message: "User not enrolled in the course" });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

router.post("/setTeacher", fetchUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { role: "teacher" });
    res.send("you are now teacher, post courses for free");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/setAdmin", fetchUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { role: "admin" });
    res.send("you are now admin");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload video / image
router.post("/upload/video", upload.single("logo"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "images" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
});

// Cart endpoints
router.post("/addtocart", (req, res) => {
  res.json({ success: true });
});

router.post("/removefromcart", (req, res) => {
  res.json({ success: true });
});

// ─── Multi-Mount for Netlify Rewrites ───────────────────────────
// Mount the router on all possible paths so requests never 404:
app.use("/api", router);
app.use("/.netlify/functions/api", router);
app.use("/", router);

// ─── Export Serverless Handler ──────────────────────────────────
export const handler = serverless(app);
