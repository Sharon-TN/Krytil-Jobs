import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";
import { FiMenu, FiX, FiUsers, FiUserCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Navbar = ({ hideAuthButtons = false }) => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent text-white font-sans pt-6">
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <img src={assets.logo} alt="logo" className="h-20 md:h-24" />
        </div>

        {/* Right Links */}
        <div className="hidden md:flex items-center gap-8">
          {user && !hideAuthButtons ? (
            <div className="flex items-center gap-6">
              <motion.button
                onClick={() => navigate("/applications")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full text-white hover:shadow-lg transition-all"
              >
                Applied Jobs
              </motion.button>
              <motion.button
                onClick={() => navigate("/profile-settings")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-2 rounded-full text-white hover:shadow-lg transition-all"
              >
                My Profile
              </motion.button>
              <span className="text-lg">Hi, {user.firstName}</span>
              <UserButton />
            </div>
          ) : hideAuthButtons ? null : (
            <div className="flex items-center gap-6">
              <motion.button 
                onClick={() => setShowRecruiterLogin(true)}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.6)"
                }}
                whileTap={{ 
                  scale: 0.95,
                  boxShadow: "0 0 30px rgba(255, 255, 255, 1), inset 0 0 30px rgba(255, 255, 255, 0.8)"
                }}
                className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full text-white transition-all duration-300"
              >
                For Recruiters
              </motion.button>
              
              <motion.button 
                onClick={(e) => {
                  e.preventDefault();
                  openSignIn();
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)" }}
                whileTap={{ scale: 0.95, boxShadow: "0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.6)" }}
                className="px-6 py-2 border-2 border-white rounded-full text-lg font-semibold bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Login
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-gray-300 transition-colors"
        >
          {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-t border-gray-800">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-6">
            {user && !hideAuthButtons ? (
              <div className="flex flex-col gap-4">
                <span className="text-lg">Hi, {user.firstName}</span>
                <motion.button
                  onClick={() => {
                    navigate("/applications");
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full text-white text-left"
                >
                  Applied Jobs
                </motion.button>
                <UserButton />
              </div>
            ) : hideAuthButtons ? null : (
              <div className="flex flex-col gap-4">
                <motion.button 
                  onClick={() => {
                    setShowRecruiterLogin(true);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.6)"
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    boxShadow: "0 0 30px rgba(255, 255, 255, 1), inset 0 0 30px rgba(255, 255, 255, 0.8)"
                  }}
                  className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full text-white"
                >
                  For Recruiters
                </motion.button>
                <motion.button 
                  onClick={() => {
                    openSignIn();
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)" }}
                  whileTap={{ scale: 0.95, boxShadow: "0 0 40px rgba(255, 255, 255, 0.8)" }}
                  className="text-lg font-semibold border-2 border-white rounded-full px-6 py-2 text-white bg-white/10 w-fit"
                >
                  Login
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
