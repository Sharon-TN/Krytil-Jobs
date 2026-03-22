import Company from "../models/Company.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";


// Register a new Company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.status(400).json({
      success: false,
      message: "Missing Details"
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url
    });

    res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Company already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email }).lean();

    if (!company) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    return res.status(200).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get company data
export const getCompanyData = async (req,res) => {
  try {
    const company = req.company;
    res.status(200).json({success:true, company})
  } catch (error) {
    res.status(500).json({
      success:false, message:error.message
    })
  }
}


// Post a new job
export const postJob = async (req,res) => {

  const { title, description, location, salary, level, category } = req.body
  const companyId = req.company._id

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
      visible: true
    })

    await newJob.save()

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      newJob
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


// ✅ PAGINATED — Get Company Job Applications
export const getCompanyJobApplicants = async (req,res) => {
  try {

    const companyId = req.company._id

    const page = Number(req.query.page) || 1;
    const limit = 20;

    const applications = await JobApplication.find({companyId})
      .populate('userId', 'name image resume')
      .populate('jobId', 'title location category level salary')
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return res.status(200).json({
      success: true,
      page,
      applications
    });

  } catch (error) {
    res.status(500).json({success:false, message:error.message})
  }
}


// ✅ PAGINATED — Get Company Posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {

    const companyId = req.company._id;

    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const jobsData = await Job.aggregate([
      { $match: { companyId: companyId } },
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications"
        }
      },
      {
        $addFields: {
          applicants: { $size: "$applications" }
        }
      },
      {
        $project: { applications: 0 }
      },
      { $sort: { date: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    res.status(200).json({
      success: true,
      page,
      jobsData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Change Job Application Status
export const ChangeJobApplicationsStatus = async (req,res) => {
  try {

    const { id, status } = req.body;

    await JobApplication.findOneAndUpdate({ _id: id }, { status });

    res.status(200).json({ success: true, message: "Status Changed" });

  } catch (error) {
    res.status(500).json({ success: false, message:error.message})
  }
}


// Change job visibility
export const changeVisiblity = async (req, res) => {
  try {

    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (job.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    job.visible = !job.visible;
    await job.save();

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete a job posting
export const deleteJob = async (req, res) => {
  try {

    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (job.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Delete the job
    await Job.findByIdAndDelete(id);

    // Also delete all applications related to this job
    await JobApplication.deleteMany({ jobId: id });

    res.status(200).json({
      success: true,
      message: "Job posting deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
