import axios from 'axios';

const request = axios.create({
  baseURL: '',
  timeout: 10000,
});

request.interceptors.request.use(config => {
  const token = localStorage.getItem('web_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  response => {
    const { data } = response;
    if (data.code !== 200) {
      alert(data.message || '请求失败');
      return Promise.reject(data);
    }
    return data;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('web_token');
      localStorage.removeItem('web_user');
      window.location.href = '/login';
    }
    alert('网络错误，请稍后重试');
    return Promise.reject(error);
  }
);

export default request;
