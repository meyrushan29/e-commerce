/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
        errors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
        errors.name = 'Name must only contain letters and spaces';
    }

    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }

    return errors;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const success = await register(name, email, password);
        if (success) {
          setMessage('Registration successful! Redirecting...');
          setTimeout(() => {
            setIsLoading(false);
            navigate('/login');
          }, 2000);
        } else {
          setMessage(error || 'Registration failed');
          setIsLoading(false);
        }
      } catch (err) {
        setMessage('An unexpected error occurred');
        setIsLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        className="max-w-md w-full mx-auto p-8 bg-white shadow-lg rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <motion.input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`w-full pl-10 pr-4 py-3 border ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
            {formErrors.name && <p className="text-red-500 text-sm font-bold mt-1">{formErrors.name}</p>}
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <motion.input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`w-full pl-10 pr-4 py-3 border ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
            {formErrors.email && <p className="text-red-500 text-sm font-bold mt-1">{formErrors.email}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <motion.input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={`w-full pl-10 pr-10 py-3 border ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {formErrors.password && <p className="text-red-500 text-sm font-bold mt-1">{formErrors.password}</p>}
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            Sign Up
          </motion.button>

          {isLoading && (
            <div className="mt-4 flex justify-center items-center">
              <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes('successful') ? 'text-black' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}
        </motion.form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-black hover:underline">Log in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
