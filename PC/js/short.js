var _Short = {
    id: 0,
    init: function () {
        //显示粘贴号码层
        $("#btn_show").click(function () {
            layer.open({
                type: 1,
                shade: 0.6,
                title: "常用短语管理", //不显示标题
                area: ['600px', '300px'],
                content: $('#alert-info'), //捕获的元素
                cancel: function (index) {
                    layer.close(index);
                }
            });
        });
        $("#btn_info_cancel").click(function () {
            layer.closeAll();
        });

        $("#btn_addInfo").click(_Short.AddShort);

        _Short.getList();
    },
    UpdateShort: function (ID, Content, Title) {
        $("#Content").val(Content);
        $("#Title").val(Title);
        _Short.id = ID;
        layer.open({
            type: 1,
            shade: 0.6,
            title: "常用短语修改", //不显示标题
            area: ['600px', '300px'],
            content: $('#alert-info'), //捕获的元素
            cancel: function (index) {
                layer.close(index);
            }
        });
    },
    DelShort: function (ID, Content) {
        layer.confirm('确定要删除该常用短语吗', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            _Short.Del(ID, Content);
        }, function () {

        });
    },
    AddShort: function () {
        var Content = $("#Content").val();
        var Title = $("#Title").val();
        if (Content.length == 0) {
            layer.msg("短语内容不能为空");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 117, Title: escape(Title), Content: escape(Content), id: _Short.id, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#Content").val("");
				            $("#Title").val("");
				            layer.closeAll();
				            _Short.id = 0;
				            layer.msg(o.Msg, { icon: 1 });
				            _Short.getList();
				        }
				        else {
				            layer.msg(o.Msg, { icon: 2 });
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 119, id: id, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            layer.msg(o.Msg, { icon: 1 });
				            _Short.getList();
				        }
				        else {
				            layer.msg(o.Msg, { icon: 2 });
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"160\">标题</th><th>内容</th><th width=\"120\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{1}</td><td>{2}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Short.UpdateShort({ID},'{Content}','{Title}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Short.DelShort({ID},'{Content}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 118,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#ListPanel").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.Content);
				                tempHtml = tempHtml.replace("{3}", oi.Title);
				                tempHtml = tempHtml.replace("{2}", btnTemplate.replace(/{ID}/g, oi.ID).replace(/{Content}/g, oi.Content).replace(/{Title}/g, oi.Title));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Short", _Short.Default_Page_Size);
				            //_Short.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}

_Short.init();