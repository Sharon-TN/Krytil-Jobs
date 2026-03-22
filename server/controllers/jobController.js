import Job from "../models/Job.js";

// Get all jobs with search and filters (PRODUCTION READY + PAGINATED)
export const getJobs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    // Search filters from query params
    const { keyword, location, category } = req.query;

    let query = { visible: true };

    // Add keyword search (searches in title, description, category)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Add location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Add category filter
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Total jobs count (for frontend pagination)
    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate({
        path: 'companyId',
        select: 'name email image'
      })
      .sort({ date: 1 })          // oldest jobs first, newest at the end
      .limit(limit)
      .skip(skip)
      .lean();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      count: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate({
        path: 'companyId',
        select: 'name email image'
      })
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

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