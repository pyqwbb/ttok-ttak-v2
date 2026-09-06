import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { transactionApi } from '../api/transactionApi';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 전체 거래 내역 조회
  const getTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transactionApi.getAll();
      setTransactions(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 거래 내역 조회
  const getOneTransaction = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await transactionApi.getOne(id);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 거래 내역 생성
  const createTransaction = useCallback(async (payload) => {
    setLoading(true);
    try {
      await transactionApi.create(payload);
      const response = await transactionApi.getAll();
      setTransactions(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 거래 내역 수정
  const updateTransaction = useCallback(async (id, payload) => {
    setLoading(true);
    try {
      await transactionApi.update(id, payload);
      const response = await transactionApi.getAll();
      setTransactions(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 거래 내역 삭제
  const deleteTransaction = useCallback(async (id) => {
    setLoading(true);
    try {
      await transactionApi.delete(id);

      setTransactions((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (t) => String(t.id) !== String(id),
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
      transactions,
      loading,
      error,
      getTransactions,
      getOneTransaction,
      createTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [
      transactions,
      loading,
      error,
      getTransactions,
      getOneTransaction,
      createTransaction,
      updateTransaction,
      deleteTransaction,
    ],
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionStore = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      'useTransactionStore must be used within TransactionProvider',
    );
  }
  return context;
};
