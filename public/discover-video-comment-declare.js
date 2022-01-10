$('#sendVideoComment').click(sendVideoComment)

function canUnfold(outer,inner){
    
    outer = $(outer)
    inner = $(inner)

    if(!outer.attr('initialMaxHeight'))
        outer.attr('initialMaxHeight',outer.css('max-height'))
    if(!inner.attr('initialMaxHeight'))
        inner.attr('initialMaxHeight',inner.css('max-height'))

    var initialMaxHeight = inner.attr('initialMaxHeight').replaceAll('px','')
    var height = inner.height()
    var scrollHeight = inner[0].scrollHeight
    if(scrollHeight <= initialMaxHeight){
        outer.find('.unfold').hide()
        outer.find('.fold').hide()
        return false
    }
    var scrollTop = inner[0].scrollTop
    var scrollBottom = scrollHeight - height - scrollTop
    if(scrollBottom > 0){
        outer.find('.unfold').show()
        outer.find('.fold').hide()
        return true
    } else {
        outer.find('.unfold').hide()
        outer.find('.fold').show()
        return false
    }
}


function loadMoreVideoComments(videoNo){
    $.post('/mumu/get-video-comments',{
        videoNo:videoNo,
        rstart:comments.rows.length+1
    },function(res){
        if(res.code == 0){
            var moreComments = res.data.comments;
            comments.rows.push(...moreComments)
            for (const i in moreComments) {
                var rowsDom = $('#videoCommentsPad .comments');
                var templateDom = $('#videoCommentsPad .comments .comment.template');
                var rowDom = renderNewVideoComment(templateDom,moreComments[i])
                rowDom.appendTo(rowsDom).show()
            }
        }
    })
}

function clearVideoComments(){
    comments.rows=[]
    $('#videoCommentsPad .comments .comment').not('.template').remove()
}

function unfold(outer,inner){
    var height = inner.height()
    var scrollHeight = inner[0].scrollHeight
    var scrollTop = inner[0].scrollTop
    var scrollBottom = scrollHeight - height - scrollTop
    if(canUnfold(outer,inner)){
        inner.css('max-height',inner.height() + scrollBottom +'px')
        outer.css('max-height',outer.height() + scrollBottom + 'px')
    }
    canUnfold(outer,inner)
}

function fold(outer,inner){
    outer.css('max-height',outer.attr('initialMaxHeight'))
    inner.css('max-height',inner.attr('initialMaxHeight'))
    canUnfold(outer,inner)
}



function sendVideoComment(){
    var content = $('#videoCommentInput').val()
    if(content==null || content==undefined || content.trim()=='')
        return;
    $.post('/mumu/comment-video',{
        videoNo:videoNo,
        content:content
    },function(res){
        if(res.code == 0){
            var comment = {
                commentNo:res.data.commentNo,
                content:content,
                createTime:moment().format("YYYY-MM-DD HH:mm:ss"),
                userNo:app.login.userNo,
                nickname:app.login.nickname,
                headImage:app.login.headImage,
                likeCount:0,
            }
            comments.rows.unshift(comment)
            var rowsDom = $('#videoCommentsPad .comments');
            var templateDom = $('#videoCommentsPad .comments .comment.template');
            var rowDom = renderNewVideoComment(templateDom,comment)
            rowDom.prependTo(rowsDom).show()
            $('#videoCommentInput').val('')

            video.commentCount+=1
            $('#commentCount').text(video.commentCount)
        }
    })
}

function renderNewVideoComment(template, comment){
    template = $(template)
    var dom = template.clone(true);
    dom.attr('data',comment)
    comment.$dom=dom
    dom.removeClass('template')
    dom.addClass('no'+comment.commentNo)
    dom.find('.headImage').attr('src',comment.headImage||'./img/head.png')
    dom.find('.nickname').text(comment.nickname)
    dom.find('.likeCount').text(comment.likeCount)
    dom.find('.content').text(comment.content)
    longPress(dom,()=>{
        if(comment.userNo==app.login.userNo){
            dom.find('.isSelf').show()
        }
    })
    if(comment.userNo==app.login.userNo){
        dom.find('.isSelf').show()
    }else{
        dom.find('.isSelf').hide()
    }
    if(comment.userNo==video.userNo){
        dom.find('.isVideoOwner').show()
    }else{
        dom.find('.isVideoOwner').hide()
    }
    if(comment.isLike){
        dom.find('.liked').show()
        dom.find('.unliked').hide()
    }else{
        dom.find('.liked').hide()
        dom.find('.unliked').show()
    }
    dom.find('.fold').click(function(){
        fold(dom,dom.find('.content'))
    })
    dom.find('.unfold').click(function(){
        unfold(dom,dom.find('.content'))
    })
    dom.find('.liked').click(function(){
        $.post('/mumu/unlike-video-comment',{commentNo:comment.commentNo},function(res){
            if(res.code==0){
                comment.isLike=0
                comment.likeCount-=1
                dom.find('.likeCount').text(comment.likeCount)
                dom.find('.liked').hide()
                dom.find('.unliked').show()
            }
        })
    })

    dom.find('.unliked').click(function(){
        $.post('/mumu/like-video-comment',{commentNo:comment.commentNo},function(res){
            if(res.code==0){
                comment.isLike=1
                comment.likeCount+=1
                dom.find('.likeCount').text(comment.likeCount)
                dom.find('.liked').show()
                dom.find('.unliked').hide()
            }
        })
    })
    return dom
}
