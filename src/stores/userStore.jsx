import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { userApi } from '../api/userApi';
import { authApi } from '../api/authApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 여부
  const isLoggedIn = !!localStorage.getItem('token');

  // 프로필 조회
  const getUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getUser();
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 회원가입
  const signup = useCallback(async (userData) => {
    setLoading(true);
    try {
      await authApi.signup(userData);
      setError(null);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 로그인
  const login = useCallback(
    async (form) => {
      setLoading(true);
      try {
        const res = await authApi.login(form);
        const token = res.data.token;
        localStorage.setItem('token', token);
        setError(null);
        // 토큰 저장 후 유저 정보 불러오기
        await getUser();
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getUser],
  );

  // 로그아웃
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // 프로필 수정
  const updateUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await userApi.updateUser(userData);
      setUser(response.data);
      setError(null);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isLoggedIn,
      getUser,
      signup,
      login,
      logout,
      updateUser,
    }),
    [
      user,
      loading,
      error,
      isLoggedIn,
      getUser,
      signup,
      login,
      logout,
      updateUser,
    ],
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
