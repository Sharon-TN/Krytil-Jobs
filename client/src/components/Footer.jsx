import React from "react";
import { motion } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiDribbble, FiGithub } from "react-icons/fi";

const Footer = () => {
  const socialLinks = [
    { icon: <FiFacebook size={20} />, name: "Facebook", href: "#" },
    { icon: <FiTwitter size={20} />, name: "Twitter", href: "#" },
    { icon: <FiInstagram size={20} />, name: "Instagram", href: "#" },
    { icon: <FiLinkedin size={20} />, name: "LinkedIn", href: "#" },
    { icon: <FiGithub size={20} />, name: "GitHub", href: "#" },
  ];

  const quickLinks = [
    { title: "Home", href: "#" },
    { title: "Browse Jobs", href: "#jobs" },
    { title: "Companies", href: "#" },
    { title: "Contact", href: "#" },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      variants={footerVariants}
      className="bg-gray-900 border-t border-gray-800 py-16"
    >
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <motion.div
            custom={0}
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ψ</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Krytil<span className="text-blue-500">Jobs</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the best career opportunities with our intelligent job search platform. Connect with top companies and build your dream career.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            custom={1}
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <motion.li
                  key={link.title}
                  custom={idx}
                  variants={itemVariants}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Empty space for layout */}
          <motion.div
            custom={2}
            variants={itemVariants}
            className="hidden lg:block"
          >
          </motion.div>

          {/* Connect With Us */}
          <motion.div
            custom={3}
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h3 className="text-white font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  custom={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -3,
                    color: "#3B82F6",
                  }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href}
                  aria-label={social.name}
                  className="text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          custom={4}
          variants={itemVariants}
          className="border-t border-gray-800 my-8"
        ></motion.div>

        {/* Bottom Section */}
        <motion.div
          custom={5}
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm"
        >
          <p>© 2026 Krytil PVT Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Support
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;