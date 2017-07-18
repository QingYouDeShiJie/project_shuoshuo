var formidable = require("formidable");
var User = require("../models/User.js");
var crypto = require("crypto");

exports.showLogin = (req,res) =>{
	res.render("login",{
		"programa" : "login",
		"login" : req.session.login,
		"email" : req.session.email,
		"nickname" : req.session.nickname,
		"avatar" : req.session.avatar,
		"introduction" : req.session.introduction
	});
}

exports.doLogin = (req,res) =>{

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var email = fields.email;
		var pwd = fields.pwd;

		User.find({"email":email},(err,docs)=>{
			if(docs.length == 0){
				res.send({"result" : -1});
				return;
			}
			//加密密码
			pwd = crypto.createHash('sha256').update("我爱" + pwd + "考拉").digest("hex");
 
			if(docs[0].pwd == pwd){
				//下发session
				req.session.login = true;
				req.session.email = email;
				req.session.nickname = docs[0].nickname;
				req.session.introduction = docs[0].introduction;
				req.session.avatar = docs[0].avatar;

				res.send({"result" : 1});
			}else{
				res.send({"result" : -2});
			}
		});
	});
}