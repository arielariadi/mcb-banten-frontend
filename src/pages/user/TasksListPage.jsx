import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import Navbar from '../../partials/Navbar';
import TaskModal from '../../components/TaskModal';

import config from '../../services/api-config/config';
import getAllTasksService from '../../services/general/getAllTasks.service';

const TasksListPage = () => {
  const [tasks, setTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 6;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTasksService(currentPage + 1, limit);
        setTasks(response.data);
        console.log(response.data);
        setPageCount(Math.ceil(response.pagination.totalTasks / limit));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
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
                  Daftar Tugas
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <a href="#">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {task.title}
                      </h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {task.description}
                    </p>
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Detail
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
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

            <TaskModal
              task={selectedTask}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default TasksListPage;
