import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/jwt.js';
import { getChats,getSingleChat,createChat} from '../controller/chat.controller.js';


router.get("/", verifyToken, getChats);
router.post("/", verifyToken, createChat);
router.get("/:id",verifyToken,  getSingleChat);
// router.put("/:id", verifyToken, updateChat); 


export default router;
