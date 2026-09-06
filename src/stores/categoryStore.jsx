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

  const value = useMemo(
    () => ({ categories, loading, error, getCategories }),
    [categories, loading, error, getCategories],
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
    throw new Error('useCategoryStore must be used within CategoryProvider');
  }
  return context;
};
