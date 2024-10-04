import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ImageModal from '../../components/ImageModal';

import config from '../../services/api-config/config';
import getAllSubmissionsService from '../../services/admin/getAllSubmissions.service';
import acceptUserSubmissionService from '../../services/admin/acceptUserSubmission.service';
import rejectUserSubmissionService from '../../services/admin/rejectUserSubmission.service';

const ManageSubmissionPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [submissions, setSubmissions] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await getAllSubmissionsService(currentPage + 1, limit);
        setSubmissions(response.data);
        setPageCount(Math.ceil(response.pagination.totalSubmissions / limit));
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };
    fetchSubmissions();
  }, [currentPage]);

  const handleAcceptSubmission = async (id) => {
    const reason = rejectionReason[id] || '';
    if (!reason.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tolong berikan pesan terlebih dahulu sebelum melakukan aksi!',
      });
      return;
    }

    const data = {
      id: id,
      rejectedReason: rejectionReason[id] || '',
    };

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin menerima submission ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, terima',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await acceptUserSubmissionService(data);

        Swal.fire({
          icon: 'success',
          title: 'Submission telah diterima',
          text: response.message,
        });

        // Refresh halaman setelah submission diterima
        const updatedResponse = await getAllSubmissionsService(
          currentPage + 1,
          limit,
        );
        setSubmissions(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error accepting submission:', error);
      let errorMessage = 'Terjadi kesalahan, silakan coba lagi!';
      if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Gagal menerima submission!',
        text: errorMessage,
      });
    }
  };

  const handleRejectSubmission = async (id) => {
    const reason = rejectionReason[id] || '';
    if (!reason.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tolong berikan pesan terlebih dahulu sebelum melakukan aksi!',
      });
      return;
    }

    const data = {
      id: id,
      rejectedReason: rejectionReason[id] || '',
    };

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin menolak submission ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, terima',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await rejectUserSubmissionService(data);

        Swal.fire({
          icon: 'success',
          title: 'Submission telah ditolak',
          text: response.message,
        });

        // Refresh halaman setelah tugas diterima
        const updatedResponse = await getAllSubmissionsService(
          currentPage + 1,
          limit,
        );
        setSubmissions(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
      let errorMessage = 'Terjadi kesalahan, silakan coba lagi!';
      if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Gagal menolak submission!',
        text: errorMessage,
      });
    }
  };

  const handleReasonChange = (id, value) => {
    setRejectionReason((prev) => ({ ...prev, [id]: value }));
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
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
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Manage Submission
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
                          <div className="font-semibold text-center">
                            Nama User
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Judul Tugas
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Deskripsi Tugas
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            URL Medsos Tugas
                          </div>
                        </th>
                        <th className="p-7 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Bukti Foto
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Penjelasan User
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Status
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Dikirim Pada
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">Pesan</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Divalidasi Pada
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">Aksi</div>
                        </th>
                      </tr>
                    </thead>
                    {/* Table body */}
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {submissions.map((submission, index) => (
                        <tr key={submission.id || index}>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">
                              {index + 1 + currentPage * limit}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              {submission.user?.username}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              {submission.task?.title}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              {submission.task?.description}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">
                              <a
                                href={submission.task?.socialMediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {submission.task?.socialMediaUrl}
                              </a>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap min-w-40">
                            <div className="text-left">
                              <img
                                src={`${config.API_URL}/${
                                  submission.taskScreenshot
                                }`}
                                onClick={() =>
                                  openModal(
                                    `${config.API_URL}/${submission.taskScreenshot}`,
                                  )
                                }
                                alt="image"
                                className="w-full cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                              />
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">
                              {submission.description}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">
                              {submission.status === 'pending' && (
                                <div className="text-center">
                                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                    {submission.status}
                                  </span>
                                </div>
                              )}
                              {submission.status === 'accepted' && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                  {submission.status}
                                </span>
                              )}
                              {submission.status === 'rejected' && (
                                <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                  {submission.status}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">
                              {formattedDate(submission.submittedAt)}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap min-w-96">
                            {submission.rejectedReason === null ||
                            !submission.rejectedReason ? (
                              <div className="text-center">
                                <textarea
                                  id="message"
                                  rows="4"
                                  value={rejectionReason[submission._id] || ''}
                                  onChange={(e) =>
                                    handleReasonChange(
                                      submission._id,
                                      e.target.value,
                                    )
                                  }
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Wajib diisi jika ditolak maupun diterima!"
                                ></textarea>
                              </div>
                            ) : (
                              <div className="text-center">
                                {submission.rejectedReason}
                              </div>
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-center">
                              {submission.validatedAt
                                ? formattedDate(submission.validatedAt)
                                : 'Tugas belum divalidasi'}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleAcceptSubmission(submission._id)
                              }
                              disabled={submission.status !== 'pending'}
                              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                              Terima
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRejectSubmission(submission._id)
                              }
                              disabled={submission.status !== 'pending'}
                              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                              Tolak
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

export default ManageSubmissionPage;
