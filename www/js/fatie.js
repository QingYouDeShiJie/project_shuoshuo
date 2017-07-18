(function(){
		function Picupbox(){
            this.$dom = $("#picupbox");
            this.lis = [];  //数组中放JS类的PicupboxLi实例，

            this.imagelimit = 9;

            this.bindEvent();

            //实例化自己的儿子
            //随机产生一个ID
            var id = "pic" + parseInt(Math.random() * 999999) + Date.parse(new Date());
            new PicupboxLi(id,this);
        }
        //最终的结果，就是一个数组
        Picupbox.prototype.getPicurlarray = function(){
            var arr = [];
            for (var i = 0; i < this.lis.length; i++) {
                if(this.lis[i].picurl){
                    arr.push(this.lis[i].picurl);
                }
            }
            return arr;
        }
        //绑定监听
        Picupbox.prototype.bindEvent = function(){
            var self = this;
            //b的点击（就是+的点击）
            this.$dom.delegate("li b","click",function(){
                $(this).siblings("input").click();
            });

            //这个是猫腻文件上传file的改变事件，此时异步上传
            this.$dom.delegate("li input[type=file]","change",function(){
                var id = $(this).attr("id");
                //安装插件之后，就能合法使用ajaxFileUpload()函数
                $.ajaxFileUpload({  
                    type: "POST",  
                    url: "/shuoshuopicupload",  
                    data:{},                //要传到后台的参数，没有可以不写  
                    secureuri : false,      //是否启用安全提交，默认为false  
                    fileElementId: id,      //文件选择框的id属性 （这个框框虽然不可见了，但是这里依然重要）
                    dataType: 'json',       //服务器返回的格式  
                    async : true,           //是不是异步的  
                    success: function(data){  
                        //DOM的改变
                        $(".picupbox ul li").eq(-1).empty().addClass("done");
                        $(".picupbox ul li").eq(-1).append("<i class='shanchu'>×</i>");
                        $(".picupbox ul li").eq(-1).css({
                            "background" : "url(" + data.suoluetuurl + ") center center no-repeat"
                        });
                        //将地址记录即可
                        self.lis[self.lis.length - 1].picurl = data.suoluetuurl;

                        if(self.lis.length < self.imagelimit){
                             var id = "pic" + parseInt(Math.random() * 999999) + Date.parse(new Date());
                             new PicupboxLi(id,self);
                        }
                    },  
                    error: function (data, status, e){  
                        
                    }  
                });  
            });

            //删除
            this.$dom.delegate("i.shanchu","click",function(){
                var id = $(this).parents("li").attr("id");
                alert(id);
                //删DOM
                $("#" + id).remove();
                //删除数组这项
                for (var i = 0; i < self.lis.length; i++) {
                    if(self.lis[i].id === id){
                        self.lis.splice(i,1);
                    }
                }

                if(self.lis.length == self.imagelimit - 1){
                     var id = "pic" + parseInt(Math.random() * 999999) + Date.parse(new Date());
                     new PicupboxLi(id,self);
                }
            });

            var startnumber , endnumber;
            //可排序
            this.$dom.find("#sortable").sortable({
                "start" : function( event, ui){
                    startnumber = $(ui.item).index();
                },
                "stop" : function( event, ui){
                    endnumber = $(ui.item).index();
                    //删除一项
                    var shan = self.lis.splice(startnumber,1)[0];
                    //重新插入
                    self.lis.splice(endnumber,0,shan);
                }
            });
        }

        //Li就是小按钮
        function PicupboxLi(id , owner){
            this.id = id;
            this.$dom = $(
                [
                    '<li id="' + this.id + '" class="ui-state-default">',
                    '    <b class="glyphicon glyphicon-plus"></b>',
                    '    <input type="file" id="' + id + '" name="pic" class="dn"/>',
                    '</li>'
                ].join("")
            );

            //自己上树，自己加入父亲的数组
            owner.lis.push(this);
            owner.$dom.find("ul").append(this.$dom);
        }

        //实例化
        var picupbox = new Picupbox();
    
        //提交
        $("#tijiaobtn").click(function(){
            $.ajax({
                "type" : "post",
                "url" : "/fabu",
                "data" : {
                    "content" : $("textarea").val(),
                    "picarr" : picupbox.getPicurlarray()
                },
                "traditional" : true,
                "success" : function(data){
                	if(data.result == 1){
                		alert("发帖成功");
                		$("textarea").val("");
                		picupbox.$dom.find("ul").empty();
                		picupbox.$dom.lis = [];
                	}
                }
            });
        });
})();