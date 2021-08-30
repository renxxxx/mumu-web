<template>
    <div id="index" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #272727;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;" >
        <div style="width:100%;height:125px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;box-sizing: border-box;position: relative;">
            <img :src="$store.login.headimg" draggable="false" style="width:60px;height:60px;margin-left:7px;margin-top:30px;display:block;" />
            <div class="lin1ellipsis" style="font-size: 20px;position:absolute;top:45px;left:90px;color: #dedede;width:150px;">
                {{$store.login.nickname}}
            </div>
        </div>
        <div style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;
            box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;" @click="$router.push('/manage-my-videos')">
            管理我的视频
        </div>
        <div style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;
            box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;">
            绑定手机
        </div>
        <div @click="$store.dologin=1" style="font-size: 20px;width:100%;height:45px;padding:8px 8px;border:1px solid #272727;border-bottom: 1px solid #4a4a4a;
            box-sizing: border-box;position: relative;color:#dedede;cursor: pointer;">
            切换账号
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
                资源
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:50px;line-height:50px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="window.location.replace('./history.html');">
                看过
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:50px;line-height:50px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#ffffff;font-weight:900;"
                @click="$router.replace('/my');">
                我的
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            window:window,
        }
    },
    props: {
        msg: String
    },
    beforeCreate() {
        window.com=this.com=this
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
