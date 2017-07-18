//引包
var mongoose = require('mongoose');
//创建一个schema
var userSchema = new mongoose.Schema({
	"email"  	: String,
 	"pwd"	 	: String,
 	"avatar" 	: {
 		type 	: String , 
 		default : "/images/default_avatar.png"
 	},
 	"nickname" 	: {
 		type 	: String , 
 		default : "没有昵称"
 	},
 	"introduction" : {
 		type 	: String , 
 		default : "这家伙很懒，什么都没有留下"
 	}
});

//创建一个模型
var User = mongoose.model("user" , userSchema);

//暴露
module.exports = User;