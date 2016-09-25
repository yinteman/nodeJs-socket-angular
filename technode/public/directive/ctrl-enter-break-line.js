/**
 * Created by ZXR on 2016/9/10.CtrlEnterBreakLine
 */

//自定义属性ctr-enter-break-line
app.directive('ctrEnterBreakLine',function(){
    return function(scope,ele,attrs){
        var ctrDon=false;
        ele.bind('keydown',function(event){
            if(event.which ===17){
                ctrDon =true;
                setTimeout(function(){ ctrDon =false;},1000);
            }0
            if(event.which === 13){
                if(ctrDon){
                    ele.val(ele.val() +'\n');
                }else{
                    scope.$apply(function(){
                        scope.$eval(attrs.ctrEnterBreakLine);
                    })
                    event.preventDefault();
                }
            }

        })
    }
});
