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
        var htmlHead = "<tr><th>手机号码</th><th>回复时间</th><th>回复内容</th></tr>";
        var template = "<tr><td width=\"200\">{1}</td><td width=\"200\">{2}</td><td>{3}</td></tr>";
        $(".panel").find("tbody").html("");
        _List.Page_Now = page;
        $.ajax(
				{
				    url: _Init.ServiceUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 104,Content:escape(Content), Mobile:Mobile, DateE:DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $(".panel").find("tbody").append(htmlHead);
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.Mobile);
				                tempHtml = tempHtml.replace("{3}", oi.Content);
				                tempHtml = tempHtml.replace("{2}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm:ss"));
				                $(".panel").find("tbody").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg);
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