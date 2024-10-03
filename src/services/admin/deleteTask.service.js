import axios from 'axios';
import config from '../api-config/config';

const deleteTaskService = async (id) => {
  try {
    const response = await axios.delete(
      `${config.API_URL}/v1/admin/delete-task`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        data: { id },
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Error deleting task');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Failed to delete task');
    }
  }
};

export default deleteTaskService;
