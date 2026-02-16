import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isRegistering, registerError, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Navigate to dashboard after successful registration
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-12 px-4 flex items-center">
        <div className="max-w-md mx-auto w-full p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20">
          <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50"
                required
              />
            </div>
            {registerError && <p className="text-red-300 mb-4">Registration failed</p>}
            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-blue-600 bg-opacity-80 text-white py-2 rounded hover:bg-opacity-100 transition-all disabled:opacity-50"
            >
              {isRegistering ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-white text-opacity-90">
            Already have an account? <a href="/login" className="text-blue-200 hover:text-blue-100 transition-colors">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};
