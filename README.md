# project_shuoshuo
# 运用强大的后台NodeJS，编写一个互动说说。
# 说说项目 —— 一个基于NodeJs实现的后台互动系统。
# 技术栈
①借助BootStrap可以轻松实现页面的快速搭建及响应式，所以，本项目采用bootstrap搭建页面
②借助Node.js + ExpressJS实现。数据库采用MongoDB + Mongoose的配合实现数据库的增删改查工作；
# 项目文件夹：

该项目的文件夹结构如下所示：

   ┠ controllers   控制器
   ┠ models   nodejs模型，里面放Mongoose数据库模型
   ┠ controllers    控制器
   ┠ node_modules 依赖
   ┠ uploads      上传
   ┠ views        ejs模板
   ┠ www	      静态资源
   ┠ app.js     nodejs的运行文件

# 项目特点

功能

   注册会员
   验证登录
   发表说说
   说说评论
   删除别人的评论
   删除自己的说说
   个人一句话签名、站内信、头像系统(支持头像剪裁,借助graphicsmagick)

路由是RESTful风格。

   所谓的RESTful路由风格,简单老说就是利用HTTP的四种请求：GET（获取资源）、POST（新建资源，也可以用于更新资源）、PUT（更新资源）、
DELETE（删除资源），来实现资源表现层的状态转换（Representational State Transfer） 。
以下是改项目的路由：

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

# 项目起步

   安装依赖
   npm install

   开数据库
   mongod --dbpath c:\shujuku

   运行
   node app.js	
   
欢迎关注
