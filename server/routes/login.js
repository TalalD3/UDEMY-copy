import express from "express";
import { login } from "../controllers/login.js";

const router = express.Router();

// http://localhost:5000/api/videos/
router.post("/", login);

export default router;