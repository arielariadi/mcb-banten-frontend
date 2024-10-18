import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import Navbar from '../../partials/Navbar';

import requestWithdrawalService from '../../services/user/requestWithdrawal.service';
import getAllUsersService from '../../services/user/getAllUsers.service';

const RequestWithdrawalPage = () => {
  // State untuk mengambil data total reward user yang sedang login
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userTotalReward, setUserTotalReward] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const withdrawalMethodRef = useRef();
  const withdrawalMethodNumberRef = useRef();
  const amountRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decode token untuk mendapatkan informasi user (misalnya role dan id)
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decodedToken.role);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error('Invalid token', error);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersService();
        // Cari user yang sedang login berdasarkan userId yang didapatkan dari token
        const loggedInUser = response.data.find((user) => user._id === userId);

        // Jika user yang sedang login ditemukan, set total reward user tersebut
        if (loggedInUser) {
          setUserTotalReward(loggedInUser.totalReward); // Set total reward untuk user yang login
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Jika userId sudah ada (berarti user sudah terlogin), panggil fetchUsers untuk mendapatkan data user
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const withdrawalMethod = event.target.withdrawalMethod.value;
    const withdrawalMethodNumber = event.target.withdrawalMethodNumber.value;
    const amount = event.target.amount.value;

    if (!withdrawalMethod || !withdrawalMethodNumber || !amount) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal melakukan request penarikan!',
        text: 'Harap isi semua kolom wajib: Metode Penarikan, Nomor Metode Penarikan, dan Jumlah!',
      });
      return;
    }
    // Cek apakah user memiliki saldo yang cukup
    if (userTotalReward < 250000) {
      Swal.fire({
        icon: 'error',
        title: 'Saldo anda tidak mencukupi!',
        text: 'Anda harus memiliki saldo minimal 250.000 untuk melakukan penarikan.',
      });
      return;
    }

    // Cek apakah jumlah penarikan melebih saldo yang dimiliki
    if (amount > userTotalReward) {
      Swal.fire({
        icon: 'error',
        title: 'Jumlah penarikan anda melebihi saldo!',
        text: 'Jumlah penarikan tidak boleh melebihi saldo yang Anda miliki.',
      });
      return;
    }

    const data = {
      withdrawalMethod,
      withdrawalMethodNumber,
      amount,
    };

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin melakukan request penarikan?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, request',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await requestWithdrawalService(data);
        console.log(response);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil melakukan request penarikan!',
          text: 'Harap menunggu validasi dari admin.',
        });

        // Reset form
        event.target.withdrawalMethod.value = '';
        event.target.withdrawalMethodNumber.value = '';
        event.target.amount.value = '';
      }
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal melakukan request penarikan!',
        text:
          error.response?.data?.message ||
          'Terjadi kesalahan saat melakukan request penarikan. Silakan coba lagi.',
      });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Navbar />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-center text-3xl font-bold mt-16">
                  Request Penarikan Reward
                </h1>
              </div>

              <div className="flex flex-col items-center mt-5">
                <div className="relative inline-block">
                  <button
                    id="dropdownHoverButton"
                    onClick={toggleDropdown}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                  >
                    Catatan{' '}
                    <svg
                      className="w-2.5 h-2.5 ms-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                </div>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    id="dropdownHover"
                    className="bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-96 lg:w-1/2 dark:bg-gray-700 mt-2"
                  >
                    <ul className="py-4 px-6 text-sm lg:text-lg font-bold text-gray-700">
                      <li className="py-2">
                        1. Anda harus memiliki saldo minimal 250.000 jika ingin
                        melakukan request penarikan
                      </li>
                      <li className="py-2">
                        2. Jumlah penarikan tidak bisa melebihi jumlah saldo
                        saat ini
                      </li>
                      <li className="py-2">
                        3. Masukkan nomor metode penarikan yang valid sesuai
                        dengan pilihan metode penarikan
                      </li>
                      <li className="py-2">
                        4. Tuliskan jumlah nominal penarikan tanpa tanda titik.
                        Contoh : 100000
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col mt-5 lg:flex-row lg:mt-5 col-span-full p-5 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                <form
                  className="w-full lg:mr-4 mx-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="mb-5">
                      <label
                        htmlFor="withdrawalMethod"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pilih Metode Penarikan
                      </label>
                      <select
                        id="withdrawalMethod"
                        ref={withdrawalMethodRef}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Pilih Metode Penarikan</option>
                        <option value="Dana">Dana</option>
                        <option value="BCA">BCA</option>
                        <option value="BNI">BNI</option>
                        <option value="BRI">BRI</option>
                      </select>
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="withdrawalMethodNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nomor Metode Penarikan
                      </label>
                      <input
                        type="text"
                        id="withdrawalMethodNumber"
                        ref={withdrawalMethodNumberRef}
                        name="withdrawalMethodNumber"
                        autoComplete="off"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Masukkan nomor Metode Penarikan"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="amount"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Jumlah
                      </label>
                      <input
                        type="number"
                        id="amount"
                        ref={amountRef}
                        name="amount"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="lg:mt-7 text-center lg:text-start">
                      <button
                        type="submit"
                        className="w-1/3 lg:w-1/5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Kirim
                      </button>

                      <button
                        type="reset"
                        className="w-1/3 lg:w-1/5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RequestWithdrawalPage;
