import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { gamificationApi } from '@/api/gamificationApi';

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [badges, setBadges] = useState([]);
  const [reactionMessages, setReactionMessages] = useState([]);
  const [monthlySummaryMessages, setMonthlySummaryMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getBadges = useCallback(async () => {
    try {
      const res = await gamificationApi.getBadges();
      setBadges(res.data);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  }, []);

  const fetchReactionMessages = useCallback(async () => {
    if (loaded) return; // 이미 로드됐으면 스킵

    try {
      const res = await gamificationApi.getReactionMessages();
      setReactionMessages(res.data);
      setLoaded(true);
    } catch (error) {
      console.error('Failed to fetch reaction messages:', error);
    }
  }, [loaded]);

  const fetchMonthlySummaryMessages = useCallback(async () => {
    try {
      const res = await gamificationApi.getMonthlySummaryMessages();
      setMonthlySummaryMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch monthly summary messages:', error);
    }
  }, []);

  // 방금 추가된 거래의 카테고리 + 이번 달 누적 횟수를 받아 출력할 메시지
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
      badges,
      getBadges,
      reactionMessages,
      fetchReactionMessages,
      monthlySummaryMessages,
      fetchMonthlySummaryMessages,
      resolveMessage,
    }),
    [
      badges,
      getBadges,
      reactionMessages,
      fetchReactionMessages,
      monthlySummaryMessages,
      fetchMonthlySummaryMessages,
      resolveMessage,
    ],
  );

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationStore = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error(
      'useGamificationStore must be used within GamificationProvider',
    );
  }
  return context;
};
