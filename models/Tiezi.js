//引包
var mongoose = require('mongoose');
//创建一个schema
var tieziSchema = new mongoose.Schema({
	"email"  	: 	String,
 	"content" 	: 	String,
 	"picarr"	: 	[String],
 	"date"		:   Date
});

//创建一个模型
var Tiezi = mongoose.model("tiezi" , tieziSchema);

//暴露
module.exports = Tiezi;