
var mongoose = require('mongoose');
var schema=mongoose.Schema;

var userSchema = new schema({
    userid:{ type:String, required:true, unique:true },
    userpassword:{type:String, requred:true},
    usernickname:{type:String, requred:true, unique:true},

});
module.exports = mongoose.model('user', userSchema);
