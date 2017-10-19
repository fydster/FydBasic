var _AddContent = {
    ID: 0,
    CID: 0,
    SID: 0,
    CType: 0,
    isHref: 0,
    init: function () {
        _AddContent.ID = _Init.getParam("id");

        if (_AddContent.ID > 0) {
            _AddContent.getContent(_AddContent.ID);
        }
        else {
            _AddContent.getList(0);
        }
        _AddContent.initEvent();
        $("#btn_save").click(_AddContent.addContent);
    },
    initEvent: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#cDate').val(NowDate);
        $('#cDate').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_cType").find("button").click(function () {
            $("#btn_cType").find("button").removeClass("icon-check");
            $(this).addClass("icon-check");
            var cType = $(this).attr("data-type");
            _AddContent.CType = cType;
        });
        $("#isHref").click(function () {
            var isHref = 0;
            if (document.getElementById("isHref").checked) {
                isHref = 1;
            }
            if (isHref == 1) {
                $("#cType3").show();
            }
            else {
                $("#cType3").hide();
            }
            _AddContent.isHref = isHref;
        });
        $("#btn_urlDefault").click(function () {
            if (_AddContent.CID > 0) {
                var cName = $("#cId").find("option:selected").text();
                if (cName == "竞价公告") {
                    $("#hrefUrl").val("c_list_1.html?cId=" + _AddContent.CID + "&cName=" + escape(cName));
                }
                else {
                    $("#hrefUrl").val("c_list.html?cId=" + _AddContent.CID + "&cName=" + escape(cName));
                }
                $(this).addClass("icon-check");
            }
        });
    },
    changeWp: function (n) {
        if (n == 0) {
            $("#div_wp").show();
            $("#label_title").html("旺铺名称&nbsp;");
            $("#label_source").html("主营项目&nbsp;");
        }
        else {
            $("#div_wp").hide();
            $("#label_title").html("标题&nbsp;");
            $("#label_source").html("来源&nbsp;");
        }
    },
    getList: function () {
        $("#cId").html("<option value=\"\">选择分类</option>");
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
				                if (_AddContent.CID == oi.id) {
				                    $("#cId").append("<option value=\"" + oi.id + "\" selected=\"selected\">" + oi.name + "</option>");
				                }
				                else {
				                    $("#cId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				            }
				            $("#cId").change(function () {
				                _AddContent.CID = $(this).val();
				                $("#sId").html("<option value=\"\">选择下级分类</option>");
				                $("#select_sid").removeClass("hidden").addClass("hidden");
				                _AddContent.SID = 0;
				                if (_AddContent.CID.length > 0) {
				                    if (_AddContent.CID == 20) {
				                        _AddContent.changeWp(0);
				                    }
				                    else {
				                        _AddContent.changeWp(1);
				                    }
				                    _AddContent.getListFS();
				                    return;
				                }
				            });
				            if (_AddContent.SID > 0) {
				                _AddContent.getListFS();
				            }
				        }
				        else {
				        }
				    }
				}
		);
    },
    getListFS: function () {
        $("#sId").html("<option value=\"\">选择下级分类</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 0, cId: _AddContent.CID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#select_sid").removeClass("hidden");
				            $("#sId").html("<option value=\"\">选择下级分类</option>");
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (_AddContent.SID == oi.id) {
				                    $("#sId").append("<option value=\"" + oi.id + "\" selected=\"selected\">" + oi.name + "</option>");
				                }
				                else {
				                    $("#sId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				            }
				            $("#sId").change(function () {
				                _AddContent.CID = $(this).val();
				            });
				        }
				        else {
				        }
				    }
				}
		);
    },
    addContent: function () {
        var cId = _AddContent.CID;
        var isHref = _AddContent.isHref;
        var title = $("#title").val();
        var source = $("#source").val();
        var cDate = $("#cDate").val();
        var cType = _AddContent.CType;
        var imgUrl = $("#imgUrl").val();
        var contents = editor.html();
        var hrefUrl = $("#hrefUrl").val();
        var wp_tel = $("#wp_tel").val();
        var wp_contact = $("#wp_contact").val();
        var wp_addr = $("#wp_addr").val();
        if (cId == 0 || cId.length == 0) {
            alert("分类必须选择！");
            return false;
        }
        if (title.length == 0) {
            alert("标题不能为空！");
            return false;
        }
        if (cType == 1 || cType == 2) {
            if (imgUrl.length == 0) {
                alert("图片不能为空！");
                return false;
            }
        }
        if (isHref == 1) {
            if (hrefUrl.length == 0) {
                alert("链接地址不能为空！");
                return false;
            }
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    type: "POST",
				    data: { fn: 13, isHref: isHref, id: _AddContent.ID, wp_tel: wp_tel, wp_addr: escape(wp_addr), wp_contact: escape(wp_contact), cId: cId, hrefUrl: hrefUrl, contents: escape(contents), imgUrl: imgUrl, cType: cType, cDate: cDate, source: escape(source), title: escape(title), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#cId").val("");
				            $("#select_sid").removeClass("hidden").addClass("hidden");
				            $("#sId").val("");
				            $("#title").val("");
				            $("#source").val("");
				            $("#btn_cType").find("button").removeClass("icon-check");
				            $("#btn_cType").find("button").eq(0).addClass("icon-check");
				            $("#imgUrl").val("");
				            $("#wp_tel").val("");
				            $("#wp_contact").val("");
				            $("#wp_addr").val("");
				            editor.html("");
				            $("#hrefUrl").val("");
				            _AddContent.isHref = 0;
				            //$("#cType2").hide();
				            document.getElementById("isHref").checked = false;
				            $("#cType3").hide();
				            _AddContent.changeWp(1);
				            try {
				                _ContentList.getList(_ContentList.Page_Now);
				                _ContentList.hideUserInfo();
				            }
				            catch (e) {

				            }
				        }
				    }
				}
		);
    },
    getContent: function (id) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    type: "POST",
				    data: { fn: 16, id: id, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            if (oi.c != null) {
				                if (oi.c.pId == 0) {
				                    _AddContent.CID = oi.cId;
				                    _AddContent.SID = 0;
				                }
				                else {
				                    _AddContent.CID = oi.c.pId;
				                    _AddContent.SID = oi.c.id;
				                }
				                _AddContent.getList();
				            }
				            if (oi.cId == 20) {
				                _AddContent.changeWp(0);
				            }
				            else {
				                _AddContent.changeWp(1);
				            }
				            _AddContent.isHref = oi.isHref;
				            $("#title").val(oi.title);
				            $("#source").val(oi.source);
				            $("#wp_tel").val(oi.wp_tel);
				            $("#wp_contact").val(oi.wp_contact);
				            $("#wp_addr").val(oi.wp_addr);
				            $("#btn_cType").find("button").removeClass("icon-check");
				            $("#btn_cType").find("button").each(function () {
				                if ($(this).attr("data-type") == oi.cType) {
				                    $(this).addClass("icon-check");
				                    _AddContent.CType = $(this).attr("data-type");
				                }
				            });
				            if (_AddContent.CType == 2 || _AddContent.CType == 1) {
				                $("#imgUrl").val(oi.imgUrl);
				                //$("#cType2").show();
				            }
				            if (_AddContent.isHref == 1) {
				                $("#hrefUrl").val(oi.hrefUrl);
				                document.getElementById("isHref").checked = true;
				                $("#cType3").show();

				            }
				            editor.html(unescape(oi.contents));
				        }
				    }
				}
		);
    }
}