<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <img :src="logo" alt="똑딱 로고" />
    </div>

    <div class="user-profile">
      <img :src="profileIcon" alt="프로필 아이콘" />
      <p class="user-name">{{ userName }}님의 가계부</p>
    </div>

    <div class="user-badge">
      <p>획득한 뱃지</p>
      <div class="badge-grid">
        <div v-for="row in 2" :key="row" class="grid-row">
          <div
            v-for="i in 3"
            :key="i"
            class="badge-item"
            :title="getBadgeTitle(row, i)"
          >
            <span v-if="getBadgeEmoji(row, i)" class="badge-emoji">
              {{ getBadgeEmoji(row, i) }}
            </span>
            <img v-else :src="placeholder" alt="뱃지" />
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        active-class="is-active"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        {{ item.name }}
      </RouterLink>
    </div>

    <div class="add-transaction-btn">
      <RouterLink to="/addTransaction" class="btn" @click="closeAll">
        <img :src="coinIcon" />
        <span class="label">가계부 쓰기</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import logo from '@/assets/icons/logo-signiture.svg';
import profileIcon from '@/assets/icons/profile.svg';
import placeholder from '@/assets/icons/placeholder.svg';
import coinIcon from '@/assets/icons/money.svg';
import { ref, computed, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { useTemplateStore } from '@/stores/template';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const categoryStore = useCategoryStore();
const templateStore = useTemplateStore();

const userName = computed(() => userStore.user?.nickname || '');
const uid = localStorage.getItem('userId') || '1';

const navItems = [
  { name: '대시보드', icon: '📊', path: '/' },
  { name: '거래내역', icon: '📝', path: '/TransactionList' },
  { name: '프로필', icon: '👤', path: '/profile' },
];

const badges = computed(() => {
  const result = Array(6).fill(null);

  const monthlyData = categoryStore.monthlyTopCountCategories;

  monthlyData.slice(0, 6).forEach((data, index) => {
    if (data.category) {
      const [year, month] = data.month.split('-');
      result[index] = {
        emoji: data.category.img,
        title: `${year.slice(-2)}년 ${parseInt(month)}월 지출 빈도가 높은 카테고리: ${data.category.name} (${data.count}회)`,
      };
    }
  });

  return result;
});

const getBadgeIndex = (row, col) => (row - 1) * 3 + (col - 1);
const getBadgeEmoji = (row, col) =>
  badges.value[getBadgeIndex(row, col)]?.emoji ?? null;
const getBadgeTitle = (row, col) =>
  badges.value[getBadgeIndex(row, col)]?.title ?? '';

onMounted(async () => {
  if (!categoryStore.chartData.length) await categoryStore.fetchAll(uid);
  await userStore.fetchUser(uid);
  await templateStore.fetchTemplates(uid);
});
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e5e7eb;
}

/* 로고 */
.sidebar-logo {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;
  padding: 0 24px;
}

/* 프로필 */
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 24px;
}

.user-profile .user-name {
  font-weight: 600;
  font-size: 17px;
}

.user-profile img {
  width: 50px;
}

/* 뱃지 영역만 가운데 */
.user-badge {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
  margin-bottom: 25px;
}

.user-badge p {
  margin-bottom: 13px;
}

.badge-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 5px 5px 5px;
  border-radius: 20px;
  background-color: var(--color-gray-10);
}

.grid-row {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.badge-item {
  width: 40px;
  height: 40px;
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: transform 0.15s ease;
  animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-item:hover {
  transform: scale(1.15);
}

.badge-emoji {
  font-size: 1.8rem;
  line-height: 1;
  transform: translateY(-7px);
}

/* 메뉴 */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--color-deepgray-80);
  font-size: 17px;
}

.nav-item.is-active {
  background-color: var(--color-gray-10);
  font-weight: 500;
}

.nav-icon {
  margin-left: 24px;
}

.add-transaction-btn {
  margin-top: auto;
  padding-top: 24px;
  padding: 0 24px;
}

.add-transaction-btn .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 80%;
  height: 52px;

  border-radius: 20px;
  text-decoration: none;

  background-color: #63f57c;
  color: #1a1a1a;
  font-weight: 700;
}

@keyframes badgePop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
