/**
 * Created by ZXR on 2016/9/11.userModel
 */

var mongoose=require('mongoose');
var userSchema = require('../schema/userSchema');

var userModel=mongoose.model('user',userSchema);




module.exports=userModel;
