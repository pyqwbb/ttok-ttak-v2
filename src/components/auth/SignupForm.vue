<template>
  <div class="form">
    <!-- 닉네임 -->
    <div class="field">
      <label>닉네임</label>
      <input
        v-model="form.nickname"
        type="text"
        placeholder="2~10글자로 입력해주세요"
        maxlength="10"
      />
      <p v-if="errors.nickname" class="error">{{ errors.nickname }}</p>
    </div>

    <!-- 이메일 -->
    <div class="field">
      <label>이메일</label>
      <input
        v-model="form.email"
        type="email"
        placeholder="이메일을 입력해주세요"
      />
      <p v-if="errors.email" class="error">{{ errors.email }}</p>
    </div>

    <!-- 비밀번호 -->
    <div class="field">
      <label>비밀번호</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
      />
    </div>

    <!-- 연령대 -->
    <div class="field">
      <label>연령대</label>
      <select v-model="form.age">
        <option value="" disabled>선택해주세요</option>
        <option v-for="age in ageOptions" :key="age" :value="age">
          {{ age }}
        </option>
      </select>
    </div>

    <!-- 성별 -->
    <div class="field">
      <label>성별</label>
      <div class="radio-group">
        <label v-for="g in genderOptions" :key="g.value" class="radio-item">
          <input type="radio" v-model="form.gender" :value="g.value" />
          {{ g.label }}
        </label>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <!-- 회원가입 버튼 -->
    <button class="btn-primary" :disabled="isLoading" @click="handleSignup">
      {{ isLoading ? '처리 중...' : '회원가입' }}
    </button>

    <!-- 로그인 링크 -->
    <p class="switch-link">
      이미 계정이 있으신가요?
      <span @click="$emit('switch')">로그인</span>
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const emit = defineEmits(['switch']);

const form = reactive({
  nickname: '',
  email: '',
  password: '',
  age: '',
  gender: '',
});

const errors = reactive({ nickname: '', email: '' });
const errorMsg = ref('');
const isLoading = ref(false);

const ageOptions = ['10대', '20대', '30대', '40대', '50대', '60대 이상'];
const genderOptions = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
];

// 유효성 검사
const validate = () => {
  errors.nickname = '';
  errors.email = '';

  if (form.nickname.length < 2 || form.nickname.length > 10) {
    errors.nickname = '닉네임은 2~10글자로 입력해주세요.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = '올바른 이메일 형식이 아니에요.';
  }

  return !errors.nickname && !errors.email;
};

const handleSignup = async () => {
  errorMsg.value = '';

  if (!validate()) return;

  if (!form.password || !form.age || !form.gender) {
    errorMsg.value = '모든 항목을 입력해주세요.';
    return;
  }

  isLoading.value = true;

  try {
    // 2주차에 실제 API 연결 예정
    // await api.post('/auth/signup', form)

    // 임시 처리 (1주차용)
    console.log('회원가입 시도:', form);
    emit('switch'); // 회원가입 성공 → 로그인 폼으로 전환
  } catch (e) {
    errorMsg.value =
      e.response?.data?.message || '회원가입에 실패했어요. 다시 시도해주세요.';
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

.field input,
.field select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
  background: white;
}

.field input:focus,
.field select:focus {
  border-color: var(--color-primary, #3bba6b);
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  cursor: pointer;
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
