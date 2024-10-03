import { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

const AddTask = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
              <form className="w-full lg:w-1/2 lg:mr-4 mx-auto" action="">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Judul Tugas"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Deskripsi Tugas
                  </label>
                  <input
                    type="text"
                    id="description"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              </form>

              <form className="w-full lg:w-1/2 mx-auto" action="">
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
                    type="file"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="URL Media Sosial"
                    required
                  />
                </div>

                <div className="lg:mt-12 flex justify-center">
                  <button
                    type="submit"
                    className="w-1/3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Green
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
