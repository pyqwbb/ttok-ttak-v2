import { create } from 'zustand';
import { reactionApi } from '@/api/reaction';

export const useReactionStore = create((set, get) => ({
  reactionMessages: [],
  monthlySummaryMessages: [],
  loaded: false,

  fetchReactionMessages: async () => {
    if (get().loaded) return;
    try {
      const res = await reactionApi.getReactionMessages();
      set({ reactionMessages: res.data, loaded: true });
    } catch (error) {
      console.error('Failed to fetch reaction messages:', error);
    }
  },

  fetchMonthlySummaryMessages: async () => {
    try {
      const res = await reactionApi.getMonthlySummaryMessages();
      set({ monthlySummaryMessages: res.data });
    } catch (error) {
      console.error('Failed to fetch monthly summary messages:', error);
    }
  },

  resolveMessage: (cid, count, categoryName) => {
    const exact = get().reactionMessages.find(
      (m) => String(m.cid) === String(cid) && Number(m.goal_count) === count,
    );
    if (exact) return exact.message;

    return `이번 달 ${categoryName} 소비 ${count}번째예요!`;
  },
}));
