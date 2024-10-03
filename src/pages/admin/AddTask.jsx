import { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import createNewTaskService from '../../services/admin/createNewTask.service';
import Swal from 'sweetalert2';

const AddTask = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [file, setFile] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('title', event.target.taskTitle.value);
    data.append('description', event.target.taskDescription.value);
    data.append('reward', event.target.rewardInput.value);
    data.append('image', file);
    data.append('socialMediaUrl', event.target.medsosUrl.value);

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin menambahkan tugas ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, tambahkan',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await createNewTaskService(data);
        console.log('response api: ', response);
        Swal.fire({
          icon: 'success',
          title: 'Tugas ditambahkan!',
        });
      }
    } catch (error) {
      console.error('Error adding task: ', error);
      let errorMessage = 'Terjadi kesalahan, silakan coba lagi!';
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes('Title sudah digunakan')
      ) {
        errorMessage =
          'Judul tugas sudah digunakan. Silakan gunakan judul tugas yang berbeda!';
      }
      Swal.fire({
        icon: 'error',
        title: 'Gagal menambahkan tugas!',
        text: errorMessage,
      });
    }
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Tambahkan Tugas
                </h1>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row col-span-full p-5 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <form className="w-full lg:mr-4 mx-auto" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="mb-5">
                    <label
                      htmlFor="taskTitle"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Judul Tugas
                    </label>
                    <input
                      type="text"
                      id="taskTitle"
                      name="taskTitle"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Judul Tugas"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="taskDescription"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Deskripsi Tugas
                    </label>
                    <input
                      type="text"
                      id="taskDescription"
                      name="taskDescription"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Deskripsi Tugas"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="rewardInput"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Jumlah Reward
                    </label>
                    <input
                      type="number"
                      id="rewardInput"
                      name="rewardInput"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="medsosImage"
                    >
                      Gambar Media Sosial
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="medsosImage"
                      name="medsosImage"
                      type="file"
                      onChange={handleFile}
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="medsosUrl"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      URL Media Sosial
                    </label>
                    <input
                      type="text"
                      id="medsosUrl"
                      name="medsosUrl"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="URL Media Sosial"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 lg:mt-12 text-center lg:text-start">
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
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTask;
