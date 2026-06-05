<template>
  <div class="form">
    <!-- 입력 필드 -->
    <div class="field">
      <label>이메일</label>
      <input
        v-model="form.email"
        type="email"
        placeholder="이메일을 입력해주세요"
        @keyup.enter="handleLogin"
      />
    </div>

    <div class="field">
      <label>비밀번호</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        @keyup.enter="handleLogin"
      />
    </div>

    <!-- 에러 메시지 -->
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <!-- 로그인 버튼 -->
    <button class="btn-primary" :disabled="isLoading" @click="handleLogin">
      {{ isLoading ? '로그인 중...' : '로그인' }}
    </button>

    <!-- 구분선 -->
    <div class="divider"><span>또는</span></div>

    <!-- 카카오 로그인 (4주차 연결 예정) -->
    <button class="btn-kakao" disabled>카카오로 시작하기</button>

    <!-- 회원가입 링크 -->
    <p class="switch-link">
      아직 계정이 없으신가요?
      <span @click="$emit('switch')">회원가입</span>
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const emit = defineEmits(['switch', 'success']);
const router = useRouter();
const userStore = useUserStore();

const form = reactive({ email: '', password: '' });
const errorMsg = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';

  // 간단한 유효성 검사
  if (!form.email || !form.password) {
    errorMsg.value = '이메일과 비밀번호를 입력해주세요.';
    return;
  }

  isLoading.value = true;

  try {
    // TODO: 실제 API 연결
    // const { data } = await api.post('/auth/login', form)
    // userStore.login(data.token)

    // 임시 처리
    console.log('로그인 시도:', form);
    emit('success');
    router.push('/dashboard');
  } catch (e) {
    errorMsg.value =
      e.response?.data?.message || '로그인에 실패했어요. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #555;
}

.field input {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: var(--color-primary, #3bba6b);
}

.error {
  font-size: 0.82rem;
  color: #e53e3e;
  margin: 0;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--color-primary, #3bba6b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-primary:hover {
  opacity: 0.9;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #aaa;
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}

.btn-kakao {
  width: 100%;
  padding: 12px;
  background: #fee500;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-kakao:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.switch-link {
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.switch-link span {
  color: var(--color-primary, #3bba6b);
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}

.switch-link span:hover {
  text-decoration: underline;
}
</style>
