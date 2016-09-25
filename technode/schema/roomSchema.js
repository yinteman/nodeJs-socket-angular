/**
 * Created by ZXR on 2016/9/23.设置房间的schema
 */

var mongoose=require('mongoose');

var roomSchema=new mongoose.Schema({
    name:String,
    createAt:{type:Date,default:Date.now()}
});

module.exports=roomSchema;