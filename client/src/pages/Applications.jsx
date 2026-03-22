import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import {
  FiUpload,
  FiEdit2,
  FiExternalLink,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Applications = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      toast.error("Please login to view applications");
      navigate("/");
    }
  }, [isLoaded, user, navigate]);

  console.log("Applications component rendered", { 
    userExists: !!user, 
    userApplications, 
    userData, 
    backendUrl,
    isLoaded 
  });

  const updateResume = async () => {
    setIsLoading(true);
    try {
      if (!resume) {
        toast.error("Please select a resume file");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Resume updated successfully");
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update resume");
    } finally {
      setIsLoading(false);
      setIsEdit(false);
      setResume(null);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("No user logged in");
      setApplicationsLoading(false);
      return;
    }

    const loadApplications = async () => {
      setApplicationsLoading(true);
      try {
        console.log("🔄 Loading user data and applications for user:", user.id);
        
        // Always fetch fresh user data first
        await fetchUserData();
        console.log("✅ User data loaded");
        
        // Then fetch applications
        await fetchUserApplications();
        console.log("✅ Applications loaded successfully");
      } catch (error) {
        console.error("❌ Error loading applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setApplicationsLoading(false);
      }
    };
    
    loadApplications();
  }, [user?.id, fetchUserData, fetchUserApplications]);

  const statusColors = {
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Pending: "bg-blue-100 text-blue-800",
    Reviewed: "bg-purple-100 text-purple-800",
    Interview: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: '#4f46e5' }}
    >
      <Navbar hideAuthButtons={true} />

      {/* Loading State while Clerk is loading */}
      {!isLoaded && (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="flex justify-center items-center h-96">
            <svg
              className="animate-spin h-12 w-12 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </main>
      )}

      {/* Main Content - only show if user is loaded and logged in */}
      {isLoaded && user && (
        <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          {/* Resume Section */}
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Resume
            </h2>
            {!isEdit && userData?.resume && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEdit(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 size={18} />
                <span>Edit</span>
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEdit || !userData?.resume ? (
              <motion.div
                key="edit-resume"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-400 transition-colors">
                      <FiUpload size={32} className="text-gray-400 mb-3" />
                      <p className="text-center text-gray-600">
                        {resume ? (
                          <span className="text-blue-600 font-medium">
                            {resume.name}
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">Choose a file</span>{" "}
                            or drag it here
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>
                    <input
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      accept="application/pdf,.doc,.docx"
                      type="file"
                      className="hidden"
                    />
                  </motion.label>

                  <div className="flex sm:flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={updateResume}
                      disabled={!resume || isLoading}
                      className={`px-6 py-3 rounded-lg font-medium flex-1 flex items-center justify-center gap-2 ${
                        !resume
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow hover:shadow-md"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          Save Resume
                        </>
                      )}
                    </motion.button>

                    {resume && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setResume(null);
                          setIsEdit(!userData?.resume);
                        }}
                        className="px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view-resume"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg"
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiExternalLink size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">Current Resume</h3>
                  <p className="text-sm text-gray-500">
                    Uploaded on{" "}
                    {moment(userData.resumeUpdatedAt).format("MMMM D, YYYY")}
                  </p>
                </div>
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Applications Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Jobs Applied
            </h2>
            <p className="text-gray-500">
              {!applicationsLoading && (userApplications?.length || 0)} applications
            </p>
          </div>

          {applicationsLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="mx-auto flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500 mt-4">Loading your applications...</p>
            </div>
          ) : userApplications?.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Company",
                        "Job Title",
                        "Location",
                        "Date",
                        "Status",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            index === 1 ? "" : "hidden sm:table-cell"
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userApplications.map((application, index) => (
                      <motion.tr
                        key={application._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-contain"
                                src={application.companyId?.image || 'https://via.placeholder.com/40'}
                                alt={application.companyId?.name || 'Company'}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.companyId?.name || 'Company Name'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {application.jobId?.title || 'Job Title'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-500">
                            {application.jobId?.location || 'Location'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" size={14} />
                            {moment(application.date).format("MMM D, YYYY")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[application.status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {application.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100"
            >
              <div className="mx-auto max-w-md">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Your job applications will appear here once you start applying
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Browse Jobs
                </a>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>
      
      <Footer />
        </>
      )}
    </div>
  );
};

export default Applications;
