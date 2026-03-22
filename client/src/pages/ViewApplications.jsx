import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import moment from 'moment';
import {
  FiDownload,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiClock,
  FiSearch,
  FiFilter, FiChevronDown
} from "react-icons/fi";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);

  // Floating background elements
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, window.innerHeight], [5, -5]);
  const rotateY = useTransform(x, [0, window.innerWidth], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const fetchCompanyJobApplications = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeJobApplicationStatus = async (id, status) => {
    setIsUpdating(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(`Application ${status.toLowerCase()}`);
        setApplicants((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  const filteredApplicants = applicants?.filter(applicant => {
    const matchesSearch = applicant.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         applicant.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus && applicant.jobId && applicant.userId;
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!applicants || applicants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full border border-gray-100"
        >
          <motion.div 
            className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }}
          >
            <FiBriefcase className="text-blue-500 text-2xl" />
          </motion.div>
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-3">
            No Applications Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Applications from candidates will appear here once they start
            applying to your jobs.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:shadow-md"
          >
            View Posted Jobs
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const statusColors = {
    Pending: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    Accepted: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    Rejected: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    Reviewed: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  };

  const statusOptions = ["All", "Reviewed", "Accepted", "Rejected"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Floating background elements */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-100 opacity-20 blur-xl"></div>
        <div className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full bg-indigo-100 opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-purple-100 opacity-20 blur-xl"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <motion.div 
          onMouseMove={handleMouseMove}
          style={{
            perspective: 1000,
            rotateX,
            rotateY,
          }}
          className="relative bg-white rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 backdrop-blur-sm bg-opacity-90 border border-gray-100"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div 
              className="absolute bg-blue-500 rounded-full filter blur-3xl opacity-10"
              style={{
                x,
                y,
                width: 300,
                height: 300,
                left: -150,
                top: -150,
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-gray-900"
              >
                Job <span className="text-blue-600">Applications</span>
              </motion.h1>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative flex-1 min-w-[200px]"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium cursor-pointer"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option} className="bg-white text-gray-900">{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiChevronDown className="text-gray-400" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {filteredApplicants?.map((applicant, index) => (
                <motion.div
                  key={applicant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`bg-white rounded-xl shadow-sm border ${statusColors[applicant.status]?.border || "border-gray-200"} overflow-hidden`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedCard(expandedCard === applicant._id ? null : applicant._id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={applicant.userId.image}
                          alt={applicant.userId.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {applicant.userId.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {applicant.jobId.title}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <FiMapPin className="mr-1" size={12} />
                          {applicant.jobId.location}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            statusColors[applicant.status]?.bg || "bg-gray-100"
                          } ${statusColors[applicant.status]?.text || "text-gray-800"}`}
                        >
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedCard === applicant._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Applied:</span>
                            <span className="text-sm font-medium">
                              {moment(applicant.createdAt).format("MMM D, YYYY")}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Last updated:</span>
                            <span className="text-sm font-medium">
                              {moment(applicant.updatedAt).fromNow()}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <motion.a
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              href={applicant.userId.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
                            >
                              <FiDownload className="mr-1" />
                              Resume
                            </motion.a>

                            {applicant.status === "Pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => changeJobApplicationStatus(applicant._id, "Reviewed")}
                                  disabled={isUpdating}
                                  className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
                                >
                                  <FiCheck className="mr-1" />
                                  Reviewed
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => changeJobApplicationStatus(applicant._id, "Accepted")}
                                  disabled={isUpdating}
                                  className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-600 hover:bg-green-100"
                                >
                                  <FiCheck className="mr-1" />
                                  Accepted
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => changeJobApplicationStatus(applicant._id, "Rejected")}
                                  disabled={isUpdating}
                                  className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                  <FiX className="mr-1" />
                                  Rejected
                                </motion.button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplicants?.map((applicant, index) => (
                      <motion.tr
                        key={applicant._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={applicant.userId.image}
                                alt={applicant.userId.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {applicant.userId.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {moment(applicant.createdAt).format("MMM D, YYYY")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {applicant.jobId.title}
                          </div>
                          <div className="text-sm text-gray-500 lg:hidden">
                            <FiMapPin className="inline mr-1" size={14} />
                            {applicant.jobId.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMapPin className="mr-1" size={14} />
                            {applicant.jobId.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[applicant.status]?.bg || "bg-gray-100"
                            } ${statusColors[applicant.status]?.text || "text-gray-800"}`}
                          >
                            {applicant.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-2">
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={applicant.userId.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                              title="Download Resume"
                            >
                              <FiDownload />
                            </motion.a>

                            {applicant.status === "Pending" ? (
                              <div className="relative inline-block text-left">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-gray-400 hover:text-gray-600 focus:outline-none p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
                                  disabled={isUpdating}
                                  title="Actions"
                                >
                                  <FiMoreVertical />
                                </motion.button>

                                <AnimatePresence>
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                  >
                                    <div className="py-1">
                                      <motion.button
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          changeJobApplicationStatus(
                                            applicant._id,
                                            "Reviewed"
                                          )
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <FiCheck /> Reviewed
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          changeJobApplicationStatus(
                                            applicant._id,
                                            "Accepted"
                                          )
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <FiCheck /> Accepted
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          changeJobApplicationStatus(
                                            applicant._id,
                                            "Rejected"
                                          )
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <FiX /> Rejected
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                <FiClock className="inline mr-1" />
                                {moment(applicant.updatedAt).fromNow()}
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-right text-sm text-gray-500"
            >
              Showing {filteredApplicants?.length || 0} of {applicants.length} applications
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewApplications;