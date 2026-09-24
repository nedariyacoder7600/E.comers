import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = apiUrl;
axios.interceptors.request.use((config) => {
	if (typeof config.url === 'string' && config.url.startsWith('http://localhost:5000')) {
		config.url = `${apiUrl}${config.url.slice('http://localhost:5000'.length)}`;
	}
	return config;
});
