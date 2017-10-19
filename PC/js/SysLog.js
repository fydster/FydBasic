var _SysLog = {
    Default_Page_Size: 100,
    Page_Now: 1,
    employeeS: "",
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateS').val(NowDate);
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
        $("#btn_select").unbind().bind("click", function () {
            _SysLog.getLogList(1);
        });
        _SysLog.initEmployee();
        _SysLog.getLogList(1);
    },
    initEmployee: function () {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 28, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#WorkNo").html("<option value=\"\">--全部--</option>");
				            for (var i = 0; i < o.List.length; i++) {
				                var ci = o.List[i];
				                _SysLog.employeeS += ci.name + "|" + ci.workNo + "|" + ci.tel + "|" + ci.isService + ",";
				                $("#WorkNo").append("<option value=\"" + ci.workNo + "\">" + ci.name + "</option>");
				            }
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _SysLog.getLogList(page);
    },
    getLogList: function (page) {
        //_UserInfo.hideUserInfo();
        _SysLog.Page_Now = page;
        var htmlHead = "<tr><th width=\"140\">用户</th><th width=\"170\">时间</th><th>内容</th></tr>";
        var template = "<tr class=\"{c}\"><td>{2}</td><td>{3}</td><td>{4}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var Content = $("#Content").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 26, page: page, Content: escape(Content),DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{2}", oi.AdminName);
				                tempHtml = tempHtml.replace("{3}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{4}", oi.Content);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_SysLog", _SysLog.Default_Page_Size);
				            //_SysLog.ShowPage(page, o.Msg);
				            _Init.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#SysLogList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    }
}