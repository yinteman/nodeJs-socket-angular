/**
 * Created by ZXR on 2016/9/22.创建消息模型
 */
var mongoose=require('mongoose');
var schema= mongoose.Schema;
var objectId=schema.ObjectId;

var messageSchema=new schema({
    message:String,
    creator:{type:objectId,ref:'user'},
    room:{type:objectId,ref:'room'},
    createdAt:{type:Date,default:Date.now()}

})


module.exports=messageSchema;