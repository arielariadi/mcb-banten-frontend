import axios from 'axios';
import config from '../api-config/config';

const getAllWithDrawalsService = async (page, limit) => {
  try {
    const response = await axios.get(
      `${config.API_URL}/v1/admin/withdrawal-list?page=${page}&limit=${limit}`,
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

export default getAllWithDrawalsService;
