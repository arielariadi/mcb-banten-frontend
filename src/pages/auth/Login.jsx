import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import loginService from '../../services/auth/login.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = { email, password };

      const response = await loginService(data);

      // Access token directly from response
      const token = response.token;

      if (!token) {
        throw new Error('Token not found in response');
      }

      setAuthToken(token);
      const decodedToken = jwtDecode(token);

      setUserRole(decodedToken.role);

      // Store token in localStorage
      localStorage.setItem('authToken', token);

      if (decodedToken.role === 'admin') {
        navigate('/admin/admin-dashboard');
      } else if (decodedToken.role === 'user') {
        navigate('/user/user-dashboard');
      }
    } catch (error) {
      setLoginFailed(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-6 justify-between">
          <a href="/" className="mr-2">
            <button className="text-gray-700 hover:text-gray-900 focus:outline-none">
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
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundColor: '#4F46E5' }}
            className="w-full text-white p-2 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500"
          >
            Login
          </button>
          {loginFailed && <p>{loginFailed}</p>}
        </form>

        {/* Link to Register */}
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
