import { useState, useContext, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AppContext } from '../context/AppContext';
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const LandingPage = () => {
    const { setSearchFilter, fetchJobs, userData } = useContext(AppContext) || {};
    const { user } = useUser();
    const canvasRef = useRef(null);
    const loginModalShownRef = useRef(false);
    const [searchData, setSearchData] = useState({
        keyword: '',
        location: ''
    });

    // Canvas wave animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            time += 0.008;

            // Clear canvas with dark blue background
            const gradientBg = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradientBg.addColorStop(0, '#1e3a8a');
            gradientBg.addColorStop(0.5, '#1e40af');
            gradientBg.addColorStop(1, '#1e3a8a');
            ctx.fillStyle = gradientBg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw flowing wave mesh with perspective
            const waveStartY = canvas.height * 0.35;
            const waveEndY = canvas.height * 0.75;
            const meshDensity = 35; // Line spacing
            
            // Draw horizontal flowing lines
            for (let row = 0; row < 25; row++) {
                const baseY = waveStartY + (row / 25) * (waveEndY - waveStartY);
                const rowAmp = Math.sin(row * 0.15 + time * 0.5) * 40 + 60;
                
                ctx.beginPath();
                
                for (let col = 0; col <= canvas.width; col += meshDensity) {
                    // Create smooth flowing wave with sine and cosine combinations
                    const waveHeight = Math.sin((col * 0.004) + time * 0.6) * rowAmp +
                                     Math.cos((col * 0.001) + time * 0.4) * (rowAmp * 0.5);
                    
                    const x = col;
                    const y = baseY + waveHeight + Math.sin(time * 0.3 + row * 0.2) * 30;
                    
                    // Color based on position
                    const posRatio = col / canvas.width;
                    
                    if (posRatio < 0.25) {
                        // Cyan to turquoise
                        // hue = 180 + posRatio * 40;
                        // saturation = 60 + posRatio * 20;
                        // lightness = 70 + posRatio * 10;
                    } else if (posRatio < 0.65) {
                        // Purple/lavender middle
                        // hue = 270 + (posRatio - 0.25) * 40;
                        // saturation = 50;
                        // lightness = 65;
                    } else {
                        // Pink/magenta
                        // hue = 320;
                        // saturation = 55 + (posRatio - 0.65) * 20;
                        // lightness = 70;
                    }
                    
                    if (col === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                // Gradient stroke along the wave - bold and vibrant
                const lineGradient = ctx.createLinearGradient(0, waveStartY, 0, waveEndY);
                lineGradient.addColorStop(0, 'rgba(100, 180, 255, 0.7)');
                lineGradient.addColorStop(0.4, 'rgba(150, 100, 220, 0.75)');
                lineGradient.addColorStop(0.7, 'rgba(200, 120, 200, 0.7)');
                lineGradient.addColorStop(1, 'rgba(220, 100, 180, 0.75)');
                
                ctx.strokeStyle = lineGradient;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
            
            // Draw vertical flowing lines for depth
            for (let col = 0; col < canvas.width; col += meshDensity) {
                ctx.beginPath();
                
                for (let row = 0; row <= 25; row++) {
                    const baseY = waveStartY + (row / 25) * (waveEndY - waveStartY);
                    const rowAmp = Math.sin(row * 0.15 + time * 0.5) * 40 + 60;
                    
                    const waveHeight = Math.sin((col * 0.004) + time * 0.6) * rowAmp +
                                     Math.cos((col * 0.001) + time * 0.4) * (rowAmp * 0.5);
                    
                    const x = col;
                    const y = baseY + waveHeight + Math.sin(time * 0.3 + row * 0.2) * 30;
                    
                    if (row === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                const colGradient = ctx.createLinearGradient(col, waveStartY, col, waveEndY);
                colGradient.addColorStop(0, 'rgba(150, 180, 220, 0.8)');
                colGradient.addColorStop(0.5, 'rgba(200, 140, 200, 0.75)');
                colGradient.addColorStop(1, 'rgba(220, 130, 180, 0.8)');
                
                ctx.strokeStyle = colGradient;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    // Show notification once for logged-in users with incomplete profile
    useEffect(() => {
        if (user && !loginModalShownRef.current) {
            const isProfileComplete = userData?.resume && userData?.cgpa;
            
            if (!isProfileComplete) {
                toast.warning("Please Update Your Profile Before Applying to Jobs", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                loginModalShownRef.current = true;
            }
        }
    }, [user, userData]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (setSearchFilter) {
            setSearchFilter({
                title: searchData.keyword,
                location: searchData.location,
                category: []
            });
        }
        if (fetchJobs) fetchJobs();

        setTimeout(() => {
            const jobsSection = document.getElementById('jobs');
            if (jobsSection) {
                jobsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div className="relative min-h-screen bg-blue-900 overflow-hidden font-sans pt-16" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {/* Canvas for wave animation */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0"
            ></canvas>

            {/* Main Content - Centered Layout */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 min-h-[85vh] flex flex-col items-center justify-center">
                
                {/* Center Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-4xl text-center"
                >
                    
                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        whileHover={{
                            scale: 1.05,
                            textShadow: "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(79, 70, 229, 0.6)"
                        }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-2xl cursor-pointer transition-all duration-300"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #ffffff, #e9d5ff, #ffffff)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            animation: "shimmer 3s linear infinite"
                        }}
                    >
                        FIND WORK THAT FITS YOU
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base md:text-lg text-white mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg"
                    >
                        Join over 10,000+ professionals who found their perfect career match with us
                    </motion.p>

                    {/* Search Bar - Pill styled */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row items-center bg-white rounded-full overflow-hidden w-full max-w-3xl mx-auto shadow-2xl z-20 p-1 hover:shadow-3xl transition-shadow duration-300"
                    >
                        {/* Job Title Input */}
                        <div className="flex-1 flex items-center px-6 py-4 md:py-0 w-full h-16 md:h-16 bg-transparent">
                            <FiSearch className="text-gray-800 text-2xl mr-3" strokeWidth={2} />
                            <input
                                type="text"
                                placeholder="Job Title or Keyword"
                                value={searchData.keyword}
                                onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
                                className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-600 text-base font-medium"
                            />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-10 bg-gray-400"></div>

                        {/* Location Input */}
                        <div className="flex-1 flex items-center px-6 py-4 md:py-0 w-full h-16 md:h-16 bg-transparent">
                            <FiMapPin className="text-gray-800 text-2xl mr-3" strokeWidth={2} />
                            <input
                                type="text"
                                placeholder="Location"
                                value={searchData.location}
                                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                                className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-600 text-base font-medium"
                            />
                        </div>

                        {/* Search Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 md:h-16 flex items-center justify-center gap-2 rounded-full w-full md:w-auto transition-all focus:outline-none flex-shrink-0 md:mr-1 font-semibold text-base shadow-lg hover:shadow-xl"
                        >
                            <span>search</span>
                            <FiArrowRight className="text-lg" strokeWidth={2.5} />
                        </motion.button>
                    </motion.form>
                </motion.div>
            </div>

            {/* Hero Image - Positioned on Right with Animation */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute right-0 bottom-0 z-5 h-96 md:h-5/6 pointer-events-none"
            >
                <motion.img
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    src="/image.png" 
                    alt="Hero illustration"
                    onError={(e) => e.target.style.display = 'none'}
                    className="h-full w-auto object-contain object-right-bottom"
                />

                {/* Job Bubbles in front of leg */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="absolute bottom-24 right-16 w-20 h-20 rounded-full bg-white/30 shadow-lg flex items-center justify-center"
                    style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="text-center">
                        <p className="text-xs font-semibold text-white">AI</p>
                        <p className="text-xs text-white">Engineer</p>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute bottom-32 right-32 w-20 h-20 rounded-full bg-white/30 shadow-lg flex items-center justify-center"
                    style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="text-center">
                        <p className="text-xs font-semibold text-white">UI/UX</p>
                        <p className="text-xs text-white">Design</p>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute bottom-20 right-48 w-20 h-20 rounded-full bg-white/30 shadow-lg flex items-center justify-center"
                    style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="text-center">
                        <p className="text-xs font-semibold text-white">Web</p>
                        <p className="text-xs text-white">Developer</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

const styles = `
    @keyframes shimmer {
        0% {
            backgroundPosition: 200% 0;
        }
        100% {
            backgroundPosition: -200% 0;
        }
    }
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default LandingPage;
