import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white">SmartLodging</a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <a href="/search" className="text-white hover:text-blue-200 transition-colors">Search</a>
                <a href="/bookings" className="text-white hover:text-blue-200 transition-colors">My Bookings</a>
                <a href="/favorites" className="text-white hover:text-blue-200 transition-colors">❤️ Favorites</a>
                {user?.role === 'admin' && (
                  <a href="/admin" className="text-blue-300 hover:text-blue-100 transition-colors font-semibold">
                    Admin
                  </a>
                )}
                {user?.role === 'host' && (
                  <a href="/host" className="text-green-300 hover:text-green-100 transition-colors font-semibold">
                    My Properties
                  </a>
                )}
                <span className="text-sm text-white text-opacity-80">
                  {user?.name}
                  {user?.role && <span className="text-blue-300 text-xs"> ({user.role})</span>}
                </span>
                <button onClick={handleLogout} className="bg-red-600 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-opacity-100 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-white hover:text-blue-200 transition-colors">Login</a>
                <a href="/register" className="bg-blue-600 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-opacity-100 transition-all">
                  Register
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 bg-black bg-opacity-20 rounded-lg p-4 mt-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('/search')}
                  className="block w-full text-left text-white hover:text-blue-200 transition-colors py-2 px-4 rounded hover:bg-white hover:bg-opacity-10"
                >
                  Search
                </button>
                <button
                  onClick={() => handleNavClick('/bookings')}
                  className="block w-full text-left text-white hover:text-blue-200 transition-colors py-2 px-4 rounded hover:bg-white hover:bg-opacity-10"
                >
                  My Bookings
                <button
                  onClick={() => handleNavClick("/favorites")}
                  className="block w-full text-left text-white hover:text-blue-200 transition-colors py-2 px-4 rounded hover:bg-white hover:bg-opacity-10"
                >
                  Favorites
                </button>
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className="block w-full text-left text-blue-300 hover:text-blue-100 transition-colors font-semibold py-2 px-4 rounded hover:bg-white hover:bg-opacity-10"
                  >
                    Admin Dashboard
                  </button>
                )}
                {user?.role === 'host' && (
                  <button
                    onClick={() => handleNavClick('/host')}
                    className="block w-full text-left text-green-300 hover:text-green-100 transition-colors font-semibold py-2 px-4 rounded hover:bg-white hover:bg-opacity-10"
                  >
                    My Properties
                  </button>
                )}
                <div className="py-2 px-4 border-t border-white border-opacity-20 mt-2">
                  <p className="text-sm text-white text-opacity-80">
                    {user?.name}
                    {user?.role && <span className="text-blue-300 text-xs ml-1">({user.role})</span>}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-opacity-100 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('/login')}
                  className="block w-full text-left text-white hover:text-blue-200 transition-colors py-2 px-4 rounded hover:bg-white hover:bg-opacity-10"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="block w-full text-left bg-blue-600 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-opacity-100 transition-all"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
