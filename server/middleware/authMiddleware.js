import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import { getAuth } from "@clerk/express";
import User from "../models/User.js";

/* =========================
   COMPANY AUTH (JWT BASED)
   ========================= */
export const protectCompany = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log('🔐 Token from headers:', token ? '✅ Present' : '❌ Missing');
    console.log('🔑 JWT_SECRET loaded:', process.env.JWT_SECRET ? '✅ Yes' : '❌ No');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully, company ID:', decoded.id);

    const company = await Company.findById(decoded.id).select("-password");

    if (!company) {
      console.log('❌ Company not found in database');
      return res.status(401).json({
        success: false,
        message: "Company not found",
      });
    }

    console.log('✅ Company found:', company.name);
    req.company = company;
    next();
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* =========================
   USER AUTH (CLERK BASED)
   ========================= */
export const protectUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Clerk auth error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
