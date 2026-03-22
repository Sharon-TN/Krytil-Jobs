import React from 'react';
import Navbar from '../components/Navbar';
import LandingPage from '../components/LandingPage';
import JobListing from '../components/JobListing';
import AppDownload from '../components/AppDownload';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: '#4f46e5' }}>
      {/* Content wrapper */}
      <div className="relative z-10">
        <Navbar />
        <LandingPage />
        {/* Content wrapper with proper background */}
        <div className="bg-indigo-500/50 backdrop-blur-md shadow-2xl pb-10 mt-10">
          <JobListing />
          <AppDownload />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
