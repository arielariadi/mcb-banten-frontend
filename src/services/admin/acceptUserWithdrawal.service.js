import axios from 'axios';
import config from '../api-config/config';

const acceptUserWithdrawalService = async (data) => {
  try {
    const response = await axios.patch(
      `${config.API_URL}/v1/admin/accept-withdrawal`,
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

export default acceptUserWithdrawalService;
