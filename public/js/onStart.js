$.ajaxSetup({
    type:'post',
})

let isStarted = sessionStorage.getItem(app.project+'-isStarted')
if(!isStarted){
    app.loginRefresh()
    isStarted = 1;
    sessionStorage.setItem(app.project+'-isStarted',isStarted)
}else{
    app.login = JSON.parse(sessionStorage.getItem(app.project+'-login'))
    if(!app.login){
        app.loginRefresh()
    }
}
