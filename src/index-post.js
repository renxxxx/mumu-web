(function(){
    var page = {}
    window.page=page
    log.debugon=1

    $('#video')[0].crossOrigin = 'anonymous';
    $("#finger,gear").animate({left:'+=150px'},2000,function(){
        $("#finger").animate({left:'-=300px'},2000,()=>{$("#finger").fadeOut(500)});
    });
    $("#gear").animate({left:'+=150px'},2000,function(){
        $("#gear").animate({left:'-=300px'},2000);
    });

    document.addEventListener('WeixinJSBridgeReady',function(){
        $('#video')[0].play();
    },false);
    var pausebeforech = null;
    var historywords=[]
    var videoNoC = window.location.search.substring(1).split("&")[0].split("=")[1];
    var videoC = null
    if(videoNoC){
        $.ajax({
            url: '/mumu/video?',
            type: 'get',
            data: 'videoNo='+videoNoC,
            async: false,
            success: function(res) {
                videoC = res.data.video
            }
        })
    }

    var video;
    var videoNo;
    var videos =[]
    var videosIndex =-1


    $.ajax({
        url: '/mumu/chatroom-msgs?',
        type: 'get',
        data: 'rcount='+300,
        async: true,
        success: function(res) {
            $(res.data.rows).each((inx,item)=>{
                if(inx==0){
                    $('#lastmsg').text(item.text)
                    $('#chatminpad').show()
                }
                var ele = $('#chatmsgtemple').clone(true)
                ele.attr('id','chatmsg'+item.msgNo)
                if(item.userNo==$.cookie('token'))
                    ele.css('color','green')
                ele.text(item.text)
                ele.show();
                $('#chatmsgspad').append(ele)
            })
        }
    })


    $.ajax({
        url: '/mumu/explore-videos?',
        type: 'get',
        data: 'shortvideo=1&kw='+'&pageSize='+30,
        async: false,
        success: function(res) {
            videos.push(...res.data.videos)
            localStorage.setItem('videos',JSON.stringify(videos))

            if(videoC)
                videos.unshift(videoC)
        }
    })
    


    var lastCurrentTime = localStorage.getItem("currentTime-"+videoNo);
    var currentIndex =parseInt(localStorage.getItem("currentIndex-"+videoNo));
    var currentCaption = JSON.parse(localStorage.getItem("currentCaption-"+videoNo));
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
        translatee(this.innerText);
    })

    
    goNextVideo()
    function goNextVideo(){
        pauseVideo()
        if(!videos[videosIndex+1]){
            $.ajax({
                url: '/mumu/explore-videos?',
                type: 'get',
                data: 'shortvideo=1&kw='+'&pageSize='+30,
                async: false,
                success: function(res) {
                    if(res.data.videos.length>0){
                        videos.push(...res.data.videos)
                        localStorage.setItem('videos',JSON.stringify(videos))
                    }
                }
            })
        }

        if(!videos[videosIndex+1]){
            return;
        }
        videosIndex++;
        videoNo = videos[videosIndex].no
        video = videos[videosIndex]
        localStorage.setItem('videosIndex',videosIndex)
        getvideodone(video)
    }

    function goPrevVideo(){
        if(!videos[videosIndex-1]){
            return;
        }
        pauseVideo()
        videosIndex--;
        videoNo = videos[videosIndex].no
        video = videos[videosIndex]
        localStorage.setItem('videosIndex',videosIndex)
        getvideodone(video)
    }

    function playend(){
        setTimeout(function(){
            goNextVideo()
        },1000)
    }
    function guide(){
        var translateed = localStorage.getItem('translateed')
        if(!translateed){
            $('#hintssec').text(3)
            pauseVideo()
            $('#video').css('top','-1000px')
            $('#hints').css('height',$('#video').css('height')).show()
            setTimeout(function(){
                $('#hints').fadeOut(1000,function(){
                    $('#video').css('top','0')
                    $('#video').attr("src",video.url)
                    setTimeout(function(){$('#video')[0].muted=false},500)
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
            $('#video').css('top','0')
            $('#video').attr('autoplay',true)
            $('#video').attr("src",video.url)
            setTimeout(function(){$('#video')[0].muted=false},500)
        }
    }

    showallhistorywords()
    function getVideo(videoNo){
        $.ajax({
            url: '/mumu/video?',
            type: 'get',
            data: 'videoNo='+videoNo,
            async: false,
            success: function(res) {
                getvideodone(res.data.video)
            }
        })
    }

    function getvideodone(videop){
        video=videop;
        $('#titleinback').text(video.name)
        $('#titleinbackpad').show()
        // if(video.height && video.width){
        //     var videoheight = parseInt($('#video').css('width').replace('px',''))*(video.height/video.width);
        //     $('#video').css('height',videoheight)
        //     $('#summtrans').css('height',$('#video').css('height'))
        //     $('#wordsframe').css('height',$('#video').css('height'))
        // }
        guide()
        $.ajax({
            url: video.captionUrl,
            type: 'get',
            async: false,
            success: function(res) {
                getEnSubtitles(res);
            }
        })

        setTimeout(function(){
            var historyvideos = JSON.parse(localStorage.getItem('historyvideos'))
            if(!historyvideos)
                historyvideos=[]
            for(var i = 0; i < historyvideos.length; i++){
                if(historyvideos[i].no==video.no){  
                    historyvideos.splice(i,1) 
                }  
            }  
            historyvideos.unshift(video)
            localStorage.setItem('historyvideos',JSON.stringify(historyvideos))
        },5000)
    }
    function restore(){
        if(!restored){
            if(lastCurrentTime == 0){
                restored=1;
                return;
            }
            if(lastCurrentTime){
                $('#video')[0].currentTime = lastCurrentTime;
                log.debug("set lct: "+lastCurrentTime+" ct: "+$('#video')[0].currentTime);
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
                log.debug("set lct: "+lastCurrentTime+" ct: "+$('#video')[0].currentTime);
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
        localStorage.setItem("durationsec-"+videoNo,$('#video')[0].duration)
        localStorage.setItem("currentTime-"+videoNo,$('#video')[0].currentTime)

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
            log.debug("next ")
            en.current = next
            en.currentIndex++
            setline(next)
            return;
        }

        if(next && _time < next.startTime &&  (!en.current || _time > en.current.endTime)){
            log.debug("before next")
            log.debug("next: st: "+next.startTime+" currinx: "+en.currentIndex)
            return;
        }

        
        $(en.subtitlesList).each(function(inx,item){
            if(item.startTime<=_time && _time<item.endTime){
                debugger
                log.debug("search all ")
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
        $('#video').attr('controls', true);
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
    function searchFn(_value){
        if(_value.keyCode == 13){
            let kw = $('.searchClass').val();
            translatee(kw);
            hideSearchFn()
        }
    }

    $('.yibiao').on('click','span svg',function(){
        log.info('$(.yibiao).click')
        let _mp3 = new Audio($(this).attr('playsrc'));
        _mp3.play();
    })
    function getEnSubtitles(_result){
        log.debug("getEnSubtitles: "+ ++runstep)
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
        log.debug('setline: ct: '+$('#video')[0].currentTime+" st: "+item.startTime +" et: "+item.endTime +" "+item.enValue.substr(0,5))
        localStorage.setItem("currentCaption-"+videoNo,JSON.stringify(item))
        localStorage.setItem("currentIndex-"+videoNo,en.currentIndex)
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
                var sp = $('<span style="border-bottom:2px solid #ffffff;;user-select: none;display: inline-block;cursor: pointer;font-weight: 900;font-size: 18px;padding-left:3px;padding-right:3px;" index="'+i+'" class="font span'+i+'">'+vv[0]+'</span>')
                sp.bind('click',function(){
                    pauseVideo()
                    locateWord(i+1)
                }).bind('mouseout',function(){
                    $(this).css('border-bottom','2px solid #ffffff')
                }).bind('mouseover',function(){
                    $(this).css('border-bottom','2px solid black')
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
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
        currwordno=0
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
        $('#summtrans').hide()
        $('#wordsframe').hide()
        $('#word-in').val('')
        $('#video').css('top','0px')
    }
    function prevline(){
        ////let _this = this;
        if(en.currentIndex>0){
            var inx = en.currentIndex
            var prev = en.subtitlesList[--inx]
            if(prev){
                if(!prev.enValue)
                    prev = en.subtitlesList[--inx];
            }
            if(prev){
                en.currentIndex =inx   
                en.current= prev
                jumpedcaption = prev
                lastCurrentTime = prev.startTime/1000
                $('#video')[0].currentTime = prev.startTime/1000
                log.debug("set ct: "+prev.startTime/1000+" ct: "+$('#video')[0].currentTime)
                setline(prev)
                currwordno=0
                $('.chDialog').hide()
                $('.dialog').css({'display' : 'none'})
                $('.dialogTitle #kw').html('');
            }
        }
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
                log.debug("set ct: "+curr.startTime/1000+" ct: "+$('#video')[0].currentTime)
                setline(curr)
                currwordno=0
                $('.chDialog').hide()
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
                log.debug("set ct: "+next.startTime/1000+" ct: "+$('#video')[0].currentTime)
                setline(next)
                currwordno=0
                $('.chDialog').hide()
                $('.dialog').css({'display' : 'none'})
                $('.dialogTitle #kw').html('');
            }
        }
    }
    $('#favor').click(function(){
        log.info('#favor.click')
        var word = $(this).attr('word')
        if(/.*[\u4e00-\u9fa5]+.*$/.test(word))
            return;
        if($(this).attr('word').split(' ').length>3)
            return;
        removehistoryword(word)
        addhistoryword(word)
    })
    
    function addhistoryword(word){
        word = word.replace(/^(,|\.|\?|!|\[|\]\(|\))+/,'').replace(/(,|\.|\?|!|\[|\]\(|\))+$/,'')
        historywords=historywords?historywords:[]
        var i = historywords.indexOf(word);
        if(i>-1)
            historywords.splice(i,1)
        historywords.unshift(word)
        var historywordele = $('#historyword_template').clone(true)
        historywordele.attr('id','historyword-'+word.replace(/[^\w]/g, ''))
        historywordele.attr('data',word)
        historywordele.text(word)
        historywordele.css('display','inline-block')
        $('#historywordspad').prepend(historywordele)
        localStorage.setItem('historywords',JSON.stringify(historywords))
    }

    function showallhistorywords(){
        var historywordsstr = localStorage.getItem('historywords')
        if(historywordsstr)
            historywords=JSON.parse(historywordsstr)
        for (let index = 0; index < historywords.length; index++) {
            var word = historywords[index];
            word = word.replace(/^(,|\.|\?|!|\[|\]\(|\))+/,'').replace(/(,|\.|\?|!|\[|\]\(|\))+$/,'')
            var historywordele = $('#historyword_template').clone(true)
            historywordele.attr('id','historyword-'+word.replace(/[^\w]/g, ''))
            historywordele.attr('data',word)
            historywordele.text(word)
            historywordele.css('display','inline-block')
            historywordele.show()
            $('#historywordspad').append(historywordele)
        }
    }

    function removehistoryword(word){
        var i = historywords.indexOf(word)
        if(i>-1)
            historywords.splice(i,1)
        $('#historyword-'+word.replace(/[^\w]/g, '')).remove()
    }

    function translatee(_data){
        log.debug(_data+3)
        $('#summrest').hide()
        doshadow()
        var translateed = localStorage.getItem('translateed')
        translateed =parseInt(translateed?++translateed:1)
        localStorage.setItem('translateed',translateed)
        _data=_data.replace(/^(,|\.|\?|!|\[|\]\(|\))+/,'').replace(/(,|\.|\?|!|\[|\]\(|\))+$/,'')  
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
            },500)
            if(_data==null || _data==undefined || !_data.toString().trim()){
                $('#summtrans-phonetic').hide();
                $('#summtrans-speak').hide();
                $('#summtrans-value').hide();
                return;
            }
            $.ajax({
                url: '/mumu/translate?from='+video.language+'&to=2&q='+_data,
                type: 'get',
                async: true,
                success: function(res) {
                    clearTimeout(window.aaa)
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
                    $('#summtrans-vv').html('').scrollTop(0)
                    if(res.data.translations){
                        $(res.data.translations).each(function(index,item){
                            $('#summtrans-vv').append(`<div>${lightkeytrans(item)}</div>`)
                        })
                    }
                    if(res.data.webTranslations){
                        $('#summtrans-vv').append(`<div style="margin-top:10px;">网络释义: </div>`)
                        $(res.data.webTranslations).each(function(index,item){
                            $('#summtrans-vv').append(`<div>${lightkeytrans(item)}</div>`)
                        })
                    }
                    
                    $(`.lightkeytrans`).bind('click',function(){
                        translatee(this.innerText)
                    })
                    $('#wordsframe').hide()
                    $('#summrest').show()
                    $('#summtrans-vv').show()
                    $('#summtrans-value').show()
                    $('#summtrans').show()
                    $('#video').css('top','-1000px')
                },
            })
        },200)
        
    }   
    function pauseVideo(){
        log.debug("pauseVideo()")
        $('#video')[0].pause();
    }
    function playVideo(){
        log.debug("playVideo()")
        $('#video')[0].play();
        clearTimeout(window.timeoutdo1)
    }
    function videoPlay(){
        log.debug("onplay: "+ ++runstep)
        log.debug(" ct: "+ $('#video')[0].currentTime +" st: " +(en.current && en.current.startTime)+" et: " +(en.current && en.current.endTime)+" "+(en.current&&en.current.enValue.substr(0,5)))
        page.dovideoshadow=0
        clearTimeout(page.timeout11)
        $('.dialog').hide()
        $('#summtrans').hide()
        $('#summtrans-word').text('')
        $('#wordsframe').hide()
        $('#word-in').val('')
        $('#summtrans-value').hide()
        $('#summtrans-vv').text('')
        $('#summtrans-phonetic').text('').hide('')
        $('#summtrans-speak').attr('play-src','').hide('')
        
        $('#video').css('top','0px')
        clearInterval(en.monitor)
        en.monitor = setInterval(function(){
            monitor(videoele.currentTime*1000)
        },10)
        currwordno=0
        translationtext = '';
        $('#zh_subtitles span').css({"background": "transparent","color": "black"})
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
        log.debug("onpause: "+ ++runstep)
        log.debug(" ct: "+ $('#video')[0].currentTime +" st: " +(en.current && en.current.startTime)+" et: " +(en.current && en.current.endTime)+" "+(en.current&&en.current.enValue.substr(0,5)))
        clearInterval(en.monitor)
        $('.stopFn').css({'display':'none'})
        $('.startFn').css({'display':'inline'})

        if($('#video')[0].currentTime == $('#video')[0].duration){
            playend()
        }

        doshadow()
    }

    function doshadow(){
        if(page.dovideoshadow && $('#videoshasow').is(':hidden')){
            var img = videocapture($('#video')[0])
            $('#videoshasowimg').attr('src',img.src)
            $('#videoshasow').show()
            log.debug(`$('#videoshasow').show()`)
            $('#video').css('top','-1000px')
        }
    }

    function enSubtitlesShow(){
        var thisEle = this;
        $("#zh_subtitles").css("opacity")
        if($("#zh_subtitles").css("opacity") == 1){
            $("#zh_subtitles").css("opacity",0)
            $('#hideBtn').text("显示")
        }else{
            $("#zh_subtitles").css("opacity",1)
            $('#hideBtn').text("隐藏")
        }
    }

    
    function chShowDialog(){
        if(!en.current || !en.current.chValue)
            return;
        
        pausebeforech=$('#video')[0].paused;
        //let _this = this
        let _time = $('#video')[0].currentTime*1000
        $('.chDialog').css("display","block")
        $('.chDialog div').html(en.current.chValue.replace(/\\n/g,'<br/>'))
        pauseVideo()
    }
    function chHideDialog(){
        // $('#video')[0].play();
        $('.chDialog').css("display","none")
        if(pausebeforech){
            pauseVideo()
        }else{
            playVideo()
        }
    }

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
    $('#zh_subtitles').mousedown(_ev => {
        log.info('#zh_subtitles.mousedown')
        if(!$(_ev.target).hasClass('font'))
            return;
        //let _this = this
        moveStata = true;
        _coordinates = {
            clientX : _ev.clientX,
            clientY : _ev.clientY,
            pageX : _ev.pageX,
            pageY : _ev.pageY
        };
        choooseStart(_coordinates); 
        $("#zh_subtitles").mousemove(_e => {
            if(!$(_e.target).hasClass('font'))
                return;
            if(moveStata){
                _coordinates = {
                    clientX : _e.clientX,
                    clientY : _e.clientY,
                    pageX : _e.pageX,   
                    pageY : _e.pageY
                };
                choooseMove(_coordinates); 
            }
        }).mouseup(function(_up){
            log.info('#zh_subtitles.mouseup')
            if(!$(_up.target).hasClass('font'))
                return;
            moveStata = false;
            _coordinates = {
                clientX : _up.clientX,
                clientY : _up.clientY,
                pageX : _up.pageX,
                pageY : _up.pageY
            };
            choooseEnd(_coordinates);
            $("#zh_subtitles").unbind('mousemove').unbind('mouseup')
        })
        
    })
    function touchstartFn(_value){
        //let _this = this,
        _coordinates = {
            clientX : _value.changedTouches[0].clientX,
            clientY : _value.changedTouches[0].clientY,
            pageX : _value.changedTouches[0].pageX,
            pageY : _value.changedTouches[0].pageY
        };
        choooseStart(_coordinates);
    }
    function touchmoveFn(_value){
        //let _this = this,
        _coordinates = {
            clientX : _value.changedTouches[0].clientX,
            clientY : _value.changedTouches[0].clientY,
            pageX : _value.changedTouches[0].pageX,
            pageY : _value.changedTouches[0].pageY
        };
        choooseMove(_coordinates);
    }
    function touchendFn(_value){
        //let _this = this,
        _coordinates = {
            clientX : _value.changedTouches[0].clientX,
            clientY : _value.changedTouches[0].clientY,
            pageX : _value.changedTouches[0].pageX,
            pageY : _value.changedTouches[0].pageY
        };
        choooseEnd(_coordinates);
    }
    function choooseStart(_value){
        log.debug(_value)
        page.dovideoshadow=1
        pauseVideo()
        console.dir($("#zh_subtitles").height())
        let width = $("#zh_subtitles").width() + $("#zh_subtitles").offset().left - 5,
        height = $("#zh_subtitles").height() + $("#zh_subtitles").offset().top - 5;

        ////let _this = this;
        chooseDomList = [];
        $('#zh_subtitles span').css({"background": "transparent","color": "black"})
        
        ele = document.elementFromPoint(_value.pageX, _value.pageY);
        if(!$(ele).hasClass('font'))
            return;
        let mx = _value.clientX || _value.pageX
        let my = _value.clientY || _value.pageY
        if((width - 5)>mx && mx>($("#zh_subtitles").offset().left+ 5) && ($("#zh_subtitles").offset().top +5)<my && my<(height - 5)){
            if(ele.className.lastIndexOf('font span ')<0){
                // 匹配是否是上次点击的字段
                // && ele.innerHTML!= translationtext && !chooseDomList.length && translationtext.indexOf(ele.innerHTML)<0
                if(ele.innerHTML!=" "){
                    chooseDomList.push({
                        class:ele.className,
                        value:ele.innerHTML,
                    })
                    $('.'+ele.className.split(' ')[1]).css({
                        'background' : '#d2cbcb',
                        'color' : 'black'
                    })
                }
            }
        }
    }
    function choooseMove(_value){
        //let _this = this,
        ele = document.elementFromPoint(_value.pageX, _value.pageY);
        if(!$(ele).hasClass('font'))
            return;
        let mx = _value.clientX || _value.pageX
        let my = _value.clientY || _value.pageY
        let width = $("#zh_subtitles").width() + $("#zh_subtitles").offset().left,
        height = $("#zh_subtitles").height() + $("#zh_subtitles").offset().top;
        if((width - 5)>mx && mx>($("#zh_subtitles").offset().left + 5) && ($("#zh_subtitles").offset().top + 5)<my && my<(height - 5)){
            if(ele.className.lastIndexOf('font span ')<0){
                let status = true;
                chooseDomList.findIndex(function(_value, inx){
                    if(_value.class == ele.className){
                        status=false
                    }
                })
                if(status && ele.innerHTML!=" "){
                    if(chooseDomList.length){
                        let _last = parseInt(chooseDomList[chooseDomList.length-1].class.replace('font span',''));
                        let _now = parseInt(ele.className.replace('font span',''));
                        log.debug(_now-_last)
                        if( _now == (_last+1)){
                            chooseDomList.push({
                                class:ele.className,
                                value:ele.innerHTML,
                            })
                            $('.'+ele.className.split(' ')[1]).css({
                                'background' : '#d2cbcb',
                                'color' : 'black'
                            })
                        }else if(_now > (_last+1)){
                            
                            for(let i = _last; i < _now; i++){
                                $('.span'+i)
                                chooseDomList.push({
                                    class:$('.span'+i).attr('class'),
                                    value:$('.span'+i).html(),
                                })
                                $('.span'+i).css({  
                                    'background' : '#d2cbcb',
                                    'color' : 'black'
                                })
                            }
                        }else{
                            for(let i = _now; i < _last; i++){
                                $('.span'+i)
                                chooseDomList.push({
                                    class:$('.span'+i).attr('class'),
                                    value:$('.span'+i).html(),
                                })
                                $('.span'+i).css({
                                    'background' : '#d2cbcb',
                                    'color' : 'black'
                                })
                            }
                        }
                    }else{
                        chooseDomList.push({
                            class:ele.className,
                            value:ele.innerHTML,
                        })
                        $('.'+ele.className.split(' ')[1]).css({
                            'background' : '#d2cbcb',
                            'color' : 'black'
                        })
                    }
                }
            }
        }
    }
    function choooseEnd(_value){
        ////let _this = this;
        ele = document.elementFromPoint(_value.pageX, _value.pageY);
        for(let i=0;i<chooseDomList.length-1;i++){
            for(let j=0;j<chooseDomList.length-i-1;j++){
                if(parseInt(chooseDomList[j].class.replace('font span',''))>parseInt(chooseDomList[j+1].class.replace('font span',''))){
                    let _swap = chooseDomList[j];
                    chooseDomList[j] = chooseDomList[j+1];
                    chooseDomList[j+1] = _swap;
                }
            }
        }
        let _data = ''
        $(chooseDomList).each(function(inx,item){
            if(inx>0){
                _data+=' '+item.value.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
            }else{
                _data=item.value.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
            }
        })
        // 匹配是否是上次点击的字段
        // && translationtext != _data && translationtext.indexOf(_data)<0
        if(_data){
            translationtext = _data;
            translatee(_data)
        }else{
            translationtext = ""
        }
        $('.searchClass').blur();
    }


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
        log.debug(keyCodes+" down")
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
                $('#video').css('top',0)
                break;
    　　　　 case '32'://space
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                if($('#video')[0].paused){
                    chHideDialog()
                    playVideo()
                }
                else
                    pauseVideo();
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
                currline()
        　　　　 break; 
            case '119'://W
            case '87'://w
                if(document.activeElement == $('#word-in')[0])
                    return;
                if(document.activeElement.tagName=="INPUT")
                    return;
                if($('.chDialog').is(":hidden")){
                    chShowDialog()
                }
                else
                    chHideDialog()
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
            translatee(word)
        }
    }

    document.onkeyup = function(event){      
        log.debug(keyCodes+" up")
        keyCodes.pop()　
    }
    document.onfocus = function(){
        log.debug('document.blur()')
        keyCodes=[]
    }

    window.onbeforeunload=function(){
        log.debug('onbeforeunload')
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
        if(isPc()){
            $('#gearframe1').hide()
            $('#pcrecommand').text('控制键(a,s,d,space) 翻译键(q,w,e,enter)')
        }else{
            $('#gearframe1').show()
            $('#pcrecommand').text('PC端操作更方便')
        }
        // if(video.height && video.width)
        //     $('#video').css('height',parseInt($('#video').css('width').replace('px',''))*(video.height/video.width))
    }
    $(document.body).bind('resize',function(){
        onresize()
    })

    function search(){
        if(document.activeElement == $('#word-in')[0]){
            $('#wordsframe').hide()
            translatee($('#word-in').val())
            if(!$('#word-in').val()){
                $('#summtrans').hide()
                $('#wordsframe').hide()
                $('#video').css('top',0)
            }
        } else {
            $('#summtrans').hide()
            $('#wordsframe').show()
            $('#word-in').focus()
            $('#word-in').trigger("input")
            page.dovideoshadow=1
            pauseVideo();
        }
    }


    $.get('/mumu/wxjsapiticket',(res)=>{
        $.get('/mumu/wxsign',{ticket:res.data.ticket,url:location.href},(res)=>{
            log.debug(JSON.stringify(res));
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

    var shareLink = location.origin+'/mumu/index.html?videoNo='+videoNo;
    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用

        wx.updateAppMessageShareData({ 
            title: video.name, // 分享标题
            desc: '幕幕 - 英语练习', // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
            success: function () {
                // 设置成功
            }
        })

        wx.updateTimelineShareData({ 
            title: video.name + '\n幕幕 - 英语练习', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
            success: function () {
            // 设置成功
            }
        })
    });

    function lightkeytrans(ss){
        if(!ss)
            return ss
        var sss= ss.match(/(\w*)\s*?(的过去|的现在|的复数|的第三|的ing)/)
        if(!sss)
            return ss;
        ss = ss.replace(sss[1],`<span class="lightkeytrans" style="text-decoration: underline;cursor:pointer;">${sss[1]}</span>`)
        return ss;
    }

    $('#video').bind('play',function(){
        videoPlay()
    }).bind('pause',function(){
        videoPause()
    }).bind('mouseover',function(){
        $('#video').attr('controls', true)
    }).bind('mouseout',function(){
        $('#video').attr('controls', false)
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
        $('#video').attr('controls', true);
    }).bind('focus',function(){
        $('#video').attr('controls', true)
    }).bind('blur',function(){
        $('#video').attr('controls', false);
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
        translatee(this.item.q)
    })

    $('#word-in').bind('input',function(){
        log.info('#word-in.input')
        var tag = this
        var value  =this.value

        if(this.value==''){
            $('#wordsframe_cancel').show()
        }else{
            $('#wordsframe_cancel').hide()
        }
        if(value){
            $.ajax({
                url:'/mumu/words',
                method:'get',
                data:{
                    kw:value,
                    start:1,
                    pageSize:10,
                    from:video.language,
                    to:2
                },
                success:function(res){
                    if(tag.value==value){
                        $('#words .word').remove()
                        var words = res.data.words
                        $(words).each((inx,item)=>{
                            var wordele = $('#wordtempl').clone(true)
                            wordele[0].item=item
                            wordele.attr('id','word'+(inx+1))
                            wordele.addClass('word')
                            wordele.html(item.q+'&nbsp;&nbsp;'+(item.phonetic?'/'+item.phonetic+'/':'')+'&nbsp;&nbsp;'+(item.explain1||'')+(item.explain2?' | ':'')+(item.explain2||'')+(item.explain3?' | ':'')
                                +(item.explain3||'')+(item.explain4?' | ':'')+(item.explain4||'')+(item.explain5?' | ':'')+(item.explain5||''))
                            $('#words').append(wordele)
                            wordele.show();
                        })
                    }
                }
            })
        }else{
            $('#words .word').remove();
        }
    })





    $('#zh_subtitles').bind('touchstart',function(event){
        log.info('#zh_subtitles.touchstart')
        if(!$(event.target).hasClass('font'))
            return;
        touchstartFn(event);
        event.preventDefault()
    }).bind('touchmove',function(event){
        if(!$(event.target).hasClass('font'))
            return;
        touchmoveFn(event);
        event.preventDefault()
    }).bind('touchend',function(event){
        log.info('#zh_subtitles.touchend')
        if(!$(event.target).hasClass('font'))
            return;
        touchendFn(event);
        event.preventDefault()
    })

    $('#startFn').bind('click',function(){
        log.info('#startFn.click')
        playVideo();
        $('#video').attr('controls', false);
    })

    $('#stopFn').bind('click',function(){
        log.info('#stopFn.click')
        pauseVideo()
        $('#video').attr('controls', false);
    })

    $('#prevline').bind('click',function(){
        log.info('#prevline.click')
        prevline()
    })
    $('#currline').bind('click',function(){
        log.info('#nextline.click')
        currline()
    })
    $('#nextline').bind('click',function(){
        log.info('#nextline.click')
        nextline()
    })

    $('#gear').bind('touchstart',function(event){
        log.info('#gear.touchstart')
        var touch = event.targetTouches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
    }).bind('touchmove',function(event){
        var touch = event.targetTouches[0];
        this.endX = touch.pageX;
        this.endY = touch.pageY;
        var distanceX=this.endX-this.startX;
        var distanceY=this.endY-this.startY;
        log.debug('distanceX: '+distanceX+' lastDist: '+this.lastDist)

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
        if(wno != null){
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
        this.lastDist=null
        this.xx=0
    })

    $('#replay').bind('click',function(event){
        log.info('#replay.click')
        $('#video')[0].load()
        setTimeout(function(){$('#video')[0].muted=false},500)
    })
    $('#hideBtn').bind('click',function(event){
        log.info('#hideBtn.click')
        enSubtitlesShow()
    })
    $('#wholebtn').bind('click',function(event){
        log.info('#wholebtn.click')
        chShowDialog()
    })
    $('#searchbtn').bind('click',function(event){
        log.info('#searchbtn.click')
        search()
    })

    $('#chDialog').bind('click',function(event){
        log.info('#chDialog.click')
        chHideDialog()
    })
    document.body.addEventListener('click',function(){
        log.debug(event.target)
    })


    $('#goPrevVideo').click(function(){
        log.info('#goPrevVideo.click')
        goPrevVideo()
    })
    $('#goNextVideo').click(function(){
        log.info('#goNextVideo.click')
        goNextVideo()
    })


    $('#word-in').bind('blur',function(){
        if(this.value == ''){
            $('#wordsframe').hide()
            $('#video').css('top',0)
            playVideo()
        }
    })

    $('#word-in').bind('focus',function(){
        this.select()
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
    $('#chatminpad').click(function(){
        $('#chatpad').css('height',(geteletop($('#controlpad')[0])-45)+'px')
        $('#chatpad').slideDown(100)
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
    $('#index').bind('touchstart',function(e){
        var touch = e.targetTouches[0];
        this.touchstart = touch.pageY;
        log.debug("touchstart "+this.touchstart)
    }).bind('touchmove',function(e){
        var touch = e.targetTouches[0];
        this.touchend = touch.pageY;
        if($(e.target).scrollTop()==0 && this.touchstart<this.touchend){
            e.preventDefault()
        }
    }).bind('touchend',function(e){
        log.debug("touchend "+this.touchend)
        this.touchstart=null
        this.touchend=null
    })


    $('#chatpad').bind('touchstart',function(e){
        var touch = e.targetTouches[0];
        this.touchstart = touch.pageY;
        log.debug("touchstart "+this.touchstart)
    }).bind('touchmove',function(e){
        var touch = e.targetTouches[0];
        this.touchend = touch.pageY;
        if($('#chatmsgspad').scrollTop()==0 && this.touchstart<this.touchend){
            e.preventDefault()
        }
    }).bind('touchend',function(e){
        log.debug("touchend "+this.touchend)
        if(this.touchend-this.touchstart>50 && $('#chatmsgspad').scrollTop()==0){
            $('#chatpad').slideUp(100)
        }
        this.touchstart=null
        this.touchend=null
    })

    $('#chatpad').bind('mousedown',function(e){
        log.debug("mousedown "+ e.pageY)
        this.mousedown = e.pageY;
    }).bind('mousemove',function(e){
        this.mouseup = e.pageY;
        if($('#chatmsgspad').scrollTop()==0 && this.mousedown<this.mouseup){
            e.preventDefault()
        }
    }).bind('mouseup',function(e){
        log.debug("mouseup "+e.pageY)
        this.mouseup = e.pageY;
        if(this.mouseup-this.mousedown>50 && $('#chatmsgspad').scrollTop()==0){
            $('#chatpad').slideUp(100)
        }
        this.mousedown=null
        this.mouseup=null
    })

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
            var msg = "网友: "+this.value

            var o = {
                text:msg,
                action:1
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

    
    

    var ws = null;
    initws()
    function initws(){
        ws = new WebSocket(`wss://${location.host}/mumu/websocket/${$.cookie('token')}`); 
        //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
        ws.onopen = function(){
        　　//当WebSocket创建成功时，触发onopen事件
            log.debug("ws onopen");            
            page.ws=ws
        }
        ws.onmessage = function(e){
        　　//当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        　　log.debug("ws onmessage: "+e.data);
            var data = JSON.parse(e.data)
            if(data.action == 1){
                var ele = $('#chatmsgtemple').clone(true)
                ele.attr('id','chatmsg'+data.msgNo)
                if(data.userNo==$.cookie('token'))
                    ele.css('color','green')
                ele.text(data.text)
                ele.show();
                $('#chatmsgspad').prepend(ele)
                $('#lastmsg').text(data.text)
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
            log.debug("to ws init after 3")
            initws()
        }
    }, 1000);
    
    setInterval(function(){
        if(ws && ws.readyState==1){
            log.debug("to ws heart check")
            ws.send("0")
        }
    },30000)
})()

