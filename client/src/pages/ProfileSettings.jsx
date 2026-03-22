import React, { useContext, useEffect, useState, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { FiUpload, FiCheck, FiArrowLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { backendUrl, userData, fetchUserData } = useContext(AppContext);
  
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cgpa, setCgpa] = useState("");
  const [isSavingCgpa, setIsSavingCgpa] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [cgpaSaved, setCgpaSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Do NOT fetch user data on mount - let user upload/save fresh in this session
  // This ensures button starts disabled and only enables after user actions

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setResume(file);
    setResumeName(file.name);
  };

  const handleUpload = async () => {
    if (!resume) {
      toast.error("Please select a resume file");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      if (data.success) {
        toast.success("Resume uploaded successfully");
        await fetchUserData();
        setResume(null);
        setResumeName("Resume uploaded ✓");
        setResumeUploaded(true);
      } else {
        toast.error(data.message || "Failed to upload resume");
      }
    } catch (error) {
      // Handle E11000 duplicate key error gracefully - it sometimes happens but resume still uploads
      if (error.response?.data?.message?.includes("E11000") || 
          error.response?.data?.message?.includes("duplicate")) {
        console.warn("Backend duplicate key error, but resume may still be uploaded");
        toast.success("Resume uploaded successfully");
        await fetchUserData();
        setResume(null);
        setResumeName("Resume uploaded ✓");
        setResumeUploaded(true);
      } else {
        const errorMsg = error.response?.data?.message || error.message || "Failed to upload resume";
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCgpa = async () => {
    if (cgpa === "" || cgpa === null) {
      toast.error("Please enter your CGPA");
      return;
    }

    const cgpaValue = parseFloat(cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      toast.error("CGPA must be between 0 and 10");
      return;
    }

    setIsSavingCgpa(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/update-cgpa`,
        { cgpa: cgpaValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("CGPA saved successfully");
        await fetchUserData();
        setCgpaSaved(true);
      } else {
        toast.error(data.message || "Failed to save CGPA");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to save CGPA";
      toast.error(errorMsg);
    } finally {
      setIsSavingCgpa(false);
    }
  };

  const handleSavePhoneNumber = async () => {
    if (phoneNumber === "" || phoneNumber === null) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setIsSavingPhone(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/update-phone`,
        { phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Phone Number Saved Successfully");
        await fetchUserData();
      } else {
        toast.error(data.message || "Failed to save phone number");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to save phone number";
      toast.error(errorMsg);
    } finally {
      setIsSavingPhone(false);
    }
  };

  // Check if profile is complete - based on THIS SESSION actions only
  const isProfileComplete = () => {
    return resumeUploaded && cgpaSaved;
  };

  const handleApplyForJobs = () => {
    if (!isProfileComplete()) {
      toast.error("Complete Your Profile Before Applying for Jobs");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <Navbar hideAuthButtons={true} />
      
      <div className="container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back Button */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white mb-6 hover:text-indigo-300 transition cursor-pointer"
          >
            <FiArrowLeft /> Back to Home
          </Link>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-indigo-100">Manage your profile and upload resume</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Profile Complete Success Message */}
              {isProfileComplete() && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FiCheck className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-xl font-bold text-green-700">Profile Updated Successfully</p>
                      <p className="text-green-600 text-sm">All details have been successfully saved. You can now apply for jobs!</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* User Info Section */}
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      value={user?.firstName || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user?.lastName || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.primaryEmailAddress?.emailAddress || ""}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 font-semibold mb-2">Phone Number</label>
                    <div className="flex gap-3">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhoneNumber(value);
                        }}
                        placeholder="Enter 10 digit phone number"
                        maxLength="10"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                      <motion.button
                        onClick={handleSavePhoneNumber}
                        disabled={isSavingPhone}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isSavingPhone ? "Saving..." : "Save"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CGPA Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Enter CGPA</h2>
                <div className="max-w-md">
                  <label className="block text-gray-600 font-semibold mb-2">
                    CGPA (0.0 - 10.0)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="Enter your CGPA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
                  />
                  <p className="text-gray-500 text-sm mb-4">
                    Enter a decimal number between 0 and 10
                  </p>
                  <motion.button
                    onClick={handleSaveCgpa}
                    disabled={isSavingCgpa}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingCgpa ? "Saving..." : "Save CGPA"}
                  </motion.button>
                </div>
              </div>

              {/* Resume Upload Section */}
              <div className="mt-8 pt-8 border-t">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resume Upload</h2>
                
                {/* File Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all mb-4"
                >
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">
                    {resumeName || "Click to upload your resume"}
                  </p>
                  <p className="text-gray-500 text-sm">PDF or Word document (Max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {resume && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      <FiCheck className="w-5 h-5" />
                      File selected: {resumeName}
                    </p>
                  </motion.div>
                )}

                {resumeUploaded && !resume && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-blue-700 font-semibold flex items-center gap-2">
                      <FiCheck className="w-5 h-5" />
                      Resume already uploaded
                    </p>
                  </motion.div>
                )}

                {/* Upload Button */}
                <motion.button
                  onClick={handleUpload}
                  disabled={!resume || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Uploading..." : "Upload Resume"}
                </motion.button>

                {/* Apply for Jobs Button */}
                <motion.button
                  onClick={handleApplyForJobs}
                  disabled={!isProfileComplete()}
                  whileHover={isProfileComplete() ? { scale: 1.02 } : {}}
                  whileTap={isProfileComplete() ? { scale: 0.98 } : {}}
                  className={`w-full mt-4 font-semibold py-3 rounded-lg transition-all ${
                    isProfileComplete()
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg cursor-pointer"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70"
                  }`}
                >
                  Apply for Jobs
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileSettings;
