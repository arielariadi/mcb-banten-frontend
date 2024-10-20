import axios from 'axios';
import config from '../api-config/config';

const submitTaskService = async (data) => {
  try {
    const response = await axios.post(
      `${config.API_URL}/v1/user/submit-task`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export default submitTaskService;
