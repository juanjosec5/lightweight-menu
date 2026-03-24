<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const email = ref('')
const restaurantName = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref<string | null>(null)

const EDGE_FN_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/self-signup'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function submit() {
  if (!email.value.trim() || !restaurantName.value.trim()) return
  loading.value = true
  error.value = null

  // Store restaurant name so onboarding form is pre-filled after magic link
  localStorage.setItem('lwm-pending-restaurant', restaurantName.value.trim())

  try {
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email: email.value.trim(), restaurantName: restaurantName.value.trim() }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Error desconocido')
    sent.value = true
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Algo salió mal. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section id="empieza-gratis" class="signup-section">
    <div class="signup-inner">

      <div v-if="!sent" class="signup-card">
        <div class="signup-badge">{{ t('signup.badge') }}</div>
        <h2 class="signup-headline">{{ t('signup.headline') }}</h2>
        <p class="signup-sub">{{ t('signup.sub') }}</p>

        <form class="signup-form" @submit.prevent="submit">
          <div class="signup-field">
            <label>{{ t('signup.restaurantLabel') }}</label>
            <input
              v-model="restaurantName"
              type="text"
              :placeholder="t('signup.restaurantPlaceholder')"
              required
              autocomplete="organization"
            />
          </div>
          <div class="signup-field">
            <label>{{ t('signup.emailLabel') }}</label>
            <input
              v-model="email"
              type="email"
              :placeholder="t('signup.emailPlaceholder')"
              required
              autocomplete="email"
            />
          </div>
          <p v-if="error" class="signup-error">{{ error }}</p>
          <button type="submit" class="signup-btn" :disabled="loading">
            {{ loading ? t('signup.sending') : t('signup.cta') }}
          </button>
        </form>

        <p class="signup-fine">{{ t('signup.fine') }}</p>
      </div>

      <div v-else class="signup-sent">
        <div class="sent-icon">✓</div>
        <h3>{{ t('signup.sentTitle') }}</h3>
        <p>{{ t('signup.sentSub', { email: email }) }}</p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.signup-section {
  padding: 8rem 1.5rem;
  position: relative;
}

.signup-inner {
  max-width: 520px;
  margin: 0 auto;
}

/* ── Card ─────────────────────────────────────────────────────────── */
.signup-card,
.signup-sent {
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 3rem;
}

/* ── Badge ────────────────────────────────────────────────────────── */
.signup-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(132, 204, 22, 0.1);
  border: 1px solid rgba(132, 204, 22, 0.2);
  color: #84cc16;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 1.5rem;
}

/* ── Headline ─────────────────────────────────────────────────────── */
.signup-headline {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.03em;
  white-space: pre-line;
  margin: 0 0 1rem;
  font-family: "Montserrat", sans-serif;
}

.signup-sub {
  font-size: 1rem;
  font-weight: 300;
  color: #a3a3a3;
  line-height: 1.6;
  margin: 0 0 2rem;
}

/* ── Form ─────────────────────────────────────────────────────────── */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.signup-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.signup-field label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #d4d4d4;
  font-family: "Montserrat", sans-serif;
}

.signup-field input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.signup-field input::placeholder {
  color: #525252;
}

.signup-field input:focus {
  border-color: rgba(132, 204, 22, 0.5);
  background: rgba(132, 204, 22, 0.04);
}

/* ── Error ────────────────────────────────────────────────────────── */
.signup-error {
  font-size: 0.8125rem;
  color: #f87171;
  margin: 0;
  font-weight: 500;
}

/* ── CTA Button ───────────────────────────────────────────────────── */
.signup-btn {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #84cc16;
  color: #052e16;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  transition: filter 0.2s, transform 0.15s;
  box-shadow: 0 0 40px -10px rgba(132, 204, 22, 0.3);
}

.signup-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.signup-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.signup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Fine print ───────────────────────────────────────────────────── */
.signup-fine {
  font-size: 0.75rem;
  font-weight: 300;
  color: #525252;
  text-align: center;
  margin: 1.25rem 0 0;
}

/* ── Success state ────────────────────────────────────────────────── */
.signup-sent {
  text-align: center;
  border-color: rgba(132, 204, 22, 0.2);
}

.sent-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  background: rgba(132, 204, 22, 0.1);
  border: 1px solid rgba(132, 204, 22, 0.3);
  color: #84cc16;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.signup-sent h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem;
  font-family: "Montserrat", sans-serif;
}

.signup-sent p {
  font-size: 0.9375rem;
  font-weight: 300;
  color: #a3a3a3;
  line-height: 1.6;
  margin: 0;
}
</style>
