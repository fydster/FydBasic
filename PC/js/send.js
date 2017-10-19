var _Key = null;
var _Send = {
    index: 0,
    index_loding: 0,
    classIDs: "",
    init: function () {
        //屏蔽回车
        $(document).keydown(function (event) {
            switch (event.keyCode) {
                case 13: return false;
            }
        });

        var RoleID = $.cookie("_RoleID");
        if (RoleID != null) {
            if (RoleID == 5 || RoleID == 1) {
                $("#btn_addContent").removeClass("hidden");
            }
        }

        //捕获手机号码输入框
        $("#mobile").keyup(function () {
            $("#div_mobile").removeClass("check-error");
            var mobile = $("#mobile").val();
            var mobiles = $("#mobiles").val();
            if (mobile.length == 11) {
                if (_Send.classIDs.length > 0) {
                    layer.alert("已添加通讯录号码，添加其他号码前请将号码清空！", { icon: 2 });
                    return;
                }
                if (_Send.IsValidMobile(mobile)) {
                    $("#mobiles").val(mobiles + mobile + ",");
                    $("#mobile").val("");
                    _Send.CountMobile();
                }
                else {
                    $("#div_mobile").removeClass("check-error").addClass("check-error");
                }
            }
        });

        //捕获内容输入框
        $("#content").keyup(function () {
            _Send.CountContent();
        });

        //清空手机号码框
        $(".button-group").find("button").eq(1).click(function () {
            layer.confirm('确定要清空已输入的信息吗', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                $("#mobiles").val("");
                $(".xm6").find(".button-little").hide();
                _Send.classIDs = "";
                layer.msg('清空完成', { icon: 1 });
            }, function () {
                
            });
        });

        //显示粘贴号码层
        $(".button-group").find("button").eq(0).click(function () {
            if (_Send.classIDs.length > 0) {
                layer.alert("已添加通讯录号码，添加其他号码前请将号码清空！", { icon: 2 });
                return;
            }
            _Send.index = layer.open({
                type: 1,
                shade: 0.6,
                title: "粘贴号码", //不显示标题
                area: ['600px', '380px'],
                content: $('#alert-mobile'), //捕获的元素
                cancel: function (index) {
                    layer.close(index);
                }
            });
        });

        //取消粘贴
        $("#btn_mobile_cancel").click(function () {
            if (_Send.index > 0) {
                _Send.CloseLayer(1);
            }
        });

        //取消通讯录添加
        $("#btn_addr_cancel").click(function () {
            if (_Send.index > 0) {
                _Send.CloseLayer(1);
            }
        });

        //确定粘贴后处理号码
        $("#btn_addMobile").click(function () {
            var mobiles = $("#ztMobiles").val();
            if (mobiles.length > 10) {
                var count = 0;
                var tempMobile = "";
                _Send.index_loding = layer.load(0, { shade: false });
                mobiles = mobiles.replace(/\r/g, ",");
                mobiles = mobiles.replace(/\n/g, ",");
                var arr = mobiles.split(",");
                var mobile = "";
                for (var i = 0; i < arr.length; i++) {
                    mobile = arr[i];
                    if (_Send.IsValidMobile(mobile)) {
                        if (tempMobile.length == 0 || (mobile + ",").indexOf(tempMobile) == -1) {
                            tempMobile += mobile + ",";
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    $("#ztMobiles").val("");
                    _Send.CloseLayer(0);
                    $("#mobiles").val($("#mobiles").val() + tempMobile);
                    _Send.CountMobile();
                    layer.msg("成功导入" + count + "个号码", { icon: 1 });
                }
                else {
                    _Send.CloseLayer(0);
                    layer.msg("成功导入" + count + "个号码", { icon: 1 });
                }
            }
            else {
                layer.msg("请先粘贴正确格式的手机号码", {icon:2});
            }
        });

        //插入姓名
        $("#btn_addName").click(function () {
            _Send.InsertParas(document.getElementById("content"), "[$姓名$]");
        });

        //插入备注
        $("#btn_addMemo").click(function () {
            _Send.InsertParas(document.getElementById("content"), "[$备注$]");
        });

        //显示常用短信模板文件
        $("#btn_addContent").click(function () {
            _Send.getShortList();
        });

        //选择通讯录
        $(".button-group").find("button").eq(2).click(function () {
            _Send.getAddrList();
        });

        $("#btn_SendSms").click(function () {
            _Send.checkSubmit();
        });

        $("#btn_addGroup").click(function () {
            var arr = new Array();
            var i = 0;
            $("#alert-contact").find("ul").find("li").find(".icon-check-square").each(function () {
                var id = $(this).attr("data-id");
                arr[i] = id;
                i++;
            });
            if (i > 0) {
                var ClassIDS = arr.join(",");
                _Send.classIDs = ClassIDS;
                _Send.getGroupMx(ClassIDS);
            }
        });


        _Send.getKeyList();
    },
    getKeyList: function () {
        $.ajax(
				{
				    url: _Init.ServiceUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 103, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            _Key = o.List;
				        }
				    }
				}
		);
    },
    getImportTxtList: function (fileName) {
        var lIndex = layer.load(0, { shade: false });
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 121,fileName:fileName, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            layer.close(lIndex);
				            var mobiles = o.Msg;
				            if (mobiles.length > 10) {
				                var count = 0;
				                var tempMobile = "";
				                mobiles = mobiles.replace(/@/g, ",");
				                mobiles = mobiles.replace(/\r/g, ",");
				                mobiles = mobiles.replace(/\n/g, ",");
				                var arr = mobiles.split(",");
				                var mobile = "";
				                for (var i = 0; i < arr.length; i++) {
				                    mobile = arr[i];
				                    if (_Send.IsValidMobile(mobile)) {
				                        if (tempMobile.length == 0 || (mobile + ",").indexOf(tempMobile) == -1) {
				                            tempMobile += mobile + ",";
				                            count++;
				                        }
				                    }
				                }
				                if (count > 0) {
				                    _Send.CloseLayer(0);
				                    $("#mobiles").val($("#mobiles").val() + tempMobile);
				                    _Send.CountMobile();
				                    layer.msg("成功导入" + count + "个号码", { icon: 1 });
				                }
				                else {
				                    _Send.CloseLayer(0);
				                    layer.msg("成功导入" + count + "个号码", { icon: 1 });
				                }
				            }
				            else {
				                layer.msg("请先粘贴正确格式的手机号码", { icon: 2 });
				            }
				        }
				    }
				}
		);
    },
    getShortList: function () {
        var template = $("#template").html();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 118, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $(".CList").html("");
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace(/{Content}/g, oi.Content);
				                tempHtml = tempHtml.replace("{Title}", oi.Title);
				                $(".CList").append(tempHtml);
				            }

				            //选择常用模板
				            $("#alert-template").find("a").click(function () {
				                var content = $(this).attr("data-content");
				                $("#content").val(content);
				                _Send.CountContent();
				                _Send.CloseLayer(1);
				            });

				            _Send.index = layer.open({
				                type: 1,
				                shade: 0.6,
				                title: "内容选择", //不显示标题
				                area: ['500px', '350px'],
				                content: $('#alert-template'), //捕获的元素
				                cancel: function (index) {
				                    layer.close(index);
				                }
				            });
				        }
				        else {
				            layer.msg("无记录，赶快到常用短语中添加吧", { icon: 1 });
				        }
				    }
				}
		);
    },
    getGroupMx: function (ClassIDS) {
        layer.load(0, { shade: true });
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 116, ClassID: ClassIDS, t: new Date() },
				    success: function (o) {
				        layer.closeAll();
				        if (o.Return == 0) {
				            var arr = new Array();
				            arr = o.List;
				            var mobiles = arr.join(",") + ",";
				            $("#mobiles").val(mobiles);
				            _Send.CountMobile();
				            layer.alert("本次共计添加号码" + o.Msg + "个", { icon: 1 });
				            //$(".xm6").find(".button-little").show();
				            try{
				                var RoleID = $.cookie("_RoleID");
				                if (RoleID != null) {
				                    if (RoleID == 3 || RoleID == 1) {
				                        $(".xm6").find(".button-little").show();
				                    }
				                }
				            }
				            catch(e){

				            }
				        }
				        else {
				            layer.alert("您选择的通讯录暂无记录", { icon: 2 });
				        }
				    }
				}
		);
    },
    getAddrList: function () {
        var template = "<li data-id=\"{id}\" data-name=\"{className}\"><span class=\"float-right badge bg-main\">{cNum}</span> <i data-id=\"{id}\" class=\"icon-square-o\"></i> {className}</li>";
        var template_ON = "<li data-id=\"{id}\" data-name=\"{className}\"><span class=\"float-right badge bg-main\">{cNum}</span> <i data-id=\"{id}\" class=\"icon-check-square\"></i> {className}</li>";
        $("#alert-contact").find("ul").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 112, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (_Send.classIDs.length > 0) {
				                    if (("," + _Send.classIDs + ",").indexOf("," + oi.ID + ",") > -1) {
				                        tempHtml = template_ON.replace("{cNum}", oi.AddrNum);
				                    }
				                    else {
				                        tempHtml = template.replace("{cNum}", oi.AddrNum);
				                    }
				                }
				                else {
				                    tempHtml = template.replace("{cNum}", oi.AddrNum);
				                }
				                tempHtml = tempHtml.replace(/{className}/g, oi.ClassName);
				                tempHtml = tempHtml.replace(/{id}/g, oi.ID);
				                $("#alert-contact").find("ul").append(tempHtml);
				            }
				            $("#alert-contact").find("ul").find("li").click(function () {
				                //$("#alert-contact").find("i").removeClass("icon-check-square").addClass("icon-square-o");
				                if ($(this).find("i").hasClass("icon-square-o")) {
				                    $(this).find("i").removeClass("icon-square-o").addClass("icon-check-square");
				                }
				                else {
				                    $(this).find("i").removeClass("icon-check-square").addClass("icon-square-o");
				                }
				                var id = $(this).attr("data-id");
				                var name = $(this).attr("data-name");
				            });

				            _Send.index = layer.open({
				                type: 1,
				                shade: 0.6,
				                title: "通讯录选择", //不显示标题
				                area: ['500px', '360px'],
				                content: $('#alert-contact'), //捕获的元素
				                cancel: function (index) {
				                    layer.close(index);
				                }
				            });
				        }
				        else {
				            layer.alert("暂无通讯录，请通讯录管理新建通讯录", { icon: 2 });
				        }
				    }
				}
		);
    },
    //给文本框插入变量
    InsertParas: function (obj,str) {
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
    },
    //关闭层
    CloseLayer: function (n) {
        if (n == 1 && _Send.index > 0) {
            layer.close(_Send.index);
        }
        if (n == 2 && _Send.index_loding > 0) {
            layer.close(_Send.index_loding);
        }
        if (n == 0) {
            layer.closeAll();
        }
    },
    //计算号码数量
    CountMobile: function () {
        var mobiles = $("#mobiles").val();
        if (mobiles.length > 0) {
            //去除重复
            var arr = mobiles.split(",");
            if (arr.length < 1000) {
                $.unique(arr);
            }
            $("#mobiles").val(arr.join(","));
            var num = arr.length - 1;
            $("#span_mobileNum").text(num);
        }
    },
    //计算内容字数
    CountContent: function () {
        var content = $("#content").val();
        //content = content.replace("强奸", "强_奸");
        //content = content.replace("杀人", "杀_人");
        //content = content.replace("法院", "法_院");
        if (content.length > 350) {
            content = content.substring(0, 350);
            $("#content").val(content);
        }
        if (content.length > 0) {
            content = content.replace("[$姓名$]", "");
            content = content.replace("[$备注$]", "");
            $("#span_contentNum").text(content.length);
        }
    },
    //判断手机号码是否合法
    IsValidMobile: function (mobile) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            return false;
        }
        else {
            return true;
        }
    },
    checkSubmit: function () {
        var content = $("#content").val();
        var mobileNum = $("#span_mobileNum").text();
        if (mobileNum == 0) {
            layer.msg("请添加手机号码", { icon: 2 });
            return;
        }
        if (content.length == 0) {
            layer.msg("请输入短信内容", { icon: 2 });
            return;
        }
        if (_Key != null) {
            if (_Key.length > 0) {
                for (var i = 0; i < _Key.length; i++) {
                    if (content.indexOf(_Key[i]) > -1) {
                        layer.alert("发送内容中含有限制关键字“"+_Key[i]+"”，请修改后重新提交", { icon: 2 });
                        return;
                    }
                }
            }
        }
        layer.confirm('<strong>确定要发送短信！</strong><br/><br/><strong>号码</strong>：' + mobileNum + '个<br><strong>内容</strong>：' + content, {
            btn: ['确定发送', '取消'] //按钮
        }, function () {
            _Send.SendSms();
        }, function () {

        });
    },
    SendSms: function () {
        var mobiles = $("#mobiles").val();
        var content = $("#content").val();
        var classIDs = _Send.classIDs;
        _Send.CloseLayer(0);
        layer.msg('正在发送中....');
        $.ajax(
				{
				    url: _Init.ServiceUrl,
				    context: document.body,
				    type: "POST",
				    dataType: "json",
				    cache: false,
				    data: { fn: 100, classIDs: classIDs, content: escape(content), mobiles: mobiles, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            layer.msg("发送完成", { icon: 1 });
				            $(".xm6").find(".button-little").hide();
				            _Send.classIDs = "";
				            $("#mobiles").val("");
				            $("#content").val("");
				            $("#span_mobileNum").text("0");
				            $("#span_contentNum").text("0");
				        }
				        else {
				            layer.msg(o.Msg, { icon: 2 });
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"120\">角色名称</th><th width=\"50\">权限列表</th><th width=\"120\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Send.showInfo({id},'{roleName}','{limits}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Send.Del({id},'{roleName}');\">删除</button>";
        $("#ListPanel").html("载入中....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 101,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#ListPanel").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var pName = "";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.roleName);
				                tempHtml = tempHtml.replace("{2}", _Send.initInfo(oi.limitInfo));
				                if (oi.limits == "*") {
				                    tempHtml = tempHtml.replace("{3}", "--");
				                }
				                else {
				                    tempHtml = tempHtml.replace("{3}", btnTemplate.replace(/{id}/g, oi.id).replace(/{roleName}/g, oi.roleName).replace(/{limits}/g, oi.limits));
				                }
				                
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Send", _Send.Default_Page_Size);
				            //_Send.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    },
    initInfo: function (limitInfo) {
        var arr = limitInfo.split(",");
        var info = "";
        var temp = "";
        if (limitInfo == "全部") {
            return limitInfo;
        }
        for (var i = 0; i < arr.length; i++) {
            var tName = "";
            var lName = "";
            if (arr[i].length > 0 && arr[i].indexOf("-") > -1) {
                tName = arr[i].split("-")[0];
                lName = arr[i].split("-")[1];
                if (temp.length == 0) {
                    info += "<strong>" + tName + "</strong>-" + lName;
                    temp = tName;
                }
                else {
                    if (temp == tName) {
                        info += "," + lName;
                    }
                    else {
                        info += "<br/>";
                        info += "<strong>" + tName + "</strong>-" + lName;
                        temp = tName;
                    }
                }
            }
        }
        return info;
    }
}

_Send.init();