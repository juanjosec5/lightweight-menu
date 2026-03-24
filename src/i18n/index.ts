import { createI18n } from 'vue-i18n'
import es from './locales/es'
import en from './locales/en'

const savedLang = localStorage.getItem('lwm-lang')
const locale = savedLang === 'en' ? 'en' : 'es'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'es',
  messages: { es, en },
})
