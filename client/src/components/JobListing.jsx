import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import JobCard from './JobCard';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs, fetchJobs } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterJobs, setFilterJobs] = useState(jobs);

  const JOBS_PER_PAGE = 6;

  const location = useLocation();

  const categories = [
    'Programming',
    'Data Science',
    'Designing',
    'Networking',
    'Management',
    'Marketing',
    'Cybersecurity'
  ];

  const locations = [
    'Bangalore',
    'Hyderabad',
    'Mumbai',
    'California',
    'Chennai',
    'New York'
  ];

  // Handle URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get('keyword');
    const locationParam = params.get('location');

    if (keyword || locationParam) {
      setSearchFilter(prev => ({
        ...prev,
        title: keyword || '',
        location: locationParam || ''
      }));
    }
  }, [location.search]);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [searchFilter, currentPage]);

  // Apply filters
  const applyFilter = () => {
    const filtered = jobs.filter(job => {
      if (searchFilter.title && !job.title.toLowerCase().includes(searchFilter.title.toLowerCase())) {
        return false;
      }
      if (searchFilter.location && !job.location.toLowerCase().includes(searchFilter.location.toLowerCase())) {
        return false;
      }
      if (searchFilter.category.length > 0 && !searchFilter.category.includes(job.category)) {
        return false;
      }
      return true;
    });
    setFilterJobs(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [jobs, searchFilter]);

  // Category filter handler
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSearchFilter(prev => ({
      ...prev,
      category: checked
        ? [...prev.category, value]
        : prev.category.filter(cat => cat !== value)
    }));
  };

  // Location filter handler
  const handleLocationChange = (value, checked) => {
    if (checked) {
      setSearchFilter(prev => ({
        ...prev,
        location: value
      }));
    } else {
      setSearchFilter(prev => ({
        ...prev,
        location: ''
      }));
    }
  };

  return (
    <div id="jobs" className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Panel */}
        <aside className="w-full md:w-80">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="md:hidden w-full bg-purple-700 text-white px-4 py-2 rounded mb-4"
          >
            {showFilter ? 'Hide' : 'Show'} Filters
          </button>

          <div className={`${showFilter ? 'block' : 'hidden'} md:block bg-purple-800 p-6 rounded-lg shadow-md`}>
            {/* Categories Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg text-white mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={searchFilter.category.includes(cat)}
                      onChange={handleCategoryChange}
                      className="w-4 h-4 rounded border-gray-400 text-blue-600 mr-3"
                    />
                    <span className="text-gray-300">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Locations Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg text-white mb-4">Locations</h3>
              <div className="space-y-3">
                {locations.map(loc => (
                  <label key={loc} className="flex items-center text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      value={loc}
                      checked={searchFilter.location === loc}
                      onChange={(e) => handleLocationChange(loc, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-400 text-blue-600 mr-3"
                    />
                    <span className="text-gray-300">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSearchFilter({ title: '', location: '', category: [] })}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Jobs Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isSearched ? `Showing ${filterJobs.length} results` : 'Latest Jobs'}
            </h2>
          </div>

          {filterJobs.length === 0 ? (
            <p className="text-white text-center py-10 text-lg font-medium">No jobs found matching your criteria</p>
          ) : (
            <>
              {/* Jobs Grid with Animated Background Patterns */}
              <div 
                className="relative mb-8 p-8 rounded-2xl overflow-hidden"
                style={{
                  background: "#4f46e5",
                  border: "2px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <style>{`
                  @keyframes moveDiagonalDown {
                    0% {
                      transform: translate(-100%, -100%);
                    }
                    100% {
                      transform: translate(100%, 100%);
                    }
                  }
                  
                  @keyframes moveDiagonalUp {
                    0% {
                      transform: translate(100%, 100%);
                    }
                    100% {
                      transform: translate(-100%, -100%);
                    }
                  }
                  
                  @keyframes rotate {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                  
                  @keyframes rotateReverse {
                    0% {
                      transform: rotate(360deg);
                    }
                    100% {
                      transform: rotate(0deg);
                    }
                  }
                  
                  @keyframes moveDiagonalDownSlower {
                    0% {
                      transform: translate(-150%, -150%) scale(1.5);
                    }
                    100% {
                      transform: translate(150%, 150%) scale(1.5);
                    }
                  }
                  
                  @keyframes moveUpDiagonal {
                    0% {
                      transform: translate(-100%, 100%);
                    }
                    100% {
                      transform: translate(100%, -100%);
                    }
                  }
                `}</style>

                {/* Pattern 1 - Spiral Moving Down-Right */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ animation: "moveDiagonalDown 8s linear infinite" }} preserveAspectRatio="none">
                  <g>
                    <path d="M 100 100 Q 150 50, 200 100 T 300 100" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 100 100 Q 160 40, 220 100 T 340 100" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
                    <path d="M 100 100 Q 170 30, 240 100 T 380 100" stroke="white" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
                  </g>
                </svg>

                {/* Pattern 2 - Concentric Circles Moving Up-Left */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ animation: "moveDiagonalUp 10s linear infinite" }} preserveAspectRatio="none">
                  <g>
                    <circle cx="150" cy="150" r="40" stroke="white" strokeWidth="2" fill="none" opacity="0.8" />
                    <circle cx="150" cy="150" r="60" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <circle cx="150" cy="150" r="80" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
                    <circle cx="150" cy="150" r="100" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                  </g>
                </svg>

                {/* Pattern 3 - Rotating Spiral */}
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ animation: "rotate 15s linear infinite" }} preserveAspectRatio="none">
                  <g transform="translate(50%, 50%)">
                    <path d="M 0,0 Q 50,30 100,0 Q 150,-30 200,0 Q 250,30 300,0" stroke="white" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
                    <path d="M 0,0 Q 60,40 120,0 Q 180,-40 240,0 Q 300,40 360,0" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
                    <path d="M -30,-30 L 30,30 M 30,-30 L -30,30" stroke="white" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
                  </g>
                </svg>

                {/* Pattern 4 - Wave Pattern Moving Diagonally Down Slower */}
                <svg className="absolute inset-0 w-full h-full opacity-18 pointer-events-none" style={{ animation: "moveDiagonalDownSlower 12s linear infinite" }} preserveAspectRatio="none">
                  <g>
                    <path d="M 0 50 Q 25 30 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
                    <path d="M 0 100 Q 30 75 60 100 T 120 100 T 180 100 T 240 100 T 300 100" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <path d="M 0 150 Q 35 120 70 150 T 140 150 T 210 150 T 280 150 T 350 150" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
                  </g>
                </svg>

                {/* Pattern 5 - Rotating Concentric Hexagons */}
                <svg className="absolute inset-0 w-full h-full opacity-17 pointer-events-none" style={{ animation: "rotateReverse 20s linear infinite" }} preserveAspectRatio="none">
                  <g transform="translate(30%, 70%)">
                    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                    <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <polygon points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
                  </g>
                </svg>

                {/* Pattern 6 - Diagonal Cross Pattern Moving Up */}
                <svg className="absolute inset-0 w-full h-full opacity-16 pointer-events-none" style={{ animation: "moveUpDiagonal 9s linear infinite" }} preserveAspectRatio="none">
                  <g>
                    <path d="M 0 200 L 400 0" stroke="white" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                    <path d="M 0 300 L 400 100" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
                    <path d="M 50 200 L 450 0" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
                    <path d="M 400 0 L 0 400" stroke="white" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                    <path d="M 300 0 L 0 300" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
                  </g>
                </svg>

                {/* Pattern 7 - Nested Squares Rotating */}
                <svg className="absolute inset-0 w-full h-full opacity-14 pointer-events-none" style={{ animation: "rotate 25s linear infinite" }} preserveAspectRatio="none">
                  <g transform="translate(70%, 30%)">
                    <rect x="-30" y="-30" width="60" height="60" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
                    <rect x="-50" y="-50" width="100" height="100" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <rect x="-70" y="-70" width="140" height="140" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
                  </g>
                </svg>

                {/* Pattern 8 - Spiral Lines Moving Down */}
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ animation: "moveDiagonalDown 11s linear infinite" }} preserveAspectRatio="none">
                  <g transform="translate(20%, 20%)">
                    <path d="M 50 0 L 50 100" stroke="white" strokeWidth="2" opacity="0.6" />
                    <path d="M 100 20 L 100 120" stroke="white" strokeWidth="1.5" opacity="0.5" />
                    <path d="M 150 40 L 150 140" stroke="white" strokeWidth="1" opacity="0.4" />
                    <path d="M 0 50 L 200 50" stroke="white" strokeWidth="1.5" opacity="0.5" />
                    <path d="M 20 100 L 180 100" stroke="white" strokeWidth="1" opacity="0.4" />
                  </g>
                </svg>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {filterJobs
                    .slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE)
                    .map((job, index) => (
                      <motion.div
                        key={job._id}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <JobCard job={job} index={index} />
                      </motion.div>
                    ))}
                </div>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
                >
                  Prev
                </button>
                <span className="px-4 py-2 bg-purple-600 text-white rounded font-semibold">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(filterJobs.length / JOBS_PER_PAGE)}
                  className="px-3 py-2 rounded bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobListing;