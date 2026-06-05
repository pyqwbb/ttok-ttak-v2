<template>
  <div class="chart-page">
    <div v-if="store.isLoading" class="loading">로딩중...</div>

    <template v-else>
      <p class="subtitle">카테고리 별 수입/지출</p>
      <h2 class="title">
        {{
          store.topCountCategory
            ? `${store.topCountCategory.img} ${store.topCountCategory.name}에 가장 자주 지출하고 있어요`
            : '이번 달 지출 내역이 없어요'
        }}
      </h2>

      <template v-if="store.chartData.length > 0">
        <div class="content">
          <BubbleChart
            :chartData="store.chartData"
            :expenseCount="store.expenseCountByCategory"
          />
          <CategoryProgressList :chartData="store.chartData" />
        </div>
      </template>

      <div v-else class="empty-state">
        <p class="empty-icon">📭</p>
        <p class="empty-text">이번 달 지출 내역이 없어요</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import BubbleChart from '@/components/dashboard/BubbleChart.vue';
import CategoryProgressList from '@/components/dashboard/ProgressBar.vue';

const store = useCategoryStore();
const userStore = useUserStore();

onMounted(async () => {
  const uid = userStore.user?.id;
  if (uid) await store.fetchAll(uid);
});
</script>

<style scoped>
.chart-page {
  width: 100%;
  padding: 1.5rem 0;
}
.loading {
  text-align: center;
  color: var(--color-deepgray-40, #aaa);
  padding: 3rem;
}
.subtitle {
  font-size: 0.85rem;
  color: var(--color-deepgray-50, #888);
  margin: 0 0 0.3rem;
}
.title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 2rem;
}

.content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}
.empty-icon {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}
.empty-text {
  color: #aaa;
  margin: 0;
}

@media (max-width: 600px) {
  .content {
    flex-direction: column;
  }
}
</style>
