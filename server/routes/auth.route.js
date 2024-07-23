import express from "express"
import { verifyToken } from "../middleware/jwt.js";
import { register, login, logout } from '../controller/auth.controller.js'; // Adjust path as per your project structure
const router = express.Router();

router.post("/register", register)
router.post("/login", login )
router.post("/logout", logout)

export default router