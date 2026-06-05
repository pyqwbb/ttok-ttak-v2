<template>
  <div class="bubble-wrap" ref="bubbleWrapRef">
    <!-- 툴팁 -->
    <div
      v-if="tooltip.visible"
      class="bubble-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <span class="tooltip-icon">{{ tooltip.data?.img }}</span>
      <div class="tooltip-body">
        <p class="tooltip-name">{{ tooltip.data?.name }}</p>
        <p class="tooltip-amount">
          {{ tooltip.data?.amount.toLocaleString() }}원
        </p>
        <p class="tooltip-count">{{ expenseCount[tooltip.data?.id] }}회 지출</p>
        <p class="tooltip-ratio">전체의 {{ tooltip.data?.ratio }}%</p>
      </div>
    </div>

    <svg
      :viewBox="`0 0 ${svgSize} ${svgSize}`"
      :width="svgSize"
      :height="svgSize"
      style="display: block; width: 100%; height: auto; overflow: visible"
    >
      <g
        v-for="(bubble, i) in bubbles"
        :key="bubble.id"
        class="bubble-group"
        @mouseenter="(e) => showTooltip(e, bubble)"
        @mousemove="(e) => moveTooltip(e)"
        @mouseleave="hideTooltip"
      >
        <circle
          :cx="bubble.cx"
          :cy="bubble.cy"
          :r="0"
          :fill="bubble.color + 'AA'"
          :stroke="bubble.color"
          stroke-width="1"
          class="bubble-circle"
          :style="{
            animationDelay: `${i * 80}ms`,
            '--target-r': bubble.r + 'px',
          }"
        />
        <text
          :x="bubble.cx"
          :y="bubble.cy"
          text-anchor="middle"
          dominant-baseline="middle"
          :font-size="Math.max(11, Math.round(bubble.r * 0.28))"
          font-weight="500"
          fill="#444"
          class="bubble-label"
          :style="{ animationDelay: `${i * 80 + 300}ms` }"
          style="pointer-events: none"
        >
          {{ bubble.ratio }}%
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  chartData: { type: Array, required: true },
  expenseCount: { type: Object, default: () => ({}) },
});

const bubbleWrapRef = ref(null);
const svgSize = 300;
const bubbles = ref([]);
const tooltip = ref({ visible: false, x: 0, y: 0, data: null });

const showTooltip = (e, bubble) => {
  tooltip.value = { visible: true, x: 0, y: 0, data: bubble };
  moveTooltip(e);
};

const moveTooltip = (e) => {
  const rect = bubbleWrapRef.value?.getBoundingClientRect();
  if (!rect) return;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  tooltip.value.x = x + 140 > rect.width ? x - 145 : x + 12;
  tooltip.value.y = y - 10;
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};

const placeBubbles = (data) => {
  const placed = [];
  for (const d of data) {
    const maxAmount = Math.max(...data.map((x) => x.amount));
    const r = Math.max(
      12,
      Math.round((d.amount / maxAmount) * (svgSize * 0.32)),
    );
    let cx,
      cy,
      attempts = 0;
    do {
      cx = Math.random() * (svgSize - r * 2) + r;
      cy = Math.random() * (svgSize - r * 2) + r;
      attempts++;
    } while (
      attempts < 50 &&
      placed.some((p) => {
        const dist = Math.sqrt((cx - p.cx) ** 2 + (cy - p.cy) ** 2);
        return dist < (r + p.r) * 0.3;
      })
    );
    placed.push({ ...d, cx, cy, r });
  }
  return placed;
};

const refreshBubbles = () => {
  if (props.chartData.length) {
    bubbles.value = placeBubbles(props.chartData);
  }
};

onMounted(async () => {
  await nextTick();
  refreshBubbles();
});

watch(() => props.chartData, refreshBubbles, { deep: true });
</script>

<style scoped>
.bubble-wrap {
  flex: 1;
  min-width: 0;
  position: relative;
  max-width: 40%;
}

.bubble-tooltip {
  position: absolute;
  z-index: 10;
  background: white;
  border: 0.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: tooltipFadeIn 0.15s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-icon {
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 2px;
}
.tooltip-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tooltip-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text, #222);
}
.tooltip-amount {
  font-size: 0.85rem;
  margin: 0;
  color: var(--color-text, #222);
}
.tooltip-count {
  font-size: 0.8rem;
  margin: 0;
  color: #888;
}
.tooltip-ratio {
  font-size: 0.8rem;
  margin: 0;
  color: #888;
}

.bubble-group {
  cursor: pointer;
}
.bubble-group:hover .bubble-circle {
  filter: brightness(1.1);
  stroke-width: 2;
}

@keyframes bubblePop {
  0% {
    r: 0;
    opacity: 0;
  }
  70% {
    r: calc(var(--target-r) * 1.1);
    opacity: 1;
  }
  100% {
    r: var(--target-r);
    opacity: 1;
  }
}

.bubble-circle {
  animation: bubblePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transition:
    filter 0.15s ease,
    stroke-width 0.15s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bubble-label {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}
</style>
