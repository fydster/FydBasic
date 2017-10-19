var _Class = {
    id: 0,
    addrId: 0,
    index: 0,
    Page_Now: 1,
    init: function () {
        $("#btn_addGroup").click(function () {
            layer.prompt(
                { title: '添加分组' },
                function (val, index) {
                    if (val.length == 0) {
                        layer.msg('分组名称不能为空', { icon: 1 });
                    }
                    else {
                        _Class.id = 0;
                        _Class.index = index;
                        _Class.AddClass(val);
                    }
                });
        });

        $("#btn_addUser").click(function () {
            $("#alert-talk").find(".bg-main").text("确定添加");
            layer.open({
                type: 1,
                shade: 0.6,
                title: "信息添加", //不显示标题
                area: ['500px', '350px'],
                content: $('#alert-talk'), //捕获的元素
                cancel: function (index) {
                    layer.close(index);
                }
            });
        });

        $("#btn_addAddress").click(function () {
            _Class.AddAddress();
        });

        $("#btn_ToImport").click(function () {
            _Class.ImportAddress();
        });

        $("#btn_ImportHis").click(function () {
            _Class.ImportHis();
        });

        _Class.getList();
        _Class.getAddrList(1);
        //_Class.initClass();
        //setTimeout(_Class.getList, 300);
    },
    ImportHis: function () {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 120, t: new Date() },
				    success: function (o) {

				    }
				}
		);
    },
    AddClass: function (className) {
        if (className.length == 0) {
            layer.msg("分组名称不能为空");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 110, id: _Class.id, className: escape(className), t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            _Class.id = 0;
				            layer.closeAll();
				            layer.msg(o.Msg, { icon: 1 });
				            _Class.getList();
				        }
				        else {
				            layer.msg(o.Msg, { icon: 2 });
				        }
				    }
				}
		);
    },
    AddAddress: function () {
        var Contact = $("#Contact").val();
        var Mobile = $("#Mobile").val();
        var Memo = $("#Memo").val();
        var ClassID = _Class.id;
        if (Contact.length == 0 || Mobile.length == 0) {
            layer.msg("姓名和手机号码必须填写");
            return;
        }
        if (!_Init.IsValidMobile(Mobile)) {
            layer.msg("手机号码有误");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 113, ClassID:ClassID,Mobile: Mobile, Contact: escape(Contact), Memo: escape(Memo), id: _Class.addrId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#Contact").val("");
				            $("#Mobile").val("");
				            $("#Memo").val("");
				            _Class.addrId = 0;
				            layer.closeAll();
				            layer.msg(o.Msg, { icon: 1 });
				            _Class.getAddrList(_Class.Page_Now);
				        }
				        else {
				            layer.msg(o.Msg, { icon: 2 });
				        }
				    }
				}
		);
    },
    Del: function (Name) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 111, id: _Class.id, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        layer.msg(o.Msg);
				        if (o.Return == 0) {
				            $("#div_GroupOper").hide();
				            $("#div_Import").hide();
				            _Class.id = 0;
				            _Class.getList();
				        }
				    }
				}
		);
    },
    ImportAddress: function () {
        var importFile = $("#importFile").val();
        var ClassID = _Class.id;
        if (importFile.length == 0) {
            layer.msg("请先上传模板文件");
            return;
        }
        layer.load(0, { shade: false });
        $.ajax(
				{
				    url: _Init.ImportUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { ClassID: ClassID, importFile: importFile, t: new Date() },
				    success: function (o) {
				        layer.closeAll();
				        if (o.Return == 0) {
				            $("#importFile").val("");
				            layer.alert(o.Msg, { icon: 1 });
				            _Class.getAddrList(_Class.Page_Now);
				        }
				        else {
				            layer.alert(o.Msg, { icon: 2 });
				        }
				    }
				}
		);
    },
    getList: function () {
        var template = "<li data-id=\"{id}\" data-name=\"{className}\"><span class=\"float-right badge bg-main\">{cNum}</span> {className}</li>";
        $("#ul_AddrGroup").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 112,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{cNum}", oi.AddrNum);
				                tempHtml = tempHtml.replace(/{className}/g, oi.ClassName);
				                tempHtml = tempHtml.replace(/{id}/g, oi.ID);
				                $("#ul_AddrGroup").append(tempHtml);
				            }
				            $("#ul_AddrGroup").find("li").click(function () {
				                $("#ul_AddrGroup").find("li").removeClass("active");
				                $(this).addClass("active");
				                var id = $(this).attr("data-id");
				                var name = $(this).attr("data-name");
				                $("#GroupName").val(name);
				                _Class.id = id;
				                $("#div_GroupOper").show();
				                $("#div_Import").show();
				                _Class.getAddrList(_Class.Page_Now);
				            });

				            $("#btn_UpdateGroup").click(function () {
				                var name = $("#GroupName").val();
				                if (name.length == 0) {
				                    layer.msg("分组名称不能为空");
				                }
				                else {
				                    _Class.AddClass(name);
				                }
				            });

				            $("#btn_DeleteGroup").click(function () {
				                layer.confirm('确定要删除该分组吗，删除后该分组下的用户同时删除！', {
				                    btn: ['确定', '取消'] //按钮
				                }, function () {
				                    var name = $("#GroupName").val();
				                    _Class.Del(name);
				                }, function () {

				                });
				            });
				        }
				        else {
				            $("#ul_AddrGroup").html("无记录");
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _Class.getAddrList(page);
    },
    getAddrList: function (page) {
        $("#PagePanel").hide();
        var htmlHead = "<tr><th>分组</th><th>姓名</th><th>手机号码</th><th>添加日期</th><th>备注</th><th>操作</th></tr>";
        var template = "<tr><td width=\"150\">{ClassName}</td><td width=\"110\">{Contact}</td><td width=\"110\">{Mobile}</td><td width=\"110\">{AddOn}</td><td>{Memo}</td><td width=\"140\"><button data-contact=\"{Contact}\" data-mobile=\"{Mobile}\" data-memo=\"{Memo}\" data-id=\"{id}\" data-classid=\"{ClassID}\" class=\"button button-small border-sub\"> 修改</button>&nbsp;&nbsp;<button class=\"button button-small border-red\" data-name=\"{Contact}\"  data-id=\"{id}\"> 删除</button></td></tr>";
        $("tbody").html("");
        _Class.Page_Now = page;
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 114,ClassID:_Class.id,page:page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("tbody").append(htmlHead);
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace(/{Mobile}/g, oi.Mobile);
				                tempHtml = tempHtml.replace(/{Memo}/g, oi.Memo);
				                tempHtml = tempHtml.replace(/{ClassID}/g, oi.ClassID);
				                tempHtml = tempHtml.replace(/{ClassName}/g, oi.ClassName);
				                tempHtml = tempHtml.replace(/{Contact}/g, oi.Contact);
				                tempHtml = tempHtml.replace(/{AddOn}/g, new Date(oi.AddOn).pattern("yyyy-MM-dd"));
				                tempHtml = tempHtml.replace(/{id}/g, oi.ID);
				                $("tbody").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg);

				            setTimeout(function () {
				                $("#Page_Info").find("button").click(function () {
				                    var page = $(this).attr("data-page");
				                    page = page.replace(" ", "");
				                    _Class.SumPage(page);
				                });
				            }, 300);

				            $("tbody").find(".border-red").click(function () {
				                var id = $(this).attr("data-id");
				                _Class.addrId = id;
				                var name = $(this).attr("data-name");
				                layer.confirm('确定要删除该用户吗！', {
				                    btn: ['确定', '取消'] //按钮
				                }, function () {
				                    _Class.DelAddr(name);
				                }, function () {

				                });
				            });

				            $("tbody").find(".border-sub").click(function () {
				                var id = $(this).attr("data-id");
				                _Class.addrId = id;
				                var contact = $(this).attr("data-contact");
				                var mobile = $(this).attr("data-mobile");
				                var memo = $(this).attr("data-memo");
				                var classId = $(this).attr("data-classid");
				                $("#Contact").val(contact);
				                $("#Mobile").val(mobile);
				                $("#Memo").val(memo);
				                _Class.id = classId;

				                $("#alert-talk").find(".bg-main").text("确定修改");
				                layer.open({
				                    type: 1,
				                    shade: 0.6,
				                    title: "信息修改", //不显示标题
				                    area: ['500px', '350px'],
				                    content: $('#alert-talk'), //捕获的元素
				                    cancel: function (index) {
				                        layer.close(index);
				                    }
				                });
				            });
				        }
				        else {
				            $("tbody").html("无记录");
				        }
				    }
				}
		);
    },
    DelAddr: function (Name) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 115, id: _Class.addrId, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        layer.msg(o.Msg);
				        if (o.Return == 0) {
				            _Class.addrId = 0;
				            _Class.getAddrList(_Class.Page_Now);
				        }
				    }
				}
		);
    },
}

_Class.init();