
(function(){
    var page = {
        manual:1,
    }
    window.page=page
    page.translateajaxs=[]
    page.wordbookWordsAjaxs=[]
    
    var onlyLookHimParam = getUrlParam('olh')

    page.seed = Math.ceil(Math.random()*100);
    page.rstart=1
    page.currVideos=[]
    //log.debugon=0
    var searchKw='' 
    var searchtag=''
    page.shortWordText=null;
    page.favoredWords={
        rows:[],
        rstart:1,
        rcount:50,
        currRows:[]
    }
    page.historyWords={
        rows:[],
        rstart:1,
        rcount:50,
        currRows:[]
    }

    page.wordbooks={
        rows:[],
        rstart:1,
        rcount:50,
        currRows:[],
        selected:null,
    }
    page.wordbooksOnAdd={
        rows:[],
        rcount:50,
        currRows:[],
        selected:null,
    }
    page.currWord=null
    page.wordBooksWordsMap={}
    page.removeWordsControl={
        favor:null,
        history:null,
    }
    page.loopVideoCountCache=null
    page.loopVideoCount=null
    page.onlyLookUserNo=null
    page.onlyLookHimVideos={
        rows:[],
        rcount:10,
        currRows:[],
        inx:0,
    }
    page.trueVideos = {
        rows:[],
        rcount:10,
        currRows:[],
        map:{},
        noes:[],
        inx:0,
    }
    page.loopVideos={
        on:null,
        count:1,
        rows:[],
        inx:0,
    }
    page.closeView=0
    var loopLine=0
    var pausebeforech = null;
    var historywords=[]
    var videoNoC = window.location.search.substring(1).split("&")[0].split("=")[1];
    var videoC = null
    var video;
    var videoNo;
    var rollInxCache = parseInt(localStorage.getItem(config.project+'-rollInx'))
    page.rollInx = rollInxCache? rollInxCache : 0;
    page.words1ajaxs=[]
    page.exploreVideos={
        rows:[],
        currRows:[],
        inx:0,
        map:{},
        rstart:0,
    }

    if(pagePre.loginTime && (new Date().getTime() - pagePre.loginTime) > 1 * 24 * 60 * 60* 1000){
        $.ajax({
          url:'/mumu/login-refresh',
          async:false,
          success:function(res){
            if(res.code==0){
              pagePre.login=res.data
              localStorage.setItem(config.project+'-login',JSON.stringify(pagePre.login))
              localStorage.setItem(config.project+'-loginTime',new Date().getTime())
              $.post('/mumu/restore-template-wordbooks')
            }else if(res.code==20){
                login()
            }
          }
        })
      }

    setTimeout(function(){
        $('#logo').hide()
        $('#index').show()

        // $("#finger").animate({left:'+=150px'},2000,function(){
        //     $("#finger").animate({left:'-=300px'},2000,()=>{$("#finger").fadeOut(500)});
        // });
        // $("#gear").animate({left:'+=150px'},2000,function(){
        //     $("#gear").animate({left:'-=300px'},2000);
        // });
    },1000)

    $('#video')[0].crossOrigin = 'anonymous';
   

    // if(isPcWeChat()){
    //     $('#video').css('object-fit','')
    // }
    

    document.addEventListener('WeixinJSBridgeReady',function(){
        $('#video')[0].play();
    },false);
    
    if(videoNoC){
        $.ajax({
            url: '/mumu/video?',
            
            ajaxCache:true,
            data: 'videoNo='+videoNoC,
            async: false,
            success: function(res) {
                if(res.code==0){
                    videoC = res.data.video
                }else if(res.code==20){
                    login()
                }
            }
        })
    }

   




    var lastCurrentTime = localStorage.getItem(config.project+"-currentTime-"+videoNo);
    var currentIndex =parseInt(localStorage.getItem(config.project+"-currentIndex-"+videoNo));
    var currentCaption = JSON.parse(localStorage.getItem(config.project+"-currentCaption-"+videoNo));
    var jumpedcaption = currentCaption;
    var tt,runstep=0;
    var playRestored=0,restored=0;
    var zh = {
        subtitles : '',
        monitor : '',
        subtitlesList : [],
    };
    var en = {
        subtitles : '',
        monitor : '',
        subtitlesList : [],
        current:currentCaption,
        currentIndex:currentIndex
    }
    page.en=en
    var chooseDomList = [];
    var translationtext = '';

    setline=setline
    var videoele=$('#video')[0];
    if(currentCaption)
        setline(currentCaption);

    

    
    $('#historyword_template').bind('click',function(event){
        log.info('$(#historyword_template).click '+$(this).attr('data'))
        page.dovideoshadow=1
        pauseVideo();
        loadRelatedWords(this.innerText)
        translatee(this.innerText);
        $('.historyword').css('background-color',"#ffffff")
        $(this).css('background-color',"#e7e7e7")
    })
    

    function getMoreOnlyLookHimVideos(){
        var obj = {}
        obj.shortvideo=1
        obj.kw=searchKw
        obj.pageSize=10
        
        obj.userNo=page.onlyLookUserNo
        obj.rstart=1
        obj.sort='orderNoInUser'
        obj.order='asc'
        if(page.onlyLookHimVideos.rows.length > 0){
            obj.split='orderNoInUser'
            obj.splitv='>'+page.onlyLookHimVideos.rows[page.onlyLookHimVideos.rows.length-1].orderNoInUser
        }
        $.ajax({
            url: '/mumu/explore-videos',
            data: obj,
            async: false,
            success: function(res) {
                if(res.code==0){
                    if(res.data.videos.length>0){
                        page.onlyLookHimVideos.rows.push(...res.data.videos)
                        page.onlyLookHimVideos.currRows=res.data.videos
                        page.trueVideos.rows.push(...res.data.videos)
                        page.trueVideos.currRows=res.data.videos
                    }else{
                        page.onlyLookHimVideos.rows=[]
                        page.onlyLookHimVideos.currRows=[]
                        getMoreOnlyLookHimVideos()
                    }
                    $('#video1').attr('src',null);
                }else if(res.code==20){
                    login()
                }
            }
        })
    }
    function getMoreVideos(){
        $.ajax({
            url: '/mumu/explore-videos?',
            data: 'shortvideo=1&kw='+searchtag+'&pageSize='+10+"&seed="+page.seed+"&rstart="+(page.exploreVideos.rows.length+1)
                    +"&userNo="+(page.onlyLookUserNo||' '),
            async: false,
            success: function(res) {
                if(res.code==0){
                    if(res.data.videos.length>0){
                        page.exploreVideos.rows.push(...res.data.videos)
                        page.exploreVideos.currRows=res.data.videos
                        page.exploreVideos.rstart=page.exploreVideos.rows.length+1
                        page.trueVideos.rows.push(...res.data.videos)
                        page.trueVideos.currRows=res.data.videos
                    }else{
                        page.seed = Math.ceil(Math.random()*100);
                        $.ajax({
                            url: '/mumu/explore-videos?',
                            
                            data: 'shortvideo=1&kw='+searchKw+'&pageSize='+10+"&seed="+page.seed+"&rstart=1"+"&userNo="+(page.onlyLookUserNo||' '),
                            async: false,
                            success: function(res) {
                                page.exploreVideos.rows.push(...res.data.videos)
                                page.exploreVideos.currRows=res.data.videos
                                page.trueVideos.rows.push(...res.data.videos)
                                page.trueVideos.currRows=res.data.videos
                                page.exploreVideos.rstart=1
                            }
                        })
                    }
                    $('#video1').attr('src',null);
                }else if(res.code==20){
                    login()
                }

            }
        })
    }




    goNextVideo()
    function goNextVideo(){
        pauseVideo()
        closeLoopLine()
        if(!page.trueVideos.rows[page.trueVideos.inx+1-1] || !page.trueVideos.rows[page.trueVideos.inx+2-1]){
            if(videoC){
                page.trueVideos.rows.unshift(videoC)
                page.trueVideos.currRows.unshift(videoC)

                page.exploreVideos.rows.unshift(videoC)
                page.exploreVideos.currRows.unshift(videoC)
                videoC=null
            }

            if(page.onlyLookUserNo){
                getMoreOnlyLookHimVideos()
            }else{
                getMoreVideos()
            }

            page.trueVideos.currRows.forEach(function(item,inx){
                page.trueVideos.map['no'+item.no]
                page.trueVideos.noes.push(item.no)
            })
        }
        
        if(!page.trueVideos.rows[page.trueVideos.inx+1-1]){
            return;
        }

        if(page.loopVideos.on){
            if(page.loopVideos.inx<page.loopVideos.count){
                page.trueVideos.inx++;
                page.loopVideos.inx++;
            }else{
                page.trueVideos.inx=page.trueVideos.inx-page.loopVideos.count+1
                page.loopVideos.inx=1
            }
            if(page.loopVideos.count > 1)
                $('#loopVideoBtn').text('循环\n'+page.loopVideos.inx+'/'+page.loopVideos.count)
        }else{
            page.trueVideos.inx++;
        }

        
        if(page.trueVideos.rows[page.trueVideos.inx+1-1]){
            $('#cacheVideo').attr('src',page.trueVideos.rows[page.trueVideos.inx+1-1].url)
            $('#cacheVideo')[0].play();
            setTimeout(function(){
                $('#cacheVideo')[0].pause()
            },3000)
        }
        

        videoNo = page.trueVideos.rows[page.trueVideos.inx-1].no
        video = page.trueVideos.rows[page.trueVideos.inx-1]

        if(page.trueVideos.rows[page.trueVideos.inx+1-1])
            $('#video1').attr('src',page.trueVideos.rows[page.trueVideos.inx+1-1].cover);
        if(page.trueVideos.rows[page.trueVideos.inx-1-1])
            $('#video2').attr('src',page.trueVideos.rows[page.trueVideos.inx-1-1].cover);
        getvideodone(video)

    }

    function goPrevVideo(){
        pauseVideo()
        closeLoopLine()
        if(!page.trueVideos.rows[page.trueVideos.inx-1-1]){
            location.replace('./index.html')
            return;
        }
        page.trueVideos.inx--;
        if(page.onlyLookUserNo){
            page.onlyLookHimVideos.inx--
        }else{
            page.exploreVideos.inx--
        }
        videoNo = page.trueVideos.rows[page.trueVideos.inx-1].no
        video = page.trueVideos.rows[page.trueVideos.inx-1]

        if(page.trueVideos.rows[page.trueVideos.inx+1-1]){
            $('#video1').attr('src',page.trueVideos.rows[page.trueVideos.inx+1-1].cover);
        }else{
            $('#video1').attr('src','');
        }
        if(page.trueVideos.rows[page.trueVideos.inx-1-1]){
            $('#video2').attr('src',page.trueVideos.rows[page.trueVideos.inx-1-1].cover);
        }else{
            $('#video2').attr('src','');
        }
        getvideodone(video)
    }

    function playend(){
        setTimeout(function(){
            goNextVideo()
        },1000)
    }
    function guide(){
        if(page.closeView)
            $('#video').attr("src",video.audio16k||audio||video.url)
        else
            $('#video').attr("src",video.url)

        var translateed = localStorage.getItem(config.project+'-translateed')
        if(!translateed){
            $('#hintssec').text(3)
            pauseVideo()
            $('#videobox').css('top','-1000px')
            $('#hints').show()
            setTimeout(function(){
                $('#hints').fadeOut(1000,function(){
                    $('#videobox').css('top','0')
                    playVideo()
                    //setTimeout(function(){$('#video')[0].muted=false},500)
                });
            },3000)
            var ccc = setInterval(function(){
                var sec = $('#hintssec').text()-1;
                if(sec<1){
                    clearInterval(ccc)
                }else {
                    $('#hintssec').text(sec)
                }
            },1000)
            
        }else{
            $('#videobox').css('top','0')
            $('#video').attr('autoplay',true)
            playVideo()
            //setTimeout(function(){$('#video')[0].muted=false},500)
        }
    }
    function guide1(){
        if(page.closeView)
            $('#video').attr("src",video.audio16k||video.audio||video.url)
        else
            $('#video').attr("src",video.url)
        $('#videobox').css('top','0')
        $('#video').attr('autoplay',true)
        playVideo()
    }
    //showallhistorywords()
    // function getVideo(videoNo){
    //     $.ajax({
    //         url: '/mumu/video?',
            
    //         data: 'videoNo='+videoNo,
    //         async: false,
    //         success: function(res) {
    //             getvideodone(res.data.video)
    //         }
    //     })
    // }

    function getvideodone(videop){
        video=videop;
        videoNo=videop.no

        clearTimeout(page.ssj)
        page.ssj= setTimeout(function(){
            ws.send(JSON.stringify({
                action:12,
                videoNo:video.no,
                duration:video.duration,
            }))
        },3000)

        genShareData()
        $('#zh_subtitles').html('')
        var ss =ttb(video.chreference)||ttb(video.seriesChname);
        var sss = ss?('#'+ss+' '):ss
        if(ss != ttb(video.chname)){
            sss=sss+ttb(video.chname)
        }
        if(video.seriesNo){
            $('#inSeriesPad').css('display','inline-block')
            $('#inSeriesPad .no').text(video.orderNoInSeries)
            $('#title').css('width','calc(100% - 169px)')
        }else{
            $('#inSeriesPad').hide()
            $('#inSeriesPad .no').text('')
            $('#title').css('width','calc(100% - 134px)')
        }
        $('#title').text(sss)
        //$('#video').attr("poster", video.cover)
        if(video.userNo){
            $('#headimg').attr('src',video.headimg)
            $('#headimg').css('display','inline-block')
            $('#onlyLookHim').css('display','inline-block')
            $('#chatminpad').css('width','calc(100% - 105px)')
            $('#videoNickname').text(video.nickname)
        }else{
            $('#headimg').hide()
            $('#onlyLookHim').hide()
            $('#chatminpad').css('width','100%')
        }
        jumpedcaption=null
        en.currentIndex=0
        
        $.ajax({
            url: video.captionUrl,
            type: 'get',
            async: false,
            success: function(res) {
                getEnSubtitles(res);
            }
        })
        clearTimeout(page.addHistoryTimeout)
        page.addHistoryTimeout=setTimeout(function(){
            var historyvideos = JSON.parse(localStorage.getItem(config.project+'-historyvideos'))
            if(!historyvideos)
                historyvideos=[]
            for(var i = 0; i < historyvideos.length; i++){
                if(historyvideos[i].no==video.no){  
                    historyvideos.splice(i,1) 
                }  
            }  
            historyvideos.unshift(video)
            localStorage.setItem(config.project+'-historyvideos',JSON.stringify(historyvideos))
        },5000)

        if(!video.chatCount){
            video.chatCount=parseInt(randomnum(2))
        }
        $('#chatCount').text(video.chatCount)
        guide1()
    }
    function restore(){
        if(!restored){
            if(lastCurrentTime == 0){
                restored=1;
                return;
            }
            if(lastCurrentTime){
                $('#video')[0].currentTime = lastCurrentTime;
                //log.debug("set lct: "+lastCurrentTime+" ct: "+$('#video')[0].currentTime);
                if($('#video')[0].currentTime >= lastCurrentTime){
                    restored=1;
                }
            }
        }
    }

    function playRestore(){
        if(!playRestored){
            if(lastCurrentTime){
                $('#video')[0].currentTime = lastCurrentTime;
                //log.debug("set lct: "+lastCurrentTime+" ct: "+$('#video')[0].currentTime);
                if($('#video')[0].currentTime >= lastCurrentTime)
                    playRestored=1;
            }
        }
    }



    function onCanPlay(){
        playRestore()
    }
    function onDurationChange(){
    }
    function onLoadedMetadata(){
    }
    function onLoadedData(){
    }
    function onLoadStart(){
   }
    function onPlaying(){
    }
    function onProgress(){
    }
    function onReadyStateChange(){
    }
    function onSuspend(){
    }

    function onTimeUpdate(){
        restore()
        if(videoele.paused)
            monitor(videoele.currentTime*1000)
    }

    function monitor(_time){
        $('#loading').hide()
        localStorage.setItem(config.project+"-durationsec-"+videoNo,$('#video')[0].duration)
        localStorage.setItem(config.project+"-currentTime-"+videoNo,$('#video')[0].currentTime)

        if(jumpedcaption){
            if(jumpedcaption.startTime < _time){
                jumpedcaption=null;
            }else{
                return;
            }
        }

        if(en.current && en.current.startTime<=_time && _time<en.current.endTime){
            return;
        }
        

        var next = en.subtitlesList[en.currentIndex+1]
        if(next && next.startTime<=_time && _time<next.endTime){
            //log.debug("next ")
            if(page.diandu)
                pauseVideo()
            if(loopLine){
                currline()
                return;
            }
            en.current = next
            en.currentIndex++
            setline(next)
            return;
        }

        if(next && _time < next.startTime &&  (!en.current || _time > en.current.endTime)){
            //log.debug("before next")
            //log.debug("next: st: "+next.startTime+" currinx: "+en.currentIndex)
            return;
        }

        
        $(en.subtitlesList).each(function(inx,item){
            if(item.startTime<=_time && _time<item.endTime){
                //log.debug("search all ")
                en.current = item
                en.currentIndex = inx
                setline(item)
                return;
            }
        })
    }

    function onWaiting(){
    }
    function onClick(){
        //$('#video').attr('controls', true);
    }



    function showSearchFn(){
        $('.dialogSearch input').val($('.dialogTitle #kw').html());
        $('.dialogSearch').css({'display':'flex'})
        $('.dialogSearch input').focus()
        $('.dialogTitle').css({'display':'none'})
        pauseVideo()
    }
    function searchClearFn(){
        $('.dialogSearch input').val("")
    }
    function hideSearchFn(){
        $('.dialogTitle #kw').html($('.dialogSearch input').val());
        $('.dialogSearch').css({'display':'none'})
        $('.dialogTitle').css({'display':'block'})
        if(!$('.dialogSearch input').val()){
            $('#zh_subtitles span').css({"background": "transparent","color": "black"})
            $('.dialog').css({'display' : 'none'})
            pauseVideo()
            $('.yibiao').html('')
            $('.fanyi').html('')
        }
    }
    // function searchFn(_value){
    //     if(_value.keyCode == 13){
    //         let kw = $('.searchClass').val();
    //         translatee(kw);
    //         hideSearchFn()
    //     }
    // }

    $('.yibiao').on('click','span svg',function(){
        log.info('$(.yibiao).click')
        let _mp3 = new Audio($(this).attr('playsrc'));
        _mp3.play();
    })
    function getEnSubtitles(_result){
        //log.debug("getEnSubtitles: "+ ++runstep)
        en.subtitlesList=[]
        ////let _this = this;
        let _fileString = [];
        _fileString = _result.split(/[(\r\n)\r\n]+/);
        _fileString.forEach((item,inx) => {
            let startValue = false
            if(!item){
                _fileString.splice(inx,1);
            }
            let reg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d/;
            let regExp = new RegExp(reg);
            if(regExp.test(item)){
                var ss = _fileString[inx+2]
                var st = _fileString[inx+1]
                if(ss.indexOf('{\\pos')>=0 || st.indexOf('{\\pos')>=0){
                    return;
                }
                en.subtitlesList.push({
                    startTime : timeCycle(item.split(' --> ')[0].replace(',','.')),
                    endTime : timeCycle(item.split(' --> ')[1].replace(',','.')),
                    chValue: st,
                    enValue: ss,
                })
            }
        });
        var iii = null
        for (let inx = 0; inx < en.subtitlesList.length; inx++) {
            iii=inx
            const curr = en.subtitlesList[inx];
            const next = en.subtitlesList[inx+1];
            if(inx<en.subtitlesList.length-2){
                if((next.startTime - curr.endTime)>1000){
                    en.subtitlesList.splice(inx+1,0,{
                        startTime:parseInt(curr.endTime)+1000,
                        endTime:next.startTime,
                        chValue:'',
                        enValue:''
                    })
                }
            }
        }
    
        var first = en.subtitlesList[0]
        if(first && first.startTime>0){
            en.subtitlesList.splice(0,0,{
                        startTime:0,
                        endTime:first.startTime,
                        chValue:'',
                        enValue:''
                    })
        }
        var last = en.subtitlesList[en.subtitlesList.length-1]
        if(last){
            en.subtitlesList.push({
                            startTime:parseInt(last.endTime)+1000,
                            endTime:video.duration*1000,
                            chValue:'',
                            enValue:''
                        })
        }
        if(en.currentIndex>=0){
            en.current=en.subtitlesList[en.currentIndex]
            setline(en.current)
        }else{
            setline(en.subtitlesList[0])
        }
    }

    function setline(item){
        if(!item)
            return;
        //log.debug('setline: ct: '+$('#video')[0].currentTime+" st: "+item.startTime +" et: "+item.endTime +" "+item.enValue.substr(0,5))
        localStorage.setItem(config.project+"-currentCaption-"+videoNo,JSON.stringify(item))
        localStorage.setItem(config.project+"-currentIndex-"+videoNo,en.currentIndex)
        ////let _this = this;
        let _v= item.enValue.split(' ');
        $("#zh_subtitles").html('')
        en.currentwords=_v
        for(let i=0; i < _v.length; i++){
            if(_v[i]=='\\n'){
                $("#zh_subtitles").append('<br/>')
                continue;
            }
            var vv = _v[i].split('\\n');
            if(vv[0]){
                var sp = $('<span style="border-bottom:2px solid #272727;color:#ffffff;user-select: none;display: inline-block;cursor: pointer;font-weight: 900;font-size: 18px;padding-left:3px;padding-right:3px;box-sizing: border-box;" index="'+i+'" class="font span'+i+'">'+vv[0]+'</span>')
                sp.bind('mouseout',function(){
                    if(isPc()){
                        $(this).css('border-bottom','2px solid #272727')
                    }
                }).bind('mouseover',function(){
                    if(isPc()){
                        $(this).css('border-bottom','2px solid #ffffff')
                    }
                })
                $("#zh_subtitles").append(sp)
            }
            if(vv[1]){
                _v.splice(i+1,0,'\\n',vv[1])
            }
            if(vv[2]){
                _v.splice(i+3,0,'\\n',vv[2])
            }
            if(vv[3]){
                _v.splice(i+5,0,'\\n',vv[3])
            }
        }
        $('#chDialog').html(item.chValue.replace(/\\n/g,'<br/>'))
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
        currwordno=0
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
        $('#summtrans').hide()
        $('#wordsframe').hide()
        $('#videoshasow').hide()
        $('#word-in').val('')
        $('#videobox').css('top','0px')
    }
    function prevline(){
        ////let _this = this;
        if(en.currentIndex>0){
            var inx = en.currentIndex
            var prev = en.subtitlesList[--inx]
            if(prev){
                if(!prev.enValue)
                    prev = en.subtitlesList[--inx];
                if(prev){
                    en.currentIndex =inx   
                    en.current= prev
                    jumpedcaption = prev
                    lastCurrentTime = prev.startTime/1000
                    $('#video')[0].currentTime = prev.startTime/1000
                    log.debug("set st: "+prev.startTime/1000+" ct: "+$('#video')[0].currentTime + " - " + en.current.enValue.substr(0,10))
                    setline(prev)
                    currwordno=0
                    
                    $('.dialog').css({'display' : 'none'})
                    $('.dialogTitle #kw').html('');
                }
            }
        }
    }

    $('#loopLine').click(troggleLoopLine)
    function troggleLoopLine(){
        if(loopLine){
            loopLine=0
            $('#loopLine').css('background-color',"unset")
        }else{
            loopLine=1
            $('#loopLine').css('background-color',"#5a5a5a")
        }
    }
    function closeLoopLine(){
        loopLine=0
        $('#loopLine').css('background-color',"unset")
    }
    function openLoopLine(){
        loopLine=1
        $('#loopLine').css('background-color',"#6f6f6f")
    }

    function currline(){
        var inx = en.currentIndex
        var curr = en.current
        if(curr){
            if(!curr.enValue)
                curr = en.subtitlesList[--inx];
            if(curr){
                en.currentIndex =inx   
                en.current= curr
                $('#video')[0].currentTime = curr.startTime/1000
                jumpedcaption = curr
                lastCurrentTime = curr.startTime/1000
                //log.debug("set ct: "+curr.startTime/1000+" ct: "+$('#video')[0].currentTime)
                setline(curr)
                currwordno=0
                
                $('.dialog').css({'display' : 'none'})
                $('.dialogTitle #kw').html('');
            }
        }
    }
    function nextline(){
        var inx = en.currentIndex
        var next = en.subtitlesList[++inx]
        if(next){
            if(!next.enValue)
                next = en.subtitlesList[++inx];
            if(next){
                en.currentIndex =inx   
                en.current= next
                jumpedcaption = next
                lastCurrentTime = next.startTime/1000
                $('#video')[0].currentTime = next.startTime/1000
                //log.debug("set ct: "+next.startTime/1000+" ct: "+$('#video')[0].currentTime)
                setline(next)
                currwordno=0
                
                $('.dialog').css({'display' : 'none'})
                $('.dialogTitle #kw').html('');
            }
        }
    }

    $('#favor').click(function(){
        log.info('#favor.click')
        addFavoredWord()
    })
    
    function pureWord(word){
        if(!word)
            return ''
        return word.replace(/^(\s|:|-|,|\.|\?|!|\[|\]\(|\))+/,'').replace(/(\s|:|-|,|\.|\?|!|\[|\]\(|\))+$/,'').toLowerCase()
    }
   
    function translatee1(word,addHistory){
        word=pureWord(word)
        page.currWordText=word
        clearTimeout(window.timeoutdo11)
        window.timeoutdo11=setTimeout(function(){
            window.aaa=setTimeout(function(){
                $('#summtrans-phonetic').hide();
                $('#summtrans-speak').hide();
                $('#summtrans-value').hide();
            },500)
            // if(word==null || word==undefined || !word.toString().trim()){
            //     $('#summtrans-phonetic').hide();
            //     $('#summtrans-speak').hide();
            //     $('#summtrans-value').hide();
            //     return;
            // }
            ws.send(JSON.stringify({
                action:10,
                addHistory:addHistory,
                word:word,
                from:1,
                to:2
            }))
        },200)
    }
    function translatee(_data,addHistory){
        //log.debug(_data+3)
        //$('#summrest').hide()
        page.dovideoshadow=1
        pauseVideo()
        doshadow()
        page.shortWordText=''
        _data=pureWord(_data)
        $('#summtrans').show()
        $('#summtrans-word').text(_data)
        $('#word-in').val(_data)
        clearTimeout(window.timeoutdo1)
        window.timeoutdo1=setTimeout(function(){
            $('#favor').attr('word',_data)
            window.aaa=setTimeout(function(){
                $('#summtrans-phonetic').hide();
                $('#summtrans-speak').hide();
                $('#summtrans-value').hide();
                $('#favor').text('')
                $('#addToWordbookBtn').text('')
            },500)
            if(_data==null || _data==undefined || !_data.toString().trim()){
                $('#summtrans-phonetic').hide();
                $('#summtrans-speak').hide();
                $('#summtrans-value').hide();
                $('#favor').text('')
                $('#addToWordbookBtn').text('')
                return;
            }
            for (const ajax of page.translateajaxs) {
                ajax.abort()
            }
            for (const ajax of page.words1ajaxs) {
                ajax.abort()
            }
            page.currWordText=_data
            page.translateajaxs.push($.ajax({
                url: '/mumu/translate?from='+video.language+'&to=2&q='+_data,
                
                ajaxCache:{
                    timeout: 30 * 24 * 60 * 60
                },
                async: true,
                success: function(res) {
                    var hasTranslate = false;
                    clearTimeout(window.aaa)
                    page.currWord=res.data
                    res.data.speakUrl=res.data.usSpeech?res.data.usSpeech:res.data.ukSpeech?res.data.ukSpeech:res.data.speakUrl;
                    res.data.phonetic=res.data.usPhonetic?res.data.usPhonetic:res.data.ukPhonetic?res.data.ukPhonetic:res.data.phonetic;
                    $('#favor').text('收 藏')
                    $('#addToWordbookBtn').text('加入单词本')
                    if(res.data.phonetic){
                        $('#summtrans-phonetic').text('/'+res.data.phonetic+'/').show()
                    }else{
                        $('#summtrans-phonetic').hide()
                    }
                    if(res.data.speakUrl){
                        $('#summtrans-speak').attr('play-url',res.data.speakUrl).show()
                    }else{
                        $('#summtrans-speak').hide()
                    }
                    $('#summtrans-vv').html('')
                    $('#summtrans-vv').scrollTop(0)
                    if(res.data.explains){
                        $(res.data.explains).each(function(index,item){
                            hasTranslate=true
                            $('#summtrans-vv').append(`<div>${lightkeytrans1(item)}</div>`)
                        })
                    }
                    if(res.data.wfs){
                        $('#summtrans-vv').append(`<div style="margin-top:10px">${lightkeytrans1(res.data.wfs)}</div>`)
                    }
                    if(res.data.webs){
                        $('#summtrans-vv').append(`<div style="margin-top:10px;">网络释义: </div>`)
                        $(res.data.webs).each(function(index,item){
                            hasTranslate=true
                            $('#summtrans-vv').append(`<div>${lightkeytrans1(item)}</div>`)
                        })
                    }
                     if(!hasTranslate && res.data.translations){
                         $(res.data.translations).each(function(index,item){
                             $('#summtrans-vv').append(`<div>${lightkeytrans1(item)}</div>`)
                         })
                     }
                    
                    
                    $(`.lightkeytrans`).bind('click',function(){
                        translatee(this.innerText,1)
                    })
                    $('#wordsframe').hide()
                    $('#summrest').show()
                    $('#summtrans-vv').show()
                    $('#summtrans-value').show()
                    $('#summtrans').show()
                    $('#videobox').css('top','-1000px')
                    $('#summtrans-vv').scrollTop(0)
                    var totaltranslatesno = localStorage.getItem(config.project+"-totaltranslatesno")
                    totaltranslatesno = totaltranslatesno?totaltranslatesno:0;
                    totaltranslatesno++;
                    localStorage.setItem(config.project+"-totaltranslatesno",totaltranslatesno)

                    $('#summtrans-speak').click()

                    var translateed = localStorage.getItem(config.project+'-translateed')
                    translateed =parseInt(translateed?++translateed:1)
                    if(translateed >= 4){
                        ws.send(JSON.stringify({
                            action:3,
                            words:3
                        }))
                        translateed=1
                    }
                    localStorage.setItem(config.project+'-translateed',translateed)

                    if(addHistory)
                        addHistoryWord()
                },
            }))
        },200)
        
    }   
    function pauseVideo(){
        //log.debug("pauseVideo()")
        $('#video')[0].pause();
    }
    function playVideo(){
        //log.debug("playVideo()")
        $('#video')[0].play();
        clearTimeout(window.timeoutdo1)
    }


    function videoPlay(){
        //log.debug("onplay: "+ ++runstep)
        //log.debug(" ct: "+ $('#video')[0].currentTime +" st: " +(en.current && en.current.startTime)+" et: " +(en.current && en.current.endTime)+" "+(en.current&&en.current.enValue.substr(0,5)))
        if(page.ajaxtranslate)
            page.ajaxtranslate.abort()
        for (const ajax of page.translateajaxs) {
            ajax.abort()
        }
        
        $('.historyword').css('background-color',"#ffffff")
        page.dovideoshadow=0
        // clearTimeout(page.timeout11)
        $('.dialog').hide()
        $('#summtrans').hide()
        $('#summtrans-word').text('')
        $('#wordsframe').hide()
        $('#word-in').val('')
        $('#summtrans-value').hide()
        $('#summtrans-vv').text('')
        $('#summtrans-phonetic').text('').hide('')
        $('#summtrans-speak').attr('play-src','').hide('')
        
        $('#videobox').css('top','0px')
        clearInterval(en.monitor)
        en.monitor = setInterval(function(){
            monitor(videoele.currentTime*1000)
        },10)
        currwordno=0
        translationtext = '';
        $('#zh_subtitles span').css({"background": "transparent","color": "#ffffff"})
        $('.startFn').css({'display':'none'})
        $('.stopFn').css({'display':'inline'})
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
        $('.searchClass').val('');
        $('.yibiao').html('')
        $('.fanyi').html('')
        $('#videoshasow').hide()
    }
    page.dovideoshadow=0
    function videoPause(){
        //log.debug("onpause: "+ ++runstep)
        //log.debug(" ct: "+ $('#video')[0].currentTime +" st: " +(en.current && en.current.startTime)+" et: " +(en.current && en.current.endTime)+" "+(en.current&&en.current.enValue.substr(0,5)))
        
        
        clearInterval(en.monitor)
        $('.stopFn').css({'display':'none'})
        $('.startFn').css({'display':'inline'})

        if($('#video')[0].currentTime == $('#video')[0].duration){
            playend()
        }

        //doshadow()
    }

    function doshadow(){
        if($('#videoshasow').is(':hidden')){
            var img = videocapture($('#video')[0])
            $('#videoshasowimg').attr('src',img.src)
            if(!img.src)
                $('#videoshasowimg').css('background-color',"#000000")
            $('#videoshasow').show()
            //log.debug(`$('#videoshasow').show()`)
            $('#videobox').css('top','-1000px')
            //$('#videoshasow').css('height',$('#video').css('height'))
        }
    }
    
    function enSubtitlesShow(){
        var thisEle = this;
        $("#zh_subtitles").css("opacity")
        if($("#zh_subtitles").css("opacity") == 1){
            $("#zh_subtitles").css("opacity",0)
            $('#chDialog').hide()
            $('#hideBtn').css("background-color","rgb(230, 230, 230)")
        }else{
            $('#chDialog').show()
            $("#zh_subtitles").css("opacity",1)
            $('#hideBtn').css("background-color","#ffffff")
        }
    }

    
    // function chShowDialog(){
    //     if(!en.current || !en.current.chValue)
    //         return;
        
    //     pausebeforech=$('#video')[0].paused;
    //     //let _this = this
    //     let _time = $('#video')[0].currentTime*1000
    //     $('.chDialog').css("display","block")
    //     $('.chDialog div').html(en.current.chValue.replace(/\\n/g,'<br/>'))
    //     pauseVideo()
    // }
    // function chHideDialog(){
    //     // $('#video')[0].play();
    //     $('.chDialog').css("display","none")
    //     if(pausebeforech){
    //         pauseVideo()
    //     }else{
    //         recoverManual()
    //     }
    // }

    function timeCycle(_value){
        let _time = _value.split(':')
        let ms = 0;
        _time.forEach((item,inx) =>{
            switch(inx){
            case 0:
                ms += parseFloat(item) * 60*60*1000
                break;
            case 1:
                ms += parseFloat(item) * 60*1000
                break;
            case 2:
                ms += parseFloat(item) * 1000
                break;
            }
        })
        return ms
    }



    // function touchstartFn(_value){
    //     //let _this = this,
    //     _coordinates = {
    //         clientX : _value.changedTouches[0].clientX,
    //         clientY : _value.changedTouches[0].clientY,
    //         pageX : _value.changedTouches[0].pageX,
    //         pageY : _value.changedTouches[0].pageY
    //     };
    //     choooseStart(_coordinates);
    // }
    // function touchmoveFn(_value){
    //     //let _this = this,
    //     _coordinates = {
    //         clientX : _value.changedTouches[0].clientX,
    //         clientY : _value.changedTouches[0].clientY,
    //         pageX : _value.changedTouches[0].pageX,
    //         pageY : _value.changedTouches[0].pageY
    //     };
    //     choooseMove(_coordinates);
    // }
    // function touchendFn(_value){
    //     //let _this = this,
    //     _coordinates = {
    //         clientX : _value.changedTouches[0].clientX,
    //         clientY : _value.changedTouches[0].clientY,
    //         pageX : _value.changedTouches[0].pageX,
    //         pageY : _value.changedTouches[0].pageY
    //     };
    //     choooseEnd(_coordinates);
    // }
    // function choooseStart(_value){
    //     //log.debug(_value)
    //     page.dovideoshadow=1
    //     pauseVideo()
    //     console.dir($("#zh_subtitles").height())
    //     let width = $("#zh_subtitles").width() + $("#zh_subtitles").offset().left - 5,
    //     height = $("#zh_subtitles").height() + $("#zh_subtitles").offset().top - 5;

    //     ////let _this = this;
    //     chooseDomList = [];
    //     $('#zh_subtitles span').css({"background": "transparent","color": "black"})
        
    //     ele = document.elementFromPoint(_value.pageX, _value.pageY);
    //     if(!$(ele).hasClass('font'))
    //         return;
    //     let mx = _value.clientX || _value.pageX
    //     let my = _value.clientY || _value.pageY
    //     if((width - 5)>mx && mx>($("#zh_subtitles").offset().left+ 5) && ($("#zh_subtitles").offset().top +5)<my && my<(height - 5)){
    //         if(ele.className.lastIndexOf('font span ')<0){
    //             // 匹配是否是上次点击的字段
    //             // && ele.innerHTML!= translationtext && !chooseDomList.length && translationtext.indexOf(ele.innerHTML)<0
    //             if(ele.innerHTML!=" "){
    //                 chooseDomList.push({
    //                     class:ele.className,
    //                     value:ele.innerHTML,
    //                 })
    //                 $('.'+ele.className.split(' ')[1]).css({
    //                     'background' : '#d2cbcb',
    //                     'color' : 'black'
    //                 })
    //             }
    //         }
    //     }
    // }
    // function choooseMove(_value){
    //     //let _this = this,
    //     ele = document.elementFromPoint(_value.pageX, _value.pageY);
    //     if(!$(ele).hasClass('font'))
    //         return;
    //     let mx = _value.clientX || _value.pageX
    //     let my = _value.clientY || _value.pageY
    //     let width = $("#zh_subtitles").width() + $("#zh_subtitles").offset().left,
    //     height = $("#zh_subtitles").height() + $("#zh_subtitles").offset().top;
    //     if((width - 5)>mx && mx>($("#zh_subtitles").offset().left + 5) && ($("#zh_subtitles").offset().top + 5)<my && my<(height - 5)){
    //         if(ele.className.lastIndexOf('font span ')<0){
    //             let status = true;
    //             chooseDomList.findIndex(function(_value, inx){
    //                 if(_value.class == ele.className){
    //                     status=false
    //                 }
    //             })
    //             if(status && ele.innerHTML!=" "){
    //                 if(chooseDomList.length){
    //                     let _last = parseInt(chooseDomList[chooseDomList.length-1].class.replace('font span',''));
    //                     let _now = parseInt(ele.className.replace('font span',''));
    //                     //log.debug(_now-_last)
    //                     if( _now == (_last+1)){
    //                         chooseDomList.push({
    //                             class:ele.className,
    //                             value:ele.innerHTML,
    //                         })
    //                         $('.'+ele.className.split(' ')[1]).css({
    //                             'background' : '#d2cbcb',
    //                             'color' : 'black'
    //                         })
    //                     }else if(_now > (_last+1)){
                            
    //                         for(let i = _last; i < _now; i++){
    //                             $('.span'+i)
    //                             chooseDomList.push({
    //                                 class:$('.span'+i).attr('class'),
    //                                 value:$('.span'+i).html(),
    //                             })
    //                             $('.span'+i).css({  
    //                                 'background' : '#d2cbcb',
    //                                 'color' : 'black'
    //                             })
    //                         }
    //                     }else{
    //                         for(let i = _now; i < _last; i++){
    //                             $('.span'+i)
    //                             chooseDomList.push({
    //                                 class:$('.span'+i).attr('class'),
    //                                 value:$('.span'+i).html(),
    //                             })
    //                             $('.span'+i).css({
    //                                 'background' : '#d2cbcb',
    //                                 'color' : 'black'
    //                             })
    //                         }
    //                     }
    //                 }else{
    //                     chooseDomList.push({
    //                         class:ele.className,
    //                         value:ele.innerHTML,
    //                     })
    //                     $('.'+ele.className.split(' ')[1]).css({
    //                         'background' : '#d2cbcb',
    //                         'color' : 'black'
    //                     })
    //                 }
    //             }
    //         }
    //     }
    // }
    // function choooseEnd(_value){
    //     ////let _this = this;
    //     ele = document.elementFromPoint(_value.pageX, _value.pageY);
    //     for(let i=0;i<chooseDomList.length-1;i++){
    //         for(let j=0;j<chooseDomList.length-i-1;j++){
    //             if(parseInt(chooseDomList[j].class.replace('font span',''))>parseInt(chooseDomList[j+1].class.replace('font span',''))){
    //                 let _swap = chooseDomList[j];
    //                 chooseDomList[j] = chooseDomList[j+1];
    //                 chooseDomList[j+1] = _swap;
    //             }
    //         }
    //     }
    //     let _data = ''
    //     $(chooseDomList).each(function(inx,item){
    //         if(inx>0){
    //             _data+=' '+item.value.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
    //         }else{
    //             _data=item.value.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
    //         }
    //     })
    //     // 匹配是否是上次点击的字段
    //     // && translationtext != _data && translationtext.indexOf(_data)<0
    //     if(_data){
    //         translationtext = _data;
    //         translatee(_data)
    //     }else{
    //         translationtext = ""
    //     }
    //     $('.searchClass').blur();
    // }


    var currwordno=0;
    var keyCodes=[]
    document.onkeydown = function(event){
　　　　 var e  = event  ||  window.e;
　　　　 var keyCode = e.keyCode || e.which;

        keyCodes=[]
        var last = keyCodes.pop()
        if(last != null && last != undefined)
            keyCodes.push(last)
        if(keyCode!=last)
            keyCodes.push(keyCode)
        //log.debug(keyCodes+" down")
        var keyy = keyCodes.join()
        switch(keyy){
    　　　　 case '27'://esc
                $('#summtrans').hide()
                $('#summtrans-word').text('')
                $('#summtrans-phonetic').text('').hide()
                $('#summtrans-speak').attr('play-url','').hide()
                $('#summtrans-value').hide()
                $('#summtrans-vv').text('')

                $('#wordsframe').hide()
                $('#word-in').val('')
                $('#words .word').remove()
                $('#videobox').css('top',0)
                break;
    　　　　 case '32'://space
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                if($('#video')[0].paused){
                    playVideo()
                    page.manual=1
                }
                else{
                    page.manual=2
                    pauseVideo();
                }
        　　　　 break;
            case '13'://enter
                if(document.activeElement.tagName!="INPUT")
                    search();
        　　　　 break;
            case '97'://A
            case '65'://a
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                prevline()
        　　　　 break;
            case '115'://S
            case '83'://s
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                troggleLoopLine()
        　　　　 break; 
            case '119'://W
            case '87'://w
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                chdialog()
        　　　　 break;
            case '100'://D
            case '68'://d
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                nextline()
        　　　　 break;
            case '113'://Q
            case '81'://q
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                if(currwordno<=1)
                    currwordno=en.currentwords.length
                else
                    currwordno--;
                locateWord(currwordno)
        　　　　 break;
            case '101'://E
            case '69'://e
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                currwordno++;
                if(currwordno>en.currentwords.length)
                    currwordno=1
                locateWord(currwordno)
        　　　　 break;
        }
        
    }



    function locateWord(no){
        currwordno = no;
        $('.font').css({
            'background' : 'transparent'
        })
        $('.font.span'+(currwordno-1)).css({
            'background' : '#d2cbcb'
        })
        page.dovideoshadow=1
        pauseVideo()
        $('#summtrans-word').show()
        if(currwordno>0){
            $('#wordsframe').hide()
            var word = en.currentwords[currwordno-1];
            translatee(word,1)
        }
    }

    document.onkeyup = function(event){      
        //log.debug(keyCodes+" up")
        keyCodes.pop()　
    }
    document.onfocus = function(){
        //log.debug('document.blur()')
        keyCodes=[]
    }

    window.onbeforeunload=function(){
        //log.debug('onbeforeunload')
        navigator.sendBeacon("/mumu/page-out");
        log.flush()
    }
    var lastTouchEnd;
    document.addEventListener('touchend', function(event) {
        var now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);


    onresize()
    function onresize(){
        // if(isPc()){
        //     $('#gearframe1').hide()
        //     $('#pcrecommand').text('控制键(a,s,d,space) 翻译键(q,w,e,enter)')
        // }else{
        //     $('#gearframe1').show()
        //     $('#pcrecommand').text('PC端操作更方便')
        // }
        // if(video.height && video.width)
        //     $('#video').css('height',parseInt($('#video').css('width').replace('px',''))*(video.height/video.width))
    }
    $(document.body).bind('resize',function(){
        onresize()
    })

    function search(){
        var word =pureWord($('#word-in').val());
        if(document.activeElement == $('#word-in')[0]){
            $('#wordsframe').hide()
            loadRelatedWords(word)
            translatee(word,1)
            if(!$('#word-in').val()){
                $('#summtrans').hide()
                $('#wordsframe').hide()
                $('#videobox').css('top',0)
            }
        } else {
            $('#words .word').remove()
            $('#summtrans').hide()
            $('#wordsframe').show()
            $('#word-in').focus()
            $('#word-in').trigger("input")
            pauseVideo();
            doshadow()
        }
    }

    function toSearch(){
        $('#words .word').remove()
        $('#summtrans').hide()
        $('#wordsframe').show()
        $('#word-in').focus()
        $('#word-in').trigger("input")
        pauseVideo();
        doshadow()
    }

    if(is_weixn()){
        $.post('/mumu/wxjsapiticket',(res)=>{
            $.post('/mumu/wxsign',{ticket:res.data.ticket,url:location.href},(res)=>{
                //log.debug(JSON.stringify(res));
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appid, // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr:  res.data.nonceStr, // 必填，生成签名的随机串
                    signature:  res.data.signature,// 必填，签名
                    jsApiList: ['updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的JS接口列表
                });
            })
        })

        var shareLink = location.origin+'/mumu?videoNo='+videoNo;
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
            wx.updateAppMessageShareData({ 
                title: ttb(video.chname), // 分享标题
                desc: '幕幕 - 短视频练英语\n'+(ttb(video.reference)||ttb(video.seriesChname)), // 分享描述
                link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
                success: function () {
                    // 设置成功
                }
            })

            wx.updateTimelineShareData({ 
                title: ttb(video.chname) + '\n幕幕 - 短视频练英语', // 分享标题
                link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
                success: function () {
                // 设置成功
                }
            })
        });
    }
    

    function genShareData(){
        shareLink = location.origin+'/mumu?videoNo='+videoNo;
        wx.updateAppMessageShareData({ 
            title: ttb(video.chname), // 分享标题
            desc: '幕幕 - 短视频练英语\n'+(ttb(video.reference)||ttb(video.seriesChname)), // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
            success: function () {
                // 设置成功
            }
        })

        wx.updateTimelineShareData({ 
            title: ttb(video.chname) + '\n幕幕 - 短视频练英语', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
            success: function () {
            // 设置成功
            }
        })
    }
    
    function lightkeytrans(ss){
        if(!ss)
            return ss
        var sss= ss.match(/(\w*)\s*?(的过去|的现在|的复数|的第三|的ing)/)
        if(!sss)
            return ss;
        ss = ss.replace(sss[1],`<span class="lightkeytrans" style="text-decoration: underline;cursor:pointer;margin:0 5px;color: bisque;">${sss[1]}</span>`)
        return ss;
    }
    function lightkeytrans1(ss){
        if(!ss)
            return ss
        var sss=ss.replace(/(\w+)/g,`<span class="lightkeytrans" style="text-decoration: underline;cursor:pointer;margin:0 3px 0 0;color: bisque;">$1</span>`)
        sss= sss.replace(/<span.+?>(vi|adj|vt|pron|n|v|num|adv|art|conj|prep|abbr|int)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(vi)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(adj)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(vt)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(porn)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(n)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(v)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(num)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(adv)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(art)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(conj)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(prep)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(abbr)<\/span>/,'$1')
        // sss= sss.replace(/<span.+?>(int)<\/span>/,'$1')
        return sss;
    }

    $('#video').bind('play',function(){
        videoPlay()
    }).bind('pause',function(){
        videoPause()
    }).bind('mouseover',function(){
        //$('#video').attr('controls', true)
    }).bind('mouseout',function(){
        //$('#video').attr('controls', false)
    }).bind('canplay',function(){
        onCanPlay()
    }).bind('durationchange',function(){
        onDurationChange()
    }).bind('loadeddata',function(){
        onLoadedData()
    }).bind('loadstart',function(){
        onLoadStart()
    }).bind('playing',function(){
        onPlaying()
    }).bind('progress',function(){
        onProgress()
    }).bind('readystatechange',function(){
        onReadyStateChange()
    }).bind('suspend',function(){
        onSuspend()
    }).bind('timeupdate',function(){
        onTimeUpdate()
    }).bind('waiting',function(){
        onWaiting()
    }).bind('click',function(){
        onClick()
    }).bind('loadedmetadata',function(){
        onLoadedMetadata()
    }).bind('touchend',function(){
        //$('#video').attr('controls', true);
    }).bind('focus',function(){
        //$('#video').attr('controls', true)
    }).bind('blur',function(){
        //$('#video').attr('controls', false);
    })


    $('#summtrans-word').bind('click',function(){
        log.info('#summtrans-word.click')
        $('#summtrans').hide()
        $('#wordsframe').show()
        $('#word-in').val(this.innerText).focus()
        $('#word-in').trigger('input')
        
    })

    $('#summtrans-speak').bind('click',function(){
        log.info('#summtrans-speak.click')
        if(!this.audio){
            this.audio=new Audio();
        }
        this.audio.src=$(this).attr('play-url')
        this.audio.play()
    })

    $('#wordtempl').bind('click',function(){
        log.info('#wordtempl.click')
        $('#wordsframe').hide()
        $('#word-in').val('')
        $('#words .word').remove()
        loadRelatedWords(this.item.word)
        translatee(this.item.word,1)
    })

    $('#word-in').bind('input',function(){
        log.info('#word-in.input')
        var tag = $('#word-in')[0]
        var value  =$('#word-in')[0].value

        if(value==''){
            $('#wordsframe_cancel').show()
        }else{
            $('#wordsframe_cancel').hide()
        }
        clearTimeout(page.ssssaaa)
        page.ssssaaa=setTimeout(function(){
            $('#words .word').remove()
        },1000)
        if(value){
            page.words1ajaxs.push($.ajax({
                url:'/mumu/words1',
                data:{
                    kw:value,
                    rstart:1,
                    rcount:100,
                    from:video.language,
                    to:2
                },
                ajaxCache:{
                    timeout: 30 * 24 * 60 * 60
                },
                success:function(res){
                    if(tag.value==value){
                        clearTimeout(page.ssssaaa)
                        $('#words .word').remove()
                        var words = res.data.words
                        $(words).each((inx,item)=>{
                            var wordele = $('#wordtempl').clone(true)
                            wordele[0].item=item
                            wordele.attr('id','word'+item.id)
                            wordele.addClass('word')
                            wordele.html(item.word+'&nbsp;&nbsp;'+(item.phonetic?'/'+item.phonetic+'/':'')+'&nbsp;&nbsp;'+(item.explain||''))
                            $('#words').append(wordele)
                            wordele.show();
                        })
                    }
                }
            }))
        }else{
            $('#words .word').remove();
        }
    })







    $('#startFn,#startFn1').bind('mousedown',function() {
        if(isMobile())
            return;
        log.info(`#startFn.mousedown`)
        page.startt=new Date()
        clearTimeout(page.dddd)
        page.dddd = setTimeout(function(){
            if(page.diandu){
                page.diandu=0
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(191, 187, 187)")
            }else{
                page.diandu=1
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
            }
        },1000)
    }).bind('mouseup',function() { 
        if(isMobile())
            return;
        log.info(`#startFn.mouseup`)
        page.manual=1
        clearTimeout(page.dddd)
        if(page.startt){
            page.endt=new Date()
            var ss = page.endt.getTime()-page.startt.getTime();
            if(ss<1000){
                playVideo()
                //$('#video').attr('controls', false);
            }
        }
    }).bind('touchstart',function() { 
        log.info(`#startFn.touchstart`)
        page.startt=new Date()
        clearTimeout(page.dddd)
        page.dddd = setTimeout(function(){
            if(page.diandu){
                page.diandu=0
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(191, 187, 187)")
            }else{
                page.diandu=1
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
            }
        },1000)
    }).bind('touchend',function() { 
        log.info(`#startFn.touchend`)
        clearTimeout(page.dddd)
        page.manual=1
        if(page.startt){
            page.endt=new Date()
            var ss = page.endt.getTime()-page.startt.getTime();
            if(ss<1000){
                playVideo()
                //$('#video').attr('controls', false);
            }
        }
    })


    $('#stopFn,#stopFn1').bind('mousedown',function() { 
        if(isMobile())
            return;
        log.info(`#stopFn.mousedown`)
        page.startt=new Date()
        clearTimeout(page.dddd)
        page.dddd = setTimeout(function(){
            if(page.diandu){
                page.diandu=0
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(191, 187, 187)")
            }else{
                page.diandu=1
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
            }
        },1000)
    }).bind('mouseup',function() { 
        if(isMobile())
            return; 
        log.info(`#stopFn.mouseup`)
        page.manual=2
        clearTimeout(page.dddd)
        if(page.startt){
            page.endt=new Date()
            var ss = page.endt.getTime()-page.startt.getTime();
            if(ss<1000){
                pauseVideo()
                //$('#video').attr('controls', false);
            }
        }
    }).bind('touchstart',function() { 
        log.info(`#stopFn.touchstart`)
        page.startt=new Date()
        clearTimeout(page.dddd)
        page.dddd = setTimeout(function(){
            if(page.diandu){
                page.diandu=0
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(191, 187, 187)")
            }else{
                page.diandu=1
                $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
            }
        },1000)
    }).bind('touchend',function() { 
        log.info(`#stopFn.touchend`)
        clearTimeout(page.dddd)
        page.manual=2
        if(page.startt){
            page.endt=new Date()
            var ss = page.endt.getTime()-page.startt.getTime();
            if(ss<1000){
                pauseVideo()
                //$('#video').attr('controls', false);
            }
        }
    })


    $('#prevline').bind('click',function(){
        log.info('#prevline.click')
        // if(!loopLine)
        //     pauseVideo()
        prevline()
    })
    $('#currline').bind('click',function(){
        log.info('#nextline.click')
        currline()
    })
    $('#nextline').bind('click',function(){
        log.info('#nextline.click')
        // if(!loopLine)
        //     pauseVideo()
        nextline()
    })

    $('#gear').bind('touchstart',function(event){
        log.info('#gear.touchstart')
        var touch = event.targetTouches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
    }).bind('touchmove',function(event){
        if(!this.startX || !this.startY)
            return
        var touch = event.targetTouches[0];
        this.endX = touch.pageX;
        this.endY = touch.pageY;
        var distanceX=this.endX-this.startX;
        var distanceY=this.endY-this.startY;
        //log.debug('distanceX: '+distanceX+' lastDist: '+this.lastDist)

        if(this.lastDist==null||this.lastDist==undefined)
            this.lastDist=distanceX;
        var dd = distanceX-this.lastDist;
        this.lastDist=distanceX;
        var left = parseInt(this.style.left.replace('px'))+dd;
        if(left <=0 && left>=-4900)
            this.style.left=left+'px';
        if(!this.xx)
            this.xx=0
        this.xx=this.xx+dd;
        var wno = null;
        if(this.xx>30){
            wno = currwordno
            wno++;
        }else if(this.xx < -30){
            wno = currwordno
            wno--;
        }

        if(en.current && en.current.enValue && wno != null){
            if(wno<1)
                wno=en.currentwords.length;
            if(wno>en.currentwords.length)
                wno=1
            page.dovideoshadow=1
            pauseVideo()
            locateWord(wno)
            this.xx=0
        }
        event.preventDefault()
    }).bind('touchend',function(event){
        log.info('#gear.touchend')
        this.startX=null
        this.startY=null
        this.endX = null;
        this.endY = null;
        this.lastDist=null
        this.xx=0
    })

    $('#gear').bind('mousedown',function(event){
        log.info('#gear.mousedown')
        this.startX = event.pageX;
        this.startY = event.pageY;
    }).bind('mousemove',function(event){
        if(!this.startX || !this.startY)
            return
        this.endX = event.pageX;
        this.endY = event.pageY;
        var distanceX=this.endX-this.startX;
        var distanceY=this.endY-this.startY;
        //log.debug('-distanceX: '+distanceX+' lastDist: '+this.lastDist)

        if(this.lastDist==null||this.lastDist==undefined)
            this.lastDist=distanceX;
        var dd = distanceX-this.lastDist;
        this.lastDist=distanceX;
        var left = parseInt(this.style.left.replace('px'))+dd;
        if(left <=0 && left>=-4900)
            this.style.left=left+'px';
        if(!this.xx)
            this.xx=0
        this.xx=this.xx+dd;
        var wno = null;
        if(this.xx>30){
            wno = currwordno
            wno++;
        }else if(this.xx < -30){
            wno = currwordno
            wno--;
        }
        if(en.current && en.current.enValue && wno != null){
            if(wno<1)
                wno=en.currentwords.length;
            if(wno>en.currentwords.length)
                wno=1
            page.dovideoshadow=1
            pauseVideo()
            locateWord(wno)
            this.xx=0
        }
        //event.preventDefault()
    }).bind('mouseup',function(event){
        log.info('#gear.mouseup')
        this.startX=null
        this.startY=null
        this.endX = null;
        this.endY = null;
        this.lastDist=null
        this.xx=0
    })

    $('#replay').bind('click',function(event){
        log.info('#replay.click')
        $('#video')[0].load()
        //setTimeout(function(){$('#video')[0].muted=false},500)
    })
    $('#hideBtn').bind('click',function(event){
        log.info('#hideBtn.click')
        enSubtitlesShow()
    })
    $('#wholebtn').bind('click',function(event){
        log.info('#wholebtn.click')
        chdialog()
    })
    $('#searchbtn').bind('click',function(event){
        log.info('#searchbtn.click')
        toSearch()
    })

    doSubtitlesStatus()
    function doSubtitlesStatus(){
        if(!page.subtitlesStatus)
            page.subtitlesStatus=0
        page.subtitlesStatus++;
        //chDialog zh_subtitles
        if(page.subtitlesStatus>3){
            page.subtitlesStatus=1
        }
        if(page.subtitlesStatus==1){
            $('#chDialog').css('visibility','visible')
            $('#zh_subtitles').css('visibility','visible')
        }else if(page.subtitlesStatus==2){
            $('#chDialog').css('visibility','hidden')
            $('#zh_subtitles').css('visibility','visible')
        }else if(page.subtitlesStatus==3){
            $('#chDialog').css('visibility','hidden')
            $('#zh_subtitles').css('visibility','hidden')
        }
    }
    $('#subtitlesBtn').click(function(){
        doSubtitlesStatus()
    })

    function chdialog(){
        if($('#chDialog').is(':hidden')){
            $('#chDialog').show()
            $('#wholebtnlash').hide()
        }else{
            $('#chDialog').hide()
            $('#wholebtnlash').show()
        }
    }


    document.body.addEventListener('click',function(){
        //log.debug(event.target)
    })


    $('#goPrevVideo').click(function(){
        log.info('#goPrevVideo.click')
        goPrevVideo()
    })
    $('#goNextVideo').click(function(){
        log.info('#goNextVideo.click')
        goNextVideo()
    })


    function recoverManual(){
        if(page.manual){
            if(page.manual==1){
                playVideo()
            }else if(page.manual==2){
                pauseVideo()
            }
        }
    }
   
    $('#word-in').bind('focus',function(){
        this.select()
        for (const ajax of page.translateajaxs) {
            ajax.abort()
        }
        for (const ajax of page.words1ajaxs) {
            ajax.abort()
        }
        if(this.value==''){
            $('#wordsframe_cancel').show()
        }else{
            $('#wordsframe_cancel').hide()
        }
    })


    // $('#chatpadhidebtn').click(function(){
    //     $('#chatpad').css('height',(geteletop($('#controlpad')[0])-45)+'px')
    //     $('#chatpad').slideUp(100)
    // })

    $('#searchclear').click(function(){
        searchKw=''
        searchtag=''
        $('#searchpad').slideUp(100)
        if(page.onlyLookUserNo)
            $('#onlyLookHim').click()
        page.seed = Math.ceil(Math.random()*100);
        page.exploreVideos.rows=[]
        page.exploreVideos.currRows=[]
        page.exploreVideos.inx=0
        page.exploreVideos.rstart=0

        page.onlyLookHimVideos.rows=[]
        page.onlyLookHimVideos.currRows=[]
        page.onlyLookHimVideos.inx=0
        page.onlyLookHimVideos.rstart=0

        page.trueVideos.rows=[]
        page.trueVideos.currRows=[]
        page.trueVideos.noes=[]
        page.trueVideos.map={}
        page.trueVideos.inx=0
        page.trueVideos.rstart=0
        closeLoopVideos()
        goNextVideo()
    })

    $('.searchtag').click(function(){
        searchtag=$(this).attr('data')
        $('#searchpad').slideUp(100)
        if(page.onlyLookUserNo)
            $('#onlyLookHim').click()
        page.exploreVideos.rows=[]
        page.exploreVideos.currRows=[]
        page.exploreVideos.inx=0
        page.exploreVideos.rstart=0

        page.onlyLookHimVideos.rows=[]
        page.onlyLookHimVideos.currRows=[]
        page.onlyLookHimVideos.inx=0
        page.onlyLookHimVideos.rstart=0

        page.trueVideos.rows=[]
        page.trueVideos.currRows=[]
        page.trueVideos.noes=[]
        page.trueVideos.map={}
        page.trueVideos.inx=0
        page.trueVideos.rstart=0
        closeLoopVideos()
        goNextVideo()
    })

  
  

    $('#wordbookpad').bind('mousedown touchstart',function(e){
        this.touchstartTime = new Date().getTime();
        if(e.type=='touchstart'){
            var touch = e.targetTouches[0];
            this.touchstartX = touch.pageX;
            this.touchstartY = touch.pageY;
        }else if(e.type=='mousedown'){
            this.touchstartX = e.pageX;
            this.touchstartY = e.pageY;
        }
    }).bind('mousemove touchmove',function(e){
        if(e.type=='touchmove'){
            var touch = e.targetTouches[0];
            this.touchendX = touch.pageX;
            this.touchendY = touch.pageY;
        }else if(e.type=='mousemove'){
            this.touchendX = e.pageX;
            this.touchendY = e.pageY;
        }

        var parentEle=null;
        while(true){
            if(!parentEle)
                parentEle=$(e.target);
            else
                parentEle = $(parentEle).parent()

            if(parentEle.scrollTop()>0){
                break;
            }
            if(parentEle.length==0)
                break
            
            if(parentEle == this)
                break;
        }
        this.scrollEle = parentEle;
    }).bind('mouseup touchend',function(e){
        if(this.scrollEle && this.scrollEle.length==0 && this.touchendY-this.touchstartY>100){
            $('#wordbookpad').slideUp(100)
            //$('#gearframe1').show()
            $('#prevnextpad').show()
            $('#subtitlePad').show()
        }
        this.touchstartY=null
        this.touchendY=null
    })






    $('#wordbookpadBtn').click(function(){
        $('#wordbookpad').css('height',($(window).height()-($('#video').height()+$('#controlpad').height()+20))+'px')
        $('#wordbookpad').slideDown(100)
        //$('#gearframe1').hide()
        $('#prevnextpad').hide()
        $('#subtitlePad').hide()
        pauseVideo()
        
        if(page.wordbooks.rows.length==0)
            loadMoreWordbooks()
    })

    $('#searchpadbtn').click(function(){
        $('#searchpad').css('height',($('#video').height())+'px')
        $('#searchpad').slideDown(100)
    })
    $('#searchpad').bind('touchstart',function(e){
        var touch = e.targetTouches[0];
        this.touchstart = touch.pageY;
    }).bind('touchmove',function(e){
        var touch = e.targetTouches[0];
        this.touchend = touch.pageY;
        if($(this).scrollTop()==0 && this.touchstart<this.touchend){
            e.preventDefault()
        }
    }).bind('touchend',function(e){
        if(this.touchstart-this.touchend>50){
            $('#searchpad').slideUp(100)
        }
        this.touchstart=null
        this.touchend=null
    })

    $('#searchpad').bind('mousedown',function(e){
        this.touchstart = e.pageY;
    }).bind('mousemove',function(e){
        this.touchend = e.pageY;
        if($(this).scrollTop()==0 && this.touchstart<this.touchend){
            e.preventDefault()
        }
    }).bind('mouseup',function(e){
        if(this.touchend-this.touchstart>50){
            $('#searchpad').slideUp(100)
        }
        this.touchstart=null
        this.touchend=null
    })


    // var choseloopVideoCountPad=`
    //     <div id="choseloopVideoCountPad" style="background-color:rgba(0,0,0,0.9);position:absolute;top:0;left:0;right:0;bottom:0;display:none;">
    //         <div style="background-color:rgba(255,255,255);width:80%;position:absolute;top:30%;left:50%;transform:translateX(-50%);height:200px;">
    //             <div>1</div>
    //             <div>5</div>
    //             <div>10</div>
    //             <div>3</div>
    //         </div>
    //     </div>
    // `
    //$(choseloopVideoCountPad).appendTo($(document.body))
    $('#loopVideoBtn').click(function(){
        if(page.loopVideos.on){
            closeLoopVideos()
        }else{
            openLoopVideos()
        }
    })

    function openLoopVideos(){
        page.loopVideos.on=1
        $('#chooseLoopVideosCountPad').show()
        clearInterval(page.loopVideoChooseInterval)
        var second  = 3;
        $('#chooseLoopVideosCountPad .restSecond').text(second)
        $('#chooseLoopVideosCountPad .count'+page.loopVideos.count).css('background-color','#9b9b9b')
        page.loopVideoChooseInterval = setInterval(function(){
            $('#chooseLoopVideosCountPad .restSecond').text(--second)
            if(second== 0){
                clearInterval(page.loopVideoChooseInterval)
                $('#chooseLoopVideosCountPad').hide()
                $('#chooseLoopVideosCountPad .count'+page.loopVideos.count).click()
            }
        },1000)
    }
    function closeLoopVideos(){
        page.loopVideos.on=0
        $('#loopVideoBtn').css('background-color','unset')
        if(page.loopVideos.count > 1){
            $('#loopVideoBtn').css('line-height','33px')
            $('#loopVideoBtn').css('white-space','unset')
            $('#loopVideoBtn').text('循环')
        }
    }

    $('#chooseLoopVideosCountPad .count').click(function(){
        page.loopVideos.inx=1
        page.loopVideos.count = this.attributes.data.value
        $('#chooseLoopVideosCountPad .count').css('background-color','unset')
        $(this).css('background-color','#9b9b9b')

        if(page.loopVideos.count > 1){
            $('#loopVideoBtn').css('line-height','15px')
            $('#loopVideoBtn').css('white-space','break-spaces')
            $('#loopVideoBtn').text('循环\n'+page.loopVideos.inx+'/'+page.loopVideos.count)
        }
        clearInterval(page.loopVideoChooseInterval)
        $('#loopVideoBtn').css('background-color','#5a5a5a')
        $('#chooseLoopVideosCountPad').hide()
    })

    $('#chatminpad,#goChatBtn').click(function(){
        //$('#chatpad').css('height',(geteletop($('#controlpad')[0])-45)+'px')
        page.preChatPaused=$('#video')[0].paused
        $('#chatpad').css('height',($(window).height()-($('#video').height()+$('#controlpad').height()+20))+'px')
        //$('#gearframe1').hide()
        $('#prevnextpad').hide()
        $('#subtitlePad').hide()
        $('#chatpad').slideDown(100,function(){
        })
    })
    $('#chatroombtn').click(function(){
        $('#chatroompad').show();
        $('#chatprivatepad').hide();
        $(this).css('background-color','#d7d7d7')
        $('#chatprivatebtn').css('background-color','#737373')
    })
    $('#chatprivatebtn').click(function(){
        $('#chatroompad').hide();
        $('#chatprivatepad').show();
        $(this).css('background-color','#d7d7d7')
        $('#chatroombtn').css('background-color','#737373')
    })
    $('#index').bind('click',function(e){

        var transele = $(e.target).hasClass('translatable')?e.target:$(e.target).parents('.translatable')[0]
        if(transele){
            if(transele.transfrom){
                translatee(transele.transfrom,1)
            }
            else if(transele.innerText){
                translatee(transele.innerText,1)
            }
            
        }
    })

   


    page.spans =[]
    page.spansIs=0
    page.firstRangeWordInx=0
    page.lastRangeWordInx=0
    $('#zh_subtitles').bind('mousedown touchstart',function(e){
        log.info(`#zh_subtitles.`+e.type)
            var currTarget = null;
            if(e.type=='touchmove'){
                currTarget=document.elementFromPoint(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
            }else{
                currTarget = e.target;
            }
            if($(currTarget).hasClass('font')){
                page.firstRangeWordInx=0
                page.lastRangeWordInx=0
                pauseVideo()
                var index = parseInt($(currTarget).attr('index'));
                currwordno=index+1
                page.spansIs=1
                page.spans =[]
                page.firstRangeWordInx=index
                page.lastRangeWordInx=index
                $('#zh_subtitles .font').css('background-color','unset')
                $('#zh_subtitles .font.span'+index).css('background-color','#828282')
            }
    }).bind('mousemove touchmove',function(e){
        var currTarget = null;
        if(e.type=='touchmove'){
            currTarget=document.elementFromPoint(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
        }else{
            currTarget = e.target;
        }
        e.stopPropagation()
        if($(currTarget).hasClass('font')){
            if(!page.spansIs)
                return
            $('#zh_subtitles .font').css('background-color','unset')
            var index = parseInt($(currTarget).attr('index'));
            if(page.spans[page.spans.length-1] != index){
                page.spans.push(index)
            }
            var first = page.spans[0]
            var last = page.spans[page.spans.length-1]
            if(first>last){
                var t = first
                first=last
                last=t
            }
            page.firstRangeWordInx=first
            page.lastRangeWordInx=last
            for (var inx = first; inx <= last; inx++) {
                $('#zh_subtitles .font.span'+inx).css('background-color','#828282')
            }
        }
    }).bind('mouseup touchend',function(e){
        log.info(`#zh_subtitles.`+e.type)
            var currTarget = null;
            if(e.type=='touchmove'){
                currTarget=document.elementFromPoint(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
            }else{
                currTarget = e.target;
            }
            if($(currTarget).hasClass('font')){
                if(page.spansIs){
                    var first = page.firstRangeWordInx
                    var last = page.lastRangeWordInx
                    var word = '';
                    for (var inx = first; inx <= last; inx++) {
                        word+=($('#zh_subtitles .font.span'+inx).text()+' ')
                    }
                    word=word.substr(0,word.length-1)
                    page.dovideoshadow=1
                    pauseVideo()
                    loadRelatedWords(word)
                    translatee(word,1)
                    page.spansIs=0
                    page.spans =[]
                }
            }
    })

    // $('#index').bind('touchstart',function(e){
    //     this.startTime = new Date().getTime();
    //     if($(e.target).parents('.scrollable').length>0)
    //         return;
    //     if($(e.target).parents('#gearframe1,#zh_subtitles,#prevnextpad,#chatpad').length>0)
    //         return;
    //     var touch = e.targetTouches[0];
    //     this.indextouchstartX = touch.pageX;
    //     this.indextouchstartY = touch.pageY;
    // }).bind('touchmove',function(e){
    //     if($(e.target).parents('.scrollable').length>0)
    //         return;
    //     if($(e.target).parents('#gearframe1,#zh_subtitles,#prevnextpad,#chatpad').length>0)
    //         return;
    //     var touch = e.targetTouches[0];
    //     if(this.indextouchstartX && this.indextouchstartY && this.indextouchendX && this.indextouchendY){
    //         $('#video1').css('left',(parseInt($('#video1').css('left').replace('px',''))+ touch.pageX-this.indextouchendX)+'px')
    //         $('#video2').css('left',(parseInt($('#video2').css('left').replace('px',''))+ touch.pageX-this.indextouchendX)+'px')
    //     }
    //     this.indextouchendX = touch.pageX;
    //     this.indextouchendY = touch.pageY;
    //     if($(e.target).scrollTop()==0 && this.indextouchstartY<this.indextouchendY){
    //         e.preventDefault()
    //     }
    // }).bind('touchend',function(e){
    //     this.endTime = new Date().getTime();
    //     if($(e.target).parents('.scrollable').length>0)
    //         return;
    //     if($(e.target).parents('#gearframe1,#zh_subtitles,#prevnextpad,#chatpad').length>0)
    //         return;
    //     //log.debug(`startX=${this.indextouchstartX} endX=${this.indextouchendX} startY=${this.indextouchstartY} endY=${this.indextouchendY}`)
    //     log.debug(this.endTime-this.startTime)
    //     $('#video1').css('left','100%')
    //     $('#video2').css('left','-100%')
    //     if(this.endTime-this.startTime < 500 && this.indextouchstartX && this.indextouchstartY && this.indextouchendX && this.indextouchendY){
    //         if(this.indextouchstartX-this.indextouchendX>100){
    //             goNextVideo()
    //         }else if(this.indextouchstartX-this.indextouchendX<-100){
    //             goPrevVideo()
    //         }
    //     }
        
    //     this.indextouchstartX=null
    //     this.indextouchstartY=null
    //     this.indextouchendX=null
    //     this.indextouchendY=null
    // })


    // $('#index').bind('mousedown',function(e){
    //     this.startTime = new Date().getTime();
    //     if($(e.target).parents('.scrollable').length>0)
    //         return;
    //     if($(e.target).parents('#gearframe1,#zh_subtitles,#prevnextpad,#chatpad').length>0)
    //         return;
    //     this.indextouchstartX = e.pageX;
    //     this.indextouchstartY = e.pageY;
    // }).bind('mousemove',function(e){
    //     if($(e.target).parents('.scrollable').length>0)
    //         return;
    //     if($(e.target).parents('#gearframe1,#zh_subtitles,#prevnextpad,#chatpad').length>0)
    //         return;
        
        
    //     if(this.indextouchstartX && this.indextouchstartY && this.indextouchendX && this.indextouchendY){
    //         $('#video1').css('left',(parseInt($('#video1').css('left').replace('px',''))+e.pageX-this.indextouchendX)+'px')
    //         $('#video2').css('left',(parseInt($('#video2').css('left').replace('px',''))+e.pageX-this.indextouchendX)+'px')
    //     }

    //     this.indextouchendX = e.pageX;
    //     this.indextouchendY = e.pageY;

    //     if($(e.target).scrollTop()==0 && this.indextouchstartY<this.indextouchendY){
    //         e.preventDefault()
    //     }

        
    // }).bind('mouseup',function(e){
    //     this.endTime = new Date().getTime();
    //     if($(e.target).parents('.scrollable').length>0)
    //         return;
    //     if($(e.target).parents('#gearframe1,#zh_subtitles,#prevnextpad,#chatpad').length>0)
    //         return;

    //     $('#video1').css('left','100%')
    //     $('#video2').css('left','-100%')
    //     //log.debug(`startX=${this.indextouchstartX} endX=${this.indextouchendX} startY=${this.indextouchstartY} endY=${this.indextouchendY}`)
    //     if(this.endTime-this.startTime < 500 && this.indextouchstartX && this.indextouchstartY && this.indextouchendX && this.indextouchendY){
            
    //         if(this.indextouchstartX-this.indextouchendX>100){
    //             goNextVideo()
    //         }else if(this.indextouchstartX-this.indextouchendX<-100){
    //             goPrevVideo()
    //         }
    //     }
        
    //     this.indextouchstartX=null
    //     this.indextouchstartY=null
    //     this.indextouchendX=null
    //     this.indextouchendY=null

       
    // })

    
$('#index').unbind('touchstart mousedown').bind('touchstart mousedown',function(e){
    this.touchstartTime = new Date().getTime();
    if(e.type=='touchstart'){
        var touch = e.targetTouches[0];
        this.touchstartX = touch.pageX;
        this.touchstartY = touch.pageY;
    }else if(e.type=='mousedown'){
        this.touchstartX = e.pageX;
        this.touchstartY = e.pageY;
    }
  }).unbind('touchmove mousemove').bind('touchmove mousemove',function(e){
    var touchendX;
    var touchendY;
    if(e.type=='touchmove'){
        var touch = e.targetTouches[0];
        touchendX = touch.pageX;
        touchendY = touch.pageY;
    }else if(e.type=='mousemove'){
        touchendX = e.pageX;
        touchendY = e.pageY;
    }

    if(this.touchstartX && this.touchstartY && this.touchendX && this.touchendY){
        if(Math.abs(this.touchstartX - touchendX) / Math.abs(this.touchstartY - touchendY) > 1 ){
            $('#video1').css('left',(parseInt($('#video1').css('left').replace('px',''))+touchendX-this.touchendX)+'px')
            $('#video2').css('left',(parseInt($('#video2').css('left').replace('px',''))+touchendX-this.touchendX)+'px')
        }
    }

    if(e.type=='touchmove'){
        var touch = e.targetTouches[0];
        this.touchendX = touch.pageX;
        this.touchendY = touch.pageY;
    }else if(e.type=='mousemove'){
        this.touchendX = e.pageX;
        this.touchendY = e.pageY;
    }

    var parentEle=null;
    while(true){
        if(!parentEle)
            parentEle=$(e.target);
        else
            parentEle = $(parentEle).parent()

        if(parentEle.scrollTop()>0){
            break;
        }
        if(parentEle.length==0)
            break
    }
    if(parentEle.length==0 && this.touchstartY<this.touchendY){
        e.preventDefault()
    }

    
  }).unbind('touchend mouseup').bind('touchend mouseup',function(e){
    this.touchendtime = new Date().getTime();
    
    
    
    if(this.touchendtime-this.touchstartTime < 500 && this.touchstartX && this.touchstartY && this.touchendX && this.touchendY){
        if(this.touchstartX-this.touchendX>100){
            clearInterval(page.vvvv)
            page.vvvv=setInterval(function(){
                var left = parseInt($('#video1').css('left').replace('px',''));
                left=left-20;
                if(left<0){
                    clearInterval(page.vvvv)
                    $('#video1').css('left','100%')
                    closeLoopVideos();
                    goNextVideo()
                }else{
                    $('#video1').css('left',left+'px')
                }
            },1)
        }else if(this.touchstartX-this.touchendX<-100){
            clearInterval(page.vvvv)
            page.vvvv=setInterval(function(){
                var left = parseInt($('#video2').css('left').replace('px',''));
                left=left+20;
                if(left>0){
                    clearInterval(page.vvvv)
                    $('#video2').css('left','-100%')
                    closeLoopVideos();
                    goPrevVideo()
                }else{
                    $('#video2').css('left',left+'px')
                }
            },1)
        }else{
            $('#video1').css('left','100%')
            $('#video2').css('left','-100%')
        }
        
    }else{
        $('#video1').css('left','100%')
        $('#video2').css('left','-100%')
    }

    this.touchstartTime=null
    this.touchendtime=null
    this.touchstartX=null
    this.touchstartY=null
    this.touchendX=null
    this.touchendY=null
  })

    $('#chatpad').bind('mousedown touchstart',function(e){
        this.touchstartTime = new Date().getTime();
        if(e.type=='touchstart'){
            var touch = e.targetTouches[0];
            this.touchstartX = touch.pageX;
            this.touchstartY = touch.pageY;
        }else if(e.type=='mousedown'){
            this.touchstartX = e.pageX;
            this.touchstartY = e.pageY;
        }
    }).bind('mousemove touchmove',function(e){
        if(e.type=='touchmove'){
            var touch = e.targetTouches[0];
            this.touchendX = touch.pageX;
            this.touchendY = touch.pageY;
        }else if(e.type=='mousemove'){
            this.touchendX = e.pageX;
            this.touchendY = e.pageY;
        }

        var parentEle=null;
        while(true){
            if(!parentEle)
                parentEle=$(e.target);
            else
                parentEle = $(parentEle).parent()

            if(parentEle.scrollTop()>0){
                break;
            }
            if(parentEle.length==0)
                break
            
            if(parentEle == this)
                break;
        }
        this.scrollEle = parentEle;
    }).bind('mouseup touchend',function(e){
        if(this.scrollEle && this.scrollEle.length==0 && this.touchendY-this.touchstartY>100){
            $('#chatpad').slideUp(100)
            //$('#gearframe1').show()
            $('#prevnextpad').show()
            $('#subtitlePad').show()
        }
        this.touchstartY=null
        this.touchendY=null
    })

    // $('#chatprivatebtn,#chatroombtn,#chatprivatepad,#chatinput').bind('touchstart',function(e){
    //     var touch = e.targetTouches[0];
    //     this.touchstart = touch.pageY;
    //     //log.debug("touchstart "+this.touchstart)
    // }).bind('touchmove',function(e){
    //     var touch = e.targetTouches[0];
    //     this.touchend = touch.pageY;
    //     if($(this).scrollTop()==0 && this.touchstart<this.touchend){
    //         e.preventDefault()
    //     }
    // }).bind('touchend',function(e){
    //     //log.debug("touchend "+this.touchend)
    //     if(this.touchend-this.touchstart>50){
    //        // $('#gearframe1').show()
    //         $('#prevnextpad').show()
    //         $('#chatpad').slideUp(100,function(){
    //         })
    //     }
    //     this.touchstart=null
    //     this.touchend=null
    // })

    // $('#chatprivatebtn,#chatroombtn,#chatprivatepad,#chatinput').bind('mousedown',function(e){
    //     //log.debug("mousedown "+ e.pageY)
    //     this.mousedown = e.pageY;
    // }).bind('mousemove',function(e){
    //     this.mouseup = e.pageY;
    //     if($(this).scrollTop()==0 && this.mousedown<this.mouseup){
    //         e.preventDefault()
    //     }
    // }).bind('mouseup',function(e){
    //     //log.debug("mouseup "+e.pageY)
    //     this.mouseup = e.pageY;
    //     if(this.mouseup-this.mousedown>50){
    //         //$('#gearframe1').show()
    //         $('#prevnextpad').show()
    //         $('#chatpad').slideUp(100,function(){
    //         })
    //     }
    //     this.mousedown=null
    //     this.mouseup=null
    // })

    // $('#chatmsgspad').bind('touchstart',function(e){
    //     var touch = e.targetTouches[0];
    //     this.touchstart = touch.pageY;
    //     //log.debug("touchstart "+this.touchstart)
    // }).bind('touchmove',function(e){
    //     var touch = e.targetTouches[0];
    //     this.touchend = touch.pageY;
    //     if($('#chatmsgspad').scrollTop()==0 && this.touchstart<this.touchend){
    //         e.preventDefault()
    //     }
    // }).bind('touchend',function(e){
    //     //log.debug("touchend "+this.touchend)
    //     if(this.touchend-this.touchstart>50 && $('#chatmsgspad').scrollTop()==0){
    //         //$('#gearframe1').show()
    //         $('#prevnextpad').show()
    //         $('#chatpad').slideUp(100,function(){
    //         })
    //     }
    //     this.touchstart=null
    //     this.touchend=null
    // })

    // $('#chatmsgspad').bind('mousedown',function(e){
    //     //log.debug("mousedown "+ e.pageY)
    //     this.mousedown = e.pageY;
    // }).bind('mousemove',function(e){
    //     this.mouseup = e.pageY;
    //     if($('#chatmsgspad').scrollTop()==0 && this.mousedown<this.mouseup){
    //         e.preventDefault()
    //     }
    // }).bind('mouseup',function(e){
    //     //log.debug("mouseup "+e.pageY)
    //     this.mouseup = e.pageY;
    //     if(this.mouseup-this.mousedown>50 && $('#chatmsgspad').scrollTop()==0){
    //         //$('#gearframe1').show()
    //         $('#prevnextpad').show()
    //         $('#chatpad').slideUp(100,function(){
    //         })
    //     }
    //     this.mousedown=null
    //     this.mouseup=null
    // })

    $('#word-in').keydown(function(){
        var evt = window.event || e;
        if (evt.keyCode == 13) {
            search()
        }
    })

    $('#chatinput').keydown(function(){
        var evt = window.event || e;
        if (evt.keyCode == 13) {
            if(this.value=='')
                return;
            var msg = this.value

            var o = {
                text:msg,
                action:1,
                looking:video.name
            }
            ws.send(JSON.stringify(o))

            // var ele = $('#chatmsgtemple').clone(true)
            // ele.attr('id','chatmsg'+1)
            // ele.css('color','green')
            // ele.text(msg)
            // ele.show();
            // $('#chatmsgspad').prepend(ele)
            this.value=''

            // $('#lastmsg').text(msg)
        }
    })
$('#wordsframe_cancel').click(function(){
    recoverManual()
    $('#wordsframe').hide()
    $('#videoshasow').hide()
    $('#videobox').css('top',0);
})
    
    

    var ws = null;
    initws()
    function initws(){
        ws = new WebSocket(`wss://${location.host}/mumu/websocket/${pagePre.login.userNo}`); 
        //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
        ws.onopen = function(){
        　　//当WebSocket创建成功时，触发onopen事件
            //log.debug("ws onopen");            
            page.ws=ws
        }
        ws.onmessage = function(e){
        　　//当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        　　//log.debug("ws onmessage: "+e.data);
            var data = JSON.parse(e.data)
            if(data.action == 1){
                if(data.nickname!=null){
                    data.nickname = data.nickname.substr(0, 1) + '...' +data.nickname.substr(3)
                }
                var ele = $('#chatmsgtemple').clone(true)
                ele.attr('id','chatmsg'+data.msgNo)
                if(data.userNo==$.cookie('token'))
                    ele.css('color','green')
                ele.find('.name').text(data.nickname||"网友")
                ele.find('.msg').text(data.text);
                ele.find('.looking').text(data.looking);
                ele.show();
                $('#chatmsgspad').prepend(ele)
                $('#lastmsg').text((data.nickname||"网友").substr(0,6) +" : "+data.text)
            }else if(data.action == 10){
                if(page.currWordText==data.word){
                    page.currWord=data
                    //$('#summrest').hide()
                    pauseVideo()
                    doshadow()

                    $('#summtrans').show()
                    $('#summtrans-word').text(page.currWord.word)
                    $('#word-in').val(page.currWord.word)

                    var hasTranslate = false;
                    clearTimeout(window.aaa)
                    if(page.currWord.phonetic){
                        $('#summtrans-phonetic').text('/'+page.currWord.phonetic+'/').show()
                    }else{
                        $('#summtrans-phonetic').hide()
                    }
                    if(page.currWord.speakUrl){
                        $('#summtrans-speak').attr('play-url',page.currWord.speakUrl).show()
                    }else{
                        $('#summtrans-speak').hide()
                    }
                    $('#summtrans-vv').scrollTop(0)
                    $('#summtrans-vv').html('')
                    if(page.currWord.explains){
                        $(page.currWord.explains).each(function(index,item){
                            hasTranslate=true
                            $('#summtrans-vv').append(`<div>${lightkeytrans1(item)}</div>`)
                        })
                    }
                    if(page.currWord.wfs){
                        $('#summtrans-vv').append(`<div style="margin-top:10px">${lightkeytrans1(page.currWord.wfs)}</div>`)
                    }
                    if(page.currWord.webs){
                        $('#summtrans-vv').append(`<div style="margin-top:10px;">网络释义: </div>`)
                        $(page.currWord.webs).each(function(index,item){
                            hasTranslate=true
                            $('#summtrans-vv').append(`<div>${lightkeytrans1(item)}</div>`)
                        })
                    }
                        if(!hasTranslate && page.currWord.translations){
                            $(page.currWord.translations).each(function(index,item){
                                $('#summtrans-vv').append(`<div>${lightkeytrans1(item)}</div>`)
                            })
                        }
                    
                    
                    $(`.lightkeytrans`).bind('click',function(){
                        translatee(this.innerText,1)
                    })
                    $('#wordsframe').hide()
                    $('#summrest').show()
                    $('#summtrans-vv').show()
                    $('#summtrans-value').show()
                    $('#summtrans').show()
                    $('#videobox').css('top','-1000px')
                    $('#summtrans-speak').click()

                    if(data.addHistory){
                        var word = {
                            word:page.currWord.word,
                            translation:page.currWord.translation,
                            phonetic:page.currWord.phonetic,
                            historyWordNo:randomnum(12)
                        }
                        var ele = createHistoryWord(word)
                        page.historyWords.rows.splice(0,0,word)
                        $('#historyWordsPad .words').prepend(ele)
                    }
                }
                
            }
        }
        ws.onclose = function(e){
        　　//当客户端收到服务端发送的关闭连接请求时，触发onclose事件
        }
        ws.onerror = function(e){
        　　//如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        }   
    }

    setInterval(() => {
        if(ws && ws.readyState==3){
            //log.debug("to ws init after 3")
            initws()
        }

        if($('#video')[0].paused)
            return;
        var totalsecondsno = localStorage.getItem(config.project+"-totalsecondsno")
        totalsecondsno = parseInt(totalsecondsno?totalsecondsno:0);
        totalsecondsno+=5;
        localStorage.setItem(config.project+"-totalsecondsno",totalsecondsno)

        ws.send(JSON.stringify({
            action:2,
            videoNo:videoNo,
            seconds:5
        }))

        
    }, 5000);
    
    setInterval(function(){
        if(ws && ws.readyState==1){
            //log.debug("to ws heart check")
            ws.send("0")
        }
    },30000)


    statisticsexps()


    function loadRelatedWords(srcword,short){
        srcword=pureWord(srcword)
        short=pureWord(short)
        var word =short?short:srcword
        clearTimeout(page.sssss)
        page.sssss=setTimeout(function(){
            $('#fromRelatedWord').text(word)
            $.ajax({
                url:'/mumu/words1',
                data:{
                    kw:word,
                    rstart:1,
                    rcount:100,
                    from:video.language,
                    to:2,
                },
                ajaxCache:{
                    timeout: 30 * 24 * 60 * 60
                },
                success:function(res){
                    if(res.data.words){
                        $('#relatedWordsPad .relatedWord').remove()
                        var subs = srcword.replace(/(\s|-|,|\.)+/g,' ').split(' ')
                        var subwords = []
                        for (iterator of subs) {
                            subwords.push({
                                id:iterator,
                                word:iterator,
                            })
                        }
                        if(subwords.length>1 || (subwords.length==1 && (res.data.words.length==0 || res.data.words[0].word!=subwords[0].word)))
                            res.data.words.unshift(...subwords)
                        if(subwords.length>1)
                            res.data.words.unshift({
                                id:srcword,
                                word:srcword,
                            })

                        $(res.data.words).each((inx,item)=>{
                            var ele = $('#relatedWord0').clone(true)
                            ele[0].data=item
                            ele.attr('id','relatedWord'+item.id)
                            ele.addClass('relatedWord')
                            ele.text(item.word)
                            $('#relatedWord0').before(ele)
                            ele.show();
                        })
                    }
                }
            })
        },100)
        
    }

    $('#relatedWord0').click(function(){
        translatee(this.innerText,1);
        if(this.innerText==page.currWordText){
            loadRelatedWords(page.currWordText)
        }
    })
    
    


    $.ajax({
        url: '/mumu/chatroom-msgs?',
        data: 'rcount='+300,
        async: true,
        success: function(res) {
            $(res.data.rows).each((inx,item)=>{
                if(item.nickname!=null){
                    item.nickname = item.nickname.substr(0, 1) + '...' +item.nickname.substr(3)
                }

                if(inx==0){
                    $('#lastmsg').text((item.nickname||"网友").substr(0,6)+" : "+item.text)
                    $('#chatminpad').show()
                }
                var ele = $('#chatmsgtemple').clone(true)
                ele.attr('id','chatmsg'+item.msgNo)
                if(item.userNo==$.cookie('token'))
                    ele.css('color','green')
                ele.find('.name').text(item.nickname||"网友")
                ele.find('.msg').text(item.text);
                ele.find('.looking').text(item.looking);
                ele.show();
                $('#chatmsgspad').append(ele)
            })
            if(res.data.rows.length==0){
                $('#lastmsg').text("聊天室")
                $('#chatminpad').show()
            }
        }
    })


    $('#wordbooksPad .createRowBtn').click(function(){
        common.promptLine({
            message:'请输入单词本名称',
            parent:$('#index'),
            confirm:function(v){
                if(v){
                    $.ajax({
                        url: '/mumu/create-wordbook?',
                        data: {
                            name:v,
                        },
                        success: function(res) {
                            if(res.code ==0){
                                var row={
                                    no:res.data.no,
                                    name:v,
                                }
                                var ele = $('#wordbooksPad .wordbooks .row0').clone(true)
                                ele.removeClass('row0')
                                ele.addClass('row'+row.no)
                                ele.text(row.name)
                                ele[0].data=row
                                ele.show();
                                $('#wordbooksPad .wordbooks .row0').before(ele)

                                var ele1 = $('#wordbooksPadOnAdd .row0').clone(true);
                                ele1.removeClass('row0')
                                ele1.addClass('row'+row.no)
                                ele1.text(row.name)
                                $('#wordbooksPadOnAdd .row0').before(ele1)
                                ele1.show()
                                ele1[0].data=row
                            }else{
                                common.alert(res.msg)
                            }
                        }
                    })
                }
            }
        })
    })
    $('#wordbooksPad .wordbooks .row0').click(function(e){
        $('#startRollBtn').hide()
        var row = page.wordbooks.selected=this.data;
        $('#wordbooksPad .wordbooks .row').css('background-color','unset')
        $(this).css('background-color','rgb(111, 111, 111)')
        $('#wordbooksPad .createRowBtn').hide()
        $('#wordbooksPad .editRowBtn').show()
        $('#clickToShowCreateWordbookBtn').show()
        chooseWordbook(row.no)
    })
    
    $('#wordbooksPad .words .loadmore').click(function(e){
        loadMoreWordbookWords(page.wordbooks.selected.no)
    })
    function chooseWordbook(wordbookNo){
        
        for (const ajax of page.wordbookWordsAjaxs) {
            ajax.abort()
        }

        var words = page.wordBooksWordsMap['no'+wordbookNo];
        if(!words){
            words={
                rows:[],
                currRows:[],
                rcount:50,
                selected:null,
            }
            page.wordBooksWordsMap['no'+wordbookNo]=words
        }
        $(`#wordbooksPad .words .pad .someload`).hide()
        $(`#wordbooksPad .words .pad .loadmore`).show()
        $('#wordbooksPad .words .pad').show()
        $('#wordbooksPad .words .pad .row').not('.row0').remove()
        if(words.rows.length==0)
            loadMoreWordbookWords(wordbookNo);
        else{
            if(words.rows.length==0){
                $(`#wordbooksPad .words .pad .someload`).hide()
                $(`#wordbooksPad .words .pad .loadnodata`).show()
            }else if(words.currRows.length < words.rcount){
                $(`#wordbooksPad .words .pad .someload`).hide()
                $(`#wordbooksPad .words .pad .loadend`).show()
            }else{
                $(`#wordbooksPad .words .pad .someload`).hide()
                $(`#wordbooksPad .words .pad .loadmore`).show()
            }
            renderWordbookWords(words.rows)
            $('#startRollBtn').show()
        }
        
    }

    function renderWordbookWords(rows){
        rows.forEach(element => {
            var ele = $(`#wordbooksPad .words .pad .row0`).clone(true);
            ele.removeClass('row0')
            ele.addClass('row'+element.no)
            ele.find('.word').text(element.word)
            element.speakUrl=element.usSpeech?element.usSpeech:element.ukSpeech?element.ukSpeech:element.speakUrl;
            element.phonetic=element.usPhonetic?element.usPhonetic:element.ukPhonetic?element.ukPhonetic:element.phonetic;
            if(element.phonetic){
                ele.find('.phonetic').text('/'+element.phonetic+'/');
            }else{
                ele.find('.word').css('width','66.666666%')
                ele.find('.phonetic').hide();
            }
            ele.find('.translation').text(element.translation)
            $(`#wordbooksPad .words .pad .row0`).before(ele)
            ele.show()
            ele[0].data=element
        });

    }

    function loadMoreWordbookWords(wordbookNo){
        var words = page.wordBooksWordsMap['no'+wordbookNo];
        var rstart = words.rows.length+1
        var rcount = words.rcount
        for (const ajax of page.wordbookWordsAjaxs) {
            ajax.abort()
        }
        page.wordbookWordsAjaxs.push(
            $.ajax({
                url: '/mumu/wordbook-words?',
                data: {
                    wordbookNo:wordbookNo,
                    rstart:rstart,
                    rcount:rcount,
                },
                beforeSend:()=>{
                    $(`#wordbooksPad .words .pad .someload`).hide()
                    $(`#wordbooksPad .words .pad .loading`).show()
                },
                success:function(res){
                    if(res.code==0){
                        if(rstart==1 && res.data.rows.length==0){
                            $(`#wordbooksPad .words .pad .someload`).hide()
                            $(`#wordbooksPad .words .pad .loadnodata`).show()
                        }else if(res.data.rows.length <rcount){
                            $(`#wordbooksPad .words .pad .someload`).hide()
                            $(`#wordbooksPad .words .pad .loadend`).show()
                        }else{
                            $(`#wordbooksPad .words .pad .someload`).hide()
                            $(`#wordbooksPad .words .pad .loadmore`).show()
                        }
                        if(res.data.rows.length>0){
                            words.currRows=res.data.rows
                            words.rows.push(...res.data.rows)
                            renderWordbookWords(res.data.rows)
                        }
                        if(words.rows.length>0){
                            $('#startRollBtn').show()
                        }else{
                            $('#startRollBtn').hide()
                        }
                    }
                }
            })
        )
    }

    // function chooseWordbook(wordbookNo){
    //     var wordsPad = $('#wordbooksPad .words .pad'+wordbookNo);
    //     if(wordsPad.length==1){
    //         $('#wordbooksPad .words .pad').hide()
    //         wordsPad.show()
    //     }else{
    //         var ele = $('#wordbooksPad .words .pad0').clone(true)
    //         ele.removeClass('pad0').addClass('pad'+wordbookNo);
    //         $('#wordbooksPad .words .pad0').before(ele)
    //         $('#wordbooksPad .words .pad').hide()
    //         ele.show()

    //         var words = page.wordBooksWordsMap['no'+wordbookNo];
    //         if(!words){
    //             words={
    //                 rows:[],
    //                 currRows:[],
    //                 rcount:50,
    //                 selected:null,
    //             }
    //             page.wordBooksWordsMap['no'+wordbookNo]=words
    //         }
    //         loadMoreWordbookWords(wordbookNo);
    //     }
    // }
    $(`#wordbooksPad .words .pad .row0`).click(function(){
        var row = this.data;
        translatee(row.word)
        loadRelatedWords(row.word)
        var words = page.wordBooksWordsMap['no'+page.wordbooks.selected.no]
        page.rollInx = words.rows.indexOf(row)+1
    })

    $('#wordbooksPad .words  .coverTargetTextBtn').click(function(){
        if($('#wordbooksPad .words .word,#wordbooksPad .words .phonetic').css('visibility')=='hidden')
            $('#wordbooksPad .words .word,#wordbooksPad .words .phonetic').css('visibility','visible')
        else
            $('#wordbooksPad .words .word,#wordbooksPad .words .phonetic').css('visibility','hidden')
    })
    $('#wordbooksPad .words .coverMainTextBtn').click(function(){
        if($('#wordbooksPad .words .translation').css('visibility')=='hidden')
            $('#wordbooksPad .words .translation').css('visibility','visible')
        else
            $('#wordbooksPad .words .translation').css('visibility','hidden')
    })

    $(`#wordbooksPad .words .pad .row0 .removeBtn`).click(function(e){
        if(page.wordbooks.selected.templateNo){
            common.alert('不可编辑系统单词本')
        }else{
            var ele = $(this).parents('.row');
            var row =ele[0].data;
            var s = page.removeWordsControl['wordbook'+page.wordbooks.selected.no]
            if(!s || new Date().getTime()-parseInt(s) > 1 * 60 *1000){
                common.promptLine({
                    message:'将删除<span style=color:red;font-size:15px>'+row.word+'</span>, 请输入delete以确认移除, 1分钟内不会再次提示.',
                    manualClose:1,
                    cancel:function(v,promptEle){
                        promptEle.remove()
                    },
                    confirm:function(v,promptEle){
                        if(v && v.toLowerCase().trim() == 'delete'){
                            ws.send(JSON.stringify({
                                action:9,
                                wordbookNo:page.wordbooks.selected.no,
                                word:row.word
                            }))
                            ele.remove()
                            promptEle.remove()
                            page.removeWordsControl['wordbook'+page.wordbooks.selected.no]=new Date().getTime()
                        }else{
                            common.alert('输入错误')
                        }
                    }
                })
            }else{
                common.confirm({
                    message:'将删除'+row.word+'.',
                    manualClose:1,
                    confirm:function(v,promptEle){
                        ws.send(JSON.stringify({
                            action:9,
                            wordbookNo:page.wordbooks.selected.no,
                            word:row.word
                        }))
                        page.removeWordsControl['wordbook'+page.wordbooks.selected.no]=new Date().getTime()
                        ele.remove()
                    }
                })
            }
            e.stopPropagation()
        }
    })

    function addWordbookWord(wordbook){
        if(wordbook.templateNo){
            common.alert('不可编辑系统单词本')
        }else{
            common.promptLine({
                message:'请输入释义, 可为空.',
                confirm:function(v){
                    if(v!=null){
                        if(page.wordbooks.selected && wordbook.no == page.wordbooks.selected.no){
                            $('#startRollBtn').show()
                            var ele = createWordbookWord(wordbook.no,v)
                            $(`#wordbooksPad .words .pad `).prepend(ele)
                        }
                        ws.send(JSON.stringify({
                            action:8,
                            wordbookNo:wordbook.no,
                            word:page.currWord.word,
                            translation:v
                        }))
                    }
                }
            })
        }
    }

    function createWordbookWord(wordbookNo,tranclation){
        var word = {
            word:page.currWord.word,
            translation:tranclation,
            phonetic:page.currWord.phonetic,
            no:randomnum(12)
        }
        var words = page.wordBooksWordsMap['no'+wordbookNo];
        words.rows.splice(0,0,word)
        var ele = $(`#wordbooksPad .words .pad .row0`).clone(true);
        ele.removeClass('row0')
        ele.addClass('row'+word.no)
        ele.find('.word').text(word.word)
        if(word.phonetic){
            ele.find('.phonetic').text('/'+word.phonetic+'/');
        }else{
            ele.find('.word').css('width','66.666666%')
            ele.find('.phonetic').hide();
        }
        ele.find('.translation').text(word.translation)
        ele.show()
        ele[0].data=word
        return ele
    }

   

    $('#wordbooksPad .editRowBtn').click(function(e){
        var row = page.wordbooks.selected;
        $('#wordbookDetailPad').show()
        $('#wordbookDetailPad .namePad .value').text(row.name)
    })
    $('#wordbookDetailPad .deleteBtn').click(function(e){
        var row = page.wordbooks.selected;
        common.promptLine({
            message:'请输入 '+row.name+' 以确认删除.',
            confirm:function(v){
                if(v){
                    if(v==row.name){
                        $.ajax({
                            url: '/mumu/delete-wordbook?',
                            data: {
                                no:row.no,
                                name:row.name,
                            },
                            async:false,
                            success: function(res) {
                               if(res.code==0){
                                    $('#wordbookDetailPad').hide()
                                    $('#wordbooksPad .wordbooks .row'+row.no).remove()
                                    row = page.wordbooks.selected=null
                                    $('#wordbooksPad .wordbooks').click()
                               }else{
                                   common.alert(res.msg)
                               }
                            }
                        })
                    }else{
                        common.alert('输入有误')
                    }
                }
            }
        })
    })

    
    $('#wordbookDetailPad .namePad .editBtn').click(function(e){
        var row = page.wordbooks.selected;
        common.promptLine({
            message:'请输入新名称',
            value:row.name,
            confirm:function(v){
                if(v!=row.name){
                    $.ajax({
                        url: '/mumu/alter-wordbook?',
                        data: {
                            no:row.no,
                            name:v,
                        },
                        success: function(res) {
                            if(res.code==0){
                                row.name=v
                                $('#wordbooksPad .wordbooks .row'+row.no).text(v)
                                $('#wordbookDetailPad .value').text(v)
                            }else{
                                common.alert(res.msg)
                            }
                        }
                    })
                }
            }
        })
    })

    $('#wordbookDetailPad .closeBtn').click(function(e){
        $('#wordbookDetailPad').hide()
    })
    
    $('#wordbooksPad .wordbooks').click(function(e){
        if(this == e.target){
            page.wordbooks.selected=null;
            $('#wordbooksPad .createRowBtn').show()
            $('#wordbooksPad .editRowBtn').hide()
            $('#wordbooksPad .words .pad').hide()
            $('#wordbooksPad .wordbooks .row').css('background-color','unset')
            $('#clickToShowCreateWordbookBtn').hide()
            $('#startRollBtn').hide()
        }
        
    })

    $(`#wordbooksPad .wordbooks .loadmore`).click(function(){
        loadMoreWordbooks()
    })
    function loadMoreWordbooks(){
        var rstart = page.wordbooks.rows.length+1;
        var rcount = page.wordbooks.rcount;
        $.ajax({
            url: '/mumu/wordbooks?',
            data: {
                rstart:rstart,
                rcount:rcount,
            },
            beforeSend:()=>{
                $(`#wordbooksPad .wordbooks .someload`).hide()
                $(`#wordbooksPad .wordbooks .loading`).show()
            },
            success: function(res) {
                page.wordbooks.rows.push(...res.data.rows)
                page.wordbooks.currRows = res.data.rows
                if(rstart==1 && res.data.rows.length==0){
                    $(`#wordbooksPad .wordbooks .someload`).hide()
                    $(`#wordbooksPad .wordbooks .loadnodata`).show()
                }else if(res.data.rows.length <rcount){
                    $(`#wordbooksPad .wordbooks .someload`).hide()
                    $(`#wordbooksPad .wordbooks .loadend`).show()
                }else{
                    $(`#wordbooksPad .wordbooks .someload`).hide()
                    $(`#wordbooksPad .wordbooks .loadmore`).show()
                }
                $(res.data.rows).each((inx,row)=>{
                    var ele = $('#wordbooksPad .wordbooks .row0').clone(true)
                    ele.removeClass('row0')
                    ele.addClass('row'+row.no)
                    ele.text(row.name)
                    ele[0].data=row
                    ele.show();
                    $('#wordbooksPad .wordbooks .row0').before(ele)

                    var words = page.wordBooksWordsMap['no'+row.no];
                    if(!words){
                        words={
                            rows:[],
                            currRows:[],
                            rcount:200,
                            selected:null,
                        }
                        page.wordBooksWordsMap['no'+row.no]=words
                    }
                })

                if(rstart==1){
                    $('#wordbooksPad .wordbooks .row').not('.row0').first().click()
                }

                
                if(page.wordbooks.rows.length==0){
                    $('#clickToShowCreateWordbookBtn').hide()
                }else{
                    $('#clickToShowCreateWordbookBtn').show()
                }
            }
        })
    }
    $(`#favorsPad .loadmore`).click(function(){
        loadMoreFavoredWords()
    })

    function loadMoreFavoredWords(){
        var rstart = page.favoredWords.rows.length+1
        var rcount = page.favoredWords.rcount
        $.ajax({
            url: '/mumu/favored-words?',
            data: {
                rstart,
                rcount,
            },
            beforeSend:()=>{
                $(`#favorsPad .someload`).hide()
                $(`#favorsPad .loading`).show()
            },
            success: function(res) {
                if(res.code==0){
                    if(rstart==1 && res.data.rows.length==0){
                        $(`#favorsPad .someload`).hide()
                        $(`#favorsPad .loadnodata`).show()
                    }else if(res.data.rows.length <rcount){
                        $(`#favorsPad .someload`).hide()
                        $(`#favorsPad .loadend`).show()
                    }else{
                        $(`#favorsPad .someload`).hide()
                        $(`#favorsPad .loadmore`).show()
                    }
                    if(res.data.rows.length>0){
                        page.favoredWords.currRows=res.data.rows
                        page.favoredWords.rows.push(...res.data.rows)
                        $(res.data.rows).each((inx,item)=>{
                            $('#favorsPad .word0').before(createFavoredWord(item))
                        })
                    }
                }
                
            }
        })
    }
    function addFavoredWord(){
        var word = {
            word:page.currWord.word,
            translation:page.currWord.translation,
            phonetic:page.currWord.phonetic,
            favorWordNo:randomnum(12)
        };
        var ele = createFavoredWord(word)
        page.favoredWords.rows.splice(0,0,word)
        $('#favorsPad .words').prepend(ele)
        ws.send(JSON.stringify(
            {
                action:4,
                word:page.currWord.word
            }
        ))
    }

    function createFavoredWord(item){
        var ele = $('#favorsPad .word0').clone(true)
        ele.removeClass('word0')
        ele.addClass('word'+item.favorWordNo)
        ele.find('.word').text(item.word)
        ele.find('.translation').text(item.translation)
        if(item.phonetic){
            ele.find('.phonetic').text('/'+item.phonetic+'/');
        }else{
            ele.find('.word').css('width','66.666666%')
            ele.find('.phonetic').hide();
        }
        ele[0].data=item
        ele[0].transfrom=item.word
        ele.show();
        return ele;
    }
    $('#favorsPad .word0').click(function(e){
        var row = this.data
        translatee(row.word)
        loadRelatedWords(row.word)
    })
    $('#favorsPad .word0 .removeBtn').click(function(e){
        var wrap = $(this).parents('.wrap')
        var row = wrap[0].data
        ws.send(JSON.stringify(
            {
                action:5,
                word:row.word
            }
        ))
        wrap.remove()
        page.favoredWords.rows.splice(page.favoredWords.rows.indexOf(row),4)
        page.favoredWords.currRows.splice(page.favoredWords.currRows.indexOf(row),4)
        e.stopPropagation()
    })
    
    $('#favorsPad .coverTargetTextBtn').click(function(){
        if($('#favorsPad .word,#favorsPad .phonetic').css('visibility')=='hidden')
            $('#favorsPad .word,#favorsPad .phonetic').css('visibility','visible')
        else
            $('#favorsPad .word,#favorsPad .phonetic').css('visibility','hidden')
    })
    $('#favorsPad .coverMainTextBtn').click(function(){
        if($('#favorsPad .translation').css('visibility')=='hidden')
            $('#favorsPad .translation').css('visibility','visible')
        else
            $('#favorsPad .translation').css('visibility','hidden')
    })

    $(`#historyWordsPad .loadmore`).click(function(){
        loadMoreHistoryWords()
    })
    
    function loadMoreHistoryWords(){
        var rstart = page.historyWords.rows.length+1
        var rcount = page.historyWords.rcount
        $.ajax({
            url: '/mumu/history-words?',
            data: {
                rstart,
                rcount,
            },
            beforeSend:()=>{
                $(`#historyWordsPad .someload`).hide()
                $(`#historyWordsPad .loading`).show()
            },
            success: function(res) {
                if(res.code==0){
                    if(rstart==1 && res.data.rows.length==0){
                        $(`#historyWordsPad .someload`).hide()
                        $(`#historyWordsPad .loadnodata`).show()
                    }else if(res.data.rows.length <rcount){
                        $(`#historyWordsPad .someload`).hide()
                        $(`#historyWordsPad .loadend`).show()
                    }else{
                        $(`#historyWordsPad .someload`).hide()
                        $(`#historyWordsPad .loadmore`).show()
                    }
                    if(res.data.rows.length>0){
                        page.historyWords.currRows=res.data.rows
                        page.historyWords.rows.push(...res.data.rows)
                        
                        $(res.data.rows).each((inx,item)=>{
                            $('#historyWordsPad .word0').before(createHistoryWord(item))
                        })
                    }
                }
                
            }
        })
    }
    function addHistoryWord(){
        var word = {
            word:page.currWord.word,
            translation:page.currWord.translation,
            phonetic:page.currWord.phonetic,
            historyWordNo:randomnum(12)
        }
        var ele = createHistoryWord(word)
        page.historyWords.rows.splice(0,0,word)
        $('#historyWordsPad .words').prepend(ele)
        ws.send(JSON.stringify(
            {
                action:6,
                word:page.currWord.word
            }
        ))
    }
    function createHistoryWord(item){
        var ele = $('#historyWordsPad .word0').clone(true)
        ele.removeClass('word0')
        ele.addClass('word'+item.historyWordNo)
        ele.find('.word').text(item.word)
        ele.find('.translation').text(item.translation)
        if(item.phonetic){
            ele.find('.phonetic').text('/'+item.phonetic+'/');
        }else{
            ele.find('.word').css('width','66.666666%')
            ele.find('.phonetic').hide();
        }
        
        ele[0].data=item
        ele[0].transfrom=item.word
        ele.show();
        return ele;
    }
    
    $('#historyWordsPad .word0 .removeBtn').click(function(e){
        var wrap = $(this).parents('.wrap')
        var row = wrap[0].data
        ws.send(JSON.stringify(
            {
                action:7,
                word:row.word
            }
        ))
        wrap.remove()
        page.historyWords.rows.splice(page.historyWords.rows.indexOf(row),4)
        page.historyWords.currRows.splice(page.historyWords.currRows.indexOf(row),4)
        e.stopPropagation()
    })
    $('#historyWordsPad .word0').click(function(e){
        var row = this.data
        translatee(row.word)
        loadRelatedWords(row.word)
    })

    $('#historyWordsPad .coverTargetTextBtn').click(function(){
        if($('#historyWordsPad .word,#historyWordsPad .phonetic').css('visibility')=='hidden')
            $('#historyWordsPad .word,#historyWordsPad .phonetic').css('visibility','visible')
        else
            $('#historyWordsPad .word,#historyWordsPad .phonetic').css('visibility','hidden')
    })
    $('#historyWordsPad .coverMainTextBtn').click(function(){
        if($('#historyWordsPad .translation').css('visibility')=='hidden')
            $('#historyWordsPad .translation').css('visibility','visible')
        else
            $('#historyWordsPad .translation').css('visibility','hidden')
    })
    $('#favorsBtn').click(function(){
        $('#favorsBtn').css('background-color','unset').css('color','#ffffff')
        $('#historyWordsBtn').css('background-color','#9f9f9f').css('color','#000000')
        $('#wordbooksBtn').css('background-color','#9f9f9f').css('color','#000000')
        
        $('#favorsPad').show()
        $('#historyWordsPad').hide()
        $('#wordbooksPad').hide()
        $('#startRollBtn').hide()

        if(page.favoredWords.rows.length==0)
            loadMoreFavoredWords()

    })

    $('#historyWordsBtn').click(function(){
        $('#favorsBtn').css('background-color','#9f9f9f').css('color','#000000')
        $('#historyWordsBtn').css('background-color','unset').css('color','#ffffff')
        $('#wordbooksBtn').css('background-color','#9f9f9f').css('color','#000000')

        $('#favorsPad').hide()
        $('#historyWordsPad').show()
        $('#wordbooksPad').hide()
        $('#startRollBtn').hide()

        if(page.historyWords.rows.length==0)
            loadMoreHistoryWords()
    })

    $('#wordbooksBtn').click(function(e){
        if(this==e.target){
            $('#favorsBtn').css('background-color','#9f9f9f').css('color','#000000')
            $('#historyWordsBtn').css('background-color','#9f9f9f').css('color','#000000')
            $('#wordbooksBtn').css('background-color','unset').css('color','#ffffff')

            $('#favorsPad').hide()
            $('#historyWordsPad').hide()
            $('#wordbooksPad').show()

            if(page.wordbooks.selected){
                var words = page.wordBooksWordsMap['no'+page.wordbooks.selected.no]
                if(words.rows.length>0){
                    $('#startRollBtn').show()
                }
            }else{
                $('#startRollBtn').hide()
            }
            
        }
    })











    $('#addToWordbookBtn').click(function(){
        $('#wordbooksPadOnAdd').show()
        if(page.wordbooksOnAdd.rows.length==0)
            loadMoreWordbooksOnAdd()
        if(page.wordbooks.selected != null){
            $('#wordbooksPadOnAdd .currRow .name').text(page.wordbooks.selected.name)
            $('#wordbooksPadOnAdd .currRow')[0].data=page.wordbooks.selected
            $('#wordbooksPadOnAdd .currRowPad').show()
        }else{
            $('#wordbooksPadOnAdd .currRowPad').hide()
        }
    })

    $('#wordbooksPadOnAdd .closeBtn').click(function(){
        $('#wordbooksPadOnAdd').hide()
    })

    $('#wordbooksPadOnAdd .currRow,#wordbooksPadOnAdd .row0').click(function(){
        var row = this.data
        $('#wordbooksPadOnAdd').hide()
        addWordbookWord(row)
        
    })

    $('#wordbooksPadOnAdd .loadmore').click(function(){
        loadMoreWordbooksOnAdd()
    })
    function loadMoreWordbooksOnAdd(){
        var rstart=page.wordbooksOnAdd.rows.length+1
        var rcount=page.wordbooksOnAdd.rcount
        $.ajax({
            url:'/mumu/wordbooks',
            data:{
                rstart:rstart,
                rcount:rcount,
            },
            beforeSend:()=>{
                $('#wordbooksPadOnAdd .someload').hide()
                $('#wordbooksPadOnAdd .loading').show()
            },
            success:function(res){
                if(res.code==0){
                    if(rstart==1 && res.data.rows.length==0){
                        $('#wordbooksPadOnAdd .someload').hide()
                        $('#wordbooksPadOnAdd .loadnodata').show()
                    }else if(res.data.rows.length <rcount){
                        $('#wordbooksPadOnAdd .someload').hide()
                        $('#wordbooksPadOnAdd .loadend').show()
                    }else{
                        $('#wordbooksPadOnAdd .someload').hide()
                        $('#wordbooksPadOnAdd .loadmore').show()
                    }
                    if(res.data.rows.length>0){
                        page.wordbooksOnAdd.currRows=res.data.rows
                        page.wordbooksOnAdd.rows.push(...res.data.rows)
                        res.data.rows.forEach(element => {
                            var ele = $('#wordbooksPadOnAdd .row0').clone(true);
                            ele.removeClass('row0')
                            ele.addClass('row'+element.no)
                            ele.text(element.name)
                            $('#wordbooksPadOnAdd .row0').before(ele)
                            ele.show()
                            ele[0].data=element
                        });
                    }
                    
                }
            }
        })
    }
    
    if(onlyLookHimParam){
        openOnlyLookHim()
    }
    $('#onlyLookHim').click(function(){
        if(page.onlyLookUserNo){
            closeOnlyLookHim()
        }else {
            openOnlyLookHim()
        }
    })
    // $('#onlyLookHim').click(function(){
    //     if(!page.onlyLookUserNo){
    //         page.exploreVideos.rows.splice(page.exploreVideos.inx+1-1,page.exploreVideos.rows.length-1)
    //         page.exploreVideos.currRows=[]
    //     }

    //     page.onlyLookHimVideos.rows=[]
    //     page.onlyLookHimVideos.currRows=[]
    //     if(page.onlyLookUserNo){
    //         page.onlyLookUserNo=null
    //         $(this).css('background-color','unset');
    //     }
    //     else {
    //         page.onlyLookUserNo=video.userNo
    //         $(this).css('background-color','rgb(90, 90, 90)');
    //         page.onlyLookHimVideos.rows.push(video)
    //         page.onlyLookHimVideos.currRows.push(video)
    //     }
    //     page.trueVideos.rows.splice(page.trueVideos.inx+1-1,page.trueVideos.rows.length-1)
    //     page.trueVideos.currRows=[]
    // })
    function openOnlyLookHim(){
        $('#video1').attr('src',null);
        if(!page.onlyLookUserNo){
            page.exploreVideos.rows.splice(page.exploreVideos.inx+1-1,page.exploreVideos.rows.length-1)
            page.exploreVideos.currRows=[]
        }
        page.onlyLookHimVideos.rows=[]
        page.onlyLookHimVideos.currRows=[]
        page.onlyLookUserNo=video.userNo
        $('#onlyLookHim').css('background-color','rgb(90, 90, 90)');
        page.onlyLookHimVideos.rows.push(video)
        page.onlyLookHimVideos.currRows.push(video)

        page.trueVideos.rows.splice(page.trueVideos.inx+1-1,page.trueVideos.rows.length-1)
        page.trueVideos.currRows=[]
    }
    function closeOnlyLookHim(){
        $('#video1').attr('src',null);
        if(!page.onlyLookUserNo){
            page.exploreVideos.rows.splice(page.exploreVideos.inx+1-1,page.exploreVideos.rows.length-1)
            page.exploreVideos.currRows=[]
        }
        page.onlyLookHimVideos.rows=[]
        page.onlyLookHimVideos.currRows=[]
        page.onlyLookUserNo=null
        $('#onlyLookHim').css('background-color','unset');

        page.trueVideos.rows.splice(page.trueVideos.inx+1-1,page.trueVideos.rows.length-1)
        page.trueVideos.currRows=[]
    }
    function closeRollShowWordsPad(){
        $('#rollShowWordsPad').hide()
        page._mp3.pause()
        page.lettersound.pause()
        clearTimeout(page.rollWordsInterval)
        clearTimeout(page.readRollWordTimeout)
        page.rollOpen=0
    }
    
    $('#rollShowWordsPad').click(function(e){
        if(this==e.target){
            closeRollShowWordsPad()
        }
    })

    $('#rollShowWordsPad .prev').click(function(e){
        wordsRoll(page.rollInx-1)
    })
    $('#rollShowWordsPad .next').click(function(e){
        wordsRoll(page.rollInx+1)
    })
    $('#rollShowWordsPad .restart').click(function(e){
        wordsRoll(1)
    })
    
    $('#rollShowWordsPad .stop').click(function(e){
        page._mp3.pause()
        page.lettersound.pause()
        clearTimeout(page.rollWordsInterval)
        clearTimeout(page.readRollWordTimeout)
        $('#rollShowWordsPad .stop').hide()
        $('#rollShowWordsPad .start').show()
        page.rollIsSound=0
        page.auto=0
    })

    $('#rollShowWordsPad .start').click(function(e){
        page.rollIsSound=1
        page.auto=1
        startWordsRoll(page.rollInx)
    })

    $('#startRollBtn').click(function(){
        page.rollOpen=1
        $('#rollShowWordsPad').show()
        $('#rollShowWordsPad .stop').hide()
        $('#rollShowWordsPad .start').show()
        pauseVideo()
        page.rollIsSound=0
        page.auto=0
        page.rollInx=!page.rollInx?1:page.rollInx
        wordsRoll(page.rollInx)
    })

    $('#rollShowWordsPad .word').click(function(){
        var words = page.wordBooksWordsMap['no'+page.wordbooks.selected.no]
        var word = words.rows[page.rollInx-1]
        translatee(word.word)
        loadRelatedWords(word.word)
        closeRollShowWordsPad()
    })

    function startWordsRoll(rollInx){
        $('#rollShowWordsPad .stop').show()
        $('#rollShowWordsPad .start').hide()
        page.rollIsSound=1
        page.auto=1
        rollInx=!rollInx?1:rollInx
        wordsRoll(rollInx);
    }
    page._mp3 = document.createElement('video')
    page.lettersound = document.createElement('video')
    function wordsRoll(rollInx){
        if(!page.rollOpen){
            closeRollShowWordsPad()
            return;
        }
        
        page._mp3.pause()
        page.lettersound.pause()
        clearTimeout(page.rollWordsInterval)
        clearTimeout(page.readRollWordTimeout)
        var words = page.wordBooksWordsMap['no'+page.wordbooks.selected.no]
        if(words.rows.length==0)
            return;
        var word = words.rows[rollInx-1]
        
        if(!word){
            loadMoreWordbookWords(page.wordbooks.selected.no)
        }
        word = words.rows[rollInx-1]
        if(!word){
            page.rollInx=1
            wordsRoll(page.rollInx)
            return;
        }

      


        word.speakUrl=word.usSpeech?word.usSpeech:word.ukSpeech?word.ukSpeech:word.speakUrl;
        if(!word.speakUrl)
            $.ajax({
                url: '/mumu/translate?from='+video.language+'&to=2&q='+word.word,
                ajaxCache:{
                    timeout: 1
                },
                async: false,
                success: function(res) {
                    if(res.code==0){
                        word.speakUrl=res.data.speakUrl
                        word.usSpeech=res.data.usSpeech
                        word.ukSpeech=res.data.ukSpeech
                        word.usPhonetic=res.data.usPhonetic
                        word.ukPhonetic=res.data.ukPhonetic
                    }
                }
            })
        word.speakUrl=word.usSpeech?word.usSpeech:word.ukSpeech?word.ukSpeech:word.speakUrl;
        word.phonetic=word.usPhonetic?word.usPhonetic:word.ukPhonetic?word.ukPhonetic:word.phonetic;

        page.rollInx=rollInx
        localStorage.setItem(config.project+'-rollInx',page.rollInx)
        $('#rollShowWordsPad .word').text(word.word)
        $('#rollShowWordsPad .inx').text(rollInx)
        $('#rollShowWordsPad .phonetic').text(word.phonetic?('/'+word.phonetic+'/'):' ')
        $('#rollShowWordsPad .translation').text(word.translation||' ')

        if(page.auto){
            if(page.rollIsSound){
                // if(word.word.split(' ').length==1 || word.word.split('-').length==2){
                //     var letters = word.word.split('')
                //     var letterInx = 1
                //     page.lettersound.src="/file/mumu/lettersounds/"+letters[letterInx-1].toLowerCase()+".mp3"
                //     page.lettersound.play()

                //     page.lettersound.onpause=function(){
                //         letterInx++;
                //         if(page.lettersound.currentTime==page.lettersound.duration){
                //             if(letters[letterInx-1]){
                //                 if(/[a-zA-Z]/.test(letters[letterInx-1])){
                //                     page.lettersound.muted=false
                //                     page.lettersound.src="/file/mumu/lettersounds/"+letters[letterInx-1].toLowerCase()+".mp3"
                //                 }else{
                //                     page.lettersound.muted=true
                //                     page.lettersound.src="/file/mumu/lettersounds/a.mp3"
                //                 }
                //                 page.lettersound.play()
                //             }else{
                //                 readWord(word)
                //             }
                //         }
                //     }
                // }else{
                //     readWord(word)
                // }
                readWord(word)
                function readWord(word){
                    var count = 0;
                    
                    if(word.speakUrl){
                        page._mp3.muted=false
                        page._mp3.src=word.speakUrl;
                    }else {
                        page._mp3.muted=true
                        page._mp3.src="/file/mumu/lettersounds/a.mp3"
                    }
                    page._mp3.onpause=function(){
                        if(page._mp3.currentTime==page._mp3.duration){
                            if(count > 0){
                                page.readRollWordTimeout=setTimeout(function(){
                                    page._mp3.play()
                                },100)
                                count--;
                            }else{
                                clearTimeout(page.readRollWordTimeout)
                                clearTimeout(page.rollWordsInterval)
                                if(!word.translationVoice){
                                    $.ajax({
                                        url:'/mumu/get-read',
                                        async:false,
                                        data:{
                                            text:word.translation,
                                            lang:'zh'
                                        },
                                        success:function(res){
                                            word.translationVoice=res.data.voice
                                        }
                                    })
                                }

                                page.rollWordsInterval = setTimeout(function(){
                                    page._mp3.onpause=function(){
                                        page.rollWordsInterval = setTimeout(function(){
                                            wordsRoll(page.rollInx+1)
                                        },1000)
                                    }
                                    page._mp3.src=word.translationVoice
                                    page._mp3.play()
                                },100)
                            }
                        }
                    }
                    page._mp3.play()
                }
                
            }
        }

        
    }
    $('#extendSearchPad').click(function(e){
        if(this==e.target){
            $('#extendSearchPad').hide()
            $('#extendSearchFrame').attr('src','https://m.baidu.com')
        }
    })
    $('#goExtendSearchBtn').click(function(e){
        $('#extendSearchPad').show()
        $('#extendSearchFrame').attr('src','https://m.baidu.com/s?word=英文'+page.currWordText)
    })
    
    $('#closeViewBtn').click(function(){
        if(page.closeView){
            page.closeView=0
            $('#closeViewBtn').attr('src','./img/openeye.png')
        }else{
            page.closeView=1
            $('#closeViewBtn').attr('src','./img/closeeye.png')
        }
        guide1()
    })
    
    $('#toShortRelatedWordsBtn').click(function(){
        page.shortWordText=page.shortWordText?page.shortWordText:page.currWordText;
        page.shortWordText=page.shortWordText.substr(0,page.shortWordText.length-1)
        if(!page.shortWordText){
            page.shortWordText=page.currWordText
        }
        $('#relatedWordsPad').children(":first").html(`
            <span style="font-size:15px;float:left;">${page.shortWordText}</span>
            <span style="font-size:15px;color:#828282;float:left;">${page.currWordText.substr(page.shortWordText.length,page.currWordText.length-page.shortWordText.length)}</span>
        `)

        loadRelatedWords(page.currWordText,page.shortWordText)
    })
   
})()

