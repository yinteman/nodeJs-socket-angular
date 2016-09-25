/**
 * Created by ZXR on 2016/9/10.表单的新建消息
 */


app.controller('MessageCtr',function($scope,socket){
    $scope.newMessage='';
    $scope.createMessage=function(){
        if($scope.newMessage == ''){
            return;
            }
        socket.emit('createMessages',{message:$scope.newMessage,creator:$scope.me});
        $scope.newMessage = '';



    }
});
