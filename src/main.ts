import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import http from '@/apis'
import {errorHandler,warnHandler} from '@/common/handlers.ts'

const app = createApp(App)
app.config.errorHandler = errorHandler
app.config.warnHandler = warnHandler
app.use(router)
app.use(http)
app.use(store)
app.mount('#app')
