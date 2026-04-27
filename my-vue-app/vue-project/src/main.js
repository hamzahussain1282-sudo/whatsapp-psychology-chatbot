import { createApp } from 'vue'
import App from './App.vue'
import routers from './router/routes'

const app=createApp(App)
app.use(routers)
app.mount('#app')
