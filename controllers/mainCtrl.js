var formidable = require('formidable'); 
var gm = require("gm");
var path = require("path");
var url = require("url");
var Tiezi = require("../models/Tiezi.js");
var User = require("../models/User.js");
var _ = require("underscore");

//显示首页
exports.showIndex = (req,res) =>{
	res.render("index",{
		"programa" : "index",
		"login" : req.session.login,
		"email" : req.session.email,
		"nickname" : req.session.nickname,
		"avatar" : req.session.avatar,
		"introduction" : req.session.introduction
	});
}

//图片上传
exports.shuoshuopicupload = (req,res) => {

	var form = new formidable.IncomingForm();
	//设置上传的文件地址
	form.uploadDir = "./uploads";

	form.keepExtensions = true;

	form.parse(req, function(err, fields, files) {
		//图片地址
		var picurl = files.pic.path;

		var basename = path.basename(picurl);
		gm(picurl).resize(80 , 80 , "^>").noProfile().write("./www/images/suoluetu/" + basename , function (err) {
			res.send({
				"result" : 1 , 
				"suoluetuurl" : "/images/suoluetu/"+ basename 
			});
		});
	});
}

//发帖
exports.fabu = (req,res) => {

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var content = fields.content;
		var picarr = fields.picarr;

		var tz = new Tiezi({
			email : req.session.email,
			content : content,
			picarr : picarr,
			date : new Date()
		});

		tz.save((err)=>{
			if(err){
				res.json({"result" : -1});
			}else{
				res.json({"result" : 1});
			}
		});
	});
};


exports.getTiezi = (req,res) => {
	var page = url.parse(req.url , true).query.page;
	var pagesize = url.parse(req.url , true).query.pagesize;

	var count = 0;
	var results = [];
	Tiezi.find({}).sort({"date" : -1}).skip((page - 1) * pagesize).limit(pagesize).exec((err,docs) => {
		if(docs.length == 0){
			res.json({"results" : []});
			return;
		}
		//下面寻找发帖人的信息
		docs.forEach((doc,index)=>{
			User.find({"email" : doc.email} , (err , us)=>{
				var u = us[0];
				//来一个新对象
				var o = {
					"_id" : doc["_id"],
					"email" : doc["email"],
					"content" : doc["content"],
					"date" : doc["date"],
					"picarr" : doc["picarr"],
					"nickname" : u["nickname"],
					"introduction" : u["introduction"],
					"avatar" : u["avatar"]
				};
				//原数组中第几名，新数组中还是第几名
				results[index] = o;
				 
				//计数器
				count++;
				if(count == docs.length){
					res.json({"results" : results});
				}
			});
		});
	});
};