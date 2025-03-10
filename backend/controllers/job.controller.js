import { Job } from "../models/job.model.js";

// recruiter
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !salary ||
      !requirements ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    )
      return res
        .status(400)
        .json({ message: "Please fill the required fields", success: false });

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      experienceLevel: experience,
      jobType,
      position,
      company: companyId,
      created_by: userId,
    });

    return res
      .status(201)
      .json({ message: "Job Created Successfully", success: true, job });
  } catch (error) {
    console.log("Error in postJob Controller", error);
    res.status(500).json({
      message: "Error Posting Job, Please Try Again Later!",
    });
  }
};

// student
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });
    if (!jobs)
      return res
        .status(404)
        .json({ message: "Job not found!", success: false });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log("Error in getAllJobs Controller", error);
    res.status(500).json({
      message: "Error Fetching Jobs, Please Try Again Later!",
    });
  }
};

// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job)
      return res
        .status(404)
        .json({ message: "Job not found!", success: false });

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log("Error in getJobById Controller", error);
    res.status(500).json({
      message: "Error Fetching Job details, Please Try Again Later!",
    });
  }
};

// jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      return res
        .status(404)
        .json({ message: "Job not found!", success: false });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log("Error in getAdminJobs Controller", error);
    res.status(500).json({
      message: "Error Fetching Jobs, Please Try Again Later!",
    });
  }
};
