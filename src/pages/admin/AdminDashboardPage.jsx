import { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

import UserGrowthChart from '../../partials/dashboard/UserGrowthChart';

import getAllTasksService from '../../services/general/getAllTasks.service';
import getAllUsersService from '../../services/admin/getAllUsers.service';

const AdminDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getTheNumberOfTasks = async () => {
      try {
        const response = await getAllTasksService();
        setTasks(response.pagination);
      } catch (error) {
        console.log(error);
      }
    };

    getTheNumberOfTasks();
  }, []);

  useEffect(() => {
    const getTheNumberOfUsers = async () => {
      try {
        const response = await getAllUsersService();
        setUsers(response.pagination);
      } catch (error) {
        console.log(error);
      }
    };

    getTheNumberOfUsers();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 lg:flex-row bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <div className="w-full">
                <div className="min-h-60 p-5 border bg-blue-500 dark:border-gray-600 flex flex-col justify-center items-center">
                  <h1 className="text-2xl font-bold text-center">
                    Jumlah User
                  </h1>
                  <div className="flex justify-center items-center">
                    <p className="text-4xl font-bold">{users.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="min-h-60 p-5 border bg-blue-500 dark:border-gray-600 flex flex-col justify-center items-center">
                  <h1 className="text-2xl font-bold text-center">
                    Jumlah Tugas
                  </h1>
                  <div className="flex justify-center items-center">
                    <p className="text-4xl font-bold">{tasks.totalTasks}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <UserGrowthChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
