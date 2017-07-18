var express = require("express");
var mongoose = require('mongoose');
var session = require('express-session')
var app = express();
var registCtrl = require("./controllers/registCtrl.js");
var loginCtrl = require("./controllers/loginCtrl.js");
var mainCtrl = require("./controllers/mainCtrl.js");
var settingCtrl = require("./controllers/settingCtrl.js");


//链接数据库
mongoose.connect('mongodb://localhost/shuoshuo',(err)=>{
	if(err) console.log("你没开数据库！请用mongod开机！");
});

app.set('trust proxy', 1) 
app.use(session({
	secret: 'keyboard cat',
	saveUninitialized: true,
	resave : false,
	cookie: { maxAge: 7 * 1000 * 60 * 60 * 24 }
}));

//静态化www
app.use(express.static("www"));
app.use("/uploads" , express.static("uploads"));

//设置模板引擎
app.set("view engine" , "ejs");

//中间件
app.get     ("/" 				   ,  mainCtrl.showIndex);
app.get     ("/regist"             ,  registCtrl.showRegist);
app.checkout("/regist"             ,  registCtrl.check);
app.post    ("/regist"             ,  registCtrl.doRegist);
app.get     ("/login"              ,  loginCtrl.showLogin);
app.post    ("/login"              ,  loginCtrl.doLogin);
app.get     ("/setting"            ,  settingCtrl.showSetting);
app.post    ("/setting"            ,  settingCtrl.doSetting);
app.get     ("/upload"             ,  settingCtrl.showUpload);
app.post    ("/upload"             ,  settingCtrl.upload);
app.post    ("/cut"           	   ,  settingCtrl.cut);
app.get     ("/upload_done"        ,  settingCtrl.upload_done);
app.post    ("/shuoshuopicupload"  ,  mainCtrl.shuoshuopicupload);
app.post    ("/fabu"  			   ,  mainCtrl.fabu);
app.get     ("/tiezi"  			   ,  mainCtrl.getTiezi);


//监听
app.listen(3000,(err)=>{
    console.log("3000端口");
});