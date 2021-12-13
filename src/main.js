let project='mumu'
let version='21110219'

import * as vue from 'vue'
import router from './router.js'
import App from './App.vue'
import uu from './assets/js/uu.js'
import v from './assets/js/v.js'
import md5 from './assets/js/md5.js'
import axios from 'axios'
import qs from 'querystring'
import { Dialog, Notify, Loading, Popup, Overlay } from 'vant'
import 'vant/lib/dialog/style';
import 'vant/lib/notify/style';
import 'vant/lib/loading/style';
import m_login from './components/modules/login.vue'
import $$ from 'jquery'
import Vconsole from 'vconsole'

let store = vue.reactive({
    doLogin: 0,
    login : {},
    vconsole:null,
    historys:[],
    components:{},
})

$$.ajaxSetup({
    type:'post',
})

async function loginRefresh(){
    $$.ajax({
        url:'/mumu/is-logined',
        async:false,
        success:function(res){
            if(res.code==0){
            let isLogined =res.data.isLogined
            if(!isLogined){
                $$.ajax({
                    url:'/mumu/anon-login',
                    async:false,
                    success:function(res){
                        if(res.code==0){
                            if(uu.isWeixn()){
                                var redirectUri=encodeURIComponent(location.origin + "/mumu/wx-web-auth")
                                var appId="wx5a33a2ccb2d91764"
                                var state=encodeURIComponent(location.href)
                                var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
                                location.replace(url)
                            }
                        }
                    }
                })
            }
            }
        }
    })
    
    $$.ajax({
        url:'/mumu/login-refresh',
        async:false,
        success:function(res){
        if(res.code==0){
            store.login=res.data
            setTimeout(function(){
                $.post('/mumu/restore-template-wordbooks')
            },2000)
        }
        }
    })
}

loginRefresh().then(res=>{
    var app = vue.createApp(App)
    app.use(router)
    app.use(Dialog)
    app.use(Notify)
    app.use(Loading)
    app.use(Popup)
    app.use(Overlay)
     
    app.component("login", m_login)
    app.config.globalProperties.window=window
    app.config.globalProperties.$project=project
    app.config.globalProperties.$version=version
    app.config.globalProperties.$store=store
    app.config.globalProperties.$uu=uu
    app.config.globalProperties.$v=v
    app.config.globalProperties.$md5=md5
    app.config.globalProperties.o=uu.o
    app.config.globalProperties.$axios=axios
    app.config.globalProperties.$qs=qs
    app.config.globalProperties.$loginRefresh=loginRefresh
    app.config.globalProperties.$$=$$
    // app.config.globalProperties.$vconsole=new Vconsole()
    // app.config.globalProperties.$vconsole.hideSwitch();

    
    app.config.globalProperties.$routerr={}
    app.config.globalProperties.$routerr.push=function(to){
        store.historys.push(to)
        router.push(to)
    };
    app.config.globalProperties.$routerr.replace=function(to){
        store.historys.pop()
        store.historys.push(to)
        router.replace(to)
    };
    app.config.globalProperties.$routerr.back=function(){
        debugger
        if(store.historys.length==0){
            router.replace('/')
        }else{
            router.back()
        }
        store.historys.pop()
    };
    app.config.globalProperties.$routerr.isFirst=function(){
        if(store.historys.length==0){
            return true
        }else{
            return false
        }
    };
    var root = app.mount('#app')
    window.app=app;
    window.root=root;
})








