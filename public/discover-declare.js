$('#historyword_template').bind('click',function(event){
    log.log('$(#historyword_template).click '+$(this).attr('data'))
    dovideoshadow=1
    pauseVideo();
    loadRelatedWords(this.innerText)
    translatee(this.innerText);
    $('.historyword').css('background-color',"#ffffff")
    $(this).css('background-color',"#e7e7e7")
})


$('#video').click(function(){
    var s = $('#video').css('object-fit')
    if(s=='cover'){
        s='contain'
    }else if(s=='contain' || !s){
        s='cover'
    }
    $('#video').css('object-fit',s)
})

$('#chooseDifficultyPad .e').click(function(){
    difficulty = $(this).attr('data')
    $('#chooseDifficultyPad .e').css('background-color','#ffffff');
    $(this).css('background-color','#8a8a8a');
})






$('.yibiao').on('click','span svg',function(){
    log.log('$(.yibiao).click')
    let _mp3 = new Audio($(this).attr('playsrc'));
    _mp3.play();
})



$('#loopLine').click(troggleLoopLine)



$('#favor').click(function(){
    log.log('#favor.click')
    addFavoredWord()
})


document.onkeyup = function(event){      
    //log.log(keyCodes+" up")
    keyCodes.pop()　
}
document.onfocus = function(){
    //log.log('document.blur()')
    keyCodes=[]
}

window.onbeforeunload=function(){
    //log.log('onbeforeunload')
    //historyrecord()
    //navigator.sendBeacon("/mumu/page-out");
}

document.addEventListener('touchend', function(event) {
    var now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);



$(document.body).bind('resize',function(){
    onresize()
})








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
    log.log('#summtrans-word.click')
    $('#summtrans').hide()
    $('#wordsframe').show()
    $('#word-in').val(this.innerText).focus()
    $('#word-in').trigger('input')
    
})

$('#summtrans-speak').bind('click',function(){
    log.log('#summtrans-speak.click')
    if(!this.audio){
        this.audio=new Audio();
    }
    this.audio.src=$(this).attr('play-url')
    this.audio.play()
})

$('#wordtempl').bind('click',function(){
    log.log('#wordtempl.click')
    $('#wordsframe').hide()
    $('#word-in').val('')
    $('#words .word').remove()
    loadRelatedWords(this.item.word)
    translatee(this.item.word,1)
})

