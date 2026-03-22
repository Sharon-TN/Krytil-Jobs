import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    salary: { type: Number, required: true },
    date: { type: Number, required: true }, // timestamp for job posting
    visible: { type: Boolean, default: true }, // for active/inactive jobs
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
});

// Indexing

//  Fast job listing for users (only visible jobs, newest first)
jobSchema.index({ visible: 1, date: -1 });

//  Fast recruiter queries (jobs by company)
jobSchema.index({ companyId: 1 });

//  Optimize search filters (category + location)
jobSchema.index({ category: 1, location: 1 });


const Job = mongoose.model("Job", jobSchema);

export default Job;
