/**
 * Created by ZXR on 2016/9/11.建立登录的控制器
 */

 app.controller('loginCtr',function($scope,$http,$location){
     $scope.login=function(){
         $http({
             url:'/api/login',
             method:'POST',
             data:{email:$scope.email}
         }).success(function(user){
             $scope.$emit('login',user);
             $location.path('/rooms');
         }).error(function(err){
             console.log(err);
             $location.path('/login');
         })
     }
 })