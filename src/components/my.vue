<template>
    <div id="_My" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #272727;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;" >
        <div @click="$store.login ? $routerr.push('/account'):null" style="width:100%;height:125px;border:1px solid #272727;
            border-bottom: 1px solid #4a4a4a;box-sizing: border-box;position: relative;">
            <img :src="($store.login && $store.login.headImg) || require('../assets/img/head.png')" draggable="false" style="width:50px;height:50px;margin-left:8px;
                margin-top:30px;display:block;cursor: pointer;" />
            <div style="font-size: 20px;position:absolute;top:40px;left:70px;color: #dedede;width:150px;">
                <template v-if="$store.login">
                    {{$store.login.nickname}}
                </template>
                <template v-else>
                    <span @click="$store.doLogin=1" style="text-decoration: underline;cursor: pointer;">
                        点击登录
                    </span>
                </template>
            </div>
            <span v-if="$store.login" style="position: absolute;right:10px;top:50%;transform: translateX(-50%);font-size: 16px;color:#cccccc;font-weight: 500;">
                >
            </span>
        </div>
        <div @click="$routerr.push('/manage-videos/index')" v-if="$store.login" style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;
            border-bottom: 1px solid #4a4a4a;box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;">
            管理我的视频
        </div>
        <div @click="showMyLoginCode()" v-if="$store.login" style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;
            box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;" >
            生成登录码
        </div>
        <div @click="debug()" style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;
            box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;" >
            {{$store.vconsole?'关闭调试':'打开调试'}}
        </div>
        <div @click="logout()" v-if="$store.login" style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;
            box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;">
            退出登录
        </div>
        <div style="font-size:0;height:50px;position: absolute;bottom:0;width:100%;border-top: 1px solid #525252;background-color: #272727;">
            <span class="unselectable" style="font-size:18px;display: inline-block;width:25%;height:50px;line-height:50px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="window.location.replace('./discover.html');">
                发现
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:50px;line-height:50px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="window.location.replace('./list.html');">
                收藏
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:50px;line-height:50px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="window.location.replace('./history.html');">
                聊天
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:50px;line-height:50px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#ffffff;font-weight:900;"
                @click="$routerr.replace('/my');">
                我的
            </span>
        </div>

       
    </div>
</template>

<script>
export default {
    name: '_My',
    data() {
        return {
            show:true
        }
    },
    methods:{
        showMyLoginCode(){
            let ts = this
            ts.$axios.post("/mumu/get-login-code")
            .then(res=>{
                if(res.data.code==0){
                    let logincode=res.data.data.logincode
                    ts.$dialog({
                        title:logincode,
                        confirmButtonText:'点击复制',
                        getContainer:'#my'
                    })
                    .then(res=>{
                        ts.$uu.copy({text:logincode,success(res){
                            ts.$notify({ 
                                type: 'success', 
                                message: "复制成功",
                                duration: 1000
                            });
                        }})
                    })
                } else {
                    ts.$notify({ 
                        
                        message: res.data.message,
                        duration: 1000
                    });
                }
            })
        },
        debug(){
            
            let ts = this
            if(ts.$store.vconsole){
                ts.$vconsole.hideSwitch()
                ts.$store.vconsole=0
            }else{
                ts.$vconsole.showSwitch()
                ts.$store.vconsole=1
            }
        },
        logout(){
            let ts = this
            ts.$dialog.confirm({
                message: '确认退出吗?',
            })
            .then(() => {
                ts.$axios.post("/mumu/logout").then(res=>{
                    
                    if(res.data.code==0){
                        ts.$store.login=null
                        ts.$uu.clearAllCookie()
                        localStorage.clear()
                        sessionStorage.clear()
                        ts.$router.reload()
                    }
                })
            })
        },
        start(){
            let ts = this
            ts.$store.components[ts.$el.id]=ts
            ts.fullPath = ts.$route.fullPath;
        }
    },
    activated(){
        debugger
        let ts = this
        ts.prevTs = window.ts
        window.ts = ts
        if(!ts.fullPath || (ts.fullPath && ts.fullPath != ts.$route.fullPath))
            ts.start()
    },
    deactivated(){
        let ts = this
        window.ts = ts.prevTs
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
