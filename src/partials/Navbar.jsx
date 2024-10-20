import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Menu } from 'lucide-react';

import getAllUsersService from '../services/user/getAllUsers.service';

import LogoSementara from '../assets/images/logo/logo-white.svg';

const Navbar = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userId, setUserId] = useState(null); // Untuk menyimpan userId yang login
  const [userTotalReward, setUserTotalReward] = useState(0); // Untuk menyimpan total reward

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decodedToken.role);
        setUserId(decodedToken.id); // Ambil userId dari token yang di-decode
      } catch (error) {
        console.error('Invalid token', error);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }

    const changeBackgroundColor = () => {
      setChangeColor(window.scrollY >= 80);
    };

    changeBackgroundColor();
    window.addEventListener('scroll', changeBackgroundColor);
    return () => {
      window.removeEventListener('scroll', changeBackgroundColor);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersService();
        // Cari user yang sedang login berdasarkan userId

        const loggedInUser = response.data.find((user) => user._id === userId);
        if (loggedInUser) {
          setUserTotalReward(loggedInUser.totalReward); // Set total reward untuk user yang login
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    if (userId) {
      fetchUsers(); // Hanya panggil API jika userId ada (berarti user sudah login)
    }
  }, [userId]);

  const isUserPage = location.pathname.startsWith('/user');

  const getBackgroundColor = () => {
    if (isLoggedIn && isUserPage) {
      return 'bg-blue-700';
    }
    return changeColor ? 'bg-blue-700' : 'bg-transparent';
  };

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Layanan', href: '#services' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Kontak', href: '#contact' },
  ];

  const menuItemsLoggedIn = [
    { label: 'Dashboard', href: '/user/user-dashboard' },
    { label: 'Kumpulan Tugas', href: '/user/tasks-list' },
    { label: 'Submit Tugas', href: '/user/submit-task' },
    { label: 'Penarikan Reward', href: '/user/request-withdrawal' },
    { label: 'Profil', href: '/user/user-profile' },
  ];

  const formattedCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // Menghilangkan desimal jika tidak diinginkan
    }).format(value || 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth/login');
  };

  // Pilih menu berdasarkan apakah user sudah login atau belum
  const selectedMenuItems = isLoggedIn ? menuItemsLoggedIn : menuItems;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${getBackgroundColor()} transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <img src={LogoSementara} alt="logo" className="h-8 w-auto" />
          </div>

          <nav className="hidden lg:flex justify-center flex-grow">
            <ul className="flex space-x-8">
              {selectedMenuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className="text-white hover:text-blue-200 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center">
            {!isLoggedIn && (
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-white hover:text-blue-200 transition-colors duration-200"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-white text-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
                >
                  Daftar
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-white font-bold">
                  Saldo: {formattedCurrency(userTotalReward)}
                </span>
                <button
                  onClick={handleLogout}
                  className="block min-w-5 text-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
            <button
              className="lg:hidden text-white ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              {selectedMenuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className="block text-blue-700 hover:text-blue-900 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {!isLoggedIn && (
              <div className="mt-6 space-y-4">
                <Link
                  to="/auth/login"
                  className="block w-full text-center bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="block w-full text-center bg-white text-blue-700 px-4 py-2 rounded-full border border-blue-700 hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <>
                <span className="block text-center text-blue-700 font-bold text-2xl">
                  Saldo: {formattedCurrency(userTotalReward)}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="mt-6 block w-full text-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
