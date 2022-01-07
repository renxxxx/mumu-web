$('#inSeriesPad').click(function(){
    $('#seriesPad').css('height',($(window).height()-($('#video').height()+$('#controlpad').height()+20))+'px')
    $('#seriesPad').slideDown(100)
    //$('#gearframe1').hide()
    $('#prevnextpad').hide()
    $('#subtitlePad').hide()

    if(seriesVideos.seriesNo != video.seriesNo){
        $('#seriesPad .seiresName').text('专辑: '+video.seriesName)
        $('#seriesPad .row').not('.trow').remove()
        seriesVideos.seriesNo=video.seriesNo
        seriesVideos.rows=[]
        loadMoreSeriesVideos();
    }else{
        $('#seriesPad .rows').scrollTop()
        $('#seriesPad .row').find('.name').css('color','#b3b3b3').css('font-weight','unset');
        $('#seriesPad .row'+video.no).find('.name').css('color','#d8d8d8').css('font-weight','900');
    }
})

$('#chatminpad,#goChatBtn,#title').click(function(){
    //$('#chatpad').css('height',(geteletop($('#controlpad')[0])-45)+'px')
    preChatPaused=$('#video')[0].paused
    $('#chatpad').css('height',($(window).height()-($('#video').height()+$('#controlpad').height()+20))+'px')
    //$('#gearframe1').hide()
    $('#prevnextpad').hide()
    $('#subtitlePad').hide()
    $('#chatpad').slideDown(100,function(){
        $('#videoCommentsBtn').click()
    })
})


// $('#favorited').click(unfavoriteVideo);
// $('#unfavorited').click(favoriteVideo);

function favoriteVideo(){
    $.post('/mumu/favorite-video',{videoNo:videoNo},function(){
        video.favoriteCount++
        $('#favorited').show().find('.favoriteCount').text(video.favoriteCount);
        $('#unfavorited').hide().find('.favoriteCount').text(video.favoriteCount);
        video.isFavorited=1
    })
}

function unfavoriteVideo(){
    $.post('/mumu/unfavorite-video',{videoNo:videoNo},function(){
        video.favoriteCount--
        $('#favorited').hide().find('.favoriteCount').text(video.favoriteCount);
        $('#unfavorited').show().find('.favoriteCount').text(video.favoriteCount);
        video.isFavorited=0
    })
}