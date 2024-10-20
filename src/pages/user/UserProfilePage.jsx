import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import Navbar from '../../partials/Navbar';

import getAllUsersService from '../../services/user/getAllUsers.service';
import updateUserProfileService from '../../services/user/updateUserProfile.service';

const UserProfilePage = () => {
  // State untuk mengambil data user yang sedang login
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [usernameUser, setUsernameUser] = useState('');
  const [noHpUser, setNoHpUser] = useState('');
  const [alamatUser, setAlamatUser] = useState('');
  const [jenisKelaminUser, setJenisKelaminUser] = useState('');
  const [tanggalLahirUser, setTanggalLahirUser] = useState('');

  const [originalData, setOriginalData] = useState({});

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

        // Cek apakah id user yang ada di database sama dengan id user yang sedang login
        const loggedInUser = response.data.find((user) => user._id === userId);

        if (loggedInUser) {
          setUsernameUser(loggedInUser.username);
          setNoHpUser(loggedInUser.noHp);
          setAlamatUser(loggedInUser.alamat);
          setJenisKelaminUser(loggedInUser.jenisKelamin);

          // Convert tanggalLahirUser ke yyyy-MM-dd format
          const formattedDate = new Date(loggedInUser.tanggalLahir)
            .toISOString()
            .split('T')[0];
          setTanggalLahirUser(formattedDate);

          // Simpan data asli
          setOriginalData({
            username: loggedInUser.username,
            noHp: loggedInUser.noHp,
            alamat: loggedInUser.alamat,
            jenisKelamin: loggedInUser.jenisKelamin,
            tanggalLahir: formattedDate,
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const updateUserProfile = async () => {
    // Cek apakah ada perubahan
    if (
      usernameUser === originalData.username &&
      noHpUser === originalData.noHp &&
      alamatUser === originalData.alamat &&
      jenisKelaminUser === originalData.jenisKelamin &&
      tanggalLahirUser === originalData.tanggalLahir
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak ada perubahan untuk diupdate!',
      });
      return;
    }
    try {
      const data = {
        username: usernameUser,
        noHp: noHpUser,
        alamat: alamatUser,
        jenisKelamin: jenisKelaminUser,
        tanggalLahir: tanggalLahirUser,
      };

      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin update profil ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, update',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await updateUserProfileService(data);

        Swal.fire({
          icon: 'success',
          title: 'Profil berhasil diupdate!',
        });

        // Update originalData setelah berhasil update
        setOriginalData({
          username: usernameUser,
          noHp: noHpUser,
          alamat: alamatUser,
          jenisKelamin: jenisKelaminUser,
          tanggalLahir: tanggalLahirUser,
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      Swal.fire(
        'Error',
        'Gagal update profil! Tolong periksa kembali inputan anda',
        'error',
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUserProfile();
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
                  User Profile
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                <div className="grid brid-cols-1 lg:grid-cols-2 gap-4">
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
                      value={usernameUser}
                      onChange={(e) => setUsernameUser(e.target.value)}
                      required
                      className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

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
                      value={noHpUser}
                      onChange={(e) => setNoHpUser(e.target.value)}
                      required
                      className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

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
                      value={alamatUser}
                      onChange={(e) => setAlamatUser(e.target.value)}
                      required
                      className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Jenis Kelamin
                    </label>
                    <div className="mt-2 flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="Laki-laki"
                          checked={jenisKelaminUser === 'Laki-laki'}
                          onChange={(e) => setJenisKelaminUser(e.target.value)}
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
                          checked={jenisKelaminUser === 'Perempuan'}
                          onChange={() => setJenisKelaminUser('Perempuan')}
                          className="form-radio text-indigo-600"
                          required
                        />
                        <span className="ml-2 text-sm">Perempuan</span>
                      </label>
                    </div>
                  </div>

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
                      value={tanggalLahirUser}
                      onChange={(e) => setTanggalLahirUser(e.target.value)}
                      required
                      className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#4F46E5' }}
                      className="w-full lg:w-52 mt-6 text-white p-2 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
