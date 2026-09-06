import api from './index';

export const authApi = {
  // 회원가입
  signup(userData) {
    return api.post('/api/auth/signup', userData);
  },

  // 로그인
  login(form) {
    return api.post('/api/auth/login', form);
  },
};
