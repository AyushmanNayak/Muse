import { get } from "mongoose";
import Job from "../models/job.model.js";

import User from "../models/user.model.js"

//not to fotgest, debugging this was the hardest
export const createJob = async (req, res) => {
    console.log("isFreelancer:", req.isFreelancer);  // Debugging line
    try {
        if (req.isFreelancer === false) {
            return res.status(403).json({ error: "You can't do it, because you are not a freelancer" });
        }


        const newJob = new Job({
            userId: req.userId,   //matalab job ki usr id is actually usr ki user id && it must be given in the request
            ...req.body
        });

        const savedJob = await newJob.save();
        res.status(200).json({ success: true, data: savedJob });
    } catch (error) {
        console.error("Error creating a job:", error);
        res.status(500).json({ success: false, error: "Error creating a job" });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const all_jobs = await Job.find();
        console.log("Type of all_jobs:", typeof all_jobs); // Check the type of all_jobs
        console.log("Number of jobs fetched:", all_jobs.length); // Check number of jobs fetched
        return res.send(all_jobs);
    } catch (err) {
        console.error("Error in getAllJobs:", err);
        return res.status(500).send("GET ALL JOBS ROUTE ERROR");
    }
};



export const deleteJob = async(req, res) => {
    try {
        // if I am the owner, then I can delete it
        const job_to_be_deleted = await Job.findById(req.params.id);
        if (!job_to_be_deleted) {
            console.log("this job doesn't exist");
            return res.status(404).send("this job doesn't exist");
        }
        console.log("req.userId = ", req.userId, "job to be deleted userId = ", job_to_be_deleted.userId);
        if (job_to_be_deleted.userId !== req.userId) {
            return res.status(403).send("You can't delete this job unless you posted it");
        }
        await Job.findByIdAndDelete(req.params.id);
        return res.status(200).send("Job successfully deleted");
    } catch (error) {
        console.error("DELETE JOB ROUTE ERROR", error);
        return res.status(500).send("Internal Server Error");
    }
};



export const getJob = async(req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if(!job) return res.status(404).send("This job with this id dont exit")

        return res.status(200).send(job);
        
    } catch (error) {
        console.error("GET JOB BY ID ROUTE ERROR", error);
        return res.status(500).send("Internal Server Error");
    }
}

export const getname =  async(req, res) => {
    try {
        const jid = req.params.id; //onject id
        const jobObject = await Job.findById(jid);
        if (!jobObject) {
            return res.status(404).send("Job not found");
        }
        const userId = jobObject.userId;
        const user = await User.findById(userId);
        const userName = user.username;
        return res.status(200).send(userName)
    } catch (error) {
        return res.status(500).send("cant get name");
    }
}

export const myJobs = async (req, res) => {
    try {
        const uId = req.params.id; // userId
        const jobObjects = await Job.find({ userId: uId });

        if (!jobObjects || jobObjects.length === 0) {
            return res.status(404).json({ message: "No posts by you yet" });
        }

        return res.status(200).json(jobObjects);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};