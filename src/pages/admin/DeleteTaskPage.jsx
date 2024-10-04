import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ImageModal from '../../components/ImageModal';

import config from '../../services/api-config/config';
import getAllTasksService from '../../services/general/getAllTasks.service';
import deleteTaskService from '../../services/admin/deleteTask.service';

const DeleteTaskPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [tasksData, setTasksData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTasksService(currentPage + 1, limit);
        setTasksData(response.data);
        setPageCount(Math.ceil(response.pagination.totalTasks / limit));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin menghapus tugas ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, hapus',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });
      if (result.isConfirmed) {
        const response = await deleteTaskService(id);

        Swal.fire({
          icon: 'success',
          title: 'Tugas telah dihapus!',
        });

        // Update tasksData tanpa reload halaman
        setTasksData((prevTasks) =>
          prevTasks.filter((task) => task._id !== id),
        );
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      let errorMessage = 'Terjadi kesalahan, silakan coba lagi!';
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Gagal menghapus tugas!',
        text: errorMessage,
      });
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage('');
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
                  Lihat dan Hapus Tugas
                </h1>
              </div>
            </div>

            <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  Kumpulan Tugas
                </h2>
              </header>
              <div className="p-3">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    {/* Table header */}
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">No</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">Judul</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Deskripsi
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            URL Media Sosial
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Gambar Media Sosial
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Reward
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">Aksi</div>
                        </th>
                      </tr>
                    </thead>
                    {/* Table body */}
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {tasksData.map((task, index) => (
                        <tr key={task.id || index}>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">
                              {index + 1 + currentPage * limit}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{task.title}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{task.description}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              <a
                                href={task.socialMediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {task.socialMediaUrl}
                              </a>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap min-w-40">
                            <div className="text-left">
                              {task.image && (
                                <img
                                  src={`${config.API_URL}/${task.image}`}
                                  onClick={() =>
                                    openModal(`${config.API_URL}/${task.image}`)
                                  }
                                  alt="image"
                                  className="w-full cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">{task.reward}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDelete(task._id)}
                              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="mt-4">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< Previous"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination flex justify-center items-center space-x-2"
                    pageClassName="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg"
                    pageLinkClassName="px-3 py-2 leading-tight"
                    activeClassName="bg-blue-50 border-blue-500 text-blue-600"
                    previousClassName="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg"
                    nextClassName="bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg"
                    previousLinkClassName="px-3 py-2 leading-tight"
                    nextLinkClassName="px-3 py-2 leading-tight"
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default DeleteTaskPage;
