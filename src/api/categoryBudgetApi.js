import api from './index';

export const categoryBudgetApi = {
  // 전체 예산 조회
  getAll() {
    return api.get('/api/category-budget');
  },

  // 예산 생성
  create(payload) {
    return api.post('/api/category-budget', payload);
  },

  // 예산 수정
  update(id, payload) {
    return api.put(`/api/category-budget/${id}`, payload);
  },

  // 예산 삭제
  delete(id) {
    return api.delete(`/api/category-budget/${id}`);
  },
};
