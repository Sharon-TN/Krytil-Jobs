import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
    userId: {type : String, ref: 'User', required: true},
    companyId: {type : mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
    jobId: {type : mongoose.Schema.Types.ObjectId, ref: 'Job', required: true},
    status: {type : String, default: 'Pending'},
    date: {type : Number, required: true}
})

// indexing things to faster the queries

// prevent single user to apply only once for one job
JobApplicationSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true }
);

// fast recruiter
JobApplicationSchema.index({jobId:1});

// for company dashboard
JobApplicationSchema.index({ companyId: 1 });

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication