<template>
    <div id="_ManageVideos_Video" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
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
            <span style="font-size:16px;">视频详情</span>
        </div>
     
        <div style="position: absolute;top:40px;bottom:0;left:0;right:0;overflow: auto;">
            <video id="video" :src='video.url' @timeupdate="timeupdate" x5-playsinline playsinline controls360=no webkit-playsinline  controls 
                autoplay style="width:100%;height:200px;background-color: #191919;"></video>
            <div @click="toModifySubtitle=1" style="background-color: #f0f8ff;position: relative;height:110px">
                <div style="font-size: 14px;text-align: center;width:100%;height: 15px;">
                    {{ dddd?currentSubtitleIndex+1:'' }}
                </div>
                <div @click="toModifySubtitleText" class="line2" 
                    style="height:41px;font-size: 18px;width:100%;padding:0 3px;text-align: center;box-sizing: border-box;font-weight: 600;">
                    {{  dddd?currentSubtitle.text:''}}
                </div>
                <div @click="toModifySubtitleTextZh" class="line2" 
                    style="height:40px;font-size: 16px;width:100%;padding:0 3px;text-align: center;box-sizing: border-box;margin-top:5px;">
                    {{  dddd?currentSubtitle.textZh:''}}
                </div>
                <div v-if="toModifySubtitle==0" style="position: absolute;top:0;bottom:0;right:0;left:0;">

                </div>
            </div>

            <div v-if="toModifySubtitle" style="position: absolute;top:315px;bottom:0;left:0;right:0;background-color: #ffffff;">
                <div style="position: absolute;top:0;bottom:40px;left:0;right:0;overflow: auto;">
                    <div style="height:35px;padding:0 3px;">
                        <div style="height:35px;width:30%;border: 1px solid #cccccc;display:inline-block;">
                            <span @click="subStart" style="font-size: 16px;width:20%;display: inline-block;line-height:35px;text-align: center;">
                                &lt;
                            </span>
                            <span @click="setStart" style="font-size: 16px;width:60%;display: inline-block;line-height:35px;text-align: center;
                                border: 1px solid #cccccc;border-width:0 1px;">
                                {{ currentSubtitle && currentSubtitle!=null ?(currentSubtitle.start/1000).toFixed(2):'' }}
                            </span>
                            <span @click="addStart" style="font-size: 16px;width:20%;display: inline-block;line-height:35px;text-align: center;">
                                &gt;
                            </span>
                        </div>

                        <div style="height:35px;width:30%;border: 1px solid #cccccc;display:inline-block;margin:0 5%;">
                            <span @click="leftMove" style="font-size: 16px;width:20%;display: inline-block;line-height:35px;text-align: center;">
                                &lt;
                            </span>
                            <span style="font-size: 16px;width:60%;display: inline-block;line-height:35px;text-align: center;
                                border: 1px solid #cccccc;border-width:0 1px;color:#ff6f09;">
                                {{ videoDom_currentTime.toFixed(2) }}
                            </span>
                            <span @click="rightMove" style="font-size: 16px;width:20%;display: inline-block;line-height:35px;text-align: center;">
                                &gt;
                            </span>
                        </div>

                        <div style="height:35px;width:30%;border: 1px solid #cccccc;display:inline-block;">
                            <span @click="subEnd" style="font-size: 16px;width:20%;display: inline-block;line-height:35px;text-align: center;">
                                &lt;
                            </span>
                            <span @click="setEnd" style="font-size: 16px;width:60%;display: inline-block;line-height:35px;text-align: center;
                                border: 1px solid #cccccc;border-width:0 1px;">
                                {{ currentSubtitle && currentSubtitle.end!=null?(currentSubtitle.end/1000).toFixed(2):'' }}
                            </span>
                            <span @click="addEnd" style="font-size: 16px;width:20%;display: inline-block;line-height:35px;text-align: center;">
                                &gt;
                            </span>
                        </div>
                    </div>

                    
                    <div style="height:40px;line-height:40px;text-align: center;margin-top:10px;">
                        <span @click="prevSubtitle" style="display: inline-block;font-size:16px;width:33%;border:1px solid #cccccc;border-left: none;height:100%;">
                            上一句
                        </span>
                        <span @click="videoDom.play()" v-show="videoDom.paused" style="display: inline-block;font-size:16px;width:34%;border:1px solid #cccccc;border-left: none;height:100%;">
                            播放
                        </span>
                        <span @click="videoDom.pause()" v-show="!videoDom.paused" style="display: inline-block;font-size:16px;width:34%;border:1px solid #cccccc;border-left: none;height:100%;">
                            暂停
                        </span>
                        <span @click="nextSubtitle" style="display: inline-block;font-size:16px;width:33%;border:1px solid #cccccc;border-left: none;height:100%;">
                            下一句
                        </span>
                    </div>
                    <div style="height:35px;line-height:35px;text-align: center;border-bottom:1px solid #cccccc;">
                        <span @click="toCreateSubtitle" style="display: inline-block;font-size:16px;width:50%;border-right:1px solid #cccccc;height:100%;">
                            创建字幕
                        </span>
                        <span @click="toSplitSubtitle" style="display: inline-block;font-size:16px;width:50%;border:none;height:100%;">
                            拆分字幕
                        </span>
                    </div>
                    <div style="height:35px;line-height:35px;text-align: center;border-bottom:1px solid #cccccc;">
                        <span @click="deleteCurrentSubtitle" style="display: inline-block;font-size:16px;width:50%;border-right:1px solid #cccccc;height:100%;">
                            删除本条
                        </span>
                        <span @click="deleteAllSubtitles" style="display: inline-block;font-size:16px;width:50%;border:none;height:100%;">
                            删除所有字幕
                        </span>
                    </div>
                </div>

                <div @click="toModifySubtitle=0" style="position: absolute;bottom:0;width:100%;line-height:40px;height:40px;text-align: center;font-size: 16px;
                    background-color: #cccccc;">
                    返回详情
                </div>
            </div>

            <div v-if="!toModifySubtitle">
                <div style="height:40px;line-height: 40px;margin-top:5px;">
                    <span style="width:20%;text-align: center;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        标题
                    </span>
                    <span style="width:73%;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        {{video.name}}
                    </span>
                    <span @click="newName=video.name;toModifyName=1" style="width:7%;text-align: center;display: inline-block;box-sizing: border-box;
                        font-size: 16px;cursor: pointer;">
                        >
                    </span>
                </div>
                <div style="height:40px;line-height: 40px;">
                    <span style="width:20%;text-align: center;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        封面
                    </span>
                    <span style="width:73%;display: inline-block;box-sizing: border-box;padding:0 3px;">
                        <img v-if="video.cover" :src="video.cover" style="width:40px;height:40px;"/>
                    </span>
                    <span @click="newCover=video.cover;toModifyCover=1;" style="width:7%;text-align: center;display: inline-block;box-sizing: border-box;
                        font-size: 16px;cursor: pointer;">
                        >
                    </span>
                </div>
                <div style="height:40px;line-height: 40px;">
                    <span style="width:20%;text-align: center;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        大小
                    </span>
                    <span style="width:80%;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        {{video.size}}
                    </span>
                </div>
                <div style="height:40px;line-height: 40px;">
                    <span style="width:20%;text-align: center;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        审核
                    </span>
                    <span style="width:80%;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        {{(video.audit=='pass'?'通过':video.audit=='ing'?'审核中':video.audit=='unpass'?'未通过':'未审核')}}
                    </span>
                </div>
                <div v-if='video.auditMessage' style="height:40px;line-height: 40px;">
                    <span style="width:20%;text-align: center;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                    </span>
                    <span style="width:80%;display: inline-block;box-sizing: border-box;padding:0 3px;font-size: 16px;">
                        {{video.auditMessage}}
                    </span>
                </div>
                
                <div style="margin-top:20px;justify-content:flex-start;display: flex;flex-wrap:wrap;">
                    <button v-if="video.audit=='unpass' || !video.audit" @click="submitVideoAudit" style="font-size:16px;width:100px;height:35px;background-color: #838383;
                        border: none;margin-right:10px">
                        提交审核
                    </button>
                    <button v-if="video.audit=='pass'" @click="parseVideo" style="font-size:16px;width:100px;height:35px;background-color: #838383;
                        border: none;margin-right:10px">
                        解析视频
                    </button>
                    <button @click="deleteVideo" style="font-size:16px;width:100px;height:35px;background-color: #838383;
                        border: none;margin-right:10px">
                        删除
                    </button>
                </div>
            </div>
        </div>
        

        


        <div v-if="toModifyName" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    修改标题
                </div>
                <div style="height:40px;margin:10px 0;">
                    <span style="display: inline-block;height:40px;line-height: 40px;width:20%;font-size:16px;text-align: center;">
                        标题
                    </span>
                    <input v-model="newName" style="display: inline-block;border:1px solid #000000;padding:0 3px;box-sizing: border-box;width:80%;height:40px;font-size:16px;
                        border-right:0;" />
                </div>
                <div style="height:40px;position:absolute;bottom:0;width:100%;">
                    <button @click="modifyName" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="toModifyName=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>


        <div v-if="toModifyCover" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    修改封面
                </div>
                <div style="height:40px;margin:10px 0;">
                    <span style="display: inline-block;height:40px;line-height: 40px;width:20%;font-size:16px;text-align: center;">
                        封面
                    </span>
                    <span v-if="!newCover" @click="chooseNewCover" style="font-size:16px;display:inline-block;width:40px;vertical-align: middle;height:40px;line-height: 40px;
                        cursor: pointer;border: 1px dashed #838383;text-align: center;box-sizing: border-box;">
                        +
                    </span>
                    <img v-if="newCover"  :src="newCover" style="width:40px;height:40px;display:inline-block;vertical-align: middle;cursor: pointer;"/>
                    <span v-if="newCover" @click="deleteCover" style="font-size:16px;display:inline-block;padding:0 5px;vertical-align: middle;height:40px;line-height: 40px;
                        cursor: pointer;">
                        X
                    </span>
                </div>
                <div style="height:40px;position:absolute;bottom:0;width:100%;">
                    <button @click="modifyCover" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="toModifyCover=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>


        <div v-if="isModifySubtitleText" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    修改字幕
                </div>
                <textarea v-model="newSubtitleText"  style="display: inline-block;border:1px solid #000000;padding:0 3px;box-sizing: border-box;
                    width:100%;font-size:16px;border-width:1px 0;height:100px;resize: none;text-align: center;">
                </textarea>
                <div style="height:20px;"></div>
                <div style="height:40px;position:absolute;bottom:0;width:100%;">
                    <button @click="modifySubtitleText" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="isModifySubtitleText=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>


        <div v-if="isModifySubtitleTextZh" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    修改字幕
                </div>
                <textarea v-model="newSubtitleTextZh"  style="display: inline-block;border:1px solid #000000;padding:0 3px;box-sizing: border-box;
                    width:100%;font-size:16px;border-width:1px 0;height:100px;resize: none;text-align: center;">
                </textarea>
                <div style="height:20px;"></div>
                <div style="height:40px;position:absolute;bottom:0;width:100%;">
                    <button @click="modifySubtitleTextZh" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="isModifySubtitleTextZh=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isCreateSubtitle" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="background-color: #ffffff;width:100%;max-height:80%;position: absolute;top:40%;transform: translateY(-50%);padding:0 0 40px 0;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    创建字幕
                </div>
                <textarea v-model="newSubtitleText"  style="display: inline-block;border:1px solid #000000;padding:0 3px;
                    width:100%;height:40px;font-size:16px;border-width:1px 0;height:100px;resize: none;text-align: center;padding:5px;">
                </textarea>
                <div style="height:20px;"></div>
                <div style="height:40px;position:absolute;bottom:0;width:100%;">
                    <button @click="createSubtitle" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="isCreateSubtitle=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
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
    name: '_ManageVideos_Video',
    data() {
        return {
            fullPath:null,
            query:{},
            video:{},
            toModifyName:0,
            toModifyCover:0,
            newName:null,
            newCover:null,
            newCoverFile:null,
            toModifySubtitle:0,
            subtitles:[],
            currentSubtitle:null,
            currentSubtitleIndex:-1,
            videoDom:null,
            videoDom_currentTime:0,
            isModifySubtitleText:0,
            isModifySubtitleTextZh:0,
            newSubtitleText:null,
            newSubtitleTextZh:null,
            isCreateSubtitle:0,
            isCreatePrevSubtitle:0,
            isCreateNextSubtitle:0,
            newPrevSubtitleText:null,
            newNextSubtitleText:null
        }
    },
    computed: {
        // 计算属性的 getter
        dddd: function(){
            let ts = this
            if(!ts.currentSubtitle)
                return false;
            let currentTime = ts.videoDom_currentTime * 1000
            if(currentTime >= ts.currentSubtitle.start && currentTime <= ts.currentSubtitle.end){
                return true
            }
            return false
        }
    },
    methods:{
        toModifySubtitleText(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.isModifySubtitleText=1;
            ts.newSubtitleText=ts.currentSubtitle.text;
            ts.videoDom.pause()
        },
        toModifySubtitleTextZh(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.isModifySubtitleTextZh=1;
            ts.newSubtitleTextZh=ts.currentSubtitle.textZh;
            ts.videoDom.pause()
        },
        toSplitSubtitle(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            ts.$dialog.confirm({
                message: '确认拆分当前字幕吗?\n'+ts.currentSubtitle.text+'\n拆分将复制当前字幕, 插入到下一条, 平分时长.',
            }).then(() => {
                var prev = ts.subtitles[ts.currentSubtitleIndex+1]
                var currentSubtitle = {
                    id : ts.currentSubtitle.id,
                    text : ts.currentSubtitle.text,
                    textZh : ts.currentSubtitle.textZh,
                    start : ts.currentSubtitle.start,
                    end : (ts.currentSubtitle.start +ts.currentSubtitle.end)/2,
                    num : ts.currentSubtitle.num,
                }
                var newSubtitle = {
                    videoNo : ts.query.no,
                    text : ts.currentSubtitle.text,
                    textZh : ts.currentSubtitle.textZh,
                    start : (ts.currentSubtitle.start +ts.currentSubtitle.end)/2,
                    end : ts.currentSubtitle.end,
                    num : prev ? (prev.num+ts.currentSubtitle.num)/2 : (ts.currentSubtitle.num + 1)
                }

                ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify(currentSubtitle)).then(res=>{
                    if(res.data.code == 0){
                        ts.subtitles.splice(ts.currentSubtitleIndex,1,currentSubtitle)
                        ts.currentSubtitle=currentSubtitle
                    }
                })
                ts.$axios.post('/mumu/manage-my-videos/create-subtitle',ts.$qs.stringify(newSubtitle)).then(res=>{
                    if(res.data.code == 0){
                        newSubtitle.id=res.data.data.id
                        ts.subtitles.splice(ts.currentSubtitleIndex+1,0,newSubtitle)
                    }
                })
            })
        },
        deleteCurrentSubtitle(){
            let ts = this
            ts.videoDom.pause()
            ts.$dialog.confirm({
                message: '确认删除当前字幕吗?\n'+ts.currentSubtitle.text+'\n如误删可以重新解析视频.',
            })
            .then(() => {
                ts.$axios.post("/mumu/manage-my-videos/delete-subtitle",ts.$qs.stringify({id:ts.currentSubtitle.id})).then(res=>{
                    if(res.data.code==0){
                        ts.currentSubtitle=null
                        ts.subtitles.splice(ts.currentSubtitleIndex,1)
                    }
                })
            })
        },
        deleteAllSubtitles(){
            let ts = this
            ts.videoDom.pause()
            ts.$dialog.confirm({
                message: '确认删除所有字幕吗?\n如误删可以重新解析视频.',
            })
            .then(() => {
                ts.$axios.post("/mumu/manage-my-videos/delete-all-subtitles",ts.$qs.stringify({videoNo:ts.query.no})).then(res=>{
                    if(res.data.code==0){
                        ts.currentSubtitle=null
                        ts.currentSubtitleIndex=-1
                        ts.subtitles.splice(0,ts.subtitles.length)
                    }
                })
            })
        },
        toCreateSubtitle(){
            let ts = this
            ts.isCreateSubtitle=1
            ts.videoDom.pause()
            ts.newSubtitleText=ts.currentSubtitle ? ts.currentSubtitle.text : ''
        },
        createSubtitle(){
            let ts = this
            let newSubtitle = {
                videoNo:ts.query.no,
                text:ts.newSubtitleText,
                textZh:ts.newSubtitleTextZh,
                start:null,
                end:null,
                num:null
            }
            var nextSubtitle = ts.subtitles[ts.currentSubtitleIndex+1]
            var currentSubtitle = ts.subtitles[ts.currentSubtitleIndex]
            if(currentSubtitle){
                newSubtitle.start=currentSubtitle.end
            }else{
                newSubtitle.start=0
            }

            if(nextSubtitle){
                newSubtitle.end=nextSubtitle.start
            }else{
                newSubtitle.end=ts.videoDom.duration*1000
            }

            if(!ts.currentSubtitle && nextSubtitle){
                newSubtitle.num=nextSubtitle.num-1
            }else if(ts.currentSubtitle && !nextSubtitle){
                newSubtitle.num=ts.currentSubtitle.num+1
            }else if(!ts.currentSubtitle && !nextSubtitle){
                newSubtitle.num=1
            }else if(ts.currentSubtitle && nextSubtitle){
                newSubtitle.num=(ts.currentSubtitle.num+nextSubtitle.num)/2
            }

            ts.$axios.post('/mumu/manage-my-videos/create-subtitle',ts.$qs.stringify(newSubtitle)).then(res=>{
                if(res.data.code == 0){
                    newSubtitle.id=res.data.data.id
                    ts.currentSubtitle=newSubtitle
                    ts.subtitles.splice(ts.currentSubtitleIndex+1,0,newSubtitle)
                    ts.isCreateSubtitle=0
                    ts.videoDom_currentTime=ts.videoDom.currentTime=newSubtitle.start/1000
                    ts.currentSubtitleIndex++;

                    ts.$axios.post('/mumu/translate',ts.$qs.stringify({
                        q:newSubtitle.text,
                        from:1,
                        to:2
                    })).then(res=>{
                        if(res.data.code == 0){
                            ts.currentSubtitle.textZh=res.data.data.translation
                        }
                    })
                }
            })
        },
        leftMove(){
            let ts = this
            ts.videoDom.pause()
            ts.videoDom_currentTime=ts.videoDom.currentTime=ts.videoDom.currentTime-0.05
        },
        rightMove(){
            let ts = this
            ts.videoDom.pause()
            ts.videoDom_currentTime=ts.videoDom.currentTime=ts.videoDom.currentTime+0.05
        },
        subStart(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            let finalStart = ts.currentSubtitle.start-50
            let prev = ts.subtitles[ts.currentSubtitleIndex-1]
            if(prev){
                if(finalStart < prev.end)
                    finalStart = prev.end
            }
            if(finalStart<0)
                finalStart=0
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                start:finalStart
            })).then(res=>{
                if(res.data.code == 0){
                    ts.currentSubtitle.start=finalStart
                }
            })
        },
        addStart(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            let finalStart = ts.currentSubtitle.start+50
            if(finalStart > ts.currentSubtitle.end)
                finalStart=ts.currentSubtitle.end
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                start:finalStart
            })).then(res=>{
                if(res.data.code == 0){
                    ts.currentSubtitle.start=finalStart
                }
            })
        },
        subEnd(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            let finalEnd = ts.currentSubtitle.end-50
            if(finalEnd < ts.currentSubtitle.start)
                finalEnd=ts.currentSubtitle.start
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                end:finalEnd
            })).then(res=>{
                if(res.data.code == 0){
                    ts.currentSubtitle.end=finalEnd
                }
            })
        },
        addEnd(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            let finalEnd = ts.currentSubtitle.end+50
            let next = ts.subtitles[ts.currentSubtitleIndex+1]
            if(next){
                if(finalEnd > next.start)
                    finalEnd = next.start
            }
            if(finalEnd>ts.videoDom.duration*1000)
                finalEnd=ts.videoDom.duration*1000
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                end:finalEnd
            })).then(res=>{
                if(res.data.code == 0){
                    ts.currentSubtitle.end=finalEnd
                }
            })
        },
        setStart(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            let start = ts.videoDom.currentTime*1000;
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                start:start
            })).then(res=>{
                if(res.data.code == 0){
                    ts.currentSubtitle.start=start
                }
            })
        },
        setEnd(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            ts.videoDom.pause()
            let end = ts.videoDom.currentTime*1000;
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                end:end
            })).then(res=>{
                if(res.data.code == 0){
                    ts.currentSubtitle.end=end
                }
            })
        },
        modifySubtitleText(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            if(ts.currentSubtitle.text==ts.newSubtitleText){
                ts.$notify({type:'success',message:'无修改'})
                ts.isModifySubtitleText=0
                return;
            }
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                text:ts.newSubtitleText
            })).then(res=>{
                if(res.data.code == 0){
                    ts.$notify({type:'success',message:"已修改"})
                    ts.currentSubtitle.text=ts.newSubtitleText
                    ts.isModifySubtitleText=0
                }else{
                    ts.$notify({message:res.data.message})
                }
            })
        },
        modifySubtitleTextZh(){
            let ts = this
            if(!ts.currentSubtitle)
                return;
            if(ts.currentSubtitle.textZh==ts.newSubtitleTextZh){
                ts.$notify({type:'success',message:'无修改'})
                ts.isModifySubtitleTextZh=0
                return;
            }
            ts.$axios.post('/mumu/manage-my-videos/modify-subtitle',ts.$qs.stringify({
                id:ts.currentSubtitle.id,
                textZh:ts.newSubtitleTextZh
            })).then(res=>{
                if(res.data.code == 0){
                    ts.$notify({type:'success',message:"已修改"})
                    ts.currentSubtitle.textZh=ts.newSubtitleTextZh
                    ts.isModifySubtitleTextZh=0
                }else{
                    ts.$notify({message:res.data.message})
                }
            })

        },
        prevSubtitle(){
            let ts = this
            ts.videoDom.pause()
            let prev = null;
            if(ts.currentSubtitle){
                prev = ts.subtitles[ts.currentSubtitleIndex-1]
                if(prev){
                    ts.currentSubtitle=prev
                    ts.currentSubtitleIndex--;
                    ts.videoDom.currentTime=ts.currentSubtitle.start/1000
                }
            }else{
                prev = ts.subtitles[ts.currentSubtitleIndex]
                if(prev){
                    ts.currentSubtitle=prev
                    ts.videoDom.currentTime=ts.currentSubtitle.start/1000
                }
            }
            
        },
        nextSubtitle(){
            let ts = this
            ts.videoDom.pause()
            let next = ts.subtitles[ts.currentSubtitleIndex+1]
            if(next){
                ts.currentSubtitle=next
                ts.currentSubtitleIndex++;
                ts.videoDom.currentTime=ts.currentSubtitle.start/1000
            }
        },
        deleteCover(){
            let ts = this
            ts.newCover=null;
            ts.newCoverFile=null;
        },
        async parseVideo(){
            let ts = this
            await ts.$axios.post('/mumu/manage-my-videos/parse-video', ts.$qs.stringify({
                no:ts.query.no
            })).then(res=>{
                if(res.data.code==0){
                    ts.$notify({type:'success',message:'解析完成'})
                }else{
                    ts.$notify({message:res.data.message})
                }
            })

            await ts.$axios.post('/mumu/manage-my-videos/get-subtitles', ts.$qs.stringify({
                videoNo:ts.query.no
            })).then(res=>{
                if(res.data.code==0){
                    ts.subtitles=res.data.data.rows
                }
            })
        },
        async modifyCover(){
            
            let ts = this
            if(ts.video.cover==ts.newCover){
                ts.$notify({type:'success',message:'无修改'})
                ts.toModifyCover=0
                return;
            }
                
            if(ts.newCoverFile){
                var formData = new FormData()
                formData.append('file',ts.newCoverFile)
                await ts.$axios.post('/mumu/upload-file', formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(res=>{
                    if(res.data.code==0){
                        ts.newCover = res.data.data.url
                    } else {
                        ts.$notify({message:res.data.message})
                    }
                })
            }
            await ts.$axios.post('/mumu/manage-my-videos/modify-video', ts.$qs.stringify({
                cover: ts.newCover,
                no:ts.query.no
            })).then(res=>{
                if(res.data.code==0){
                    ts.$notify({type:'success',message:'已修改'})
                    ts.video.cover=ts.newCover
                    ts.toModifyCover=0
                    
                    let _ManageVideos_Index = ts.$store.components['_ManageVideos_Index'];
                    let videos = _ManageVideos_Index.videos;
                    videos.selected.cover=ts.newCover
                }else{
                    ts.$notify({message:res.data.message})
                }
            })
        },
        chooseNewCover(){
            let ts = this
            ts.$$('<input type="file"/>').change(function(){
                
                ts.toCreateVideo=1
                let file=this.files[0]
                ts.newCoverFile=file
                ts.newCover=URL.createObjectURL(file)
            }).click()
        },
        modifyName(){
            let ts = this
            if(ts.video.name==ts.newName){
                ts.$notify({type:'success',message:'无修改'})
                ts.toModifyName=0
                return;
            }
            ts.$axios.post('/mumu/manage-my-videos/modify-video',ts.$qs.stringify({
                no:ts.query.no,
                name:ts.newName
            })).then(res=>{
                
                if(res.data.code == 0){
                    ts.$notify({type:'success',message:"已修改"})
                    ts.video.name=ts.newName
                    ts.toModifyName=0
                    let _ManageVideos_Index = ts.$store.components['_ManageVideos_Index'];
                    let videos = _ManageVideos_Index.videos;
                    videos.selected.name=ts.newName
                }else{
                    ts.$notify({message:res.data.message})
                }
            })
        },
        deleteVideo(){
            let ts = this
            ts.$dialog.confirm({
                message: '确认删除吗?',
            })
            .then(() => {
                ts.$axios.post('/mumu/manage-my-videos/delete-video',ts.$qs.stringify({no:ts.query.no})).then(res=>{
                    
                    if(res.data.code == 0){
                        ts.$notify({type:'success',message:"已删除"})
                        let _ManageVideos_Index = ts.$store.components['_ManageVideos_Index'];
                        let videos = _ManageVideos_Index.videos;
                        videos.rows.splice(videos.rows.findIndex(e => e.no === ts.video.no), 1)
                        videos.map[ts.video.no]=null
                        ts.$routerr.back()
                    }else{
                        ts.$notify({message:res.data.message})
                    }
                })
            })
        },
        submitVideoAudit(){
            let ts = this
            ts.$dialog.confirm({
                message: '确认提交审核吗?'+(ts.video.audit=='ing'?' 当前正在审核中, 重新提交会重新排队.':''),
            })
            .then(() => {
                ts.$axios.post('/mumu/manage-my-videos/submit-video-audit',ts.$qs.stringify({no:ts.query.no})).then(res=>{
                    
                    if(res.data.code == 0){
                        ts.$notify({type:'success',message:"已提交审核"})
                        ts.video.audit='ing'
                    }else{
                        ts.$notify({message:res.data.message})
                    }
                })
            })
        },
        timeupdate(){
            let ts = this
            let currentSubtitle=ts.currentSubtitle
            ts.videoDom_currentTime = ts.videoDom.currentTime
            let currentTime = ts.videoDom.currentTime*1000
            if(ts.ffff(ts.currentSubtitle, currentTime)){
                return
            }
            ts.currentSubtitle=null
            let nextSubtitle = ts.subtitles[ts.currentSubtitleIndex+1]
            if(nextSubtitle && currentSubtitle && currentTime > currentSubtitle.end && currentTime<nextSubtitle.start)
                return;
            if(ts.ffff(nextSubtitle, currentTime)){
                ts.currentSubtitle = nextSubtitle
                ts.currentSubtitleIndex++
                return
            }
            
            for (let index = 0; index < ts.subtitles.length; index++) {
                const subtitle = ts.subtitles[index];
                if(currentTime >= subtitle.start && currentTime <= subtitle.end){
                    ts.currentSubtitle = subtitle
                    ts.currentSubtitleIndex=index
                    break;
                }
            }
        },
        ffff(subtitle,currentTime){
            if(!subtitle)
                return false;
            if(currentTime >= subtitle.start && currentTime <= subtitle.end){
                return true
            }
            return false
        },
        start(){
            let ts = this
            ts.$store.components[ts.$el.id]=ts
            ts.query = ts.$uu.getCurrentQuery()
            ts.videoDom = document.getElementById("video");
            ts.$axios.post('/mumu/manage-my-videos/get-video',ts.$qs.stringify({no:ts.query.no})).then(res=>{
                ts.newVideo=ts.video=res.data.data.row
            })
            ts.$axios.post('/mumu/manage-my-videos/get-subtitles', ts.$qs.stringify({
                videoNo:ts.query.no
            })).then(res=>{
                if(res.data.code==0){
                    ts.subtitles=res.data.data.rows
                }
            })
        }
    }, 
    activated(){
        debugger
        let ts = this
        if(!ts.fullPath || (ts.fullPath && ts.fullPath != ts.$route.fullPath))
            ts.start()
        ts.fullPath = ts.$route.fullPath;
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

</style>
