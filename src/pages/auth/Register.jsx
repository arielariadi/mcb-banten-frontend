import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import registerService from '../../services/auth/register.service';

import Swal from 'sweetalert2';

const Register = () => {
  const [registerFailed, setRegisterFailed] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    const data = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
      alamat: event.target.alamat.value,
      noHp: event.target.noHp.value,
      jenisKelamin: event.target.jenisKelamin.value,
      tanggalLahir: event.target.tanggalLahir.value,
    };

    const isFormFilled = Object.values(data).every(
      (value) => value.trim() !== '',
    );

    if (!isFormFilled) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Tidak Lengkap!',
        text: 'Tolong isi semua formnya terlebih dahulu!',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await registerService(data);
      console.log(response);
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Silakan login untuk mengakses akun Anda',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/auth/login');
        }
      });
    } catch (error) {
        setRegisterFailed(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-gradient-to-r from-blue-400 to-indigo-600">
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
          <h2 className="text-2xl font-bold text-center flex-grow">
            Registrasi
          </h2>
        </div>
        {registerFailed && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{registerFailed}</span>
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

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
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Nomor Handphone */}
          <div>
            <label
              htmlFor="noHp"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Handphone
            </label>
            <input
              type="text"
              name="noHp"
              id="noHp"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Alamat */}
          <div>
            <label
              htmlFor="alamat"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              id="alamat"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jenis Kelamin
            </label>
            <div className="mt-1 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="Laki-laki"
                  className="form-radio text-indigo-600"
                  required
                />
                <span className="ml-2 text-sm">Laki-laki</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jenisKelamin"
                  value="Perempuan"
                  className="form-radio text-indigo-600"
                  required
                />
                <span className="ml-2 text-sm">Perempuan</span>
              </label>
            </div>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label
              htmlFor="tanggalLahir"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggalLahir"
              id="tanggalLahir"
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
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
