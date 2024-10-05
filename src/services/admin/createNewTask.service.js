import axios from 'axios';
import config from '../api-config/config';

const createNewTaskService = async (data) => {
  try {
    const response = await axios.post(
      `${config.API_URL}/v1/admin/create-task`,
      data,
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

export default createNewTaskService;
