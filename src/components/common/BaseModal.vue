<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- 헤더 -->
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <!-- 바디 -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- 푸터  -->
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
});

const emit = defineEmits(['close']);

// ESC 키로 닫기
const handleKeydown = (e) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden'; // 모달 열릴 때 스크롤 방지
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 420px;
  max-width: 90vw;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: modalFadeIn 0.2s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #888;
  padding: 4px;
  line-height: 1;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    max-width: 100%;
    min-height: 50vh;
    border-radius: 20px 20px 0 0;
    position: fixed;
    bottom: 0;
    padding: 24px 20px;
  }

  .modal-overlay {
    align-items: flex-end;
  }
}
</style>
