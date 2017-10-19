var _Role = {
    id: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _Role.AddRole();
        });
        $("#btn_show").click(function () {
            $("form").removeClass("hidden");
            $(this).hide();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _Role.id = 0;
            $("#romeName").val("");
            var obj = $("#limitUL").find("input");
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    obj[i].checked = false;
                }
            }
            $("#btn_add").text("添加角色");
            $("#btn_cancel").text("取消添加");
            $("form").removeClass("hidden").addClass("hidden");
            $("#btn_show").show();
        });
        _Role.InitLimit();
        setTimeout(_Role.getList, 300);
    },
    InitLimit: function () {
        $("#limitUL").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 107, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var roleS = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (oi.PID == 0) {
				                    $("#limitUL").append("<div style=\"height:40px;font-weight:bold;padding-top:12px;\">" + oi.LimitName + "</div>");
				                    for (var j = 0; j < o.List.length; j++) {
				                        var oj = o.List[j];
				                        if (oj.PID == oi.ID) {
				                            $("#limitUL").append("<label style=\"border-bottom:1px dashed #ccc;margin-right:25px;height:35px;padding-top:5px;\"><input data-id=\"" + oj.ID + "\" id=\""+oj.ID+"\" value=\"" + oj.ID + "," + oj.PID + "\" type=\"checkbox\">" + oj.LimitName + "</label>");
				                        }
				                    }
				                }
				            }
				        }
				        else {

				        }
				    }
				}
		);
    },
    showInfo: function (id,roleName,limits) {
        $("#roleName").val(roleName);
        _Role.id = id;
        var obj = $("#limitUL").find("input");
        for (var i = 0; i < obj.length; i++) {
            if ((","+limits).indexOf("," + obj[i].id + ",") > -1)
            {
                obj[i].checked = true;
            }
        }
        $("form").removeClass("hidden");
        $("#btn_add").text("确认修改");
        $("#btn_cancel").text("取消修改");
        $("#btn_cancel").show();
        $("#btn_show").hide();
    },
    AddRole: function () {
        var roleName = $("#roleName").val();
        var limits = "";
        var obj = $("#limitUL").find("input");
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].checked)
            {
                limits += obj[i].value + ",";
            }
        }
        if (limits.length > 0) {
            var tempLimits = ",";
            var lArr = limits.split(",");
            for (var i = 0; i < lArr.length; i++) {
                if (lArr[i].length > 0) {
                    if (tempLimits.indexOf("," + lArr[i] + ",") == -1) {
                        tempLimits += lArr[i] + ",";
                    }
                }
            }
        }
        if (roleName.length == 0 || tempLimits.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 106, roleName: escape(roleName), id: _Role.id, limits: tempLimits, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Role.CommunityId = 0;
				            _Role.id = 0;
				            $("#roleName").val("");
				            for (var i = 0; i < obj.length; i++) {
				                if (obj[i].checked) {
				                    obj[i].checked = false;
				                }
				            }
				            $("form").addClass("hidden");
				            $("#btn_show").show();
				            $("#btn_add").text("添加角色");
				            $("#btn_cancel").hide();
				            _Role.getList();
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除角色“" + Name + "”吗!")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 105, id: id, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Role.getList(_Role.fId);
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"120\">角色名称</th><th width=\"50\">权限列表</th><th width=\"120\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Role.showInfo({id},'{roleName}','{limits}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Role.Del({id},'{roleName}');\">删除</button>";
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
				                tempHtml = template.replace("{1}", oi.RoleName);
				                tempHtml = tempHtml.replace("{2}", _Role.initInfo(oi.LimitInfo));
				                if (oi.Limits == "*") {
				                    tempHtml = tempHtml.replace("{3}", "--");
				                }
				                else {
				                    tempHtml = tempHtml.replace("{3}", btnTemplate.replace(/{id}/g, oi.ID).replace(/{roleName}/g, oi.RoleName).replace(/{limits}/g, oi.Limits));
				                }
				                
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Role", _Role.Default_Page_Size);
				            //_Role.ShowPage(page, o.Msg);
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

_Role.init();