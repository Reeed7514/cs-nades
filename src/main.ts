import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueKonva from 'vue-konva'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueKonva)
app.use(createPinia())
app.use(router)

app.mount('#app')
