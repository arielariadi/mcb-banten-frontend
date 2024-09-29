import axios from 'axios';
import config from '../api-config/config';

const loginService = async data => {
	try {
		const response = await axios.post(`${config.API_URL}/v1/auth/login`, data);

		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message);
	}
};

export default loginService;
