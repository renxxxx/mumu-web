import * as VueRouter from 'vue-router'
import qs from 'querystring'
import _Index from './components/index.vue'
import _My from './components/my.vue'
import _Account from './components/account.vue'
import _FavoritedVideos from './components/favorited-videos.vue'
import _ManageVideos_Index from './components/manage-videos/index.vue'
import _ManageVideos_Video from './components/manage-videos/video.vue'
import _ManageVideos_Series from './components/manage-videos/series.vue'
import _ManageVideos_SeriesVideos from './components/manage-videos/series-videos.vue'
import _Redirect from './components/redirect.vue'
import uu from './assets/js/uu.js'

const routes = [
    { path: '/', component: _Index },
    { path: '/index', component: _Index },
    { path: '/my', component: _My },
    { path: '/account', component: _Account },
    { path: '/favorited-videos', component: _FavoritedVideos },
    { path: '/manage-videos/index', component: _ManageVideos_Index },
    { path: '/manage-videos/video', component: _ManageVideos_Video },
    { path: '/manage-videos/series', component: _ManageVideos_Series },
    { path: '/manage-videos/series-videos', component: _ManageVideos_SeriesVideos },
    { path: '/redirect', component: _Redirect },
]

const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
router.afterEach((to,from) =>{
    debugger
    if(to.fullPath==from.fullPath){
        //router.push({path:'/redirect',query:{query:qs.stringify(to.query),path:to.path}})
        router.replace('/redirect?path='+encodeURIComponent(to.fullPath))
    }
})
router.beforeEach((to,from, next) =>{
    debugger
    console.log('to '+to.fullPath)
    if(from.href)
        sessionStorage.setItem(app.config.globalProperties.$project+'-prevRoute',from.href)
    next()
})

router.reload=function(){
    //router.push({path:router.currentRoute.value.path,query:router.currentRoute.value.query})
    router.replace(router.currentRoute.value.fullPath)
}

export default router;