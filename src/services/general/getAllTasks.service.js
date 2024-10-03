import axios from 'axios';
import config from '../api-config/config';

const getAllTasksService = async (page, limit) => {
  try {
    const response = await axios.get(
      `${config.API_URL}/v1/user/tasks-list?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default getAllTasksService;
