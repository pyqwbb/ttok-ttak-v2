import api from './index';

export const userApi = {
  // 프로필 조회
  fetchUser() {
    return api.get('/api/user');
  },

  // 프로필 수정
  updateUser(userData) {
    return api.patch('/api/user', userData);
  },
};
