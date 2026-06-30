import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 401 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   // 토큰 만료 시 처리 로직 (온보딩 페이지로 리다이렉트)
    //   localStorage.removeItem('token');
    //   window.location.href = '/';
    // }
    return Promise.reject(error);
  },
);

export default api;
