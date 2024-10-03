import React, { useEffect, useState } from 'react';
import LineChartUserGrowth from '../../charts/LineChartUserGrowth';
import { tailwindConfig } from '../../utils/Utils';
import GetAllUsersService from '../../services/admin/getAllUsers.service';

function UserGrowthChart() {
  const [chartData, setChartData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await GetAllUsersService();
        const users = response.data;

        const userCountByMonth = {};
        users.forEach((user) => {
          const month = new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
          });
          userCountByMonth[month] = (userCountByMonth[month] || 0) + 1;
        });

        const sortedMonths = Object.keys(userCountByMonth).sort(
          (a, b) => new Date(a) - new Date(b),
        );
        let cumulativeCount = 0;
        const cumulativeCounts = sortedMonths.map((month) => {
          cumulativeCount += userCountByMonth[month];
          return cumulativeCount;
        });

        const oldCount = cumulativeCounts[cumulativeCounts.length - 2] || 0;
        const newCount = cumulativeCounts[cumulativeCounts.length - 1];
        const growth =
          oldCount > 0 ? ((newCount - oldCount) / oldCount) * 100 : 100;

        setTotalUsers(newCount);
        setGrowthPercentage(growth.toFixed(0));

        setChartData({
          labels: sortedMonths,
          datasets: [
            {
              label: 'Total Users',
              data: cumulativeCounts,
              fill: false,
              borderColor: tailwindConfig().theme.colors.violet[500],
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
              pointHoverBackgroundColor:
                tailwindConfig().theme.colors.violet[500],
              pointBorderColor: tailwindConfig().theme.colors.white,
              pointBorderWidth: 2,
              pointHoverBorderWidth: 2,
              clip: 0,
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Pertumbuhan Jumlah User
          </h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Total Users
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">
            +{growthPercentage}%
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:border-r-8">
        {chartData && (
          <LineChartUserGrowth data={chartData} width={389} height={128} />
        )}
      </div>
    </div>
  );
}

export default UserGrowthChart;
