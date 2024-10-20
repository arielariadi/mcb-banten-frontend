import axios from 'axios';
import config from '../api-config/config';

const getAllUsersService = async () => {
  try {
    const response = await axios.get(`${config.API_URL}/v1/user/users-list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export default getAllUsersService;
