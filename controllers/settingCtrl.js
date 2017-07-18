var formidable = require('formidable'); 
var path = require("path");
var gm = require("gm");
var User = require("../models/User.js");

//显示设置页面
exports.showSetting = (req,res) =>{
	//本页面要求登录！
	if(!req.session.login){
		res.send("非法闯入！请<a href='/login'>登录</a>！");
		return;
	}
	//检索数据库
	var email = req.session.email;
	User.find({"email":email},(err,docs)=>{
		res.render("setting",{
			"programa" : "setting",
			"login" : req.session.login,
			"email" : req.session.email,
			"nickname" : req.session.nickname,
			"avatar" : req.session.avatar,
			"introduction" : req.session.introduction
		});
	});
}

//显示上传页面
exports.showUpload = (req,res) =>{
	res.render("upload");
}

//执行上传
exports.upload = (req,res) =>{

	var form = new formidable.IncomingForm();
	form.uploadDir = "./uploads";
	form.keepExtensions = true;
	form.parse(req, function(err, fields, files) {
		//验证拓展名
		var extname = path.extname(files.touxiang.name)
		 
		if(extname != ".jpg" && extname != ".jpeg" && extname != ".png" && extname != ".gif" && extname != ".bmp"){
			res.send("请上传图片文件！<a href='/upload'>返回重新上传</a>");
			return;
		}
		//得到图片的原本尺寸
		gm(files.touxiang.path).size({bufferStream: true}, (err, size)=>{
			 
			var default_w = size.width;
			var default_h = size.height;
			//查看合法性
			if(default_w > 1600 || default_h > 1600 || default_w < 100 || default_h < 100){
				res.send("图片宽度高度必须均大于100且小于1600 <a href='/upload'>返回重新上传</a>");
				return;
			}

			req.session.picpath = files.touxiang.path;
			//呈递切图的视图
			res.render("upload_cut",{
				tupiandizhi : files.touxiang.path,
				default_w : default_w,
				default_h : default_h
			});
		});
	});
}

//裁切接口
exports.cut = (req,res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files)=>{
		//绝对路径
		var picpath = path.resolve("./" , req.session.picpath);
		//纯文件名
		var basename = path.basename(picpath);
		//要写入的新路径
		var avatarpath = "./www/images/avatars/" + basename;
		//用gm来切图
		gm(picpath)
			.crop(fields.w , fields.w , fields.x , fields.y)
			.resize(100 , 100 , "!")
			.noProfile()
			.write(avatarpath , function (err) {
				if (err){
					res.json({"result" : -1});
				}else{
					//切图成功之后要存储数据库
					var email = req.session.email;
					User.find({"email" : email} , (err,docs)=>{
						var u = docs[0];
						u.avatar = "images/avatars/" + basename;
						u.save((err)=>{
							if(!err){
								req.session.avatar = u.avatar;
								res.json({"result" : 1});
							}
						});
						
					});
				}
			});
	});
}


//裁切完毕之后显得的页面
exports.upload_done = (req,res) => {
	var email = req.session.email;
	//检索数据库
	User.find({"email" : email} , (err,docs)=>{
		res.render("upload_done",{
			cuttedpicurl : docs[0].avatar
		});
	});
};

//保存
exports.doSetting = (req,res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files)=>{
		var nickname = fields.nickname;
		var introduction = fields.introduction;
		var email = req.session.email;
		//验证正则
		if(/[\~\`\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\\\|\?\/\>\<\,\.\!]/.test(nickname)){
			res.json({"result" : -2});
			return;
		}
		//长度验证
		if(nickname.length > 15){
			res.json({"result" : -3});
			return;
		}
		//验证正则
		if(/[\~\`\@\#\$\%\^\&\*\(\)\_\-\+\=\[\]\{\}\\\|\?\/\>\<\,\.\!]/.test(introduction)){
			res.json({"result" : -4});
			return;
		}
		//长度验证
		if(introduction.length > 15){
			res.json({"result" : -5});
			return;
		}
		//检索数据库
		User.find({"email" : email} , (err,docs)=>{
			var u = docs[0];
			u.nickname = nickname;
			u.introduction = introduction;
			u.save((err)=>{
				if(err){
					res.json({"result" : -1});
				}else{
					//改变session
					req.session.nickname = nickname;
					req.session.introduction = introduction;
					res.json({"result" : 1});
				}
			});
		});
	});
}