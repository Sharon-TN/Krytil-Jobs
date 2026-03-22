import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Clerk userId
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // Removed unique constraint to prevent duplicate null key errors
      // Clerk userId (_id) is the true identifier
    },
    image: {
      type: String,
    },
    resume: {
      type: String,
      default: "",
    },
    resumeUpdatedAt: {
      type: Date,
      default: null,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
