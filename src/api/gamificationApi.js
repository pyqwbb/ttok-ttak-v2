import api from './index';

export const gamificationApi = {
  // 뱃지 목록 조회
  getBadges() {
    return api.get('/api/badges');
  },

  // 월간 요약 메시지 조회
  getMonthlySummaryMessages() {
    return api.get('/api/monthly-summary-messages');
  },

  // 반응 메시지 목록 조회
  getReactionMessages() {
    return api.get('/api/reaction-messages');
  },
};
