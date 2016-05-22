
$(document).on('touchmove',function(ev){
    ev.preventDefault();
});
$(function(){
    //解决各设备高度适配问题
    var viewHeight=$(window).height();
    var $li=$('#list').find('>li');
    $('#main').css('height',viewHeight);
    slidePage();
    function slidePage(){
        var startY=null;
        var step=1/4;
        var nowIndex=0;
        var nextorprevIndex=0;
        var bOk=true;
        //绑定touchstart事件
        $li.on('touchstart',function(ev){
            if(bOk==false) return;
            bOk=false;
            var touch=ev.originalEvent.touches[0];
            startY=touch.pageY;
            nowIndex=$(this).index();
            $li.on('touchmove.move',function(ev){
                var touch=ev.originalEvent.touches[0];
                $(this).siblings('li').hide();
                //首先会进行上下划动的判断
                //缩放公式：1-Math.abs(touch.pageY-startY)/viewHeight*step 0~0.25 1~0.75
                if(touch.pageY<startY){//up
                    nextorprevIndex=nowIndex==$li.length-1?0:nowIndex+1;
                    $li.eq(nextorprevIndex).css('transform','translate(0,'+(viewHeight+touch.pageY-startY)+'px)')
                }else if(touch.pageY>startY){//down
                    nextorprevIndex=nowIndex==0?$li.length-1:nowIndex-1;
                    $li.eq(nextorprevIndex).css('transform','translate(0,'+(-viewHeight+touch.pageY-startY)+'px)')
                }else{
                    bOk=true;
                }
                $(this).css('transform','translate(0,'+(touch.pageY-startY)*step+'px) scale('+(1-Math.abs(touch.pageY-startY)/viewHeight*step)+')');
                $li.eq(nextorprevIndex).addClass('zIndex').show();
            });
            $li.on('touchend.move',function(ev){
                var touch=ev.originalEvent.changedTouches[0];
                if(touch.pageY<startY) {//up
                    $(this).css('transform','translate(0,'+(-viewHeight*step)+'px) scale('+(1-step)+')')
                }else if(touch.pageY>startY) {//down
                    $(this).css('transform','translate(0,'+(viewHeight*step)+'px) scale('+(1-step)+')')
                }else{
                    bOk=true;
                }
                $li.eq(nextorprevIndex).css('transform','translate(0,0)');
                $li.eq(nextorprevIndex).css('transition','.3s');
                $li.eq(nowIndex).css('transition','.3s');
                $li.off('.move');
            })
        })
        $li.on('transitionend webkitTransitionend',function(ev){
            if(!$li.is(ev.target)) return;
            resetFn();
        })
        function resetFn(){
            $li.css('transform','');
            $li.css('transition','');
            $li.eq(nextorprevIndex).removeClass('zIndex').siblings('li').hide();
            bOk=true;
        }
    }
})