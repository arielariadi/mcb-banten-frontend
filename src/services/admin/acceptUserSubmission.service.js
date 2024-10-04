import axios from 'axios';
import config from '../api-config/config';

const acceptUserSubmissionService = async (data) => {
  try {
    console.log('Service received data:', data);
    const response = await axios.patch(
      `${config.API_URL}/v1/admin/accept-submission`,
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

export default acceptUserSubmissionService;
