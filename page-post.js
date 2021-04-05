feedback()
function feedback(){ 
    $(document.body).append(`
        <div class="unselectable" style="position:absolute;right:0;bottom:0;cursor:pointer;border:1px solid #827e7e;border-bottom:0;border-right:0;border-radius: 2px 0 0 0;padding:0 5px;
                z-index:999999;background-color:#ffffff;color: #827e7e;" 
            onclick="
                var r= prompt('感谢您的反馈, 可留下联系方式.')
                if(r){
                    $.post('/mumu/feedback',{content:r})
                    alert('已反馈')
                }
            "
        >反馈</div>`)
}