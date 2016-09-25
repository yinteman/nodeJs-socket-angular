/**
 * Created by ZXR on 2016/9/10.控制器RoomCtrol
 */


app.controller('Room',function($scope,$routeParams,socket){
    $scope.room=[];
    $scope.messages=[];
    socket.emit('getAllRooms',{_roomId:$routeParams._roomId});
    socket.on('roomData'+$routeParams._roomId,function(room){
        $scope.room=room.users;
        room.messages.forEach(function(item){
            $scope.messages.push(item);

        });

    });
    socket.on('joinRoom',function(join){
        console.log(join);
        $scope.room.users.push(join.user)
    })

    socket.on('messageAdded',function(message){
        console.log( message );
        $scope.messages.push(message);
    })
   /* socket.on('online',function(user){
        $scope.room.users.push(user);
    });*/
    socket.on('offLine',function(user){
       var  _userId =user._id;
        $scope.room.users=$scope.room.users.filter(function(user){
            return user.id !=_userId;
        })
    })

});