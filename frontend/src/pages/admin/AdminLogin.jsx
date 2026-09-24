import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin-otp', { email, password });
      if (response.data.success) {
        setShowOtp(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Access Denied. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin-login-verify', { email, otp });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        toast.success('Neural Link Established.');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-accent/30 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8 glass-card p-10 relative z-10"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white font-cormorant">
            Admin <span className="text-gold">Portal</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to access the dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={showOtp ? handleVerifyOtp : handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            {!showOtp ? (
              <>
                <div>
                  <label className="sr-only">Email address</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="sr-only">Password</label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label className="sr-only">OTP Code</label>
                <input
                  type="text"
                  required
                  className="input-field text-center text-2xl tracking-[1em] font-bold text-gold"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
                <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest">
                  Enter the 6-digit neural key sent to your email.
                </p>
              </motion.div>
            )}
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                showOtp ? 'Verify OTP' : 'Request Neural Key'
              )}
            </button>
            {showOtp && (
              <button 
                type="button"
                onClick={() => setShowOtp(false)}
                className="w-full mt-4 text-[10px] uppercase tracking-widest text-gray-500 hover:text-gold transition-colors"
              >
                Back to Login
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
