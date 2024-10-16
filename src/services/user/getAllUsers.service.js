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
    throw new Error(error.response.data.message);
  }
};

export default getAllUsersService;
