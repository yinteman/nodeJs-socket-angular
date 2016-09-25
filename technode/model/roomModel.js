/**
 * Created by ZXR on 2016/9/23.room的model
 */

var mongoose=require('mongoose');
var roomSchema=require('../schema/roomSchema');

var roomModel=mongoose.model('room',roomSchema);


module.exports=roomModel;