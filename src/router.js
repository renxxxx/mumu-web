import * as VueRouter from 'vue-router'
import qs from 'querystring'
import _Index from './components/index.vue'
import _My from './components/my.vue'
import _Account from './components/account.vue'
import _ManageVideos_index from './components/manage-videos/index.vue'
import _ManageVideos_video from './components/manage-videos/video.vue'
import _Redirect from './components/redirect.vue'
import uu from './assets/js/uu.js'

const routes = [
    { path: '/', component: _Index },
    { path: '/index', component: _Index },
    { path: '/my', component: _My },
    { path: '/account', component: _Account },
    { path: '/manage-videos/index', component: _ManageVideos_index },
    { path: '/manage-videos/video', component: _ManageVideos_video },
    { path: '/redirect', component: _Redirect },
]

const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
router.afterEach((to,from) =>{
    
    if(to.path==from.path){
        router.push({path:'/redirect',query:{query:qs.stringify(to.query),path:to.path}})
    }
})
router.beforeEach((to,from) =>{
    
    console.log(qs.stringify(from.query) + ' to '+ qs.stringify(to.query))
})

router.reload=function(){
    
    router.push({path:router.currentRoute.value.path,query:router.currentRoute.value.query})
}

export default router;