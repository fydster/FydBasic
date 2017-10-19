var _List = {
    Page_Now: 1,
    init: function () {

        var NowDate = new Date().pattern("yyyy-MM-dd");
        //$('#DateS').val(NowDate);
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
        $("#btn_select").click(function () {
            _List.getList(1);
        });
        _List.getList(1);
    },
    SumPage: function (page) {
        _List.getList(page);
    },
    getList: function (page) {
        $("#PagePanel").hide();
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var Mobile = $("#mobile").val();
        var Content = $("#content").val();
        var htmlHead = "<tr><th>发送号码</th><th>发送数量</th><th>发送内容</th><th>添加时间</th><th>发送状态</th><th>操作</th></tr>";
        var template = "<tr><td width=\"200\">{1}</td><td width=\"100\">{2}</td><td>{3}</td><td width=\"110\">{4}</td><td width=\"110\">{5}</td><td width=\"140\"><button data-id=\"{id}\" data-streamno=\"{streamNo}\" class=\"button button-small border-blue\"> 查看详情</button></td></tr>";
        $(".panel").find("tbody").html("");
        _List.Page_Now = page;
        $.ajax(
				{
				    url: _Init.ServiceUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 101,Content:escape(Content), Mobile:Mobile, DateE:DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $(".panel").find("tbody").append(htmlHead);
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (oi.SendType == 0) {
				                    var mobiles = oi.Mobiles;
				                    if (mobiles.length > 12) {
				                        mobiles = mobiles.toString().substr(0, 11) + " ...";
				                    }
				                    else {
				                        mobiles = mobiles.toString().substr(0, 11);
				                    }
				                    tempHtml = template.replace("{1}", mobiles);
				                }
				                else {
				                    tempHtml = template.replace("{1}", oi.SendName);
				                }
				                tempHtml = tempHtml.replace("{2}", oi.MobileNum);
				                tempHtml = tempHtml.replace("{3}", oi.Content);
				                tempHtml = tempHtml.replace("{4}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm:ss"));
				                tempHtml = tempHtml.replace("{5}", oi.State.toString().replace("0", "<span class=\"tag bg-red-light\">待发送</span>").replace("1", "<span class=\"tag bg-blue-light\">发送中</span>").replace("2", "<span class=\"tag bg-green-light\">已发送</span>"));
				                tempHtml = tempHtml.replace(/{id}/g, oi.ID);
				                tempHtml = tempHtml.replace(/{streamNo}/g, oi.StreamNo);
				                $(".panel").find("tbody").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg);

				            setTimeout(function () {
				                $("#Page_Info").find("button").click(function () {
				                    var page = $(this).attr("data-page");
				                    page = page.replace(" ", "");
				                    _List.SumPage(page);
				                });
				            }, 300);

				            $(".panel").find("tbody").find(".border-blue").click(function () {
				                var id = $(this).attr("data-id");
				                var streamNo = $(this).attr("data-streamno");
				                _List.getMxList(streamNo);
				            });
				        }
				        else {
				            $(".panel").find("tbody").html("无记录");
				        }
				    }
				}
		);
    },
    getMxList: function (streamNo) {
        var htmlHead = "<tr><th>手机号码</th><th>添加时间</th><th>发送时间</th><th>发送结果</th></tr>";
        var template = "<tr title=\"{errmsg}\"><td width=\"110\">{1}</td><td width=\"180\">{2}</td><td width=\"180\">{3}</td><td width=\"80\">{4}</td></tr>";
        $("#alert-mx").find("tbody").html("");
        layer.load(0, { shade: false });
        $.ajax(
				{
				    url: _Init.ServiceUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 102, streamNo: streamNo, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#alert-mx").find("tbody").append(htmlHead);
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.Mobile);
				                tempHtml = tempHtml.replace("{2}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm:ss"));
				                if (oi.State > 0) {
				                    tempHtml = tempHtml.replace("{3}", new Date(oi.SendOn).pattern("yyyy-MM-dd HH:mm:ss"));
				                }
				                else {
				                    tempHtml = tempHtml.replace("{3}", "---");
				                }
				                
				                tempHtml = tempHtml.replace("{4}", oi.State.toString().replace("0", "<span class=\"tag bg-red-light\">发送中</span>").replace("1", "<span class=\"tag bg-blue-light\">发送完成</span>").replace("2", "<span class=\"tag bg-green-light\">发送失败</span>"));
				                tempHtml = tempHtml.replace("{5}", "---");
				                tempHtml = tempHtml.replace(/{id}/g, oi.ID);
				                tempHtml = tempHtml.replace(/{errmsg}/g, oi.ErrMsg);
				                $("#alert-mx").find("tbody").append(tempHtml);
				            }
				            layer.closeAll();
				            layer.open({
				                type: 1,
				                shade: 0.6,
				                title: "发送明细", //不显示标题
				                area: ['600px', '400px'],
				                content: $('#alert-mx'), //捕获的元素
				                cancel: function (index) {
				                    layer.close(index);
				                }
				            });
				        }
				        else {
				            layer.closeAll();
				            layer.msg("短信未分发，请稍等", { icon: 1 });
				        }
				    }
				}
		);
    }
}

_List.init();