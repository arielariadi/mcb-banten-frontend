import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import loginService from '../../services/auth/login.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginService({ email, password });

      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      const decodedToken = jwtDecode(response.token);

      if (!decodedToken || !decodedToken.role) {
        throw new Error('Invalid token received');
      }

      localStorage.setItem('authToken', response.token);

      if (decodedToken.role === 'admin') {
        navigate('/admin/admin-dashboard');
      } else if (decodedToken.role === 'user') {
        navigate('/user/user-dashboard');
      } else {
        throw new Error('Unknown user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'User does not exist!') {
        setError('No account found with this email address.');
      } else if (error.message === 'Incorrect password!') {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError('Login failed. Please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-6 justify-between">
          <a href="/" className="mr-2">
            <button
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </a>
          <h2 className="text-2xl font-bold text-center flex-grow">Login</h2>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white p-2 rounded-lg focus:ring-4 focus:outline-none focus:ring-indigo-500 ${
              isLoading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <a href="/auth/register" className="text-indigo-600 hover:underline">
            Daftar disini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
