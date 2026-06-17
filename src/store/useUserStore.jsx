import { create } from 'zustand';
import { userApi } from '../api/user';

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true });
    try {
      const response = await userApi.fetchUser(id);
      if (response.status === 200) {
        set({ user: response.data, error: null });
      } else {
        set({ error: '유저 조회 실패' });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (userData) => {
    set({ loading: true });
    try {
      const response = await userApi.createUser(userData);
      if (response.status === 200 || response.status === 201) {
        set({ user: response.data, error: null });
      } else {
        set({ error: '유저 생성 실패' });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true });
    try {
      const response = await userApi.updateUser(id, userData);
      if (response.status === 200 || response.status === 204) {
        set({ user: response.data, error: null });
      } else {
        set({ error: '유저 수정 실패' });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true });
    try {
      const response = await userApi.deleteUser(id);
      if (response.status === 200 || response.status === 204) {
        set({ user: null, error: null });
      } else {
        set({ error: '유저 삭제 실패' });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
