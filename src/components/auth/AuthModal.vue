<template>
  <BaseModal
    :title="mode === 'login' ? '로그인' : '회원가입'"
    @close="$emit('close')"
  >
    <LoginForm
      v-if="mode === 'login'"
      @switch="mode = 'signup'"
      @success="$emit('close')"
    />
    <SignupForm v-else @switch="mode = 'login'" />
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import SignupForm from '@/components/auth/SignupForm.vue';

const emit = defineEmits(['close']);
const mode = ref('login'); // 'login' | 'signup'
</script>
