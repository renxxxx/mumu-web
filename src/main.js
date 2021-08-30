import * as vue from 'vue'
import router from './router.js'
import App from './App.vue'
import uu from './assets/js/uu.js'
import axios from 'axios'
import qs from 'querystring'

let store = vue.reactive({
    dologin: 0,
    login: null,
})

var app = vue.createApp(App)
app.config.globalProperties.$uu=uu
app.config.globalProperties.$axios=axios
app.config.globalProperties.$qs=qs
app.config.globalProperties.$tologin=0
app.config.globalProperties.$store=store

app.use(router)
var root = app.mount('#app')
window.app=app;
window.root=root;




