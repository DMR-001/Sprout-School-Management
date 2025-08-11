import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import sproutLogo from '../assets/images/sprout-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const result = await login(form.email, form.password);
    
    if (result.success) {
      // Redirect based on role
      if (result.role === 'parent') {
        navigate('/parent-dashboard');
      } else if (result.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (result.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'parent@demo.com', password: 'demo123', role: 'Parent' },
    { email: 'admin@demo.com', password: 'admin123', role: 'Admin' },
    { email: 'teacher@demo.com', password: 'teacher123', role: 'Teacher' }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border">
        <div className="text-center mb-8">
          <img src={sproutLogo} alt="Sprout School Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Demo accounts section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts</h3>
          <div className="space-y-2 text-xs">
            {demoAccounts.map((account, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                <span className="font-medium text-gray-800">{account.role}:</span>
                <span className="text-gray-600">{account.email} / {account.password}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
