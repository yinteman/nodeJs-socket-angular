/**
 * Created by ZXR on 2016/9/11.userSchema
 */

var mongoose=require('mongoose');
var ObjectId= mongoose.Schema.ObjectId ;
var userSchema=new mongoose.Schema({
    email:String,
    name:String,
    room:{type:ObjectId,ref:'room'},
    avatarUrl:String,
    online:Boolean
})


module .exports=userSchema;