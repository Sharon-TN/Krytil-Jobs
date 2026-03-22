import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center justify-center gap-4">
        {/* Animated Spinner */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
            },
            scale: {
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="relative w-20 h-20"
        >
          {/* Outer ring with gradient */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, #3b82f6 50%, transparent 100%)`,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
            }}
            animate={{
              rotate: [0, 180, 360],
            }}
            transition={{
              rotate: {
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              },
            }}
          />

          {/* Inner dot */}
          <motion.div
            className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Text with fade animation */}
        <motion.p
          className="text-gray-600 font-medium"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          Loading...
        </motion.p>

        {/* Floating dots */}
        <div className="flex gap-2 mt-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
