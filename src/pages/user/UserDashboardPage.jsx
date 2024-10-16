import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import Navbar from '../../partials/Navbar';
import ImageModal from '../../components/ImageModal';

import config from '../../services/api-config/config';
import getUserSubmissionsHistoryService from '../../services/user/getUserSubmissionsHistory.service';
import getUserWithdrawalsHistoryService from '../../services/user/getUserWithdrawalHistory.service';

const UserDashboardPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [submissionsHistory, setSubmissionsHistory] = useState([]);
  const [withdrawalsHistory, setWithdrawalsHistory] = useState([]);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;

  const [pageCount2, setPageCount2] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const limit2 = 5;

  useEffect(() => {
    const fetchSubmissionsHistory = async () => {
      try {
        const response = await getUserSubmissionsHistoryService(
          currentPage + 1,
          limit,
        );

        setSubmissionsHistory(response.data);
        // console.log(response.data);
        setPageCount(Math.ceil(response.pagination.totalSubmissions / limit));
      } catch (error) {
        console.error('Error fetching submission history:', error);
      }
    };

    fetchSubmissionsHistory();
  }, [currentPage]);

  useEffect(() => {
    const fetchWithdrawalsHistory = async () => {
      try {
        const response = await getUserWithdrawalsHistoryService(
          currentPage2 + 1,
          limit2,
        );

        setWithdrawalsHistory(response.data);
        console.log(response.data);
        setPageCount2(Math.ceil(response.pagination.totalWithdrawals / limit2));
      } catch (error) {
        console.error('Error fetching withdrawal history:', error);
      }
    };
    fetchWithdrawalsHistory();
  }, [currentPage2]);

  // const handleMessageChange = (id, value) => {
  //   setAdminMessage((prev) => ({ ...prev, [id]: value }));
  // };

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

  const handlePageClick2 = (event) => {
    setCurrentPage2(event.selected);
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
    <>
      <div className="flex h-screen overflow-hidden">
        <Navbar />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-center text-3xl font-bold mt-16">
                  User Dashboard
                </h1>
              </div>

              <div className="col-span-full xl:col-span-6 bg-white shadow-sm rounded-xl mt-10">
                <header className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Riwayat Pengerjaan Tugas
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
                              Bukti Foto
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Deskripsi
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Dikirim Pada
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Divalidasi Pada
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Pesan Admin
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Status
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {/* Table body */}
                      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                        {submissionsHistory.map((submission, index) => (
                          <tr key={submission._id || index}>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {index + 1 + currentPage * limit}
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
                                {formattedDate(submission.submittedAt)}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              {submission.validatedAt === null ||
                              !submission.validatedAt ? (
                                <div className="text-center">
                                  Tugas belum divalidasi!
                                </div>
                              ) : (
                                <div className="text-center">
                                  {formattedDate(submission.validatedAt)}
                                </div>
                              )}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              {submission.rejectedReason === null ||
                              !submission.rejectedReason ? (
                                <div className="text-center">---</div>
                              ) : (
                                <div className="text-center">
                                  {submission.rejectedReason}
                                </div>
                              )}
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

              <div className="col-span-full xl:col-span-6 bg-white shadow-sm rounded-xl mt-10">
                <header className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    Riwayat Penarikan
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
                              Metode Pembayaran
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Nomor Metode Pembayaran
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Jumlah
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Direquest Pada
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Divalidasi Pada
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Pesan Admin
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Status
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {/* Table body */}
                      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                        {withdrawalsHistory.map((withdrawal, index) => (
                          <tr key={withdrawal._id || index}>
                            <td className="p-6 whitespace-nowrap">
                              <div className="text-center">
                                {index + 1 + currentPage2 * limit2}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.withdrawalMethod}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.withdrawalMethodNumber}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.amount}
                              </div>
                            </td>

                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {formattedDate(withdrawal.requestedAt)}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              {withdrawal.validatedAt === null ||
                              !withdrawal.validatedAt ? (
                                <div className="text-center">
                                  Tugas belum divalidasi!
                                </div>
                              ) : (
                                <div className="text-center">
                                  {formattedDate(withdrawal.validatedAt)}
                                </div>
                              )}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              {withdrawal.rejectedReason === null ||
                              !withdrawal.rejectedReason ? (
                                <div className="text-center">---</div>
                              ) : (
                                <div className="text-center">
                                  {withdrawal.rejectedReason}
                                </div>
                              )}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.status === 'pending' && (
                                  <div className="text-center">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                      {withdrawal.status}
                                    </span>
                                  </div>
                                )}
                                {withdrawal.status === 'accepted' && (
                                  <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    {withdrawal.status}
                                  </span>
                                )}
                                {withdrawal.status === 'rejected' && (
                                  <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                    {withdrawal.status}
                                  </span>
                                )}
                              </div>
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
                      onPageChange={handlePageClick2}
                      pageRangeDisplayed={5}
                      pageCount={pageCount2}
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
      </div>
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        imageUrl={selectedImage}
      />
    </>
  );
};

export default UserDashboardPage;
