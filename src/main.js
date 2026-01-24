import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { usePageLoading } from './composables/usePageLoading'

const app = createApp(App)

const { setLoading } = usePageLoading()

router.beforeEach((to, from, next) => {
  setLoading(true)
  next()
})

router.afterEach(() => {
  setLoading(false)
})

router.onError(() => setLoading(false))

app.use(router).use(i18n).mount('#app')
