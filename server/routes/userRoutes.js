import express from "express";
import { requireAuth } from "@clerk/express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  updateUserCgpa,
  updateUserPhone,
} from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Clerk-protected user routes
router.get("/user", requireAuth(), getUserData);
router.post("/apply", requireAuth(), applyForJob);
router.get("/applications", requireAuth(), getUserJobApplications);
router.post(
  "/update-resume",
  requireAuth(),
  upload.single("resume"),
  updateUserResume
);
router.post("/update-cgpa", requireAuth(), updateUserCgpa);
router.post("/update-phone", requireAuth(), updateUserPhone);

export default router;
