var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var controller=require('./controllers');
var  session=require('express-session');
var cookie  = require('cookie');
var mongoStore=require('connect-mongo')(session);
var async=require('async');
var sessionStore=new mongoStore({
  url:'mongodb://localhost/pachong'
})
mongoose.connect('mongodb://localhost/pachong');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http=require('http');
var server=http.createServer(app);
var io=require('socket.io').listen(server);

//创建服务
var port=process.env.PORT || 9000;

server.listen(port,function(){
  console.log('tech node is on port'+port);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.signedCookieParser=cookieParser('technode');
app.use(session({
       secret:'technode',
       resave:true,
      saveUninitialized:true,
      cookie:{maxAge : 60 *1000},
      store:sessionStore
}));
app.get('/api/validate',function(req,res){
  var userId=req.session._userId;
  if(userId){

    controller.findUserById(userId,function(err,user){
      if(err){res.status(401).json({msg:err})}
      else {
        res.json(user)
      }
    })
  }else{
    res.status(401).json(null);
  }
})
app.post('/api/login',function(req,res){
  var email=req.body.email ;
  if(email){
    controller.findByEmailorCreate(email,function(err,user) {

      if (err) {

        res.json(500, {msg: err});
      } else {

        req.session._userId = user._id;
        controller.online(user._id, function (err, data) {
          if (err) {
            res.json(500, {msg: err})
          }
          else {

            res.json(data);
          }

        })

      }
    })
  }else{res.json(403)}
})

app.get('/api/logout',function(req,res){
  var  _userId =req.session._userId;
  controller.offline(_userId ,function(err,user){
   if(err){res.json(500,{msg:err})}else{
     res.json(200);
     delete req.session._userId;
   }
  })
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res){
  res.sendFile(path.join(__dirname, './public/index.html'));

});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




var messages=[];
io.set('authorization',function(handShakeData,accept){
  var cookies=cookie.parse(handShakeData.headers.cookie);
  var connectSid=cookies['connect.sid'];
  if(connectSid){

    //将cookie中的connectSid解签，为了获取其中的session
    var connected=cookieParser.signedCookie(connectSid,'technode');

    if(connected){
      sessionStore.get(connected,function(error,session){
        if(error){accept(error.message ,false)}
        else {

          handShakeData.headers.sessions=session;
          if(session._userId){accept(null,true)}else{accept(null,false)}
        }
      })
    }else{
      accept(null,false)
    }
  }
  /*signedCookieParser(handShakeData,{},function(err){
    if(err){accept(err,false);}
    console.log((handShakeData.signedCookies['connect.sid']));
    sessionStore.get(handShakeData.signedCookies['connect.sid'],function(err,session){
   if(err){
        accpet(err.message,false)
      }else{
        handShakeData.session=session;
        if( session && session._userId){

          accept(null,true)
        }else {accept('no login')}
      }
    })
  })*/
});

io.sockets.on('connection',function(socket){
  socket.emit('connected');
  var userId=socket.handshake.headers.sessions._userId;
  //创建房间信息
  socket.on('createRoom',function(room){
    controller.createRoom(room,function(err,room){
      if(err){socket.emit('err',{msf:err})}
      else {
        console.log(room);
        io.sockets.emit('roomAdded',room)
      }
    })
  });
 //获取所有房间信息
  socket.on('getAllRooms',function(data){
    if(data && data._roomId){
      controller.getByRoomId(data._roomId,function(err,room){
        if(err){socket.emit('err',{msg:err})}else{
          socket.emit('roomData'+data._roomId,room)
        }
      })
    }else {
      controller.getRoomInfo(function (err, rooms) {
        if (err) {
          socket.emit(err, {msg: 'err'})
        } else {
          socket.emit('roomsData', rooms)
        }
      })
    }
  })
  //用户加入某个房间后，进行的修改
  socket.on('joinRoom',function(join){
    controller.joinRoom(join,function(err){
      if(err){socket.emit('err',{msg:err})}else{
        socket.join(join.room._id);
        socket.emit('joinRoom'+join.user._id,join);
        socket.in(join.room._id).broadcast.emit('messageAdded',{
          message:join.user.name+' 进入聊天室',
        'creator':'SYStem',
        createdAt:new Date()})

        io.sockets.in(join.room._id).emit('joinRoom',join)
      }
    })
  })
  //获取用户进入房间信息
  controller.online(userId,function(err,user){
    if(err){socket.emit('err',{msg:err})}else{
      io.sockets.emit('messageAdded',
          {message:user[0].name + '进入了聊天室',
          creator:'System',
          createdAt:new Date()})
    }
  });

  //获取当前房间用户信息和发送的所有信息
  socket.on('getRoom',function(){
    async.parallel([function(done){
      controller.getOnlineUser(done);},
      function(done){controller.readMsg(done);}
    ],
    function(err,result){

      if(err){socket.emit('err',{msg:err})}
      else{
        socket.emit('roomData',{
          user:result[0],
          message:result[1]
        })
      }
    }

    )
  });
 //创建一条信息的信息
  socket.on('createMessages',function(message){
    controller.createMsg(message,function(err,data){

      if(err){socket.emit('err',{msg:err})}
      else{
        socket.in(message._roomId).broadcast.emit('messageAdded'.message)
        messages.push(message);
        io.sockets.emit('messageAdded',message);
      }
    })

  });

//断开连接
  socket.on('disconnect',function(){
    controller.offline(userId,function(err,user){
      if(err){socket.emit(err,{msg:err})}else {
        socket.broadcast.emit('offline',user)
      }
    })
  })
});



module.exports = app;
