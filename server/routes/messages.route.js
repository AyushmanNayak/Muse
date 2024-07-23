import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
const router = express.Router();

import {createMessage, getAllMessages } from '../controller/messages.controller.js'


router.post("/:id", verifyToken, createMessage);
router.get("/:id", verifyToken, getAllMessages);
export default router;
