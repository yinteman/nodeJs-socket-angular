/**
 * Created by ZXR on 2016/9/10.使用angular的路由
 */

app.config(function($routeProvider,$locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
     .when('/rooms',{
         templateUrl:'/pages/roomList.html',
         controller:'RoomsCtrl'
     })
     .when('/rooms/:_roomId',{
        templateUrl:'/pages/room.html',
        controller:'Room'
    })
    .when('/login',{
        templateUrl:'/pages/login.html',
        controller:'loginCtr'
    })
    .otherwise({
        redirectTo:'/login'
    })
})