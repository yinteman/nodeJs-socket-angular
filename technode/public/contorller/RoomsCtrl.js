/**
 * Created by ZXR on 2016/9/23.roomCtrl的控制器
 */

app.controller('RoomsCtrl',function($scope,$location,socket){
    socket.emit('getAllRooms');
    console.log($scope.searchKey);
    socket.on('roomsData',function(rooms){
        $scope.rooms=$scope._rooms=rooms;
        $scope.searchRoom=function(){
            console.log($scope.searchKey);
            if($scope.searchKey){
                $scope.rooms=$scope._rooms.filter(function(room){
                    return room.name.indexOf($scope.searchKey) > -1
                })
            }else{
                $scope.rooms=$scope._rooms;
            }
        }
    })
    $scope.createRoom=function(){
        socket.emit('createRoom',{name:$scope.searchKey});
        socket.on('roomAdded',function(room){
            $scope._rooms.push(room);
            $scope.searchKey='';
            $scope.searchRoom();
        });

    }

   $scope.enterRoom=function(room) {
       socket.emit('joinRoom', {user: $scope.me, room: room});}


       socket.on('joinRoom' + $scope.me._id, function (join) {
           $location.path('/rooms/' + join.room._id)
       });

       socket.on('joinRoom',function(join){
           console.log($scope.rooms);
           $scope.rooms.forEach(function(room){
               if(room._id == join.room._id){
                   room.users.push(join.user)
               }
           })
       })



})