import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

import { AppContext } from "../context/AppContext";

import {
  FiPlus,
  FiHome,
  FiUsers,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

import { assets } from "../assets/assets";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  const [showLogout, setShowLogout] = useState(false);

  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  useEffect(() => {
    if (companyData && location.pathname === "/dashboard") {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData, navigate, location.pathname]);

  const sidebarLinks = [
    {
      path: "/dashboard/add-job",
      icon: <FiPlus size={18} />,
      label: "Add Job",
    },
    {
      path: "/dashboard/manage-jobs",
      icon: <FiHome size={18} />,
      label: "Manage Jobs",
    },
    {
      path: "/dashboard/view-applications",
      icon: <FiUsers size={18} />,
      label: "View Applications",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-white"
      style={{
        backgroundColor: '#4f46e5',
      }}
    >

      {/* NAVBAR */}

      <nav 
        className="px-6 py-3 flex justify-between items-center sticky top-0 z-50"
        style={{
          backgroundColor: '#4f46e5',
        }}
      >

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={assets.logo}
            className="h-16"
            alt="logo"
          />

          <span className="hidden md:block font-semibold text-lg">
            {companyData?.name}
          </span>
        </div>

        {companyData && (

          <div className="flex items-center gap-4 relative">

            <p className="hidden md:block text-gray-300 text-sm">
              Welcome back{" "}
              <span className="font-medium text-white">
                {companyData.name.split(" ")[0]}
              </span>
            </p>

            <button
              onClick={() => setShowLogout(!showLogout)}
              className="focus:outline-none"
            >
              <img
                className="w-9 h-9 rounded-full border border-white/20"
                src={companyData.image}
                alt=""
              />
            </button>

            <AnimatePresence>

              {showLogout && (

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-12 bg-[#1e293b] border border-white/10 rounded-lg shadow-lg overflow-hidden"
                >

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full"
                  >
                    <FiLogOut />
                    Sign out
                  </button>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        )}

      </nav>

      <div className="flex flex-col md:flex-row">

        {/* SIDEBAR */}

        <aside className="md:w-64 bg-white/5 border-r border-white/10 min-h-screen">

          <div className="p-5">

            <h3 className="text-lg font-semibold mb-6">
              Dashboard
            </h3>

            <ul className="space-y-2">

              {sidebarLinks.map((link) => (

                <li key={link.path}>

                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "text-gray-400 hover:bg-white/10"
                      }`
                    }
                  >

                    {link.icon}

                    {link.label}

                    {location.pathname === link.path && (
                      <span className="ml-auto">
                        <FiChevronRight />
                      </span>
                    )}

                  </NavLink>

                </li>

              ))}

            </ul>

          </div>

        </aside>

        {/* MAIN CONTENT */}

        <main className="flex-1 p-6 md:p-10">

          <AnimatePresence mode="wait">

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>

          </AnimatePresence>

        </main>

      </div>

    </motion.div>
  );
};

export default Dashboard;

