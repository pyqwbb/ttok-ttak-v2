import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { categoryBudgetApi } from '../api/categoryBudgetApi';

const CategoryBudgetContext = createContext();

export const CategoryBudgetProvider = ({ children }) => {
  const [categoryBudget, setCategoryBudget] = useState([]); // 배열로 초기화
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 예산 조회
  const getCategoryBudget = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryBudgetApi.getAll();
      // 응답이 배열이 아닐 경우를 대비한 방어 코드
      setCategoryBudget(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 예산 생성
  const createCategoryBudget = useCallback(async (payload) => {
    setLoading(true);
    try {
      await categoryBudgetApi.create(payload);
      // 생성 응답 구조를 신뢰하지 않고, 전체 목록을 다시 조회해서 동기화
      const response = await categoryBudgetApi.getAll();
      setCategoryBudget(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 예산 수정
  const updateCategoryBudget = useCallback(async (id, payload) => {
    setLoading(true);
    try {
      await categoryBudgetApi.update(id, payload);
      // 수정 응답 구조도 신뢰하지 않고, 전체 목록을 다시 조회해서 동기화
      const response = await categoryBudgetApi.getAll();
      setCategoryBudget(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 예산 삭제
  const deleteCategoryBudget = useCallback(async (id) => {
    setLoading(true);
    try {
      await categoryBudgetApi.delete(id);
      // delete API 응답을 신뢰하지 않고 로컬에서 직접 제거
      setCategoryBudget((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (b) => String(b.id) !== String(id),
        ),
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      categoryBudget,
      loading,
      error,
      getCategoryBudget,
      createCategoryBudget,
      updateCategoryBudget,
      deleteCategoryBudget,
    }),
    [
      categoryBudget,
      loading,
      error,
      getCategoryBudget,
      createCategoryBudget,
      updateCategoryBudget,
      deleteCategoryBudget,
    ],
  );

  return (
    <CategoryBudgetContext.Provider value={value}>
      {children}
    </CategoryBudgetContext.Provider>
  );
};

export const useCategoryBudgetStore = () => {
  const context = useContext(CategoryBudgetContext);
  if (!context) {
    throw new Error(
      'useCategoryBudgetStore must be used within CategoryBudgetProvider',
    );
  }
  return context;
};
