import * as VueRouter from 'vue-router'
import qs from 'querystring'
import index from './components/pages/index.vue'
import my from './components/pages/my.vue'
import manageMyVideos from './components/pages/manage-my-videos.vue'
import redirect from './components/pages/redirect.vue'

const routes = [
    { path: '/', component: index },
    { path: '/index', component: index },
    { path: '/my', component: my },
    { path: '/manage-my-videos', component: manageMyVideos },
    { path: '/redirect', component: redirect },
]

const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
router.afterEach((to,from) =>{
    console.log('router.afterEach')
    if(to.path==from.path){
        router.push({path:'/redirect',query:{query:qs.stringify(to.query),path:to.path}})
    }
})
router.beforeEach((to,from) =>{
    console.log('router.beforeEach')
    console.log(from.path + ' to '+ to.path)
    console.log(qs.stringify(from.query) + ' to '+ qs.stringify(to.query))
})

router.reload=function(){
    router.push({path:router.currentRoute.value.path,query:router.currentRoute.value.query})
}
export default router;