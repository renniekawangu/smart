import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white w-full">
        <h1 className="text-5xl font-bold mb-4">Smart Lodging</h1>
        <p className="text-2xl mb-8">Find Your Perfect Stay with AI-Powered Recommendations</p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(isAuthenticated ? '/search' : '/login')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Get Started
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/register')}
              className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600"
            >
              Register Now
            </button>
          )}
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
            <p>Get personalized lodging suggestions based on your preferences</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Smart Pricing</h3>
            <p>Dynamic pricing predictions to help you book at the best rates</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Smart Reviews Analysis</h3>
            <p>AI-powered sentiment analysis of guest reviews</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Browse Lodgings Card */}
          <button
            onClick={() => navigate('/search')}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl hover:bg-opacity-20 transition-all duration-300 text-left overflow-hidden border border-white border-opacity-20"
          >
            <div className="p-6">
              <h4 className="text-white font-bold text-lg">Browse Lodgings</h4>
            </div>
            <p className="text-white text-opacity-90 px-6 pb-6">Explore our collection of premium accommodations</p>
          </button>

          {/* My Bookings Card */}
          <button
            onClick={() => navigate(isAuthenticated ? '/bookings' : '/login')}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl hover:bg-opacity-20 transition-all duration-300 text-left overflow-hidden border border-white border-opacity-20"
          >
            <div className="p-6">
              <h4 className="text-white font-bold text-lg">My Bookings</h4>
            </div>
            <p className="text-white text-opacity-90 px-6 pb-6">{isAuthenticated ? 'Manage your reservations' : 'Sign in to view bookings'}</p>
          </button>

          {/* Recommendations Card */}
          <button
            onClick={() => navigate(isAuthenticated ? '/search' : '/login')}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl hover:bg-opacity-20 transition-all duration-300 text-left overflow-hidden border border-white border-opacity-20"
          >
            <div className="p-6">
              <h4 className="text-white font-bold text-lg">Recommendations</h4>
            </div>
            <p className="text-white text-opacity-90 px-6 pb-6">Get personalized suggestions powered by AI</p>
          </button>

          {/* Dashboard Card */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl hover:bg-opacity-20 transition-all duration-300 text-left overflow-hidden border border-white border-opacity-20"
            >
              <div className="p-6">
                <h4 className="text-white font-bold text-lg">My Profile</h4>
              </div>
              <p className="text-white text-opacity-90 px-6 pb-6">View and manage your account</p>
            </button>
          )}

          {/* Sign In Card */}
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl hover:bg-opacity-20 transition-all duration-300 text-left overflow-hidden border border-white border-opacity-20"
            >
              <div className="p-6">
                <h4 className="text-white font-bold text-lg">Sign In</h4>
              </div>
              <p className="text-white text-opacity-90 px-6 pb-6">Access your account and bookings</p>
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
