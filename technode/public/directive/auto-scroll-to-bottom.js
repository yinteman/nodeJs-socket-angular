/**
 * Created by ZXR on 2016/9/10.autoScrollToBottom
 */
//自定义属性auto-control-scroll
app.directive('autoControlScroll',function(){
    return{
        link:function(scope,ele,attrs){
            scope.$watch(
                function(){
                    return ele.find('.list-group-item').length;},
                function(){
                    ele.animate({
                        scrollTop:ele.prop('scrollHeight')
                    },1000)
                }
            );
        }
    }
});
