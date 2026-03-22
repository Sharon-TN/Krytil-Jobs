import React from "react";
import { motion } from "framer-motion";
import { FiSearch, FiBell, FiBookmark, FiShare2, FiBriefcase } from "react-icons/fi";

const AppDownload = () => {
  const features = [
    {
      icon: <FiSearch size={32} className="text-blue-600" />,
      title: "Advanced Search",
      description: "Find your dream job with our powerful search filters",
    },
    {
      icon: <FiBell size={32} className="text-blue-600" />,
      title: "Job Alerts",
      description: "Get notified when new jobs match your criteria",
    },
    {
      icon: <FiBookmark size={32} className="text-blue-600" />,
      title: "Save Listings",
      description: "Bookmark interesting jobs to apply later",
    },
    {
      icon: <FiShare2 size={32} className="text-blue-600" />,
      title: "Easy Sharing",
      description: "Share job postings with friends and colleagues",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      {/* Floating decoration elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-100 opacity-30"></div>
      <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-indigo-100 opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Powerful Job Search{" "}
              <span className="text-blue-600">Platform</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Our web platform gives you complete access to thousands of jobs
              with all the tools you need to find and land your perfect
              position.
            </p>

            {/* Features list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              whileHover={{
                y: -3,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-all"
            >
              Browse All Jobs
            </motion.a>
          </motion.div>

          {/* Browser mockup */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-lg"></div>
              <div className="relative bg-white rounded-xl shadow-xl border-8 border-gray-900 overflow-hidden w-full max-w-md">
                {/* Browser chrome */}
                <div className="bg-gray-100 p-2 flex items-center gap-2 border-b">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 bg-gray-200 rounded px-3 py-1 text-xs text-gray-600">
                    https://job-nest-client-coral.vercel.app/
                  </div>
                </div>

                {/* Browser content */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-24 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-medium">
                      Search
                    </div>
                  </div>

                  {/* Job cards */}
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiBriefcase className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Senior UX Designer
                          </h3>
                          <p className="text-sm text-gray-600">
                            Bangalore • Full-time
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiBriefcase className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Product Manager
                          </h3>
                          <p className="text-sm text-gray-600">
                            Remote • ₹120k-₹150k
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiBriefcase className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Frontend Developer
                          </h3>
                          <p className="text-sm text-gray-600">
                            Mysore • React experience
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AppDownload;
