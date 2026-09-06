import api from './index';

export const transactionApi = {
  // 전체 거래 내역 조회
  getAll() {
    return api.get('/api/budget');
  },

  // 특정 거래 내역 조회
  getOne(id) {
    return api.get(`/api/budget/${id}`);
  },

  // 거래 내역 생성
  create(payload) {
    return api.post('/api/budget', payload);
  },

  // 거래 내역 수정
  update(id, payload) {
    return api.put(`/api/budget/${id}`, payload);
  },

  // 거래 내역 삭제
  delete(id) {
    return api.delete(`/api/budget/${id}`);
  },
};