$('#word-in').bind('input',function(){
    log.log('#word-in.input')
    var tag = $('#word-in')[0]
    var value  =$('#word-in')[0].value

    if(value==''){
        $('#wordsframe_cancel').show()
    }else{
        $('#wordsframe_cancel').hide()
    }
    clearTimeout(ssssaaa)
    ssssaaa=setTimeout(function(){
        $('#words .word').remove()
    },1000)
    if(value){
        words1ajaxs.push($.ajax({
            url:'/mumu/words1',
            data:{
                kw:value,
                rstart:1,
                rcount:100,
                from:video.language,
                to:2
            },
            ajaxCache:true,
            success:function(res){
                if(tag.value==value){
                    clearTimeout(ssssaaa)
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
    log.log(`#startFn.mousedown`)
    startt=new Date()
    clearTimeout(dddd)
    dddd = setTimeout(function(){
        if(diandu){
            diandu=0
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(103, 103, 103)")
        }else{
            diandu=1
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
        }
    },1000)
}).bind('mouseup',function() { 
    if(isMobile())
        return;
    log.log(`#startFn.mouseup`)
    manual=1
    clearTimeout(dddd)
    if(startt){
        endt=new Date()
        var ss = endt.getTime()-startt.getTime();
        if(ss<1000){
            playVideo()
            //$('#video').attr('controls', false);
        }
    }
}).bind('touchstart',function() { 
    log.log(`#startFn.touchstart`)
    startt=new Date()
    clearTimeout(dddd)
    dddd = setTimeout(function(){
        if(diandu){
            diandu=0
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(103, 103, 103)")
        }else{
            diandu=1
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
        }
    },1000)
}).bind('touchend',function() { 
    log.log(`#startFn.touchend`)
    clearTimeout(dddd)
    manual=1
    if(startt){
        endt=new Date()
        var ss = endt.getTime()-startt.getTime();
        if(ss<1000){
            playVideo()
            //$('#video').attr('controls', false);
        }
    }
})


$('#stopFn,#stopFn1').bind('mousedown',function() { 
    if(isMobile())
        return;
    log.log(`#stopFn.mousedown`)
    startt=new Date()
    clearTimeout(dddd)
    dddd = setTimeout(function(){
        if(diandu){
            diandu=0
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(103, 103, 103)")
        }else{
            diandu=1
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
        }
    },1000)
}).bind('mouseup',function() { 
    if(isMobile())
        return; 
    log.log(`#stopFn.mouseup`)
    manual=2
    clearTimeout(dddd)
    if(startt){
        endt=new Date()
        var ss = endt.getTime()-startt.getTime();
        if(ss<1000){
            pauseVideo()
            //$('#video').attr('controls', false);
        }
    }
}).bind('touchstart',function() { 
    log.log(`#stopFn.touchstart`)
    startt=new Date()
    clearTimeout(dddd)
    dddd = setTimeout(function(){
        if(diandu){
            diandu=0
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(103, 103, 103)")
        }else{
            diandu=1
            $('#stopFn,#stopFn1,#startFn,#startFn1').css('border-color',"rgb(255 0 0)")
        }
    },1000)
}).bind('touchend',function() { 
    log.log(`#stopFn.touchend`)
    clearTimeout(dddd)
    manual=2
    if(startt){
        endt=new Date()
        var ss = endt.getTime()-startt.getTime();
        if(ss<1000){
            pauseVideo()
            //$('#video').attr('controls', false);
        }
    }
})


$('#prevline').bind('click',function(){
    log.log('#prevline.click')
    // if(!loopLine)
    //     pauseVideo()
    prevline()
})
$('#currline').bind('click',function(){
    log.log('#nextline.click')
    currline()
})
$('#nextline').bind('click',function(){
    log.log('#nextline.click')
    // if(!loopLine)
    //     pauseVideo()
    nextline()
})

$('#gear').bind('touchstart',function(event){
    log.log('#gear.touchstart')
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
    //log.log('distanceX: '+distanceX+' lastDist: '+this.lastDist)

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
        dovideoshadow=1
        pauseVideo()
        locateWord(wno)
        this.xx=0
    }
    event.preventDefault()
}).bind('touchend',function(event){
    log.log('#gear.touchend')
    this.startX=null
    this.startY=null
    this.endX = null;
    this.endY = null;
    this.lastDist=null
    this.xx=0
})

$('#gear').bind('mousedown',function(event){
    log.log('#gear.mousedown')
    this.startX = event.pageX;
    this.startY = event.pageY;
}).bind('mousemove',function(event){
    if(!this.startX || !this.startY)
        return
    this.endX = event.pageX;
    this.endY = event.pageY;
    var distanceX=this.endX-this.startX;
    var distanceY=this.endY-this.startY;
    //log.log('-distanceX: '+distanceX+' lastDist: '+this.lastDist)

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
        dovideoshadow=1
        pauseVideo()
        locateWord(wno)
        this.xx=0
    }
    //event.preventDefault()
}).bind('mouseup',function(event){
    log.log('#gear.mouseup')
    this.startX=null
    this.startY=null
    this.endX = null;
    this.endY = null;
    this.lastDist=null
    this.xx=0
})

$('#replay').bind('click',function(event){
    log.log('#replay.click')
    $('#video')[0].load()
    //setTimeout(function(){$('#video')[0].muted=false},500)
})
$('#hideBtn').bind('click',function(event){
    log.log('#hideBtn.click')
    enSubtitlesShow()
})
$('#wholebtn').bind('click',function(event){
    log.log('#wholebtn.click')
    chdialog()
})
$('#searchbtn').bind('click',function(event){
    log.log('#searchbtn.click')
    toSearch()
})



$('#subtitlesBtn').click(function(){
    doSubtitlesStatus()
})





document.body.addEventListener('click',function(){
    //log.log(event.target)
})


$('#goPrevVideo').click(function(){
    log.log('#goPrevVideo.click')
    goPrevVideo()
})
$('#goNextVideo').click(function(){
    log.log('#goNextVideo.click')
    goNextVideo()
})





$('#word-in').bind('focus',function(){
    this.select()
    for (const ajax of translateajaxs) {
        ajax.abort()
    }
    for (const ajax of words1ajaxs) {
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
    if(onlyLookUserNo)
        $('#onlyLookHim').click()
    seed = Math.ceil(Math.random()*100);
    exploreVideos.rows=[]
    exploreVideos.currRows=[]
    exploreVideos.inx=0
    exploreVideos.rstart=0

    onlyLookHimVideos.rows=[]
    onlyLookHimVideos.currRows=[]
    onlyLookHimVideos.inx=0
    onlyLookHimVideos.rstart=0

    trueVideos.rows=[]
    trueVideos.currRows=[]
    trueVideos.noes=[]
    trueVideos.map={}
    trueVideos.inx=0
    trueVideos.rstart=0
    closeLoopVideos()
    goNextVideo()
})

$('.searchtag').click(function(){
    searchtag=$(this).attr('data')
    $('#searchpad').slideUp(100)
    if(onlyLookUserNo)
        $('#onlyLookHim').click()
    seed = Math.ceil(Math.random()*100);
    exploreVideos.rows=[]
    exploreVideos.currRows=[]
    exploreVideos.inx=0
    exploreVideos.rstart=0

    onlyLookHimVideos.rows=[]
    onlyLookHimVideos.currRows=[]
    onlyLookHimVideos.inx=0
    onlyLookHimVideos.rstart=0

    trueVideos.rows=[]
    trueVideos.currRows=[]
    trueVideos.noes=[]
    trueVideos.map={}
    trueVideos.inx=0
    trueVideos.rstart=0
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
        playVideo()
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
    
    if(wordbooks.rows.length==0)
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
    if(loopVideos.on){
        closeLoopVideos()
    }else{
        openLoopVideos()
    }
})



$('#chooseLoopVideosCountPad .count').click(function(){
    clearInterval(loopVideoChooseInterval)
    loopVideos.inx=1
    loopVideos.count = this.attributes.data.value
    $('#chooseLoopVideosCountPad .count').css('background-color','unset')
    $(this).css('background-color','#9b9b9b')

    if(loopVideos.count > 1){
        $('#loopVideoBtn').css('line-height','15px')
        $('#loopVideoBtn').css('white-space','break-spaces')
        $('#loopVideoBtn').text('循环\n'+loopVideos.inx+'/'+loopVideos.count)
    }
    $('#loopVideoBtn').css('background-color','#5a5a5a')
    $('#chooseLoopVideosCountPad').hide()
})


$('#chatroombtn').click(function(){
    $('#chatroompad').show();
    $('#videoCommentsPad').hide();
    $(this).css('background-color','#d7d7d7')
    $('#videoCommentsBtn').css('background-color','#737373')
})
$('#videoCommentsBtn').click(function(){
    $('#chatroompad').hide();
    $('#videoCommentsPad').show();
    $(this).css('background-color','#d7d7d7')
    $('#chatroombtn').css('background-color','#737373')

    $('#videoCommentsPad .comments .comment').each(function(i, item){
        canUnfold(item,$(item).find('.content'))
    })
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





$('#zh_subtitles').bind('mousedown touchstart',function(e){
    log.log(`#zh_subtitles.`+e.type)
        var currTarget = null;
        if(e.type=='touchmove'){
            currTarget=document.elementFromPoint(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
        }else{
            currTarget = e.target;
        }
        if($(currTarget).hasClass('font')){
            firstRangeWordInx=0
            lastRangeWordInx=0
            pauseVideo()
            var index = parseInt($(currTarget).attr('index'));
            currwordno=index+1
            spansIs=1
            spans =[]
            firstRangeWordInx=index
            lastRangeWordInx=index
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
        if(!spansIs)
            return
        $('#zh_subtitles .font').css('background-color','unset')
        var index = parseInt($(currTarget).attr('index'));
        if(spans[spans.length-1] != index){
            spans.push(index)
        }
        var first = spans[0]
        var last = spans[spans.length-1]
        if(first>last){
            var t = first
            first=last
            last=t
        }
        firstRangeWordInx=first
        lastRangeWordInx=last
        for (var inx = first; inx <= last; inx++) {
            $('#zh_subtitles .font.span'+inx).css('background-color','#828282')
        }
    }
}).bind('mouseup touchend',function(e){
    log.log(`#zh_subtitles.`+e.type)
        var currTarget = null;
        if(e.type=='touchmove'){
            currTarget=document.elementFromPoint(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
        }else{
            currTarget = e.target;
        }
        if($(currTarget).hasClass('font')){
            if(spansIs){
                var first = firstRangeWordInx
                var last = lastRangeWordInx
                var word = '';
                for (var inx = first; inx <= last; inx++) {
                    word+=($('#zh_subtitles .font.span'+inx).text()+' ')
                }
                word=word.substr(0,word.length-1)
                dovideoshadow=1
                pauseVideo()
                loadRelatedWords(word)
                translatee(word,1)
                comm.copy({text:word})
                spansIs=0
                spans =[]
            }
        }
})


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
        clearInterval(vvvv)
        vvvv=setInterval(function(){
            var left = parseInt($('#video1').css('left').replace('px',''));
            left=left-20;
            if(left<0){
                clearInterval(vvvv)
                pauseVideo()
                $('#video1').css('left','0')
                goNextVideo()
            }else{
                $('#video1').css('left',left+'px')
            }
        },2)
    }else if(this.touchstartX-this.touchendX<-100){
        clearInterval(vvvv)
        vvvv=setInterval(function(){
            var left = parseInt($('#video2').css('left').replace('px',''));
            left=left+20;
            if(left>0){
                clearInterval(vvvv)
                pauseVideo()
                $('#video2').css('left','0')
                goPrevVideo()
            }else{
                $('#video2').css('left',left+'px')
            }
        },2)
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
        sendChatMsg(msg)
        
        

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

$('#sendChatMsgBtn').click(function(){
    sendChatMsg($('#chatinput').val())
})







$('#wordsframe_cancel').click(function(){
    recoverManual()
    $('#wordsframe').hide()
    $('#videoshasow').hide()
    $('#videobox').css('top',0);
})








$('#relatedWord0').click(function(){
    var tt = this.innerText.replace('\n','')
    translatee(fp__data=tt,fp_addHistory=1,fp_only=1);
    if(tt==currWordText){
        shortWordText=''
        loadRelatedWords(currWordText)
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
                                templateNo:res.data.templateNo
                            }
                            var ele = $('#wordbooksPad .wordbooks .row0').clone(true)
                            ele.removeClass('row0')
                            ele.addClass('row'+row.no)
                            ele.text(row.name)
                            ele[0].data=row
                            row.dom=ele
                            ele.show();
                            $('#wordbooksPad .wordbooks .row0').before(ele)

                            var ele1 = $('#wordbooksPadOnAdd .row0').clone(true);
                            ele1.removeClass('row0')
                            ele1.addClass('row'+row.no)
                            ele1.text(row.name)
                            $('#wordbooksPadOnAdd .row0').before(ele1)
                            ele1.show()
                            ele1[0].data=row

                            wordbooks.rows.push(row)
                            wordbooks.map['no'+row.no]=row
                            row.words={
                                rows:[],
                                currRows:[],
                                rcount:200,
                                selected:null,
                            }
                        }else{
                            common.alert(res.message)
                        }
                    }
                })
            }
        }
    })
})
$('#wordbooksPad .wordbooks .row0').click(function(e){
    $('#startRollBtn').hide()
    var row = wordbooks.selected=this.data;
    $('#wordbooksPad .wordbooks .row').css('background-color','unset')
    $(this).css('background-color','rgb(111, 111, 111)')
    $('#wordbooksPad .createRowBtn').hide()
    $('#wordbooksPad .editRowBtn').show()
    $('#clickToShowCreateWordbookBtn').css('visibility','visible')
    chooseWordbook(row.no)
})

$('#wordbooksPad .words .loadmore').click(function(e){
    loadMoreWordbookWords(wordbooks.selected.no)
})


$(`#wordbooksPad .words .pad .row0`).click(function(){
    var row = this.data;
    translatee(row.word)
    loadRelatedWords(row.word)
    var words = wordbooks.selected.words
    rollInx = words.rows.indexOf(row)+1
    $('#wordbooksPad .words .pad .row').css('background-color','unset')
    $(this).css('background-color','#444')
})

$('#wordbooksPad .words  .coverTargetTextBtn').click(function(){
    if($('#wordbooksPad .words .word').css('visibility')=='hidden')
        $('#wordbooksPad .words .word').css('visibility','visible')
    else
        $('#wordbooksPad .words .word').css('visibility','hidden')
})
$('#wordbooksPad .words  .coverPhoneticTextBtn').click(function(){
    if($('#wordbooksPad .words .phonetic').css('visibility')=='hidden')
        $('#wordbooksPad .words .phonetic').css('visibility','visible')
    else
        $('#wordbooksPad .words .phonetic').css('visibility','hidden')
})
$('#wordbooksPad .words .coverMainTextBtn').click(function(){
    if($('#wordbooksPad .words .translation').css('visibility')=='hidden')
        $('#wordbooksPad .words .translation').css('visibility','visible')
    else
        $('#wordbooksPad .words .translation').css('visibility','hidden')
})

//////////
$(`#wordbooksPad .words .pad .row0 .removeBtn`).click(function(e){
    $('#wordDetailPad').show();
    var row = $(this).parents('.row')[0].data
    wordbooks.selected.words.selected=row
    $('#wordDetailPad .namePad .value').text(row.word)
    $('#wordDetailPad .explainPad .value').text(row.translation)
    $('#wordbooksPad .words .pad .row').css('background-color','unset')
    $(row.dom).css('background-color','#444')
    e.stopPropagation()
})






$('#wordbooksPad .editRowBtn').click(function(e){
    var row = wordbooks.selected;
    $('#wordbookDetailPad').show()
    $('#wordbookDetailPad .namePad .value').text(row.name)
})

$('#wordbookDetailPad .shareBtn').click(function(e){
    var row = wordbooks.selected;
    location.href='./wordbook.html?wordbookNo='+ttb(row.no)+'&templateNo='+ttb(row.templateNo)
})

$('#wordbookDetailPad .deleteBtn').click(function(e){
    var row = wordbooks.selected;
    common.promptLine({
        message:'将删除<span style=color:red;font-size:15px>'+row.name+'</span>, 请输入delete以确认移除.',
        confirm:function(v){
            if(v){
                if(v.toLowerCase().trim() == 'delete'){
                    $.ajax({
                        url: '/mumu/delete-wordbook?',
                        data: {
                            no:row.no,
                            name:row.name,
                            templateNo:row.templateNo
                        },
                        async:false,
                        success: function(res) {
                            if(res.code==0){
                                $('#wordbookDetailPad').hide()
                                $('#wordbooksPad .wordbooks .row'+row.no).remove()
                                row = wordbooks.selected=null
                                $('#wordbooksPad .wordbooks').click()
                            }else{
                                common.alert(res.message)
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
    var row = wordbooks.selected;
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
                        templateNo:row.templateNo
                    },
                    success: function(res) {
                        if(res.code==0){
                            row.name=v
                            $('#wordbooksPad .wordbooks .row'+row.no).text(v)
                            $('#wordbookDetailPad .value').text(v)
                        }else{
                            common.alert(res.message)
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
        wordbooks.selected=null;
        $('#wordbooksPad .createRowBtn').show()
        $('#wordbooksPad .editRowBtn').hide()
        $('#wordbooksPad .words .pad').hide()
        $('#wordbooksPad .wordbooks .row').css('background-color','unset')
        $('#clickToShowCreateWordbookBtn').css('visibility','hidden')
        $('#startRollBtn').hide()
    }
    
})

$(`#wordbooksPad .wordbooks .loadmore`).click(function(){
    loadMoreWordbooks()
})

$(`#favorsPad .loadmore`).click(function(){
    loadMoreFavoredWords()
})






$('#favorsPad .word0').click(function(e){
    var row = this.data
    translatee(row.word)
    loadRelatedWords(row.word)
})
$('#favorsPad .word0 .removeBtn').click(function(e){
    var wrap = $(this).parents('.wrap')
    var row = wrap[0].data
    var ele = $(this).parents('.row');
    var s = removeWordsControl['favor']
    if(!s || new Date().getTime()-parseInt(s) > 1 * 60 *1000){
        common.promptLine({
            message:'将删除<span style=color:red;font-size:15px>'+row.word+'</span>, 请输入delete以确认移除, 1分钟内不会再次提示.',
            manualClose:1,
            cancel:function(v,promptEle){
                promptEle.remove()
            },
            confirm:function(v,promptEle){
                if(v && v.toLowerCase().trim() == 'delete'){
                    $.post('/mumu/unfavor-word',{word:row.word})
                    wrap.remove()
                    favoredWords.rows.splice(favoredWords.rows.indexOf(row),4)
                    favoredWords.currRows.splice(favoredWords.currRows.indexOf(row),4)
                    removeWordsControl['favor']=new Date().getTime()
                    promptEle.remove()
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
                $.post('/mumu/unfavor-word',{word:row.word})
                wrap.remove()
                favoredWords.rows.splice(favoredWords.rows.indexOf(row),4)
                favoredWords.currRows.splice(favoredWords.currRows.indexOf(row),4)
                removeWordsControl['favor']=new Date().getTime()
            }
        })
    }
    e.stopPropagation()
})

$('#favorsPad .coverTargetTextBtn').click(function(){
    if($('#favorsPad .word').css('visibility')=='hidden')
        $('#favorsPad .word').css('visibility','visible')
    else
        $('#favorsPad .word').css('visibility','hidden')
})
$('#favorsPad .coverPhoneticTextBtn').click(function(){
    if($('#favorsPad .phonetic').css('visibility')=='hidden')
        $('#favorsPad .phonetic').css('visibility','visible')
    else
        $('#favorsPad .phonetic').css('visibility','hidden')
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

$('#historyWordsPad .word0 .removeBtn').click(function(e){
    var wrap = $(this).parents('.wrap')
    var row = wrap[0].data
    $.post('/mumu/delete-history-word',{word:row.word})
    wrap.remove()
    historyWords.rows.splice(historyWords.rows.indexOf(row),4)
    historyWords.currRows.splice(historyWords.currRows.indexOf(row),4)
    e.stopPropagation()
})
$('#historyWordsPad .word0').click(function(e){
    var row = this.data
    translatee(row.word)
    loadRelatedWords(row.word)
})

$('#historyWordsPad .coverTargetTextBtn').click(function(){
    if($('#historyWordsPad .word').css('visibility')=='hidden')
        $('#historyWordsPad .word').css('visibility','visible')
    else
        $('#historyWordsPad .word').css('visibility','hidden')
})
$('#historyWordsPad .coverPhoneticTextBtn').click(function(){
    if($('#historyWordsPad .phonetic').css('visibility')=='hidden')
        $('#historyWordsPad .phonetic').css('visibility','visible')
    else
        $('#historyWordsPad .phonetic').css('visibility','hidden')
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

    if(favoredWords.rows.length==0)
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

    if(historyWords.rows.length==0)
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

        if(wordbooks.selected){
            var words = wordbooks.selected.words
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
    if(wordbooksOnAdd.rows.length==0)
        loadMoreWordbooksOnAdd()
    if(wordbooks.selected != null){
        $('#wordbooksPadOnAdd .currRow .name').text(wordbooks.selected.name)
        $('#wordbooksPadOnAdd .currRow')[0].data=wordbooks.selected
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



















$('#onlyLookHim').click(function(){
    if(onlyLookUserNo){
        closeOnlyLookHim()
    }else {
        openOnlyLookHim()
    }
})
// $('#onlyLookHim').click(function(){
//     if(!onlyLookUserNo){
//         exploreVideos.rows.splice(exploreVideos.inx+1-1,exploreVideos.rows.length-1)
//         exploreVideos.currRows=[]
//     }

//     onlyLookHimVideos.rows=[]
//     onlyLookHimVideos.currRows=[]
//     if(onlyLookUserNo){
//         onlyLookUserNo=null
//         $(this).css('background-color','unset');
//     }
//     else {
//         onlyLookUserNo=video.userNo
//         $(this).css('background-color','rgb(90, 90, 90)');
//         onlyLookHimVideos.rows.push(video)
//         onlyLookHimVideos.currRows.push(video)
//     }
//     trueVideos.rows.splice(trueVideos.inx+1-1,trueVideos.rows.length-1)
//     trueVideos.currRows=[]
// })








$('#rollShowWordsPad').click(function(e){
    if(this==e.target){
        closeRollShowWordsPad()
    }
})

$('#rollShowWordsPad .prev').click(function(e){
    wordsRoll(rollInx-1)
})
$('#rollShowWordsPad .next').click(function(e){
    wordsRoll(rollInx+1)
})
$('#rollShowWordsPad .restart').click(function(e){
    wordsRoll(1)
})

$('#rollShowWordsPad .stop').click(function(e){
    _mp3.pause()
    lettersound.pause()
    clearTimeout(rollWordsInterval)
    clearTimeout(readRollWordTimeout)
    $('#rollShowWordsPad .stop').hide()
    $('#rollShowWordsPad .start').show()
    rollIsSound=0
    auto=0
})

$('#rollShowWordsPad .start').click(function(e){
    rollIsSound=1
    auto=1
    startWordsRoll(rollInx)
})

$('#startRollBtn').click(function(){
    rollOpen=1
    $('#rollShowWordsPad').show()
    $('#rollShowWordsPad .stop').hide()
    $('#rollShowWordsPad .start').show()
    pauseVideo()
    rollIsSound=0
    auto=0
    rollInx=!rollInx?1:rollInx
    wordsRoll(rollInx)
})

$('#rollShowWordsPad .word').click(function(){
    var words = wordbooks.selected.words
    var word = words.rows[rollInx-1]
    translatee(word.word)
    loadRelatedWords(word.word)
    closeRollShowWordsPad()
})


_mp3 = $(`<video x5-playsinline playsinline controls360=no webkit-playsinline ></video>`)[0]
lettersound = $(`<video x5-playsinline playsinline controls360=no webkit-playsinline ></video>`)[0]




$('#extendSearchPad').click(function(e){
    if(this==e.target){
        $('#extendSearchPad').hide()
        $('#extendSearchFrame').attr('src',null).hide()
        $('#extendSearchFrame1').attr('src',null).hide()
        $('#extendSearchFrame2').attr('src',null).hide()
        $('#extendSearchFrame3').attr('src',null).hide()
        $('#extendSearchFrame4').attr('src',null).hide()

        $('#extendSearchPad .g').css('background-color','unset')
        $('#extendSearchPad .g1').css('background-color','unset')
        $('#extendSearchPad .g2').css('background-color','unset')
        $('#extendSearchPad .g3').css('background-color','unset')
        $('#extendSearchPad .g4').css('background-color','unset')
    }
})
$('#goExtendSearchBtn').click(function(e){
    $('#extendSearchPad').show()
    $('#extendSearchFrame').attr('src','https://m.youdao.com/dict?q='+currWordText).show()
    $('#extendSearchFrame1').attr('src',null).hide()
    $('#extendSearchFrame2').attr('src',null).hide()
    $('#extendSearchFrame3').attr('src',null).hide()
    $('#extendSearchFrame4').attr('src',null).hide()

    $('#extendSearchPad .g').css('background-color','#ffffff')
    $('#extendSearchPad .g1').css('background-color','#cacaca')
    $('#extendSearchPad .g2').css('background-color','#cacaca')
    $('#extendSearchPad .g3').css('background-color','#cacaca')
    $('#extendSearchPad .g4').css('background-color','#cacaca')
})
$('#extendSearchPad .g').click(function(e){
    $('#extendSearchFrame').show()
    $('#extendSearchFrame1').hide()
    $('#extendSearchFrame2').hide()
    $('#extendSearchFrame3').hide()
    $('#extendSearchFrame4').hide()
    $('#extendSearchPad .g').css('background-color','#ffffff')
    $('#extendSearchPad .g1').css('background-color','#cacaca')
    $('#extendSearchPad .g2').css('background-color','#cacaca')
    $('#extendSearchPad .g3').css('background-color','#cacaca')
    $('#extendSearchPad .g4').css('background-color','#cacaca')
})
$('#extendSearchPad .g1').click(function(e){
    $('#extendSearchFrame').hide()
    $('#extendSearchFrame1').show()
    $('#extendSearchFrame2').hide()
    $('#extendSearchFrame3').hide()
    $('#extendSearchFrame4').hide()
    $('#extendSearchPad .g').css('background-color','#cacaca')
    $('#extendSearchPad .g1').css('background-color','#ffffff')
    $('#extendSearchPad .g2').css('background-color','#cacaca')
    $('#extendSearchPad .g3').css('background-color','#cacaca')
    $('#extendSearchPad .g4').css('background-color','#cacaca')
    if(!$('#extendSearchFrame1').attr('src')){
        $('#extendSearchFrame1').attr('src','https://cn.bing.com/images/search?ensearch=1&q='+currWordText)
    }
})
$('#extendSearchPad .g2').click(function(e){
    $('#extendSearchFrame').hide()
    $('#extendSearchFrame1').hide()
    $('#extendSearchFrame2').show()
    $('#extendSearchFrame3').hide()
    $('#extendSearchFrame4').hide()
    $('#extendSearchPad .g').css('background-color','#cacaca')
    $('#extendSearchPad .g1').css('background-color','#cacaca')
    $('#extendSearchPad .g2').css('background-color','#ffffff')
    $('#extendSearchPad .g3').css('background-color','#cacaca')
    $('#extendSearchPad .g4').css('background-color','#cacaca')
    if(!$('#extendSearchFrame2').attr('src')){
        $('#extendSearchFrame2').attr('src','https://m.baidu.com/sf/vsearch?pd=video&atn=index&word=英文'+currWordText)
    }
})
$('#extendSearchPad .g3').click(function(e){
    $('#extendSearchFrame').hide()
    $('#extendSearchFrame1').hide()
    $('#extendSearchFrame2').hide()
    $('#extendSearchFrame3').show()
    $('#extendSearchFrame4').hide()
    $('#extendSearchPad .g').css('background-color','#cacaca')
    $('#extendSearchPad .g1').css('background-color','#cacaca')
    $('#extendSearchPad .g2').css('background-color','#cacaca')
    $('#extendSearchPad .g3').css('background-color','#ffffff')
    $('#extendSearchPad .g4').css('background-color','#cacaca')
    if(!$('#extendSearchFrame3').attr('src')){
        $('#extendSearchFrame3').attr('src','https://m.aliexpress.com/wholesale/'+currWordText+'.html?osf=direct')
    }
})
$('#extendSearchPad .g4').click(function(e){
    $('#extendSearchFrame').hide()
    $('#extendSearchFrame1').hide()
    $('#extendSearchFrame2').hide()
    $('#extendSearchFrame3').hide()
    $('#extendSearchFrame4').show()
    $('#extendSearchPad .g').css('background-color','#cacaca')
    $('#extendSearchPad .g1').css('background-color','#cacaca')
    $('#extendSearchPad .g2').css('background-color','#cacaca')
    $('#extendSearchPad .g3').css('background-color','#cacaca')
    $('#extendSearchPad .g4').css('background-color','#ffffff')
    if(!$('#extendSearchFrame4').attr('src')){
        $('#extendSearchFrame4').attr('src','https://www.learnersdictionary.com/definition/'+currWordText)
    }
})
$('#closeViewBtn').click(function(){
    if(closeView){
        closeView=0
        $('#closeViewBtn').attr('src','./img/openeye.png')
    }else{
        closeView=1
        $('#closeViewBtn').attr('src','./img/closeeye.png')
    }

    historyrecord()
    restored=0
    playRestored=0
    if(closeView){
        $('#video').attr("poster",null)
        $('#video').css("background-image","url("+video.cover+")")
        $('#video').css("background-repeat","no-repeat")
        $('#video').css("background-size","contain")
        $('#video').css("background-position","center")

        $('#video').attr("src",video.audio16k||video.audio||video.url)
    }else{
        $('#video').attr("poster",video.cover)
        $('#video').attr("src",video.url)
        $('#video').css("background-image","unset")
        $('#video').css("background-repeat","unset")
        $('#video').css("background-size","unset")
        $('#video').css("background-position","unset")
    }
    $('#videobox').css('top','0')
    $('#video').attr('autoplay',true)
    playVideo()
})

$('#changevideoshowtype').click(function(){
    $('#video')[0].load()
    // var s = $('#video').css('object-fit')
    // if(s=='cover'){
    //     s='contain'
    // }else if(s=='contain' || !s){
    //     s='cover'
    // }
    // $('#video').css('object-fit',s)
})


$('#toShortRelatedWordsBtn').click(function(){
    shortWordText=shortWordText?shortWordText:currWordText;
    shortWordText=shortWordText.substr(0,shortWordText.length-1)
    if(!shortWordText){
        shortWordText=currWordText;
    }
    loadRelatedWords(currWordText,shortWordText);
})
$('#toLongRelatedWordsBtn').click(function(){
    shortWordText=shortWordText?shortWordText:currWordText;
    shortWordText=currWordText.substr(0,shortWordText.length+1)
    if(!shortWordText){
        shortWordText=currWordText;
    }
    loadRelatedWords(currWordText,shortWordText);
})

$('#video').bind('contextmenu',function() { return false; });




$('#seriesPad').bind('mousedown touchstart',function(e){
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
        $('#seriesPad').slideUp(100)
        //$('#gearframe1').show()
        $('#prevnextpad').show()
        $('#subtitlePad').show()
    }
    this.touchstartY=null
    this.touchendY=null
})





$('#seriesPad .trow').click(function(){
    var row = this.data;
    trueVideos.rows.splice(trueVideos.inx,100,row)
    onlyLookHimVideos.rows.splice(onlyLookHimVideos.inx,100,row)
    goNextVideo()
    $('#seriesPad').slideUp(100)
    $('#prevnextpad').show()
    $('#subtitlePad').show()
})


$('#wordbookDetailPad .moveup').click(function(){
    var curr = wordbooks.selected;
    var inx = wordbooks.rows.indexOf(curr)
    var prev1 = wordbooks.rows[inx-1]
    var prev2 = wordbooks.rows[inx-2]
    var orderNum=null
    if(prev1 && prev2){
        orderNum=(prev1.orderNum+prev2.orderNum)/2
    }else if(prev1){
        orderNum=prev1.orderNum-1
    }else{
        orderNum=curr.orderNum
    }
    $.post('/mumu/alter-wordbook',{no:curr.no,orderNum:orderNum,templateNo:curr.templateNo},function(res){
        if(res.code==0){
            if(prev1){
                common.changearr(wordbooks.rows,inx,inx-1)
                common.changedom(curr.dom,prev1.dom)
            }
            curr.orderNum=orderNum
        }else{
            common.alert(res.message)
        }
    })
})
$('#wordbookDetailPad .movereset').click(function(){
    var curr = wordbooks.selected;
    common.promptLine({
        message:'将重置所有单词本排序, 请输入know以确认.',
        manualClose:1,
        cancel:function(v,promptEle){
            promptEle.remove()
        },
        confirm:function(v,promptEle){
            if(v && v.toLowerCase().trim() == 'know'){
                promptEle.remove()
                $.post('/mumu/reset-all-wordbooks-ordernum',{templateNo:curr.templateNo},function(res){
                    if(res.code==0){
                        wordbooks={
                            rows:[],
                            rstart:1,
                            rcount:50,
                            currRows:[],
                            selected:null,
                        }
                        $('#wordbooksPad .wordbooks .row').not('.row0').remove()
                        loadMoreWordbooks()
                    }else{
                        common.alert(res.message)
                    }
                })
            }else{
                common.alert('输入错误')
            }
        }
    })
})
$('#wordbookDetailPad .movedown').click(function(){
    var curr = wordbooks.selected;
    var inx = wordbooks.rows.indexOf(curr)
    var next1 = wordbooks.rows[inx+1]
    var next2 = wordbooks.rows[inx+2]
    var orderNum=null
    if(next1 && next2){
        orderNum=(next1.orderNum+next2.orderNum)/2
    }else if(next1){
        orderNum=next1.orderNum+1
    }else{
        orderNum=curr.orderNum
    }
    $.post('/mumu/alter-wordbook',{no:curr.no,orderNum:orderNum,templateNo:curr.templateNo},function(res){
        if(res.code==0){
            if(next1){
                common.changearr(wordbooks.rows,inx,inx+1)
                common.changedom(curr.dom,next1.dom)
            }
            curr.orderNum=orderNum
        }else{
            common.alert(res.message)
        }
    })
})



$('#wordDetailPad .moveup').click(function(){
    var wordbook=wordbooks.selected
    var curr = wordbook.words.selected;
    var inx = wordbook.words.rows.indexOf(curr)
    var prev1 = wordbook.words.rows[inx-1]
    var prev2 = wordbook.words.rows[inx-2]
    var orderNum=null
    if(prev1 && prev2){
        orderNum=(prev1.orderNum+prev2.orderNum)/2
    }else if(prev1){
        orderNum=prev1.orderNum-1
    }else{
        orderNum=curr.orderNum
    }
    curr.orderNum=orderNum;
    $.post('/mumu/add-word-to-book',{
        wordbookNo:wordbook.no,
        word:curr.word,
        translation:curr.translation,
        templateNo:wordbook.templateNo,
        orderNum:orderNum
    })
    if(prev1){
        common.changearr(wordbook.words.rows,inx,inx-1)
        common.changedom(curr.dom,prev1.dom)
    }
})
$('#wordDetailPad .movereset').click(function(){
    var wordbook=wordbooks.selected
    var curr = wordbook.words.selected;
    common.promptLine({
        message:'将重置所有单词排序, 请输入know以确认.',
        manualClose:1,
        cancel:function(v,promptEle){
            promptEle.remove()
        },
        confirm:function(v,promptEle){
            if(v && v.toLowerCase().trim() == 'know'){
                promptEle.remove()
                $.post('/mumu/reset-all-wordbook-words-ordernum',{wordbookNo:wordbook.no,templateNo:wordbook.templateNo},function(res){
                    if(res.code==0){
                        wordbook.words={
                            rows:[],
                            currRows:[],
                            rcount:200,
                            selected:null,
                        }
                        wordbooks.map['no'+wordbook.no].words.rows=[]
                        $(`#wordbooksPad .words .pad .row`).not('.row0').remove()
                        loadMoreWordbookWords(wordbook.no)
                    }else{
                        common.alert(res.message)
                    }
                })
            }else{
                common.alert('输入错误')
            }
        }
    })

})
$('#wordDetailPad .movedown').click(function(){
    var wordbook=wordbooks.selected
    var curr = wordbook.words.selected;
    var inx = wordbook.words.rows.indexOf(curr)
    var next1 = wordbook.words.rows[inx+1]
    var next2 = wordbook.words.rows[inx+2]
    var orderNum=null
    if(next1 && next2){
        orderNum=(next1.orderNum+next2.orderNum)/2
    }else if(next1){
        orderNum=next1.orderNum+1
    }else{
        orderNum=curr.orderNum
    }
    curr.orderNum=orderNum;
    $.post('/mumu/add-word-to-book',{
        wordbookNo:wordbook.no,
        word:curr.word,
        translation:curr.translation,
        templateNo:wordbook.templateNo,
        orderNum:orderNum
    })
    if(next1){
        common.changearr(wordbook.words.rows,inx,inx+1)
        common.changedom(curr.dom,next1.dom)
    }
})

$('#wordDetailPad .closeBtn').click(function(){
    $('#wordDetailPad').hide()
})
$('#wordDetailPad .deleteBtn').click(function(){
    var wordbook=wordbooks.selected
    var curr = wordbook.words.selected;
    if(wordbook.templateNo && app.login.userNo != '100000000000'){
        common.alert('不可编辑系统单词本')
    }else{
        common.promptLine({
            message:'将删除<span style=color:red;font-size:15px>'+curr.word+'</span>, 请输入delete以确认移除.',
            manualClose:1,
            cancel:function(v,promptEle){
                promptEle.remove()
            },
            confirm:function(v,promptEle){
                if(v && v.toLowerCase().trim() == 'delete'){
                    $.post('/mumu/sub-word-to-book',{
                        wordbookNo:wordbook.no,
                        word:curr.word,
                        templateNo:wordbook.templateNo
                    })
                    wordbook.words.rows.splice(wordbook.words.rows.indexOf(curr),1)
                    $(curr.dom).remove()
                    promptEle.remove()
                }else{
                    common.alert('输入错误')
                }
            }
        })
    }
    $('#wordDetailPad').hide()
})






var manual=1
var translateajaxs=[]
var wordbookWordsAjaxs=[]
var videoDom=null;
var query = {
    videoNo:null,
    userNo:null,
    history:null
}
query = getQuery()
var subtitlesStatus
var subtitles=null
var currentSubtitle=null
var currentSubtitleIndex=-1
var rawsubtitles=null;
var dddd;
var seed = Math.ceil(Math.random()*100);
var rstart=1
var currVideos=[]
//log.logon=0
var timeout999
var searchKw='' 
var searchtag=''
var shortWordText=null;
var favoredWords={
    rows:[],
    rstart:1,
    rcount:50,
    currRows:[]
}
var historyWords={
    rows:[],
    rstart:1,
    rcount:50,
    currRows:[]
}

var wordbooks={
    rows:[],
    rstart:1,
    rcount:50,
    currRows:[],
    selected:null,
    map:{},
}
var wordbooksOnAdd={
    rows:[],
    rcount:50,
    currRows:[],
    selected:null,
}
var currWord=null
var removeWordsControl={
    favor:null,
    history:null,
}
var loopVideoCountCache=null
var loopVideoCount=null
var onlyLookUserNo=null
var onlyLookHimVideos={
    rows:[],
    rcount:10,
    currRows:[],
    inx:0,
}
var trueVideos = {
    rows:[],
    rcount:10,
    currRows:[],
    map:{},
    noes:[],
    inx:0,
}

var vvvv,loopVideoChooseInterval,difficulty,diandu,sssss,ssssaaa;
var loopVideos={
    on:null,
    count:1,
    rows:[],
    inx:0,
}
var seriesVideos={
    seriesNo:null,
    rcount:100,
    rows:[],
    inx:0,
    map:{},
}
var closeView=0
var loopLine=0
var pausebeforech = null;
var historywords=[]
var queryVideo = null
var video;
var videoNo;
var rollInxCache = parseInt(localStorage.getItem(config.project+'-rollInx'))
var rollInx = rollInxCache? rollInxCache : 0;
var words1ajaxs=[]
var exploreVideos={
    rows:[],
    currRows:[],
    inx:0,
    map:{},
    rstart:0,
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
var chooseDomList = [];
var translationtext = '';
var comments = {
    rows:[]
}
var dovideoshadow=0

function getMoreOnlyLookHimVideos(async){
    var obj = {}
    obj.shortvideo=1
    obj.longvideo=1
    obj.kw=searchKw
    obj.pageSize=10
    
    obj.userNo=onlyLookUserNo||query.userNo
    // obj.rstart=1
    // obj.sort='numInUser,numInSeries'
    // obj.order='desc,asc'
    if(onlyLookHimVideos.rows.length > 0){
        var last = onlyLookHimVideos.rows[onlyLookHimVideos.rows.length-1];
        obj.lastNo=last.no
        obj.lastCreateTime=last.createTime
        obj.lastNumInSeries=last.numInSeries
        obj.lastNumInUser=last.numInUser
    }else{
        obj.lastNo=null
        obj.lastCreateTime=null
        obj.lastNumInSeries=null
        obj.lastNumInUser=null
    }
    $.ajax({
        url: '/mumu/explore-user-videos',
        data: obj,
        async: async,
        success: function(res) {
            if(res.code==0){
                if(res.data.videos.length>0){
                    onlyLookHimVideos.rows.push(...res.data.videos)
                    onlyLookHimVideos.currRows=res.data.videos
                    trueVideos.rows.push(...res.data.videos)
                    trueVideos.currRows=res.data.videos
                }else{
                    onlyLookHimVideos.rows=[]
                    onlyLookHimVideos.currRows=[]
                    getMoreOnlyLookHimVideos(async)
                }
                $('#video1').attr('src','./img/black.png');
            }
        }
    })
}




function getMoreFavoritedVideos(async){
    var queryData = {
        kw:query.kw,
        rstart:null,
        sort:query.sort,
        order:query.order
    }
    if(trueVideos.rows.length==0 && query.rstart)
        queryData.rstart=query.rstart
    else 
        queryData.rstart=trueVideos.rows.length+1
    $.ajax({
        url: '/mumu/favorited-videos?',
        data: queryData,
        async: async,
        success: function(res) {
            if(res.code==0){
                if(res.data.videos.length>0){
                    trueVideos.rows.push(...res.data.videos)
                    trueVideos.currRows=res.data.videos
                }else{
                    queryData.rstart=1
                    $.ajax({
                        url: '/mumu/favorited-videos?',
                        data: queryData,
                        async: async,
                        success: function(res) {
                            if(res.data.videos.length>0){
                                trueVideos.rows.push(...res.data.videos)
                                trueVideos.currRows=res.data.videos
                            }
                        }
                    })
                }
                $('#video1').attr('src','./img/black.png');
            }
        }
    })
}
function getMoreVideos(async){
    if(query.history){
        getMoreHistoryVideos(async)
        return;
    }
    var rcount = 10
    $.ajax({
        url: '/mumu/explore-videos?',
        data: 'shortvideo=1&kw='+searchtag+'&pageSize='+rcount+"&seed="+seed+"&rstart="+(exploreVideos.rows.length+1),
        async: async,
        success: function(res) {
            if(res.code==0){
                if(res.data.videos.length>0){
                    exploreVideos.rows.push(...res.data.videos)
                    exploreVideos.currRows=res.data.videos
                    exploreVideos.rstart=exploreVideos.rows.length+1
                    trueVideos.rows.push(...res.data.videos)
                    trueVideos.currRows=res.data.videos
                }else{
                    seed = Math.ceil(Math.random()*100);
                    $.ajax({
                        url: '/mumu/explore-videos?',
                        data: 'shortvideo=1&kw='+searchKw+'&pageSize='+rcount+"&seed="+seed+"&rstart=1",
                        async: async,
                        success: function(res) {
                            if(res.data.videos.length>0){
                                exploreVideos.rows.push(...res.data.videos)
                                exploreVideos.currRows=res.data.videos
                                trueVideos.rows.push(...res.data.videos)
                                trueVideos.currRows=res.data.videos
                                exploreVideos.rstart=1
                            }
                        }
                    })
                }
                $('#video1').attr('src','./img/black.png');
            }
        }
    })
}

function getMoreHistoryVideos(async){
    var obj = {}
    obj.rcount=10
    obj.rstart=1
    if(exploreVideos.rows.length > 0){
        obj.init=0
        var last = exploreVideos.rows[exploreVideos.rows.length-1];
        obj.lastNo=last.no
        obj.lastHistoryCreateTime=last.historyCreateTime
        obj.lastNumInSeries=last.numInSeries
        obj.lastNumInUser=last.numInUser
    }else{
        obj.init=1
        obj.lastNo=null
        obj.lastHistoryCreateTime=null
        obj.lastNumInSeries=null
        obj.lastNumInUser=null
    }

    $.ajax({
        url: '/mumu/watch-history-videos?',
        data: obj,
        async: async,
        ajaxCache:{ timeout:5 },
        success: function(res) {
            if(res.code==0){
                if(res.data.videos.length>0){
                    exploreVideos.rows.push(...res.data.videos)
                    exploreVideos.currRows=res.data.videos
                    exploreVideos.rstart=exploreVideos.rows.length+1
                    trueVideos.rows.push(...res.data.videos)
                    trueVideos.currRows=res.data.videos
                }else{
                    exploreVideos.rows=[]
                    exploreVideos.currRows=[]
                    getMoreHistoryVideos(async)
                }
                $('#video1').attr('src','./img/black.png');
            }
        }
    })
}
function recordView(){
    if(ws && video){
        video.view={
            videoNo:video.no,
            videoCurrentTime:$('#video')[0].currentTime,
        }
        ws.send(JSON.stringify({
            action:12,
            ...video.view
        }))
    }
}


function goNextVideo(){
    console.log('goNextVideo')
    restored=0
    playRestored=0
    recordView()
    pauseVideo()
    closeLoopLine()

    if(queryVideo){
        trueVideos.rows.unshift(queryVideo)
        trueVideos.currRows.unshift(queryVideo)

        exploreVideos.rows.unshift(queryVideo)
        exploreVideos.currRows.unshift(queryVideo)
        queryVideo=null
    }

    
    log.log(trueVideos.rows.length+" "+trueVideos.inx)
    if(trueVideos.rows.length==0 || trueVideos.rows.length == trueVideos.inx){
        log.log("sync")
        if(onlyLookUserNo||query.userNo){
            getMoreOnlyLookHimVideos(false)
        }else if(query.isFavorite){
            getMoreFavoritedVideos(false)
        }else{
            getMoreVideos(false)
        }

        trueVideos.currRows.forEach(function(item,inx){
            trueVideos.map['no'+item.no]
            trueVideos.noes.push(item.no)
        })
    }
    
    if(!trueVideos.rows[trueVideos.inx+4-1] ){
        log.log("async")
        if(onlyLookUserNo||query.userNo){
            getMoreOnlyLookHimVideos(true)
        }else if(query.isFavorite){
            getMoreFavoritedVideos(false)
        }else{
            getMoreVideos(true)
        }

        trueVideos.currRows.forEach(function(item,inx){
            trueVideos.map['no'+item.no]
            trueVideos.noes.push(item.no)
        })
    }

    if(!trueVideos.rows[trueVideos.inx+1-1]){
        return;
    }

    if(loopVideos.on){
        if(loopVideos.inx<loopVideos.count){
            trueVideos.inx++;
            loopVideos.inx++;
        }else{
            trueVideos.inx=trueVideos.inx-loopVideos.count+1
            loopVideos.inx=1
        }
        if(loopVideos.count > 1)
            $('#loopVideoBtn').text('循环\n'+loopVideos.inx+'/'+loopVideos.count)
    }else{
        trueVideos.inx++;
    }
    

    videoNo = trueVideos.rows[trueVideos.inx-1].no
    video = trueVideos.rows[trueVideos.inx-1]
    log.log(videoNo)
    
    getvideodone(video)

}

function goPrevVideo(){
    console.log('goPrevVideo')
    restored=0
    playRestored=0
    recordView()
    pauseVideo()
    closeLoopLine()
    if(!trueVideos.rows[trueVideos.inx-1-1]){
        location.replace(location.pathname)
        return;
    }
    trueVideos.inx--;
    if(onlyLookUserNo){
        onlyLookHimVideos.inx--
    }else{
        exploreVideos.inx--
    }
    videoNo = trueVideos.rows[trueVideos.inx-1].no
    video = trueVideos.rows[trueVideos.inx-1]

    if(trueVideos.rows[trueVideos.inx+1-1]){
        $('#video1').attr('src',trueVideos.rows[trueVideos.inx+1-1].cover);
    }else{
        $('#video1').attr('src','');
    }
    if(trueVideos.rows[trueVideos.inx-1-1]){
        $('#video2').attr('src',trueVideos.rows[trueVideos.inx-1-1].cover);
    }else{
        $('#video2').attr('src','./img/black.png');
    }
    getvideodone(video)
}

function playend(){
    timeout999= setTimeout(goNextVideo,1000)
}

function getvideodone(videop){
    video=videop;
    videoNo=videop.videoNo
    clearTimeout(timeout999)
    genShareData()
    $('#zh_subtitles').html('')
    $('#chDialog').text('')
    var ss =ttb(video.reference)||ttb(video.seriesName);
    sss=
        ttb(video.name)+(video.name?' ':'') + 
        (ss?'#':'') + ss

    $('#title').text(sss)
    if(video.seriesNo){
        $('#inSeriesPad').css('display','inline-block')
        $('#inSeriesPad .no').text(video.numInSeries)
        $('#title').css('width','calc(100% - 209px)')
    }else{
        $('#inSeriesPad').hide()
        $('#inSeriesPad .no').text('')
        $('#title').css('width','calc(100% - 169px)')
    }
    if(video.userNo){
        $('#headImage').attr('src',video.headImage)
        $('#headImage').css('display','inline-block')
        $('#onlyLookHim').css('display','inline-block')
        $('#chatminpad').css('width','calc(100% - 105px)')
        $('#videoNickname').text(video.nickname)
    }else{
        $('#headImage').hide()
        $('#onlyLookHim').hide()
        $('#chatminpad').css('width','100%')
    }
    jumpedcaption=null
    currentSubtitle=null
    currentSubtitleIndex=-1
    
    $.ajax({
        url:'/mumu/get-subtitles',
        async:false,
        data:{
            videoNo:videoNo
        },
        success(res){
            subtitles = res.data.subtitles
        }
    })

    $('#commentCount').text(video.commentCount)
    
    restored=0
    playRestored=0
    if(closeView){
        $('#video').attr("poster",null)
        $('#video').css("background-image","url("+video.cover+")")
        $('#video').css("background-repeat","no-repeat")
        $('#video').css("background-size","contain")
        $('#video').css("background-position","center")

        $('#video').attr("src",video.audio16k||video.audio||video.url)
    }else{
        $('#video').attr("src",video.url)
        $('#video').attr("poster",video.cover)

        $('#video').css("background-image","unset")
        $('#video').css("background-repeat","unset")
        $('#video').css("background-size","unset")
        $('#video').css("background-position","unset")
    }
    $('#videobox').css('top','0')
    $('#video').attr('autoplay',true)
    playVideo()

    if(videop.userNo==query.userNo || videop.userNo==onlyLookUserNo){
        $('#onlyLookHim').css('background-color','rgb(90, 90, 90)');
    }else{
        $('#onlyLookHim').css('background-color','unset');
    }



    $('#favorited').hide().find('.favoriteCount').text(video.favoriteCount);
    $('#unfavorited').hide().find('.favoriteCount').text(video.favoriteCount);
    if(videop.isFavorited){
        $('#favorited').show();
        $('#unfavorited').hide();
    }else{
        $('#favorited').hide();
        $('#unfavorited').show();
    }

    clearVideoComments()
    loadMoreVideoComments(videoNo)
}




function restore(){
    if(!restored && video.history){
        if(video.view.videoCurrentTime){
            if(video.duration-video.view.videoCurrentTime>1){
                $('#video')[0].currentTime = video.view.videoCurrentTime;
                if($('#video')[0].currentTime >= video.view.videoCurrentTime){
                    $('#video')[0].currentTime = video.view.videoCurrentTime-2
                    restored=1;
                }else{
                    $('#video')[0].currentTime = 0
                    restored=1;
                }
            }
        }else{
            restored=1
        }
    }else{
        restored=1
    }
}


function playRestore(){
    if(!playRestored && video.history){
        if(video.view.videoCurrentTime){
            if(video.duration-video.view.videoCurrentTime>1){
                $('#video')[0].currentTime = video.view.videoCurrentTime;
                if($('#video')[0].currentTime >= video.view.videoCurrentTime){
                    $('#video')[0].currentTime = video.view.videoCurrentTime-2
                    playRestored=1;
                }
            }else{
                $('#video')[0].currentTime = 0
                playRestored=1;
            }
        }else{
            playRestored=1
        }
    }else{
        playRestored=1
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
    if(videoDom.paused)
        monitor(videoDom.currentTime*1000)
}

function showEndFeelSelect(){
    if($('#video')[0].duration-$('#video')[0].currentTime<3){
        if($('#chooseDifficultyPad').is(':hidden')){
            $('#chooseDifficultyPad .e').css('background-color','#ffffff');
            $('#chooseDifficultyPad').fadeIn(300)
        }
    }else{
        if(!$('#chooseDifficultyPad').is(':hidden')){
            $('#chooseDifficultyPad').hide()
            $('#chooseDifficultyPad .e').css('background-color','#ffffff');
        }
    }
}

function monitor(currentTime){
    $('#loading').hide()
    $('#progressbar .slider').css('width',(videoDom.currentTime/videoDom.duration*100)+'%')
    //showEndFeelSelect()

    if(currentSubtitle && currentTime > currentSubtitle.start && currentTime < currentSubtitle.end){
        return;
    }
    if(!subtitles)
        return
    var next = subtitles[currentSubtitleIndex+1]
    if((next && currentSubtitle && currentTime > currentSubtitle.end && currentTime<next.start) || 
        (!next && currentSubtitle && currentTime >= currentSubtitle.end)){
        if(diandu)
            pauseVideo()
        if(loopLine){
            
            currline()
            return;
        }
        return;
    }

    currentSubtitle=null
    setline(null)
    
    if(next && next.start < currentTime && currentTime < next.end){
        currentSubtitle = next
        currentSubtitleIndex++
        setline(currentSubtitle)
        return;
    }

    for (let index = 0; index < subtitles.length; index++) {
        const subtitle = subtitles[index];
        if(currentTime >= subtitle.start && currentTime <= subtitle.end){
            currentSubtitle = subtitle
            currentSubtitleIndex=index
            setline(currentSubtitle)
            break;
        }
    }
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

function setline(item){
    //item: {id,text,textZh,start,end,num}
    $("#zh_subtitles").html('')
    $("#chDialog").text('')
    if(!item)
        return;
    let _v= item.text.split(' ');
    for(let i=0; i < _v.length; i++){
        if(_v[i]=='\\n'){
            $("#zh_subtitles").append('<br/>')
            continue;
        }
        var sp = $('<span '+
        'style="height: 30px;color:#ffffff;user-select: none;display: inline-block;cursor: pointer;font-weight: 900;font-size: 18px;padding-left:3px;padding-right:3px;box-sizing: border-box;"'+
        ' index="'+i+'"'+
        ' class="font span'+i+'">'+_v[i]+'</span>')
        sp.bind('mouseout',function(){
            if(isPc()){
                $(this).css('border-bottom','none')
            }
        }).bind('mouseover',function(){
            if(isPc()){
                $(this).css('border-bottom','2px solid #ffffff')
            }
        })
        $("#zh_subtitles").append(sp)
    }
    $('#chDialog').html(item.textZh.replace(/\\n/g,'<br/>'))
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
    
    log.log('function prevline')
    var prev = subtitles[currentSubtitleIndex-1]
    if(prev){
        currentSubtitleIndex--; 
        currentSubtitle= prev
        $('#video')[0].currentTime = prev.start/1000
        setline(prev)
        currwordno=0
        
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
    } else {
        $('#video')[0].currentTime = 0
    }
}
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
    log.log('function currline')
    var current = subtitles[currentSubtitleIndex]
    if(current){
        $('#video')[0].currentTime = current.start/1000
        setline(current)
        currwordno=0
        
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
    } else {
        prevline()
    }
}
function nextline(){
    log.log('function nextline')
    var next = subtitles[currentSubtitleIndex+1]
    if(next){
        currentSubtitleIndex++  
        currentSubtitle = next
        $('#video')[0].currentTime = next.start/1000
        setline(next)
        currwordno=0
        
        $('.dialog').css({'display' : 'none'})
        $('.dialogTitle #kw').html('');
    } else {
        $('#video')[0].currentTime = $('#video')[0].duration
    }
}


function pureWord(word){
    if(!word)
        return ''
    return word.replace(/^(\s|:|-|,|\.|\?|!|\[|\]\(|\))+/,'').replace(/(\s|:|-|,|\.|\?|!|\[|\]\(|\))+$/,'').toLowerCase()
}

function translatee(_data,addHistory,only){
    //log.log(_data+3)
    //$('#summrest').hide()
    _data=pureWord(_data)
    if(!only){
        shortWordText='';
        currWordText=_data;
    }
    $('#favor').text('')
    $('#addToWordbookBtn').text('')
    dovideoshadow=1;
    pauseVideo();
    doshadow();
    $('#wordsframe').hide()
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
        for (const ajax of translateajaxs) {
            ajax.abort()
        }
        for (const ajax of words1ajaxs) {
            ajax.abort()
        }
        translateajaxs.push($.ajax({
            url: '/mumu/translate?from='+video.language+'&to=2&q='+_data,
            ajaxCache:true,
            async: true,
            success: function(res) {
                var hasTranslate = false;
                clearTimeout(window.aaa)
                currWord=res.data
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
                }else{
                    if(res.data.translation){
                        hasTranslate=true
                        $('#summtrans-vv').append(`<div>${lightkeytrans1(res.data.translation)}</div>`)
                    }
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
                    // ws.send(JSON.stringify({
                    //     action:3,
                    //     words:3
                    // }))
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
    //log.log("pauseVideo()")
    $('#video')[0].pause();
}
function playVideo(){
    //log.log("playVideo()")
    $('#video')[0].play();
    clearTimeout(window.timeoutdo1)
}


function videoPlay(){
    //log.log("onplay: "+ ++runstep)
    //log.log(" ct: "+ $('#video')[0].currentTime +" st: " +(en.current && en.current.startTime)+" et: " +(en.current && en.current.endTime)+" "+(en.current&&en.current.enValue.substr(0,5)))
    for (const ajax of translateajaxs) {
        ajax.abort()
    }
    $('#video1').css('left','100%')
    $('#video2').css('left','-100%')

    if(trueVideos.rows[trueVideos.inx+1-1])
        $('#video1').attr('src',trueVideos.rows[trueVideos.inx+1-1].cover);
    if(trueVideos.rows[trueVideos.inx-1-1])
        $('#video2').attr('src',trueVideos.rows[trueVideos.inx-1-1].cover);

    $('.historyword').css('background-color',"#ffffff")
    dovideoshadow=0
    // clearTimeout(timeout11)
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
        monitor(videoDom.currentTime*1000)
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

function videoPause(){
    //log.log("onpause: "+ ++runstep)
    //log.log(" ct: "+ $('#video')[0].currentTime +" st: " +(en.current && en.current.startTime)+" et: " +(en.current && en.current.endTime)+" "+(en.current&&en.current.enValue.substr(0,5)))
    
    
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
        //log.log(`$('#videoshasow').show()`)
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
    return ms;
}


var currwordno=0;
var keyCodes=[];
document.onkeydown = function(event){
    var e  = event  ||  window.e;
    var keyCode = e.keyCode || e.which;

    keyCodes=[]
    var last = keyCodes.pop()
    if(last != null && last != undefined)
        keyCodes.push(last)
    if(keyCode!=last)
        keyCodes.push(keyCode)
    //log.log(keyCodes+" down")
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
                manual=1
            }
            else{
                manual=2
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
    dovideoshadow=1
    pauseVideo()
    $('#summtrans-word').show()
    if(currwordno>0){
        $('#wordsframe').hide()
        var word = en.currentwords[currwordno-1];
        translatee(word,1)
    }
}


var lastTouchEnd;
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
function genShareData(){
    shareLink = location.origin+'/mumu?videoNo='+videoNo;
    wx.updateAppMessageShareData({ 
        title: ttb(video.name), // 分享标题
        desc: ttb(video.nickname), // 分享描述
        link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
        success: function () {
            // 设置成功
        }
    })

    wx.updateTimelineShareData({ 
        title: ttb(video.name) + '\n'+ttb(video.nickname), // 分享标题
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
    var sss=ss.replace(/(\w+)/g,`<span class="lightkeytrans" style="cursor:pointer;margin:0 3px 0 0;color: bisque;">$1</span>`)
    sss= sss.replace(/<span.+?>(vi|adj|vt|pron|n|v|num|adv|art|conj|prep|abbr|int|det)<\/span>/,'$1')
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

function doSubtitlesStatus(){
    if(!subtitlesStatus)
        subtitlesStatus=0
    subtitlesStatus++;
    //chDialog zh_subtitles
    if(subtitlesStatus>3){
        subtitlesStatus=1
    }
    if(subtitlesStatus==1){
        $('#chDialog').css('visibility','visible')
        $('#zh_subtitles').css('visibility','visible')
    }else if(subtitlesStatus==2){
        $('#chDialog').css('visibility','hidden')
        $('#zh_subtitles').css('visibility','visible')
    }else if(subtitlesStatus==3){
        $('#chDialog').css('visibility','hidden')
        $('#zh_subtitles').css('visibility','hidden')
    }
}
function chdialog(){
    if($('#chDialog').is(':hidden')){
        $('#chDialog').show()
        $('#wholebtnlash').hide()
    }else{
        $('#chDialog').hide()
        $('#wholebtnlash').show()
    }
}
function recoverManual(){
    if(manual){
        if(manual==1){
            playVideo()
        }else if(manual==2){
            pauseVideo()
        }
    }
}

function openLoopVideos(){
    loopVideos.on=1
    $('#chooseLoopVideosCountPad').show()
    clearInterval(loopVideoChooseInterval)
    var second  = 2;
    $('#chooseLoopVideosCountPad .restSecond').text(second+'s')
    $('#chooseLoopVideosCountPad .count'+loopVideos.count).css('background-color','#9b9b9b')
    loopVideoChooseInterval = setInterval(function(){
        --second;
        $('#chooseLoopVideosCountPad .restSecond').text(second+'s')
        if(second== 0){
            clearInterval(loopVideoChooseInterval)
            $('#chooseLoopVideosCountPad').hide()
            $('#chooseLoopVideosCountPad .count'+loopVideos.count).click()
        }
    },1000)
}
function closeLoopVideos(){
    clearInterval(loopVideoChooseInterval)
    $('#chooseLoopVideosCountPad').hide()
    loopVideos.on=0
    $('#loopVideoBtn').css('background-color','unset')
    if(loopVideos.count > 1){
        $('#loopVideoBtn').css('line-height','33px')
        $('#loopVideoBtn').css('white-space','unset')
        $('#loopVideoBtn').text('循环')
    }
}
spans =[]
spansIs=0
firstRangeWordInx=0
lastRangeWordInx=0
function sendChatMsg(msg){
    if(!msg)
        return;
    var o = {
        text:msg,
        action:1,
        looking:video.name
    }
    ws.send(JSON.stringify(o))
}
function loadRelatedWords(srcword,short){
    srcword=pureWord(srcword)
    short=pureWord(short)
    var word =short?short:srcword
    clearTimeout(sssss)
    sssss=setTimeout(function(){
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
            ajaxCache:true,
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

                    if(short){
                        $('#relatedWordsPad').children(":first").html(`
                            <span style="font-size:15px;float:left;">${shortWordText}</span>
                            <span style="font-size:15px;color:#adadad;float:left;">${currWordText.substr(shortWordText.length,currWordText.length-shortWordText.length)}</span>
                        `)
                    }
                }
            }
        })
    },100)
    
}



function chooseWordbook(wordbookNo){
    
    for (const ajax of wordbookWordsAjaxs) {
        ajax.abort()
    }

    var words = wordbooks.map['no'+wordbookNo].words;
    if(!words){
        words={
            rows:[],
            currRows:[],
            rcount:50,
            selected:null,
        }
        wordbooks.map['no'+wordbookNo].words=words
    }
    $(`#wordbooksPad .words .pad .someload`).hide()
    $(`#wordbooksPad .words .pad .loadmore`).show()
    $('#wordbooksPad .words .pad').show()
    $('#wordbooksPad .words .pad .row').not('.row0').remove()
    if(words.rows.length==0)
        loadMoreWordbookWords(wordbookNo);
    else{
        renderWordbookWords(words.rows,wordbookNo)
        $('#startRollBtn').show()
    }
    
}

function renderWordbookWords(rows,wordbookNo){
    var words = wordbooks.map['no'+wordbookNo].words
    if(rows){
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
            element.dom=ele
        });
    }
    if(words.rows.length==0){
        $(`#wordbooksPad .words .pad .someload`).hide()
        $(`#wordbooksPad .words .pad .loadnodata`).show()
    }else{
        $(`#wordbooksPad .words .pad .someload`).hide()
        $(`#wordbooksPad .words .pad .loadend`).show()
    }
}

function loadMoreWordbookWords(wordbookNo){
    var words = wordbooks.map['no'+wordbookNo].words;
    var rstart = words.rows.length+1
    var rcount = words.rcount
    for (const ajax of wordbookWordsAjaxs) {
        ajax.abort()
    }
    wordbookWordsAjaxs.push(
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
                    wordbooks.selected.words={
                        rows:res.data.rows,
                        currRows:res.data.rows,
                        rcount:200,
                        selected:null,
                    }
                    words.currRows=res.data.rows
                    words.rows.push(...res.data.rows)
                    renderWordbookWords(res.data.rows,wordbookNo)
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
function addWordbookWord(wordbook){
    if(wordbook.templateNo && app.login.userNo != '100000000000'){
        common.alert('不可编辑系统单词本')
    }else{
        common.promptLine({
            message:'请输入释义, 可为空.',
            confirm:function(v){
                if(v!=null){
                    if(wordbooks.selected && wordbook.no == wordbooks.selected.no){
                        $('#startRollBtn').show()
                        var ele = createWordbookWord(wordbook.no,v)
                        $(`#wordbooksPad .words .pad `).prepend(ele)
                    }
                    $.post('/mumu/add-word-to-book',{
                        wordbookNo:wordbook.no,
                        word:currWord.word,
                        translation:v,
                        templateNo:wordbook.templateNo
                    })
                }
            }
        })
    }
}

function createWordbookWord(wordbookNo,tranclation){
    var word = {
        word:currWord.word,
        translation:tranclation,
        phonetic:currWord.phonetic,
        no:randomnum(12)
    }

    var words = wordbooks.map['no'+wordbookNo].words
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
    word.dom=ele
    return ele
}


function loadMoreFavoredWords(){
    var rstart = favoredWords.rows.length+1
    var rcount = favoredWords.rcount
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
                    favoredWords.currRows=res.data.rows
                    favoredWords.rows.push(...res.data.rows)
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
        word:currWord.word,
        translation:currWord.translation,
        phonetic:currWord.phonetic,
        favorWordNo:randomnum(12)
    };
    var ele = createFavoredWord(word)
    favoredWords.rows.splice(0,0,word)
    $('#favorsPad .words').prepend(ele)
    $.post('/mumu/favor-word',{word:currWord.word})
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








function loadMoreHistoryWords(){
    var rstart = historyWords.rows.length+1
    var rcount = historyWords.rcount
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
                    historyWords.currRows=res.data.rows
                    historyWords.rows.push(...res.data.rows)
                    
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
        word:currWord.word,
        translation:currWord.translation,
        phonetic:currWord.phonetic,
        historyWordNo:randomnum(12)
    }
    var ele = createHistoryWord(word)
    historyWords.rows.splice(0,0,word)
    $('#historyWordsPad .words').prepend(ele)
    $.post('/mumu/add-history-word',{word:currWord.word})
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

function loadMoreWordbooksOnAdd(){
    var rstart=wordbooksOnAdd.rows.length+1
    var rcount=wordbooksOnAdd.rcount
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
                    wordbooksOnAdd.currRows=res.data.rows
                    wordbooksOnAdd.rows.push(...res.data.rows)
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

function openOnlyLookHim(){
    $('#video1').attr('src','./img/black.png');
    if(!onlyLookUserNo){
        exploreVideos.rows.splice(exploreVideos.inx+1-1,exploreVideos.rows.length-1)
        exploreVideos.currRows=[]
    }
    onlyLookHimVideos.rows=[]
    onlyLookHimVideos.currRows=[]
    onlyLookUserNo=video.userNo
    $('#onlyLookHim').css('background-color','rgb(90, 90, 90)');
    onlyLookHimVideos.rows.push(video)
    onlyLookHimVideos.currRows.push(video)
    onlyLookHimVideos.inx=1
    trueVideos.rows.splice(trueVideos.inx+1-1,trueVideos.rows.length-1)
    trueVideos.currRows=[]
}
function closeOnlyLookHim(){
    $('#video1').attr('src','./img/black.png');
    if(!onlyLookUserNo){
        exploreVideos.rows.splice(exploreVideos.inx+1-1,exploreVideos.rows.length-1)
        exploreVideos.currRows=[]
    }
    onlyLookHimVideos.rows=[]
    onlyLookHimVideos.currRows=[]
    onlyLookUserNo=null
    $('#onlyLookHim').css('background-color','unset');

    trueVideos.rows.splice(trueVideos.inx+1-1,trueVideos.rows.length-1)
    trueVideos.currRows=[]
}
function closeRollShowWordsPad(){
    $('#rollShowWordsPad').hide()
    _mp3.pause()
    lettersound.pause()
    clearTimeout(rollWordsInterval)
    clearTimeout(readRollWordTimeout)
    rollOpen=0
}

function startWordsRoll(rollInx){
    $('#rollShowWordsPad .stop').show()
    $('#rollShowWordsPad .start').hide()
    rollIsSound=1
    auto=1
    rollInx=!rollInx?1:rollInx
    wordsRoll(rollInx);
}
function wordsRoll(rollInx){
    if(!rollOpen){
        closeRollShowWordsPad()
        return;
    }
    
    _mp3.pause()
    lettersound.pause()
    clearTimeout(rollWordsInterval)
    clearTimeout(readRollWordTimeout)
    var words = wordbooks.selected.words
    if(words.rows.length==0)
        return;
    var word = words.rows[rollInx-1]
    
    if(!word){
        loadMoreWordbookWords(wordbooks.selected.no)
    }
    word = words.rows[rollInx-1]
    if(!word){
        rollInx=1
        wordsRoll(rollInx)
        return;
    }

    


    word.speakUrl=word.usSpeech?word.usSpeech:word.ukSpeech?word.ukSpeech:word.speakUrl;
    if(!word.speakUrl)
        $.ajax({
            url: '/mumu/translate?from='+video.language+'&to=2&q='+word.word,
            ajaxCache:true,
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

    rollInx=rollInx
    localStorage.setItem(config.project+'-rollInx',rollInx)
    $('#rollShowWordsPad .word').text(word.word)
    $('#rollShowWordsPad .inx').text(rollInx)
    $('#rollShowWordsPad .phonetic').text(word.phonetic?('/'+word.phonetic+'/'):' ')
    $('#rollShowWordsPad .translation').text(word.translation||' ')

    if(auto){
        if(rollIsSound){
            // if(word.word.split(' ').length==1 || word.word.split('-').length==2){
            //     var letters = word.word.split('')
            //     var letterInx = 1
            //     lettersound.src="/file/mumu/lettersounds/"+letters[letterInx-1].toLowerCase()+".mp3"
            //     lettersound.play()

            //     lettersound.onpause=function(){
            //         letterInx++;
            //         if(lettersound.currentTime==lettersound.duration){
            //             if(letters[letterInx-1]){
            //                 if(/[a-zA-Z]/.test(letters[letterInx-1])){
            //                     lettersound.muted=false
            //                     lettersound.src="/file/mumu/lettersounds/"+letters[letterInx-1].toLowerCase()+".mp3"
            //                 }else{
            //                     lettersound.muted=true
            //                     lettersound.src="/file/mumu/lettersounds/a.mp3"
            //                 }
            //                 lettersound.play()
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
                    _mp3.muted=false
                    _mp3.src=word.speakUrl;
                }else {
                    _mp3.muted=true
                    _mp3.src="/file/mumu/lettersounds/a.mp3"
                }
                _mp3.onpause=function(){
                    if(_mp3.currentTime==_mp3.duration){
                        if(count > 0){
                            readRollWordTimeout=setTimeout(function(){
                                _mp3.play()
                            },100)
                            count--;
                        }else{
                            clearTimeout(readRollWordTimeout)
                            clearTimeout(rollWordsInterval)
                            if(!word.translationVoice){
                                $.ajax({
                                    url:'/mumu/get-read',
                                    data:{
                                        text:word.translation,
                                        lang:'zh'
                                    },
                                    success:function(res){
                                        word.translationVoice=res.data.voice
                                        fff()
                                    }
                                })
                            }else{
                                fff()
                            }

                            function fff(){
                                rollWordsInterval = setTimeout(function(){
                                    _mp3.onpause=function(){
                                        rollWordsInterval = setTimeout(function(){
                                            wordsRoll(rollInx+1)
                                        },1000)
                                    }
                                    _mp3.src=word.translationVoice
                                    _mp3.play()
                                },100)
                            }
                        }
                    }
                }
                _mp3.play()
            }
            
        }
    }

    
}

function loadMoreSeriesVideos(){
    var rstart = seriesVideos.rows.length+1;
    var rcount = seriesVideos.rcount;
    $.ajax({
        url: '/mumu/series-videos?',
        data: {
            kw:'',
            seriesNo:seriesVideos.seriesNo,
            rstart:rstart,
            rcount:rcount,
        },
        beforeSend:()=>{
            $(`#seriesPad .someload`).hide()
            $(`#seriesPad .loading`).show()
        },
        success: function(res) {
            seriesVideos.rows.push(...res.data.rows)
            if(rstart==1 && res.data.rows.length==0){
                $(`#seriesPad .someload`).hide()
                $(`#seriesPad .loadnodata`).show()
            }else if(res.data.rows.length <rcount){
                $(`#seriesPad .someload`).hide()
                $(`#seriesPad .loadend`).show()
            }else{
                $(`#seriesPad .someload`).hide()
                $(`#seriesPad .loadmore`).show()
            }
            $(res.data.rows).each((inx,row)=>{
                var ele = $('#seriesPad .trow').clone(true)
                ele.removeClass('trow')
                ele.addClass('row'+row.no)
                ele.find('.cover').attr('src',row.cover)
                ele.find('.name').text((row.numInSeries?ttb(row.numInSeries)+" | ":"")+ttb(row.name))
                ele[0].data=row
                ele.show();
                $('#seriesPad .trow').before(ele)

                seriesVideos.map['no'+row.no]=row;
            })
            $('#seriesPad .row').find('.name').css('color','#b3b3b3').css('font-weight','unset');
            $('#seriesPad .row'+video.no).find('.name').css('color','#d8d8d8').css('font-weight','900');
        }
    })
}

function loadMoreWordbooks(){
    var rstart = wordbooks.rows.length+1;
    var rcount = wordbooks.rcount;
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
            wordbooks.rows.push(...res.data.rows)
            wordbooks.currRows = res.data.rows
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
                row.dom=ele
                ele.show();
                $('#wordbooksPad .wordbooks .row0').before(ele)

                wordbooks.map['no'+row.no]=row
                row.words={
                    rows:[],
                    currRows:[],
                    rcount:200,
                    selected:null,
                }
            })

            if(rstart==1){
                $('#wordbooksPad .wordbooks .row').not('.row0').first().click()
            }

            
            if(wordbooks.rows.length==0){
                $('#clickToShowCreateWordbookBtn').css('visibility','hidden')
            }else{
                $('#clickToShowCreateWordbookBtn').css('visibility','visible')
            }
        }
    })
}