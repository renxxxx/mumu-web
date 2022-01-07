<template>
    <div id="_FavoritedVideos" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #272727;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;">

        <div style="height:45px;padding:5px 2.5%;">
            <input v-model='videosExplorer.kw' style="height:35px;width:80%;font-size: 16px;padding:0 3px;border:none;background-color: #f1f1f1;" />
            <span @click='searchFavoritedVideos' style="height:35px;line-height:35px;width:20%;font-size: 16px;text-align: center;background-color: #8b8b8b;">
                搜索
            </span>
        </div>
        <div ref='videosScroll' @scroll="videosScroll" style="position: absolute;top:40px;bottom:50px;left:0;right:0;overflow: auto;margin-top:5px;">
            <span :key=item.videoNo v-for="item in videosExplorer.rows"
                style="width:46.25%;height:240px;background-color: #919191;margin:5px 0 0 2.5%;">
                <img :src="item.cover" style="width:100%;height:190px;display: block;background-color: #919191;" />
                <img v-if="item.isFavorited" @click="unfavorite(item.videoNo)" src="../../public/img/favorited.png" style="position: absolute;top:155px;right:12px;width:30px;"/>
                <img v-if="!item.isFavorited" @click="favorite(item.videoNo)" src="../../public/img/unfavorited.png" style="position: absolute;top:155px;right:12px;width:30px;"/>
                <div v-if="item.seriesName" style="font-size: 15px;height:25px;color: rgb(28 28 28);line-height: 30px;padding:0 5px;">
                    {{item.seriesName}}
                </div>
                <div style="font-size: 15px;min-height:25px;max-height:60px;color: rgb(28 28 28);line-height: 20px;padding:0 5px;"
                    :class="{line2:!item.seriesName}">
                    {{item.name}}
                </div>
            </span>

            <div @click="(!videosExplorer.isNoData && !videosExplorer.isFullData) ? loadMoreFavoritedVideos() : ''" 
                style="width:100%;line-height:40px;font-size: 15px;text-align: center;color:#8b8b8b;margin-top: 10px;">
                {{ 
                    (videosExplorer.lastRows.length==0 && videosExplorer.rows.length==0) ? '暂无数据' :
                    (videosExplorer.lastRows.length &lt; videosExplorer.rcount) ? '已全部加载' : '点击加载更多'
                }}
            </div>
        </div>


        <div style="font-size:0;height:50px;position: absolute;bottom:0;width:100%;border-top: 1px solid #525252;background-color: #272727;">
            <span class="unselectable" style="font-size:18px;display: inline-block;width:25%;height:49px;line-height:49px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="window.location.replace('./discover.html');">
                发现
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:49px;line-height:49px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#ffffff;font-weight:900;"
                @click="window.location.replace('/favorited-videos');">
                收藏
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:49px;line-height:49px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="window.location.replace('./history.html');">
                聊天
            </span>
            <span class="unselectable" style="font-size:16px;display: inline-block;width:25%;height:49px;line-height:49px;cursor: pointer;text-align: center;
                vertical-align: middle;color:#919191;"
                @click="$router.replace('/my');">
                我的
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: '_FavoritedVideos',
    data() {
        return {
            videosExplorer:{
                kw:null,
                rcount:20,
                rows:[],
                lastRows:[],
                map:{},
                selected:null
            }
        }
    },
    props: {
    },
    methods:{
        unfavorite(videoNo){
            ts.$axios.post('/mumu/unfavorite-video',ts.$qs.stringify({
                videoNo:videoNo
            })).then((res)=>{
                if(res.data.code==0){
                    ts.videosExplorer.map[videoNo].isFavorited=0
                }
            })
        },
        favorite(videoNo){
            ts.$axios.post('/mumu/favorite-video',ts.$qs.stringify({
                videoNo:videoNo
            })).then((res)=>{
                if(res.data.code==0){
                    ts.videosExplorer.map[videoNo].isFavorited=1
                }
            })
        },
        videosScroll(){
            if(ts.$uu.isScrollBottom(ts.$refs.videosScroll)){
                ts.loadMoreFavoritedVideos()
            }
        },
        searchFavoritedVideos(){
            ts.videosExplorer.rows=[]
            ts.videosExplorer.lastRows=[]
            ts.loadMoreFavoritedVideos()
        },
        loadMoreFavoritedVideos(){
            ts.$axios.post('/mumu/favorited-videos',ts.$qs.stringify({
                kw:ts.videosExplorer.kw,
                rstart:ts.videosExplorer.rows.length+1,
                rcount:ts.videosExplorer.rcount
            })).then((res)=>{
                if(res.data.code==0){
                    var videos = res.data.data.videos;
                    ts.videosExplorer.rows.push(...videos)
                    ts.videosExplorer.lastRows=videos
                    for (var i in videos) {
                        var video = videos[i]
                        ts.videosExplorer.map[video.videoNo]=video
                    }
                }
            })
        },
        start(){
            ts.$store.components[ts.$el.id]=ts
            ts.fullPath = ts.$route.fullPath;
            ts.query = ts.$uu.getCurrentQuery()
            ts.loadMoreFavoritedVideos()
        }
    },
    activated(){
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