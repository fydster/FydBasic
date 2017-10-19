var _ContentList = {
    id: 0,
    CID: 0,
    Default_Page_Size: 15,
    Page_Now: 1,
    isCheck: 0,
    selectCheck: -1,
    init: function () {
        _ContentList.isCheck = _Init.getParam("isCheck");
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateE').val(NowDate);
        $('#DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $('#DateE').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_save").click(_AddContent.addContent);
        $("#btn_cancel").click(_ContentList.hideUserInfo);
        $("#btn_select").click(function () { _ContentList.getList(1); });
        $("#btn_check").click(function () {
            if ($(this).hasClass("icon-check")) {
                _ContentList.selectCheck = -1;
                $(this).removeClass("icon-check");
            }
            else {
                _ContentList.selectCheck = 1;
                $(this).removeClass("icon-check").addClass("icon-check");
            }
            _ContentList.getList(1);
        });
        _ContentList.initClass();
        _ContentList.getList(1);
    },
    hideUserInfo: function () {
        $("#tab-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-List").removeClass("hidden").addClass("active");
        $("#tab-OrderList").removeClass("hidden").addClass("active");
        $("#panel_select").show();
    },
    initClass: function () {
        $("#cId_select").html("<option value=\"\">选择分类</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 0, cId: 0, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#cId_select").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				            }
				            $("#cId_select").change(function () {
				                _ContentList.CID = $(this).val();
				                $("#sId_select").html("<option value=\"\">选择下级分类</option>");
				                $("#select_sid_select").removeClass("hidden").addClass("hidden");
				                if (_ContentList.CID.length > 0) {
				                    _ContentList.getListFS();
				                    return;
				                }
				            });
				        }
				        else {
				        }
				    }
				}
		);
    },
    getListFS: function () {
        $("#select_sid_select").removeClass("hidden");
        $("#sId_select").html("<option value=\"\">选择下级分类</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 0, cId: _ContentList.CID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#sId_select").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				            }
				        }
				        else {
				        }
				    }
				}
		);
    },
    Del: function (id, title) {
        if (!confirm("确定要删除内容“" + title + "”吗!")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 14, id: id, title: escape(title), t: new Date() },
				    success: function (o) {
				        //alert(o.Msg);
				        if (o.Return == 0) {
				            _ContentList.getList(_ContentList.Page_Now);
				        }
				    }
				}
		);
    },
    Hot: function (id, isHot) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 21, id: id, isHot: isHot, t: new Date() },
				    success: function (o) {
				        //alert(o.Msg);
				        if (o.Return == 0) {
				            _ContentList.getList(_ContentList.Page_Now);
				        }
				    }
				}
		);
    },
    Check: function (id, isCheck, title) {
        var ct = "审核通过";
        if (isCheck == 0) {
            ct = "取消审核";
        }
        if (!confirm("确定要" + ct + "内容“" + title + "”吗!")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 15, id: id, isCheck: isCheck, title: escape(title), t: new Date() },
				    success: function (o) {
				        //alert(o.Msg);
				        if (o.Return == 0) {
				            _ContentList.getList(_ContentList.Page_Now);
				        }
				    }
				}
		);
    },
    updateC: function (id) {
        _AddContent.ID = id;
        _AddContent.getContent(id);
        $("#tab-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-List").removeClass("active");
        $("#tab-OrderList").removeClass("active");
        $("#panel_select").hide();
    },
    SumPage: function (page) {
        _ContentList.getList(page);
    },
    getList: function (page) {
        _ContentList.Page_Now = page;
        var htmlHead = "<tr><th width=\"100\">分类</th><th>类别</th><th>标题</th><th width=\"80\">是否置顶</th><th width=\"80\">审核状态</th><th width=\"140\">发布时间</th><th width=\"80\">发布人</th><th width=\"210\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{9}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        if (_ContentList.isCheck == 1) {
            htmlHead = "<tr><th width=\"100\">分类</th><th>类别</th><th>标题</th><th width=\"80\">是否置顶</th><th width=\"80\">审核状态</th><th width=\"140\">发布时间</th><th width=\"80\">发布人</th><th width=\"80\">审核人</th><th width=\"100\">操作</th></tr>";
            template = "<tr class=\"{c}\"><td>{1}</td><td>{9}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        }
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_ContentList.updateC({id});\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_ContentList.Del({id},'{title}');\">删除</button>";
        var cId = $("#cId_select").val();
        var sId = $("#sId_select").val();
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var key = $("#title_select").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 20, isCheck: _ContentList.selectCheck, page: page, cId: cId, sId: sId, DateS: DateS, DateE: DateE, key: escape(key), t: new Date() },
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
				                var buttonHot = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_ContentList.Hot(" + oi.id + ",1);\">置顶</button>";
				                if (oi.isHot == 1) {
				                    buttonHot = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_ContentList.Hot(" + oi.id + ",0);\">取消置顶</button>";
				                }

				                var buttonCheck = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_ContentList.Check(" + oi.id + ",1,'" + oi.title + "');\">通过审核</button>";
				                if (oi.isCheck == 1) {
				                    buttonCheck = "&nbsp;<button class=\"button button-small border-dot\" onclick=\"_ContentList.Check(" + oi.id + ",0,'" + oi.title + "');\">取消审核</button>";
				                }
				                tempHtml = template.replace("{1}", oi.c.name);
				                tempHtml = tempHtml.replace("{2}", oi.title + "<br/><span style=\"color:#5ea9dd;cursor:pointer;\"><a class=\"am-btn am-btn-link\" style=\"color:#5ea9dd;\" data-id=\"" + oi.id + "\">显示链接地址</a></span>");
				                tempHtml = tempHtml.replace("{3}", oi.isHot.toString().replace("0", "<span class=\"tag\">否</span>").replace("1", "<span class=\"tag bg-main\">是</span>"));
				                tempHtml = tempHtml.replace("{4}", oi.isCheck.toString().replace("0", "<span class=\"tag\">否</span>").replace("1", "<span class=\"tag bg-main\">是</span>"));
				                tempHtml = tempHtml.replace("{5}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{6}", oi.adminName);
				                tempHtml = tempHtml.replace("{9}", oi.cType.toString().replace("0", "普通").replace("2", "轮播图片"));
				                if (_ContentList.isCheck == 0) {
				                    tempHtml = tempHtml.replace("{7}", btnTemplate.replace(/{id}/g, oi.id).replace(/{title}/g, oi.title) + buttonHot);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{7}", oi.checkName);
				                    tempHtml = tempHtml.replace("{8}", buttonCheck);
				                }
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_ContentList", _ContentList.Default_Page_Size);
				            //_ContentList.ShowPage(page, o.Msg);
				            $("#ListPanel").find("a").click(function () {
				                var id = $(this).attr("data-id");
				                $(this).parent().text(_Init.BaseUrl + "/c_info.html?id=" + id);
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

_ContentList.init();