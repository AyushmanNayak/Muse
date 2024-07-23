import express from "express"
import { deleteUser, getSingleUser } from '../controller/usercontroller.js'
import {verifyToken} from '../middleware/jwt.js'

const router = express.Router();

router.get("/test", (req, res)=>{
    res.send("haaalo"); 
})

router.delete("/:id", verifyToken, deleteUser)
router.get("/:id",  getSingleUser);

export default router