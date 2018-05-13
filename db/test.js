var mongoose = require("mongoose");
var schema = mongoose.Schema;

var testSchema = new schema({
  title: { type: String, required: true },
  testtype: { type: Boolean },
  example: [{ type: String }],
  category: { type: String, required: true },
  answer: { type: String, required: true },
  recommend: [{ type: mongoose.Schema.Types.ObjectId }],
  author: { type: String, required: true }
});
module.exports = mongoose.model("test", testSchema);
