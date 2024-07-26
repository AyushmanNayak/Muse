import express from 'express';
import {getAllJobs, getJob, deleteJob,getname, myJobs, createJob} from "../controller/job.controller.js"

import { verifyToken } from '../middleware/jwt.js';
const router = express.Router();
// Example GET route
router.get('/', getAllJobs); //didnt add verify token as I want anyone to see all jobs rn
router.get('/:id', getJob);
router.post('/', verifyToken,createJob);
router.get('/name/:id' , getname);
router.get('/my/:id', myJobs);
router.delete('/:id',verifyToken, deleteJob);


export default router;
