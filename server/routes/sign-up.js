import express from "express";
import { signUp } from "../controllers/signUp.js";

const router = express.Router();

// http://localhost:5000/api/sign-upload
router.post("/", signUp);

export default router;