<template>
    <div id="manage-my-videos" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;" >
        
        <div style="width:100%;height:40px;line-height:40px;border-bottom: 1px solid #e8e8e8;box-sizing: border-box;position: relative;">
            <span style="font-size:16px;padding:0 10px;cursor: pointer;display: inline-block;" @click="$router.back()">
                &lt;
            </span>
            <span style="font-size:16px;">管理我的视频</span>
        </div>
        
        <div style="width:100%;height:40px;line-height:40px;box-sizing: border-box;">
            <span style="font-size:16px;display:inline-block;width:50%;line-height:40px;text-align: center;cursor: pointer;" 
                :style="{
                    'background-color':showwho!=1?'#b3b3b3':''
                }" @click="showwho=1">
                视频
            </span>
            <span style="font-size:16px;display:inline-block;width:50%;line-height:40px;text-align: center;cursor: pointer;"
                :style="{
                    'background-color':showwho!=2?'#b3b3b3':''
                }" @click="showwho=2">
                专辑
            </span>
        </div>

        <div v-show="showwho==1" style="width:100%;position:absolute;top:80px;bottom:0;left:0;right:0;">
            <div style="position: absolute;top:0;bottom:40px;width:100%;display: flex;flex-wrap: wrap;overflow: auto;">
                <div :key=item.no v-for="item in videoRows.rows" style="width:200px;height:140px;margin:10px 10px;cursor: pointer;margin:10px;">
                    <img src="../assets/logo.png" draggable="false" style="display:block;width:100%;height:100px;object-fit: cover;"/>
                    <div class="lin1ellipsis" style="font-size: 16px;width:100%;line-height:20px;">
                        啥发撒旦法士大夫阿达放多少
                    </div>
                    <div class="lin1ellipsis" style="font-size: 15px;width:100%;line-height:20px;">
                        专辑1
                    </div>
                </div>
                <div style="width:100%;line-height:40px;font-size: 16px;text-align: center;color:#cccccc;">
                    暂无数据
                </div>
            </div>
            <div style="width:100%;text-align: center;height:40px;line-height: 40px;font-size: 16px;position: absolute;bottom:0;cursor: pointer;
                background-color: rgb(179, 179, 179);">
                创建视频
            </div>
        </div>
        <div v-show="showwho==2" style="width:100%;position:absolute;top:80px;bottom:0;left:0;right:0;">
            <div style="width:100%;text-align: center;height:40px;line-height: 40px;font-size: 16px;position: absolute;bottom:0;cursor: pointer;
                background-color: rgb(179, 179, 179);">
                创建专辑
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'manage-my-videos',
    data() {
        return {
            showwho:1,
            videoRows:{
                rows:[],
                rcount:20,
                selected:null,
                map:{}
            }
        }
    },
    methods:{
        loadMoreVideos(){
            let ts=this
            ts.$axios.post('/mumu/manage-my-videos/get-video-rows',ts.$qs.stringify({
                rstart: ts.videoRows.rows.length+1,
                rcount: ts.videoRows.rcount
            })).then(function (res) {
                ts.videoRows.rows.push(...res.data.data.rows)
            })
        }
    },
    created() {
        let ts = window.ts = this
        ts.loadMoreVideos()
    }
}
</script>

<style>
body {
    background-color: #191919;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@media screen and (min-width: 800px) {
    
}
</style>
