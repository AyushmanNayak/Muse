import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import {paisa, allmyOrders} from "../controller/order.controller.js"
const router = express.Router();




// router.post("/:jobId", verifyToken, createOrder);
router.get("/", verifyToken, allmyOrders);
router.post("/create-payment-intent/:id", verifyToken, paisa);
export default router;
