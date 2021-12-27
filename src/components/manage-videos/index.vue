<template>
    <div id="_ManageVideos_Index" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;" >
        
        <div style="width:100%;height:40px;line-height:40px;border-bottom: 1px solid #e8e8e8;box-sizing: border-box;position: relative;">
            <span style="font-size:16px;width:40px;height:40px;text-align: center;cursor: pointer;display: inline-block;" @click="$routerr.back()">
                <template v-if="!$routerr.isFirst()" >
                    &lt;
                </template>
                <template v-else >
                    <img src='../../assets/img/home.png' style="vertical-align: text-bottom;width: 50%;"/>
                </template>
            </span>
            
            <span style="font-size:16px;">管理我的视频</span>
        </div>
        
        <div style="width:100%;height:40px;line-height:40px;box-sizing: border-box;">
            <span style="font-size:16px;display:inline-block;width:50%;line-height:40px;text-align: center;cursor: pointer;" 
                :style="{
                    'background-color':showTab!='videos'?'#b3b3b3':''
                }" @click="showTab='videos'">
                视频
            </span>
            <span style="font-size:16px;display:inline-block;width:50%;line-height:40px;text-align: center;cursor: pointer;"
                :style="{
                    'background-color':showTab!='serieses'?'#b3b3b3':''
                }" @click="showTab='serieses'">
                专辑
            </span>
        </div>

        <div v-show="showTab=='videos'" style="width:100%;position:absolute;top:80px;bottom:0;left:0;right:0;">
            <div ref='videosScroll' @scroll="videosScroll" style="position: absolute;top:0;bottom:40px;width:100%;overflow: auto;">
                <div @click="videos.selected=item; $routerr.push({path:'./video', query:{no:item.no}})" :key=item.no v-for="item,index in videos.rows" 
                    style="width:32.3%;height:160px;cursor: pointer;margin:0.5%;box-sizing: border-box;position: relative;display:inline-block;
                        vertical-align: middle;"
                    :style="{backgroundColor:videos.selected==item?'rgb(214 214 214 / 0.5)':'unset'}">
                    <img :src="item.cover" draggable="false" style="display:block;width:100%;height:160px;object-fit: cover;"/>
                    <div style="height:15px;width:100%;background-color: rgba(255, 255, 255, 0.5);position: absolute;top:145px;">
                        <span style="display: inline-block;">
                            <img src="../../assets/img/comment.png" style="width:15px;vertical-align: middle;" draggable="false"/>
                            <span style="font-size: 12px;vertical-align: middle;margin-left:2px;">
                                {{item.commentCount?item.commentCount:0}}
                            </span>
                        </span>
                        <span style="display: inline-block;margin-left:10px;">
                            <img src="../../assets/img/view.png" style="width:15px;vertical-align: middle;" draggable="false"/>
                            <span style="font-size: 12px;vertical-align: middle;margin-left:2px;">
                                {{item.viewCount?item.viewCount:0}}
                            </span>
                        </span>
                    </div>
                    <div v-if="videos.selected==item" style="position: absolute;top:0;bottom:0;left:0;right:0;background-color: rgb(12 12 12 / 64%);">
                    </div>
                    <div @click.stop="videos.coverSelected=item" v-if="videos.coverSelected!=item" style="position: absolute;top:0;right:0;width:25px;
                        height:25px;line-height: 25px;background-color: #ffffff;text-align: center;">
                        <img src="../../assets/img/more.png" style="width:20px;"/>
                    </div>
                    <div v-if="videos.coverSelected==item" @click.stop="" style="position: absolute;top:0;bottom:0;left:0;right:0;background-color: #ffffffdc;">
                        <div @click="videos.coverSelected=null" style="height:30px;line-height: 30px;border-bottom: 1px solid #838383;text-align: center;font-size: 16px;">
                            关闭
                        </div>
                        <div style="height:30px;line-height: 30px;border-bottom: 1px solid #838383;text-align: center;font-size: 16px;">
                            <span @click="videoMoveLeft(index)" style="display: inline-block;width:50%;border-right: 1px solid #838383;">&lt;</span>
                            <span @click="videoMoveRight(index)" style="display: inline-block;width:50%;">&gt;</span>
                        </div>
                    </div>
                </div>
                <div @click="(!videos.isNoData && !videos.isFullData) ? loadMoreVideos() : ''" style="width:100%;line-height:40px;font-size: 16px;text-align: center;color:#cccccc;">
                    {{videos.isNoData?'暂无数据':videos.isFullData?'已全部加载':'点击加载更多'}}
                </div>
            </div>
            <div @click="createVideo" style="width:100%;text-align: center;height:40px;line-height: 40px;font-size: 16px;position: absolute;bottom:0;cursor: pointer;
                background-color: rgb(179, 179, 179);">
                创建视频
            </div>
        </div>
        <div v-show="showTab=='serieses'" style="width:100%;position:absolute;top:80px;bottom:0;left:0;right:0;">
            <div  ref='seriesesScroll' @scroll="seriesesScroll" style="position: absolute;top:0;bottom:40px;width:100%;overflow: auto;">
                <div @click="serieses.selected=item; $routerr.push({path:'./series-videos', query:{no:item.no}})" :key=item.no v-for="item,index in serieses.rows" 
                    style="width:32.3%;height:203px;cursor: pointer;margin:0.5%;box-sizing: border-box;position: relative;display:inline-block;"
                    :style="{backgroundColor:videos.selected==item?'rgb(214 214 214 / 0.5)':'unset'}">
                    <img :src="item.cover" draggable="false" style="display:block;width:100%;height:160px;object-fit: cover;"/>
                    <div style="height:15px;width:100%;background-color: rgba(255, 255, 255, 0.5);position: absolute;top:145px;">
                        <span style="display: inline-block;">
                            <img src="../../assets/img/comment.png" style="width:15px;vertical-align: middle;" draggable="false"/>
                            <span style="font-size: 12px;vertical-align: middle;margin-left:2px;">
                                {{item.commentCount?item.commentCount:0}}
                            </span>
                        </span>
                        <span style="display: inline-block;margin-left:10px;">
                            <img src="../../assets/img/view.png" style="width:15px;vertical-align: middle;" draggable="false"/>
                            <span style="font-size: 12px;vertical-align: middle;margin-left:2px;">
                                {{item.viewCount?item.viewCount:0}}
                            </span>
                        </span>
                    </div>
                    <div style="font-size: 15px;width:100%;line-height:20px;margin-top: 3px;">
                        {{item.name}}
                    </div>
                    <div v-if="serieses.selected==item" style="position: absolute;top:0;bottom:43px;left:0;right:0;background-color: rgb(12 12 12 / 64%);">
                    </div>
                    <div @click.stop="serieses.coverSelected=item" v-if="serieses.coverSelected!=item" style="position: absolute;top:0;right:0;width:25px;
                        height:25px;line-height: 25px;background-color: #ffffff;text-align: center;">
                        <img src="../../assets/img/more.png" style="width:20px;"/>
                    </div>
                    <div v-if="serieses.coverSelected==item" @click.stop="" style="position: absolute;top:0;bottom:43px;left:0;right:0;
                        background-color: #ffffffdc;">
                        <div @click="serieses.coverSelected=null" style="height:30px;line-height: 30px;border-bottom: 1px solid #838383;
                            text-align: center;font-size: 16px;">
                            关闭
                        </div>
                        <div style="height:30px;line-height: 30px;border-bottom: 1px solid #838383;text-align: center;font-size: 16px;">
                            <span @click="seriesMoveLeft(index)" style="display: inline-block;width:50%;border-right: 1px solid #838383;">&lt;</span>
                            <span @click="seriesMoveRight(index)" style="display: inline-block;width:50%;">&gt;</span>
                        </div>
                    </div>
                </div>
                <div @click="(!serieses.isNoData && !serieses.isFullData) ? loadMoreSerieses() : ''" style="width:100%;line-height:40px;font-size: 16px;text-align: center;color:#cccccc;">
                    {{serieses.isNoData?'暂无数据':serieses.isFullData?'已全部加载':'点击加载更多'}}
                </div>
            </div>
            <div @click="isCreateSeries=1" style="width:100%;text-align: center;height:40px;line-height: 40px;font-size: 16px;position: absolute;bottom:0;cursor: pointer;
                background-color: rgb(179, 179, 179);">
                创建专辑
            </div>
        </div>
        <div v-if="isCreateVideo" style="position: absolute;top:0;bottom:0;left:0;right:0;background-color: rgba(25, 25, 25, 0.9);">
            <div style="width:100%;height:380px;box-sizing: border-box;background-color: #ffffff;margin-top: 10%;position: relative;">
                <div style="height:40px;line-height:40px;text-align: center;font-size: 16px;">
                    创建视频
                </div>
                <video :src="fileObjectUrl" controls style="height:300px;width:100%;background-color: #000000;"></video>
                <div style="margin-top:25px;position: absolute;bottom:0;width:100%;">
                    <button @click="confirmCreateVideo" style="font-size:16px;width:50%;border:none;box-sizing: border-box;background-color: #838383;height:40px;color:#e8e8e8;">
                        确定
                    </button>
                    <button @click="isCreateVideo=0" style="font-size:16px;width:50%;border:none;box-sizing: border-box;background-color: #d4d4d4;height:40px;">
                        取消
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isCreateSeries" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    创建专辑
                </div>
                <div style="height:40px;margin:10px 0;">
                    <span style="display: inline-block;height:40px;line-height: 40px;width:20%;font-size:16px;text-align: center;">
                        名称
                    </span>
                    <input v-model="seriesName" style="display: inline-block;border:1px solid #000000;padding:0 3px;box-sizing: border-box;width:80%;height:40px;font-size:16px;
                        border-right:0;" />
                </div>
                <div style="height:40px;position:absolute;bottom:0;width:100%;">
                    <button @click="createSeries" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="isCreateSeries=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '_ManageVideos_Index',
    data() {
        return {
            file:null,
            fileObjectUrl:null,
            seriesName:null,
            isCreateVideo:0,
            isCreateSeries:0,
            showTab:'videos',//videos serieses
            videos:{
                rows:[],
                rcount:20,
                isNoData:0,
                isFullData:0,
                selected:null,
                coverSelected:null,
                map:{}
            },
            serieses:{
                rows:[],
                rcount:20,
                isNoData:0,
                isFullData:0,
                selected:null,
                coverSelected:null,
                map:{}
            }
        }
    },
    methods:{
        videosScroll(){
            let ts = this
            if(ts.$uu.isScrollBottom(ts.$refs.videosScroll)){
                ts.loadMoreVideos()
            }
        },
        seriesesScroll(){
            let ts = this
            if(ts.$uu.isScrollBottom(ts.$refs.seriesesScroll)){
                ts.loadMoreSerieses()
            }
        },
        seriesMoveLeft(index){
            debugger
            let ts = this
            let left = ts.serieses.rows[index-1]
            let left2 = ts.serieses.rows[index-2]
            let current = ts.serieses.rows[index]
            if(!left)
                return;
            let num = null;
            if(left2){
                num = (left2.num + left.num) / 2
            }else
                num = left.num - 1
            ts.$axios.post('/mumu/manage-my-videos/modify-series',ts.$qs.stringify({
                no: current.no,
                num: num
            })).then(function (res) {
                if(res.data.code == 0){
                    let temp = ts.serieses.rows[index];
                    ts.serieses.rows[index]=ts.serieses.rows[index-1];
                    ts.serieses.rows[index-1] = temp
                }
            })
        },
        seriesMoveRight(index){
            let ts = this
            let right = ts.serieses.rows[index+1]
            let right2 = ts.serieses.rows[index+2]
            let current = ts.serieses.rows[index]
            if(!right)
                return;
            let num = null;
            if(right2){
                num = (right2.num + right.num) / 2
            }else
                num = right.num + 1
            ts.$axios.post('/mumu/manage-my-videos/modify-series',ts.$qs.stringify({
                no: current.no,
                num: num
            })).then(function (res) {
                if(res.data.code == 0){
                    let temp = ts.serieses.rows[index];
                    ts.serieses.rows[index]=ts.serieses.rows[index+1];
                    ts.serieses.rows[index+1] = temp
                }
            })
        },
        videoMoveLeft(index){
            let ts = this
            let left = ts.videos.rows[index-1]
            let left2 = ts.videos.rows[index-2]
            let current = ts.videos.rows[index]
            if(!left)
                return;
            let numInUser = null;
            if(left2){
                numInUser = (left2.numInUser + left.numInUser) / 2
            }else
                numInUser = left.numInUser - 1
            ts.$axios.post('/mumu/manage-my-videos/modify-video',ts.$qs.stringify({
                no: current.no,
                numInUser: numInUser
            })).then(function (res) {
                if(res.data.code == 0){
                    let temp = ts.videos.rows[index];
                    ts.videos.rows[index]=ts.videos.rows[index-1];
                    ts.videos.rows[index-1] = temp
                }
            })
        },
        videoMoveRight(index){
            let ts = this
            let right = ts.videos.rows[index+1]
            let right2 = ts.videos.rows[index+2]
            let current = ts.videos.rows[index]
            if(!right)
                return;
            let numInUser = null;
            if(right2){
                numInUser = (right2.numInUser + right.numInUser) / 2
            }else
                numInUser = right.numInUser + 1
            ts.$axios.post('/mumu/manage-my-videos/modify-video',ts.$qs.stringify({
                no: current.no,
                numInUser: numInUser
            })).then(function (res) {
                if(res.data.code == 0){
                    let temp = ts.videos.rows[index];
                    ts.videos.rows[index]=ts.videos.rows[index+1];
                    ts.videos.rows[index+1] = temp
                }
            })
        },
        loadMoreVideos(){
            let ts = this
            if(ts.videos.isNoData || ts.videos.isFullData)
                return;
            ts.$axios.post('/mumu/manage-my-videos/get-videos',ts.$qs.stringify({
                rstart: ts.videos.rows.length+1,
                rcount: ts.videos.rcount
            })).then(function (res) {
                let rows = res.data.data.rows;
                if(rows.length==0 && ts.videos.rows.length==0)
                    ts.videos.isNoData=1
                if(rows.length==0 && ts.videos.rows.length>0)
                    ts.videos.isFullData=1
                ts.videos.rows.push(...rows)
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    ts.videos.map[row.no]=row
                }
            })
        },
        loadMoreSerieses(){
            let ts = this
            if(ts.serieses.isNoData || ts.serieses.isFullData)
                return;
            ts.$axios.post('/mumu/manage-my-videos/get-serieses',ts.$qs.stringify({
                rstart: ts.serieses.rows.length+1,
                rcount: ts.serieses.rcount,
            })).then(function (res) {
                let rows = res.data.data.rows;
                if(rows.length==0 && ts.serieses.rows.length==0)
                    ts.serieses.isNoData=1
                if(rows.length==0 && ts.serieses.rows.length>0)
                    ts.serieses.isFullData=1
                ts.serieses.rows.push(...rows)
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    ts.serieses.map[row.no]=row
                }
            })
        },
        createVideo(){
            let ts = this
            
            ts.$$('<input type="file"/>').change(function(){
                
                ts.isCreateVideo=1
                ts.file=this.files[0]
                ts.fileObjectUrl=URL.createObjectURL(ts.file)
            }).click()
        },
        createSeries(){
            let ts = this
            
            ts.$axios.post('/mumu/manage-my-videos/create-series', ts.$qs.stringify({
                name:ts.seriesName
            })).then(res=>{
                if(res.data.code==0){
                    let no = res.data.data.no
                    ts.isCreateSeries=0
                    ts.$routerr.push({path:'./series-videos',query:{no:no}})
                    ts.serieses.rows.unshift({
                        no:no,
                        name:ts.seriesName
                    })
                }else{
                    ts.$notify({message:res.data.message})
                }
            })
        },
        confirmCreateVideo(){
            let ts = this
            var formData = new FormData()
            formData.append('file',ts.file)
            ts.$axios.post('/mumu/upload-file', formData, {
                headers:{'Content-Type':'multipart/form-data'}
            }).then(res=>{
                if(res.data.code==0){
                    ts.$axios.post('/mumu/manage-my-videos/create-video', ts.$qs.stringify({
                        url:res.data.data.url
                    })).then(res=>{
                        if(res.data.code==0){
                            let no = res.data.data.no
                            let newRow = {
                                no:no,
                                url:res.data.data.url
                            }
                            ts.videos.rows.unshift(newRow)
                            ts.videos.rows.selected = newRow
                            ts.isCreateVideo=0
                            ts.$routerr.push({path:'./video',query:{no:no}})
                        }else{
                            ts.$notify({message:res.data.message})
                        }
                    })
                } else {
                    ts.$notify({message:res.data.message})
                }
            })
        },
        start(){
            let ts = this
            ts.fullPath = ts.$route.fullPath;
            ts.$store.components[ts.$el.id]=ts
            ts.loadMoreVideos()
            ts.loadMoreSerieses()
        },
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
