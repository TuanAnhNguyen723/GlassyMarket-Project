import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale, t } = useI18n()

  const changeLanguage = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  const toggleLanguage = () => {
    const newLocale = locale.value === 'en' ? 'vi' : 'en'
    changeLanguage(newLocale)
  }

  return {
    locale,
    t,
    changeLanguage,
    toggleLanguage,
  }
}
