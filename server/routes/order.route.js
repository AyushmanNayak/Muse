import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { allmyOrders, createOrder} from "../controller/order.controller.js"
const router = express.Router();




router.post("/:jobId", verifyToken, createOrder);
router.get("/", verifyToken, allmyOrders);
export default router;
