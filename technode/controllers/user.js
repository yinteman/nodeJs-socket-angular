/**
 * Created by ZXR on 2016/9/11.user的实例化功能
 */

var userModel=require('../model/userModel');
var messageModel=require('../model/messageModel');
var roomModel=require('../model/roomModel');
var async=require('async');

var gravatar=require('gravatar');

/**
 * 关于用户的处理
 * */

exports.findUserById=function(userId,cb){
    userModel.findOne({_id:userId},cb);
};

exports.findByEmailorCreate =function(email,cb){
    userModel.findOne({email:email},function(err ,user){
        console.log(user);
        if(user){ cb(null ,user)}else{
            var newOne={
                name:email.split('@')[0],
                email:email,
                avatarUrl:gravatar.url(email)
            };

            userModel.create(newOne,cb);
        }
    })
}


exports.online=function(_userId,cb){
    userModel.update({_id:_userId},{$set:{online:true}},function(err,data){
        if(data){
            userModel.find({_id:_userId},cb);
        }
    })
}


exports.offline=function(_userId,cb){
    userModel.update({_id:_userId},{$set:{online:false}},cb)
}
exports.getOnlineUser=function(cb){
    userModel.find({online:true},cb);
}

exports.joinRoom=function(join,cb){
    userModel.findOneAndUpdate({_id:join.user._id},{
        $set:{online:true,room:join.room._id}},cb)
}
/***
 *
 * 关于信息的管理
 * */
exports.createMsg=function(message,cb){
    var newMsg =new messageModel();
    newMsg.message = message.message;
    newMsg.creator=message.creator._id;
    newMsg.save(cb);
}

exports.readMsg=function(cb){
    messageModel.find({},null,{sort:{'createdAt':-1},limit:20})
        .populate('creator','_id name avatarUrl online').exec(cb);
}

/*
* 关于房间的建立和管理
* ***/

exports.createRoom=function(room,cb){
    var r=new roomModel();
    r.name=room.name;
    r.save(cb);
}

exports.getRoomInfo=function(cb){
    roomModel.find({},function(err,rooms){
        if(!err){
            var roomsDate=[];
            async.each(rooms,function(room,done){
                var roomDate=room.toObject();
                userModel.find({room:roomDate._id,online:true},
                    function(err,users){
                    if(err){done(err)}else {
                        roomDate.users=users;
                        roomsDate.push(roomDate);
                        done();
                    }

                })

            },function(err){console.log(roomsDate);cb(err,roomsDate)}
            )
        }
    })
}

exports.getByRoomId=function(roomId,cb){
    roomModel.findOne({_id:roomId},function(err,room){
        if(err){cb(err)}
        else{
            async.parallel([function(done){
                userModel.find({room:roomId,online:true},function(err,users){
                    done(err,users);
                })
            },function(done){
                messageModel.find({room:roomId},null,{sort:{'createdAt':-1},limit:20})
                .populate('creator','id name avatarUrl online').exec(function(err,messages){
                    done(err,messages.reverse());
                })
            }],function(err,results){
                if(err){cb(err)}else{
                    room =room.toObject();
                    room.users=results[0];
                    room.messages=results[1];
                    cb(null,room)
                }
            })
        }
    })
}