import api from './index';

export const categoryApi = {
  // 전체 카테고리 조회
  getAll() {
    return api.get('/api/category');
  },

  // 수입 카테고리 조회
  getIncome() {
    return api.get('/api/category/income');
  },

  // 지출 카테고리 조회
  getExpense() {
    return api.get('/api/category/expense');
  },
};
