import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";


// GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;

    console.log('📊 Fetching user data for userId:', userId);

    let user = await User.findById(userId);
    
    if (!user) {
      console.log('🆕 Creating new user:', userId);
      user = new User({
        _id: userId,
        name: req.auth.sessionClaims?.name || "User",
      });
      await user.save();
      console.log('✅ User created successfully');
    } else {
      console.log('👤 User found in database');
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        resume: user.resume,
        resumeUpdatedAt: user.resumeUpdatedAt,
        cgpa: user.cgpa,
        phoneNumber: user.phoneNumber,
      },
    });

  } catch (error) {
    console.error('❌ Error in getUserData:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user data",
    });
  }
};


// APPLY FOR JOB
export const applyForJob = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { jobId } = req.body;

    const job = await Job.findById(jobId)
      .select("companyId")
      .lean();

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      userId,
      jobId,
      companyId: job.companyId,
      date: Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: "Applied successfully"
    });

  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Already applied"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



// ✅ PAGINATED — GET USER APPLICATIONS
export const getUserJobApplications = async (req, res) => {
  try {

    const userId = req.auth.userId;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalApplications = await JobApplication.countDocuments({ userId });

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title location salary level")
      .sort({ date: -1 }) // newest first
      .limit(limit)
      .skip(skip)
      .lean();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalApplications / limit),
      totalApplications,
      count: applications.length,
      applications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// UPDATE USER RESUME
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    console.log('📥 Resume upload request:', { userId, fileName: resumeFile?.originalname, fileSize: resumeFile?.size });

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    try {
      console.log('📤 Uploading to Cloudinary...');
      const uploadResult = await cloudinary.uploader.upload(resumeFile.path, {
        resource_type: "auto",
        folder: "job-nest-resumes",
      });

      console.log('✅ Cloudinary upload successful:', uploadResult.public_id);

      // Find or create user
      let user = await User.findById(userId);
      
      if (!user) {
        console.log('🆕 Creating new user for resume upload');
        user = new User({
          _id: userId,
          name: req.auth.sessionClaims?.name || "User",
        });
      }

      // Update resume
      user.resume = uploadResult.secure_url;
      user.resumeUpdatedAt = new Date();
      await user.save();

      console.log('✅ User record updated with resume URL');

      // Clean up temporary file
      const fs = (await import("fs")).default;
      if (resumeFile.path && fs.existsSync(resumeFile.path)) {
        fs.unlinkSync(resumeFile.path);
      }

      res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        resume: user.resume,
      });
    } catch (uploadError) {
      console.error('❌ Upload error:', uploadError.message);
      const fs = (await import("fs")).default;
      if (resumeFile.path && fs.existsSync(resumeFile.path)) {
        fs.unlinkSync(resumeFile.path);
      }
      throw uploadError;
    }
  } catch (error) {
    console.error("❌ Resume upload error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload resume",
    });
  }
};

// UPDATE USER CGPA
export const updateUserCgpa = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { cgpa } = req.body;

    // Validate CGPA value
    if (cgpa === null || cgpa === undefined) {
      return res.status(400).json({
        success: false,
        message: "CGPA value is required",
      });
    }

    const cgpaNum = parseFloat(cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      return res.status(400).json({
        success: false,
        message: "CGPA must be a number between 0 and 10",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cgpa = cgpaNum;
    await user.save();

    res.status(200).json({
      success: true,
      message: "CGPA updated successfully",
      cgpa: user.cgpa,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER PHONE NUMBER
export const updateUserPhone = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { phoneNumber } = req.body;

    // Validate phone number
    if (phoneNumber === null || phoneNumber === undefined || phoneNumber === "") {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Check if phone is exactly 10 digits
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.phoneNumber = phoneNumber;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Phone number updated successfully",
      phoneNumber: user.phoneNumber,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
