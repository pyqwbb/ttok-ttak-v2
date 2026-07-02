import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { categoryApi } from '../api/categoryApi';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 카테고리 조회
  const getCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 수입 카테고리 조회
  const getIncomeCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getIncome();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 지출 카테고리 조회
  const getExpenseCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getExpense();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      getCategories,
      getIncomeCategories,
      getExpenseCategories,
    }),
    [
      categories,
      loading,
      error,
      getCategories,
      getIncomeCategories,
      getExpenseCategories,
    ],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryStore = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategoryStoreV2 must be used within CategoryProviderV2',
    );
  }
  return context;
};
