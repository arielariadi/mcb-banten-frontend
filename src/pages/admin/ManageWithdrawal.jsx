import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ImageModal from '../../components/ImageModal';

import config from '../../services/api-config/config';
import getAllWithDrawalsService from '../../services/admin/getAllWithdrawals.service';
import acceptUserWithdrawalService from '../../services/admin/acceptUserWithdrawal.service';
import rejectUserWithdrawalService from '../../services/admin/rejectUserWithdrawal.service';

const ManageWithdrawalPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [withdrawalsData, setWithdrawalsData] = useState([]);
  const [adminMessage, setAdminMessage] = useState('');

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await getAllWithDrawalsService(currentPage + 1, limit);
        setWithdrawalsData(response.data);
        setPageCount(Math.ceil(response.pagination.totalWithdrawals / limit));
      } catch (error) {
        console.error('Error fetching withdrawals: ', error);
      }
    };

    fetchWithdrawals();
  }, [currentPage]);

  const handleAcceptWithdrawal = async (id) => {
    const reason = adminMessage[id] || '';
    if (!reason.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Tolong berikan pesan terlebih dahulu sebelum melakukan aksi!',
      });
      return;
    }

    const data = {
      id: id,
      rejectedReason: adminMessage[id] || '',
    };

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title:
          'Apakah kamu yakin ingin menyetujui request penarikan reward ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, setujui',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await acceptUserWithdrawalService(data);

        Swal.fire({
          icon: 'success',
          title: 'Penarikan reward disetujui',
          text: `Penarikan reward dengan nominal ${formattedNumber(response.data.amount)} telah disetujui!`,
        });

        // Refresh halaman setelah withdrawal disetujui
        const updatedResponse = await getAllWithDrawalsService(
          currentPage + 1,
          limit,
        );

        setWithdrawalsData(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      let errorMessage = 'Terjadi kesalahan, silakan coba lagi!';
      if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Gagal menerima penarikan reward!',
        text: errorMessage,
      });
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const reason = adminMessage[id] || '';
    if (!reason.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Tolong berikan pesan terlebih dahulu sebelum melakukan aksi!',
      });
      return;
    }

    const data = {
      id: id,
      rejectedReason: adminMessage[id] || '',
    };

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin menolak request penarikan reward ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, terima',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await rejectUserWithdrawalService(data);

        Swal.fire({
          icon: 'success',
          title: 'Penarikan reward telah ditolak',
          text: `Penarikan reward dengan nominal ${formattedNumber(response.data.amount)} telah ditolak!`,
        });

        // Refresh halaman setelah tugas diterima
        const updatedResponse = await getAllWithDrawalsService(
          currentPage + 1,
          limit,
        );
        setWithdrawalsData(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      let errorMessage = 'Terjadi kesalahan, silakan coba lagi!';
      if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Gagal menolak penarikan reward!',
        text: errorMessage,
      });
    }
  };

  const formattedNumber = (number) => {
    return number.toLocaleString('id-ID');
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

  const handleMessageChange = (id, value) => {
    setAdminMessage((prev) => ({ ...prev, [id]: value }));
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
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
                  Kelola Penarikan
                </h1>
              </div>
            </div>

            <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  Kumpulan Penarikan User
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
                            Alamat
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Metode Penarikan
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Nomor Metode Penarikan
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Jumlah
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Status
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Direquest Pada
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
                      </tr>
                    </thead>

                    {/* Table body */}
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                      {withdrawalsData.length > 0 ? (
                        withdrawalsData.map((withdrawal, index) => (
                          <tr key={withdrawal._id || index}>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {index + 1 + currentPage * limit}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.user?.username}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.user?.alamat}
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
                                {formattedNumber(withdrawal.amount)}
                              </div>
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
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {formattedDate(withdrawal.requestedAt)}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap min-w-96">
                              {withdrawal.rejectedReason === null ||
                              !withdrawal.rejectedReason ? (
                                <div className="text-center">
                                  <textarea
                                    id="message"
                                    rows="4"
                                    value={adminMessage[withdrawal._id] || ''}
                                    onChange={(e) =>
                                      handleMessageChange(
                                        withdrawal._id,
                                        e.target.value,
                                      )
                                    }
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Wajib diisi jika ditolak maupun diterima!"
                                  ></textarea>
                                </div>
                              ) : (
                                <div className="text-center">
                                  {withdrawal.rejectedReason}
                                </div>
                              )}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {withdrawal.validatedAt
                                  ? formattedDate(withdrawal.validatedAt)
                                  : 'Request penarikan belum divalidasi'}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAcceptWithdrawal(withdrawal._id)
                                }
                                disabled={withdrawal.status !== 'pending'}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                              >
                                Terima
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRejectWithdrawal(withdrawal._id)
                                }
                                disabled={withdrawal.status !== 'pending'}
                                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                              >
                                Tolak
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" className="p-2 text-center">
                            Tidak ada data penarikan
                          </td>
                        </tr>
                      )}
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
      {/* <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        imageUrl={selectedImage}
      /> */}
    </div>
  );
};

export default ManageWithdrawalPage;
