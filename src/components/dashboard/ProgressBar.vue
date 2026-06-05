<template>
  <div class="category-list">
    <div
      v-for="(item, i) in chartData"
      :key="item.id"
      class="category-item"
      :style="{ animationDelay: `${i * 60}ms` }"
    >
      <div class="category-row">
        <span class="category-icon">{{ item.img }}</span>
        <span class="category-name">{{ item.name }}</span>
        <span class="category-amount"
          >{{ item.amount.toLocaleString() }}원</span
        >
      </div>

      <template v-if="item.goalAmount">
        <div class="progress-bar-wrap">
          <div
            class="progress-bar-fill"
            :style="{
              '--fill-width':
                Math.min(
                  Math.round((item.amount / item.goalAmount) * 100),
                  100,
                ) + '%',
              backgroundColor: item.color,
              animationDelay: `${i * 60 + 200}ms`,
            }"
          ></div>
        </div>
        <span class="progress-pct" :style="{ color: item.color }">
          {{
            Math.min(Math.round((item.amount / item.goalAmount) * 100), 100)
          }}%
        </span>
      </template>

      <p v-else class="no-budget">설정된 목표 예산이 없어요</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  chartData: { type: Array, required: true },
});
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.category-list {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  opacity: 0;
  animation: slideIn 0.4s ease forwards;
  margin-bottom: 0.4rem;
}

.category-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.2rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.category-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}
.category-amount {
  font-size: 0.95rem;
  font-weight: 600;
}

.progress-bar-wrap {
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 99px;
  overflow: hidden;
}

@keyframes fillBar {
  from {
    width: 0;
  }
  to {
    width: var(--fill-width);
  }
}

.progress-bar-fill {
  height: 100%;
  border-radius: 99px;
  width: 0;
  animation: fillBar 0.6s ease forwards;
}

.progress-pct {
  font-size: 0.8rem;
  font-weight: 500;
  text-align: right;
}
.no-budget {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0;
}
</style>
