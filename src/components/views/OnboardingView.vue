<template>
  <div class="onboarding">
    <button class="btn-start" @click="showModal = true">시작하기</button>

    <AuthModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AuthModal from '@/components/auth/AuthModal.vue';

const showModal = ref(false);
</script>
