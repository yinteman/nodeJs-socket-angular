/**
 * Created by ZXR on 2016/9/22.message的model模型
 */

var mongoose=require('mongoose');
var messageSchema=require('../schema/messageSchema');

var messageModel=mongoose.model('message',messageSchema);



module.exports=messageModel;