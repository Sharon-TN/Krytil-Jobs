import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    keyword: '',
    location: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchData.keyword && !searchData.location) {
      alert('Please enter a job title or location to search');
      return;
    }

    // Scroll to jobs section with search params
    const params = new URLSearchParams();
    if (searchData.keyword) params.append('keyword', searchData.keyword);
    if (searchData.location) params.append('location', searchData.location);

    navigate(`/?${params.toString()}#jobs`);

    // Scroll to jobs section after navigation
    setTimeout(() => {
      document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your <span className="text-pink-500">Dream Job</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Search and apply for jobs from top companies
          </p>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Job Title or Keyword"
              value={searchData.keyword}
              onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-md outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-md outline-none"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-md font-semibold transition"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex-1">
          <img src={assets.hero_img} alt="Hero" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Hero;