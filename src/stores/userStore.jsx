import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { userApi } from '../api/user';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await userApi.fetchUser(id);
      if (response.status === 200) {
        setUser(response.data);
        setError(null);
      } else {
        setError('유저 조회 실패');
        alert('유저 조회 실패');
      }
    } catch (err) {
      setError(err.message);
      alert('에러발생 :' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await userApi.createUser(userData);
      if (response.status === 200 || response.status === 201) {
        setUser(response.data);
        setError(null);
      } else {
        setError('유저 생성 실패');
        alert('유저 생성 실패');
      }
    } catch (err) {
      setError(err.message);
      alert('에러발생 :' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    try {
      const response = await userApi.updateUser(id, userData);
      if (response.status === 200 || response.status === 204) {
        setUser(response.data);
        setError(null);
      } else {
        setError('유저 수정 실패');
        alert('유저 수정 실패');
      }
    } catch (err) {
      setError(err.message);
      alert('에러발생 :' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await userApi.deleteUser(id);
      if (response.status === 200 || response.status === 204) {
        setUser(null);
        setError(null);
      } else {
        setError('유저 삭제 실패');
        alert('유저 삭제 실패');
      }
    } catch (err) {
      setError(err.message);
      alert('에러발생 :' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      fetchUser,
      createUser,
      updateUser,
      deleteUser,
    }),
    [user, loading, error, fetchUser, createUser, updateUser, deleteUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within UserProvider');
  }
  return context;
};
