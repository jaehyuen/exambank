var mongoose = require('mongoose');
var schema=mongoose.Schema;


var categorySchema = new schema({
    name:{type:String ,required:true},
    author:{type:String},
    open:{type:Boolean},
});
module.exports = mongoose.model('category', categorySchema);
