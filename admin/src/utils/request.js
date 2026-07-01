import axios from 'axios';

const request = axios.create({
  baseURL: '',
  timeout: 10000,
});

request.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  response => {
    const { data } = response;
    if (data.code !== 200) {
      return Promise.reject(data);
    }
    return data;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
