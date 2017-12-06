var userObj;
var _List = {
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
        $("#btn_select").click(function () {
            _List.getList(1);
        });
        _List.initUser();
    },
    initUser: function () {
        $("#adminId").html("<option value='0'>全部用户</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 103, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            userObj = o.List;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#adminId").append("<option value='" + oi.ID + "'>" + oi.CorpName + "</option>");
				            }
				            _List.getList();
				        }
				    }
				}
		);
    },
    getUserName: function (adminId) {
        var corpName = "";
        if (userObj != null) {
            for (var i = 0; i < userObj.length; i++) {
                var oi = userObj[i];
                if (oi.ID == adminId) {
                    corpName = oi.CorpName;
                    break;
                }
            }
        }
        return corpName;
    },
    getList: function () {
        $("#PagePanel").hide();
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var adminId = $("#adminId").val();
        var htmlHead = "<tr><th>用户</th><th>发送次数</th><th>号码总计</th><th>计费总计</th></tr>";
        var template = "<tr><td width=\"160\">{1}</td><td width=\"110\">{2}</td><td width=\"90\">{3}</td><td width=\"170\">{4}</td></tr>";
        $(".panel").find("tbody").html("");
        $.ajax(
				{
				    url: _Init.ServiceUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 106, adminId:adminId,DateE: DateE, DateS: DateS, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $(".panel").find("tbody").append(htmlHead);
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", _List.getUserName(oi.AdminID));
				                tempHtml = tempHtml.replace("{2}", oi.Count);
				                tempHtml = tempHtml.replace("{3}", oi.MobileNum);
				                tempHtml = tempHtml.replace("{4}", oi.FeeNum);
				                $(".panel").find("tbody").append(tempHtml);
				            }
				        }
				        else {
				            $(".panel").find("tbody").html("无记录");
				        }
				    }
				}
		);
    }
}

_List.init();