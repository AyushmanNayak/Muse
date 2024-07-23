import express from 'express';
import {getAllJobs, getJob, deleteJob, createJob} from "../controller/job.controller.js"
import { verifyToken } from '../middleware/jwt.js';
const router = express.Router();
// Example GET route
router.get('/', verifyToken, getAllJobs);
router.get('/:id', getJob);
router.post('/', verifyToken,createJob);
router.delete('/:id',verifyToken, deleteJob);


export default router;
