import express from "express";
import { createCourse } from "../controllers/course.js";

const router = express.Router();

// http://localhost:5000/api/videos/
router.post("/", createCourse);

export default router;