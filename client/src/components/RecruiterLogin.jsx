import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiX,
  FiUser,
  FiMail,
  FiLock,
  FiUpload,
  FiArrowRight,
} from "react-icons/fi";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (state === "Sign Up" && !isTextDataSubmited) {
      setIsLoading(false);
      return setIsTextDataSubmited(true);
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });
        handleSuccess(data);
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("image", image);

        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData
        );
        handleSuccess(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setIsLoading(false);
    }
  };

  const handleSuccess = (data) => {
    if (data.success) {
      setCompanyData(data.company);
      setCompanyToken(data.token);
      localStorage.setItem("companyToken", data.token);
      toast.success(`Welcome ${data.company.name}!`);
      setShowRecruiterLogin(false);
      navigate("/dashboard");
    } else {
      toast.error(data.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0, scale: 0.95 },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <FiX size={24} />
        </button>

        {/* Form Content */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {state === "Login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 mt-2">
              {state === "Login"
                ? "Sign in to manage your recruitment"
                : "Setup your company profile"}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.form
              key={state + isTextDataSubmited}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={onSubmitHandler}
              className="space-y-4"
            >
              {state === "Sign Up" && isTextDataSubmited ? (
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center gap-6 py-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors">
                      {image ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Company logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <FiUpload
                            size={32}
                            className="mx-auto text-gray-400"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Upload Logo
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      onChange={(e) => setImage(e.target.files[0])}
                      type="file"
                      id="image"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </motion.div>
                  <p className="text-gray-600 text-center">
                    Upload your company logo for recognition
                  </p>
                </motion.div>
              ) : (
                <>
                  {state !== "Login" && (
                    <motion.div
                      custom={0}
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      className="relative"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        placeholder="Company Name"
                        required
                      />
                    </motion.div>
                  )}

                  <motion.div
                    custom={1}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="email"
                      placeholder="Email Address"
                      required
                    />
                  </motion.div>

                  <motion.div
                    custom={2}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type="password"
                      placeholder="Password"
                      required
                    />
                  </motion.div>

                  {state === "Login" && (
                    <motion.div
                      custom={3}
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-right"
                    >
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Forgot password?
                      </button>
                    </motion.div>
                  )}
                </>
              )}

              <motion.button
                custom={4}
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow hover:shadow-md transition-all"
              >
                {isLoading ? (
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
                ) : (
                  <>
                    {state === "Login"
                      ? "Sign In"
                      : isTextDataSubmited
                      ? "Complete Registration"
                      : "Continue"}
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-sm text-gray-500"
          >
            {state === "Login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setState("Sign Up");
                    setIsTextDataSubmited(false);
                  }}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setState("Login")}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  Sign In
                </button>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecruiterLogin;
