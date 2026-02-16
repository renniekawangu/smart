import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'host') {
      navigate('/host');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Welcome, {user?.name}!</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => navigate('/search')} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 text-left hover:bg-opacity-20 transition-all">
              <h2 className="text-xl font-bold mb-2 text-white">Search Lodgings</h2>
              <p className="text-white text-opacity-80">Find your perfect accommodation</p>
            </button>

            <button onClick={() => navigate('/bookings')} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 text-left hover:bg-opacity-20 transition-all">
              <h2 className="text-xl font-bold mb-2 text-white">My Bookings</h2>
              <p className="text-white text-opacity-80">View and manage your reservations</p>
            </button>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6">
              <h2 className="text-xl font-bold mb-2 text-white">Profile</h2>
              <p className="text-white text-opacity-80">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
