(function(){
    var page = {
    }
    window.page=page
   
    setTimeout(function(){
        $('#logo').hide()
        $('#index').show()
    },500)

    $('#moreUsersBtn').click(function(){
        $('#moreUserPad').slideDown(100)
    })

    $('#moreUserPad').click(function(e){
        if(e.target==this)
            $('#moreUserPad').slideUp(100)
    })
})()

