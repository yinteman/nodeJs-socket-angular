/**
 * Created by ZXR on 2016/9/10.设置socket和angular
 */

var app=angular.module('technode',['ngRoute']);
//启动服务器实现验证
app.run(function($window,$rootScope,$http,$location){
    $http({
        url:'/api/validate',
        method:'GET'})
    .success(function(user){
        if(!user){
            $location.path('/login');
        }
        $rootScope.me=user;//后台将用户信息传入data
        $location.path('/rooms');
    }).error(function(err){

        $location.path('/login');
    });

    $rootScope.logout=function(){
        $http({
            url:'/ajax/logout',
            method:'GET'
        }).success(function(data){
            $rootScope.me =null;
            $location.path('/login');

        });
    };
    //监听login路由的变化
    $rootScope.$on('login',function(evt,me){
        $rootScope.me=me;
    })

    })


//将socket封装到angular当中，使用工厂函数，并且监听angular
angular.module('technode').factory('socket',function($rootScope){
     var socket = io('localhost:9000');
     return{
         on:function(e,cb){
             socket.on(e,function(){
                 var args=arguments;
                 $rootScope.$apply(function(){
                     cb.apply(socket,args)
                 })
             })
         },
         emit:function(e,data,cb){
             socket.emit(e,data,function(){
                 var args=arguments;
                 $rootScope.$apply(function(){
                     if(cb){
                         cb.apply(socket,args);
                     }
                 })
             })
         }
     }
 });





