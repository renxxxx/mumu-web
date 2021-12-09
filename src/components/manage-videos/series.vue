<template>
    <div id="_ManageVideos_Series" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
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
            <span style="font-size:16px;display: inline-block;width:calc(100% - 40px)">
                专辑详情
            </span>
        </div>
        
       <div style="height:40px;line-height: 40px;">
            <span style="display:inline-block;font-size: 16px;padding:0 3px;width:20%;text-align: center;">
               名称
            </span>
            <span style="display:inline-block;font-size: 16px;padding:0 3px;width:73%;">
                {{series.name}}
            </span>
            <span @click="newName=series.name;isModifyName=1" style="display:inline-block;font-size: 16px;padding:0 3px;
                width:7%;text-align: center;">
                &gt;
            </span>
       </div>

       <div style="height:40px;line-height: 40px;">
            <span style="display:inline-block;font-size: 16px;padding:0 3px;width:20%;text-align: center;">
                封面
            </span>
            <span style="display:inline-block;font-size: 16px;padding:0 3px;width:73%;">
                <img :src="series.cover" style="width:40px;"/>
            </span>
            <span @click="newCover=series.cover;isModifyCover=1" style="display:inline-block;font-size: 16px;padding:0 3px;width:7%;text-align: center;">
                &gt;
            </span>
        </div>


        <div v-if="isModifyName" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
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
                    <button @click="isModifyName=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>


        <div v-if="isModifyCover" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
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
                    <button @click="isModifyCover=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
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
    name: '_ManageVideos_Series',
    data() {
        return {
            query:{},
            series:{},
            isModifyName:0,
            isModifyCover:0,
            newName:null,
            newCover:null,
            newCoverFile:null,
        }
    },
    methods:{
        start(){
            let ts = this
            ts.$store.components[ts.$el.id]=ts
            ts.query = ts.$uu.getCurrentQuery()
            ts.$axios.post('/mumu/manage-my-videos/get-series',ts.$qs.stringify({no:ts.query.no})).then(res=>{
                ts.series=res.data.data.row
            })
        },
        deleteCover(){
            let ts = this
            ts.newCover=null;
            ts.newCoverFile=null;
        },
        async modifyCover(){
            let ts = this
            if(ts.series.cover==ts.newCover){
                ts.$notify({type:'success',message:'无修改'})
                ts.isModifyCover=0
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
            await ts.$axios.post('/mumu/manage-my-videos/modify-series', ts.$qs.stringify({
                cover: ts.newCover,
                no:ts.query.no
            })).then(res=>{
                if(res.data.code==0){
                    ts.$notify({type:'success',message:'已修改'})
                    ts.series.cover=ts.newCover
                    ts.isModifyCover=0
                    
                    let _ManageVideos_Index = ts.$store.components['_ManageVideos_Index'];
                    if(_ManageVideos_Index){
                        let serieses = _ManageVideos_Index.serieses;
                        serieses.selected.cover=ts.newCover
                    }
                    let _ManageVideos_SeriesVideos = ts.$store.components['_ManageVideos_SeriesVideos'];
                    if(_ManageVideos_SeriesVideos){
                        _ManageVideos_SeriesVideos.series.cover=ts.newCover
                    }
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
            if(ts.series.name==ts.newName){
                ts.$notify({type:'success',message:'无修改'})
                ts.isModifyName=0
                return;
            }
            ts.$axios.post('/mumu/manage-my-videos/modify-series',ts.$qs.stringify({
                no:ts.query.no,
                name:ts.newName
            })).then(res=>{
                
                if(res.data.code == 0){
                    ts.$notify({type:'success',message:"已修改"})
                    ts.series.name=ts.newName
                    ts.isModifyName=0

                    let _ManageVideos_Index = ts.$store.components['_ManageVideos_Index'];
                    if(_ManageVideos_Index){
                        let serieses = _ManageVideos_Index.serieses;
                        serieses.selected.name=ts.newName
                    }
                    let _ManageVideos_SeriesVideos = ts.$store.components['_ManageVideos_SeriesVideos'];
                    if(_ManageVideos_SeriesVideos){
                        _ManageVideos_SeriesVideos.series.name=ts.newName
                    }
                }else{
                    ts.$notify({message:res.data.message})
                }
            })
        },
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

@media screen and (min-width: 800px) {
    
}
</style>
