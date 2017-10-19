var _Admin = {
    id: 0,
    roleId: 0,
    pId: 0,
    cId: 0,
    roleS: "",
    isUpdate: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            if (_Admin.isUpdate == 0) {
                _Admin.id = 0;
            }
            _Admin.AddAdmin();
        });
        $("#btn_showadd").unbind().bind("click", function () {
            $("#panel_select").removeClass("hidden").addClass("hidden");
            $("#panel_add").removeClass("hidden");
            $(".tab").hide();
        });
        $("#btn_select").click(function () {
            _Admin.getList($("#btn_CID").val());
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _Admin.pId = 0;
            $("#btn_CID_ej").html("");
            $("#btn_CID").find("span").removeClass("icon-check");
            $("#div_pp").hide();
            _Admin.cId = 0;
            _Admin.sId = 0;
            _Admin.id = 0;
            _Admin.isUpdate = 0;
            $("#uName").val("");
            $("#mobile").val("");
            $("#bNo").val("");
            $("#tel").val("");
            $("#job").val("");
            $("#imgUrl").val("");
            $("#btn_CID_S").val("0");
            $("#S_FID_S").removeClass("hidden").addClass("hidden");
            $("#btn_add").text("添加员工");
            $("#btn_cancel").text("取消添加");
            $("#panel_select").removeClass("hidden");
            $("#panel_add").removeClass("hidden").addClass("hidden");
            $(".tab").show();
        });
        _Admin.InitRole();
        _Admin.initChannel();
        setTimeout(_Admin.getList, 300);
    },
    InitRole: function () {
        $("#btn_CID_S").html("<option value=\"0\">选择角色</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 101, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var roleS = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                roleS += oi.ID + "|" + oi.RoleName + ",";
				                $("#btn_CID_S").append("<option value=\"" + oi.ID + "\">" + oi.RoleName + "</option>");
				            }
				            _Admin.roleS = roleS;
				        }
				        else {

				        }
				    }
				}
		);
    },
    initChannel: function () {
        $("#ChannelID").html("<option value=\"0\">选择通道</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 122, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#ChannelID").append("<option value=\"" + oi.ChannelID + "\">" + oi.ChannelName + "</option>");
				            }
				        }
				    }
				}
		);
    },
    getRoleName: function (id) {
        var rArr = _Admin.roleS.split(",");
        for (var i = 0; i < rArr.length; i++) {
            var rs = rArr[i];
            if (rs.length > 0) {
                if (rs.split("|")[0] == id) {
                    return rs.split("|")[1];
                }
            }
        }
    },
    showInfo: function (id,name,uName,mobile,memo,role) {
        $("#btn_CID_S").val(role);
        _Admin.id = id;
        _Admin.isUpdate = 1;
        $("#uName").val(uName);
        $("#mobile").val(mobile);
        $("#name").val(name);
        $("#memo").val(memo);
        $("#btn_add").text("确认修改");
        $("#panel_select").removeClass("hidden").addClass("hidden");
        $("#panel_add").removeClass("hidden");
        $(".tab").hide();
        $("#btn_cancel").text("取消修改");
    },
    AddAdmin: function () {
        var uName = $("#uName").val();
        var name = $("#name").val();
        var uPass = $("#uPass").val();
        var memo = $("#memo").val();
        var role = $("#btn_CID_S").val();
        var mobile = $("#mobile").val();
        if (uName.length == 0 || name.length == 0 || role.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        if (_Admin.id == 0 && uPass.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 102, name: escape(name), role: role, mobile: mobile, uName: escape(uName), memo: memo, uPass: uPass, id: _Admin.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Admin.id = 0;
				            _Admin.pId = 0;
				            _Admin.isUpdate = 0;
				            $("#btn_CID_ej").html("");
				            $("#btn_CID").find("span").removeClass("icon-check");
				            $("#div_pp").hide();
				            _Admin.cId = 0;
				            $("#uName").val("");
				            $("#name").val("");
				            $("#uPass").val("");
				            $("#mobile").val("");
				            $("#memo").val("");
				            $("#btn_add").text("添加账户");
				            $("#btn_cancel").text("取消添加");
				            $("#panel_select").removeClass("hidden");
				            $("#panel_add").removeClass("hidden").addClass("hidden");
				            $(".tab").show();
				            _Admin.getList();
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除账户“" + Name + "”吗!")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 104, id: id, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Admin.getList(_Admin.fId);
				        }
				    }
				}
		);
    },
    Enable: function (id, enable) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 104, id: id, enable: enable, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Admin.getList(_Admin.fId);
				        }
				    }
				}
		);
    },
    SetChannel: function () {
        var SignName = $("#SignName").val();
        var MaxNum = $("#MaxNum").val();
        var ChannelID = $("#ChannelID").val();
        var SignType = 0;
        if (document.getElementById("SignType").checked) {
            SignType = 1;
        }
        var AdminID = _Admin.id;
        if (SignName.length == 0) {
            layer.msg("请填写完整签名信息");
            return;
        }
        if (isNaN(MaxNum) || MaxNum.length==0) {
            layer.msg("余额只能是数字");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 123, AdminID: AdminID, SignType: SignType, ChannelID: ChannelID, MaxNum: MaxNum, SignName: escape(SignName), t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            layer.closeAll();
				            layer.alert(o.Msg);
				            _Admin.getList();
				        }
				        else {
				            layer.alert(o.Msg);
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"120\">公司名称</th><th width=\"90\">角色</th><th width=\"90\">登陆用户</th><th width=\"90\">添加日期</th><th width=\"60\">状态</th><th width=\"60\">余额</th><th width=\"150\">通道信息</th><th width=\"100\">设置</th><th width=\"140\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{2}</td><td>{1}</td><td>{3}</td><td>{6}</td><td>{7}</td><td>{5}</td><td>{10}</td><td>{9}</td><td>{8}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Admin.showInfo({id},'{name}','{uName}','{mobile}','{memo}',{role});\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Admin.Del({id},'{uName}');\">删除</button>";
        var key = $("#key").val();
        $("#ListPanel").html("载入中....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 103, key: escape(key),t: new Date() },
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
				                if (oi.Enable != 1) {
				                    var buttonHot = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_Admin.Enable(" + oi.ID + ",0);\">启用</button>";
				                    if (oi.Enable == 0) {
				                        buttonHot = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_Admin.Enable(" + oi.ID + ",2);\">停用</button>";
				                    }
				                    tempHtml = template.replace("{1}", _Admin.getRoleName(oi.RoleID));
				                    tempHtml = tempHtml.replace("{2}", oi.CorpName);
				                    tempHtml = tempHtml.replace("{3}", oi.LoginName);
				                    if (oi.channelSet != null) {
				                        var tdinfo = "签名："+oi.channelSet.SignName;
				                        if (oi.channel != null) {
				                            tdinfo = "通道：" + oi.channel.ChannelName + "<br/>用户：" + oi.channel.MchUName + "<br/>" + tdinfo;
				                        }
				                        tempHtml = tempHtml.replace("{10}", tdinfo);
				                        tempHtml = tempHtml.replace("{5}", oi.channelSet.MaxNum);
				                        tempHtml = tempHtml.replace("{9}", "<button class=\"button button-small bg-sub\" data-id=\"" + oi.ID + "\" data-channelid=\"" + oi.channelSet.ChannelID + "\" data-maxnum=\"" + oi.channelSet.MaxNum + "\" data-signtype=\"" + oi.channelSet.SignType + "\" data-signname=\"" + oi.channelSet.SignName + "\">设置</button>");
				                    }
				                    else{
				                        tempHtml = tempHtml.replace("{10}", "");
				                        tempHtml = tempHtml.replace("{5}", "");
				                        tempHtml = tempHtml.replace("{9}", "<button class=\"button button-small bg-sub\" data-id=\"" + oi.ID + "\" data-channelid=\"0\" data-maxnum=\"0\" data-signtype=\"0\" data-signname=\"\">设置</button>");
				                    }
				                    tempHtml = tempHtml.replace("{6}", new Date(oi.AddOn).pattern("yyyy-MM-dd"));
				                    tempHtml = tempHtml.replace("{7}", oi.Enable.toString().replace("0", "<span class=\"tag bg-main\">启用</span>").replace("2", "<span class=\"tag\">停用</span>"));
				                    tempHtml = tempHtml.replace("{8}", btnTemplate.replace(/{id}/g, oi.ID).replace(/{name}/g, oi.CorpName).replace(/{uName}/g, oi.LoginName).replace(/{mobile}/g, oi.Mobile).replace(/{memo}/g, oi.Memo).replace(/{role}/g, oi.RoleID) + buttonHot);
				                    tempHtml = tempHtml.replace("{c}", cName);
				                    $("#ListPanel").append(tempHtml);
				                }
				            }
				            //_Init.ShowPage(page, o.Msg, "_Admin", _Admin.Default_Page_Size);
				            //_Admin.ShowPage(page, o.Msg);
				            $("#ListPanel").find(".bg-sub").click(function () {
				                var ChannelID = $(this).attr("data-channelid");
				                var SignName = $(this).attr("data-signname");
				                var SignType = $(this).attr("data-signtype");
				                var MaxNum = $(this).attr("data-maxnum");
				                var id = $(this).attr("data-id");
				                _Admin.id = id;
				                $("#SignName").val(SignName);
				                $("#MaxNum").val(MaxNum);
				                $("#ChannelID").val(ChannelID);
				                document.getElementById("SignType").checked = false;
				                if (SignType == 1) {
				                    document.getElementById("SignType").checked = true;
				                }
				                layer.open({
				                    type: 1,
				                    shade: 0.6,
				                    title: "通道设置", //不显示标题
				                    area: ['500px', '300px'],
				                    content: $('#alert-channel'), //捕获的元素
				                    cancel: function (index) {
				                        layer.close(index);
				                    }
				                });

				                $("#btn_cancel_set").click(function () {
				                    layer.closeAll();
				                });

				                $("#btn_setChannel").click(_Admin.SetChannel);
				            });
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}

_Admin.init();