<template>
    <div id="_ManageVideos_Index" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;" >
        
        <div style="width:100%;height:40px;line-height:40px;border-bottom: 1px solid #e8e8e8;box-sizing: border-box;position: relative;">
            <span style="font-size:16px;padding:0 15px;cursor: pointer;display: inline-block;" @click="$back()">
                &lt;
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
            <div style="position: absolute;top:0;bottom:40px;width:100%;overflow: auto;">
                <div @click="videos.selected=item; $push({path:'./video', query:{no:item.no}})" :key=item.no v-for="item in videos.rows" 
                    style="width:31.3%;height:203px;cursor: pointer;margin:1%;box-sizing: border-box;position: relative;display:inline-block;vertical-align: middle;"
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
                    <div class="line1" style="font-size: 15px;width:100%;line-height:20px;margin-top: 3px;">
                        {{item.name}}
                    </div>
                    <div class="line1" style="font-size: 15px;width:100%;line-height:20px;">
                        {{item.seriesName}}
                    </div>
                </div>
                <div style="width:100%;line-height:40px;font-size: 16px;text-align: center;color:#cccccc;">
                    暂无数据
                </div>
            </div>
            <div @click="createVideo" style="width:100%;text-align: center;height:40px;line-height: 40px;font-size: 16px;position: absolute;bottom:0;cursor: pointer;
                background-color: rgb(179, 179, 179);">
                创建视频
            </div>
        </div>
        <div v-show="showTab=='serieses'" style="width:100%;position:absolute;top:80px;bottom:0;left:0;right:0;">
            <div style="position: absolute;top:0;bottom:40px;width:100%;overflow: auto;">
                <div @click="serieses.selected=item; $push({path:'./series', query:{no:item.no}})" :key=item.no v-for="item in serieses.rows" 
                    style="width:31.3%;height:203px;cursor: pointer;margin:1%;box-sizing: border-box;position: relative;display:inline-block;"
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
                    <div class="line1" style="font-size: 15px;width:100%;line-height:20px;margin-top: 3px;">
                        {{item.name}}
                    </div>
                </div>
                <div style="width:100%;line-height:40px;font-size: 16px;text-align: center;color:#cccccc;">
                    暂无数据
                </div>
            </div>
            <div @click="toCreateSeries=1" style="width:100%;text-align: center;height:40px;line-height: 40px;font-size: 16px;position: absolute;bottom:0;cursor: pointer;
                background-color: rgb(179, 179, 179);">
                创建专辑
            </div>
        </div>
        <div v-if="toCreateVideo" style="position: absolute;top:0;bottom:0;left:0;right:0;background-color: rgba(25, 25, 25, 0.9);">
            <div style="width:100%;height:500px;box-sizing: border-box;background-color: #ffffff;margin-top: 10%;position: relative;">
                <div style="height:40px;line-height:40px;text-align: center;font-size: 16px;">
                    创建视频
                </div>
                <video :src="fileObjectUrl" controls style="height:300px;width:100%;background-color: #000000;"></video>
                <div style="height:40px;line-height:40px;margin-top:15px;">
                    <span class="line1" style="width:20%;font-size: 16px;text-align: center;display:inline-block;padding:0 3px;box-sizing: border-box;">
                        名称
                    </span>
                    <input v-model="fileName" style="display:inline-block;width:80%;padding:0 3px;box-sizing: border-box;font-size: 16px;height:40px;
                        border:1px solid #000000;border-right:0;"/>
                </div>
                <div style="margin-top:25px;position: absolute;bottom:0;width:100%;">
                    <button @click="confirmCreateVideo" style="font-size:16px;width:50%;border:none;box-sizing: border-box;background-color: #838383;height:40px;color:#e8e8e8;">
                        确定
                    </button>
                    <button @click="toCreateVideo=0" style="font-size:16px;width:50%;border:none;box-sizing: border-box;background-color: #d4d4d4;height:40px;">
                        取消
                    </button>
                </div>
            </div>
        </div>

        <div v-if="toCreateSeries" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    创建专辑
                </div>
                <div style="height:40px;margin:10px 0;">
                    <span class="line1" style="display: inline-block;height:40px;line-height: 40px;width:20%;font-size:16px;text-align: center;">
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
                    <button @click="toCreateSeries=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
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
            toCreateSeries:0,
            file:null,
            fileObjectUrl:null,
            fileName:null,
            seriesName:null,
            toCreateVideo:0,
            showTab:'videos',
            videos:{
                rows:[],
                rcount:20,
                selected:null,
                map:{}
            },
            serieses:{
                rows:[],
                rcount:20,
                selected:null,
                map:{}
            }
        }
    },
    methods:{
        loadMoreVideos(){
            let ts = this
            ts.$axios.post('/mumu/manage-my-videos/get-videos',ts.$qs.stringify({
                rstart: ts.videos.rows.length+1,
                rcount: ts.videos.rcount,
                sort:'addTime',
                order:'desc',
            })).then(function (res) {
                let rows = res.data.data.rows;
                ts.videos.rows.push(...rows)
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    ts.videos.map[row.no]=row
                }
            })
        },
        loadMoreSerieses(){
            let ts = this
            ts.$axios.post('/mumu/manage-my-videos/get-serieses',ts.$qs.stringify({
                rstart: ts.serieses.rows.length+1,
                rcount: ts.serieses.rcount,
                sort:'addTime',
                order:'desc',
            })).then(function (res) {
                let rows = res.data.data.rows;
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
                
                ts.toCreateVideo=1
                ts.file=this.files[0]
                ts.fileName=ts.$uu.getPureNameInUrl(ts.file.name)
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
                    ts.$axios.post('/mumu/manage-my-videos/get-series',ts.$qs.stringify({no:no})).then(res=>{
                        ts.serieses.rows.unshift(res.data.data.row)
                    })
                    ts.$dialog.confirm({
                        message: '创建成功, 现在去编辑吗?'
                    }).then(() => {
                        ts.toCreateSeries=0
                        ts.$push({path:'./series',query:{no:no}})
                    }).catch(() => {
                        ts.toCreateSeries=0
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
                        name:ts.fileName,
                        url:res.data.data.url
                    })).then(res=>{
                        if(res.data.code==0){
                            let no = res.data.data.no
                            ts.$axios.post('/mumu/manage-my-videos/get-video',ts.$qs.stringify({no:no})).then(res=>{
                                ts.videos.rows.unshift(res.data.data.row)
                                ts.videos.rows.selected = res.data.data.row
                            })
                            ts.toCreateVideo=0
                            ts.$push({path:'./video',query:{no:no}})
                        }else{
                            ts.$notify({message:res.data.message})
                        }
                    })
                } else {
                    ts.$notify({message:res.data.message})
                }
            })
        }
    },
    activated(){
        
        let ts = this
    },
    created() {
        let ts = this
    },
    mounted() {
        let ts = this
        ts.$store.components[ts.$el.id]=ts
        ts.loadMoreVideos()
        ts.loadMoreSerieses()
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
