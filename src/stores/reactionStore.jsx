import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { reactionApi } from '@/api/reaction';

const ReactionContext = createContext();

export const ReactionProvider = ({ children }) => {
  const [reactionMessages, setReactionMessages] = useState([]);
  const [monthlySummaryMessages, setMonthlySummaryMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchReactionMessages = useCallback(async () => {
    if (loaded) return; // 이미 로드됐으면 스킵
    try {
      const res = await reactionApi.getReactionMessages();
      setReactionMessages(res.data);
      setLoaded(true);
    } catch (error) {
      console.error('Failed to fetch reaction messages:', error);
    }
  }, [loaded]);

  const fetchMonthlySummaryMessages = useCallback(async () => {
    try {
      const res = await reactionApi.getMonthlySummaryMessages();
      setMonthlySummaryMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch monthly summary messages:', error);
    }
  }, []);

  /**
   * 방금 추가된 거래의 카테고리 + 이번 달 누적 횟수를 받아 출력할 메시지 결정
   * @param {number|string} cid - 방금 추가된 거래의 카테고리 ID
   * @param {number} count - 이번 달 해당 카테고리 누적 지출 횟수 (방금 추가된 것 포함)
   * @param {string} categoryName - 카테고리 이름 (fallback 메시지용)
   * @returns {string} 출력할 메시지
   */
  const resolveMessage = useCallback(
    (cid, count, categoryName) => {
      // cid + goal_count 정확히 일치하는 메시지 우선
      const exact = reactionMessages.find(
        (m) => String(m.cid) === String(cid) && Number(m.goal_count) === count,
      );
      if (exact) return exact.message;

      // 없으면 fallback
      return `이번 달 ${categoryName} 소비 ${count}번째예요!`;
    },
    [reactionMessages],
  );

  const value = useMemo(
    () => ({
      reactionMessages,
      fetchReactionMessages,
      monthlySummaryMessages,
      fetchMonthlySummaryMessages,
      resolveMessage,
    }),
    [
      reactionMessages,
      fetchReactionMessages,
      monthlySummaryMessages,
      fetchMonthlySummaryMessages,
      resolveMessage,
    ],
  );

  return (
    <ReactionContext.Provider value={value}>
      {children}
    </ReactionContext.Provider>
  );
};

export const useReactionStore = () => {
  const context = useContext(ReactionContext);
  if (!context) {
    throw new Error('useReactionStore must be used within ReactionProvider');
  }
  return context;
};
