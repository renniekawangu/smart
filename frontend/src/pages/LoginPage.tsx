import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-12 px-4 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <LoginForm />
          <p className="text-center mt-6 text-sm text-white text-opacity-90">
            Don't have an account? <a href="/register" className="text-blue-200 hover:text-blue-100 transition-colors">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};
