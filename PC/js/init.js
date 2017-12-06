var _Init = {
    Title: "信息服务",
    COOKIE_NAME: "_Mobile",
    BaseUrl: "http://sms.tyrtdl.cn",
    CityS: "",
    Default_Page_Size: 10,
    ServerUrl: "Handler.ashx?mobile_cookie=" + $.cookie("_Mobile"),
    ImportUrl: "importHandler.ashx?mobile_cookie=" + $.cookie("_Mobile"),
    ServiceUrl: "serviceHandler.ashx?mobile_cookie=" + $.cookie("_Mobile"),
    init: function (id) {
        $("#btn_Logout").click(_Init.logout);
        $(".icon-arrow-left").click(_Init.hideMenu);
        try {
            _Init.initNew();
            $("#Login_workNo").after("&nbsp;" + $.cookie("_CorpName") + "&nbsp;&nbsp;");

            var RoleID = $.cookie("_RoleID");
            var Account = $.cookie("_Account");
            if (RoleID != null && Account!=null) {
                if (RoleID == 4 || RoleID == 1) {
                    $(".icon-money").show();
                    $(".icon-money").find("em").text(Account);
                }
            }
        }
        catch (e) { }
    },
    hideMenu: function () {
        $(".x2").hide();
        $(".x10").removeClass().addClass("x12");
        $("#menuControl").html("<span class=\"icon-tasks\" style=\"font-size:20px;\"></span>&nbsp;&nbsp;&nbsp;");
        $("#menuControl").click(_Init.showMenu);
    },
    showMenu: function () {
        $(".x12").removeClass().addClass("x10");
        $(".x2").show();
        $("#menuControl").html("<span class=\"icon-tasks\" style=\"font-size:20px;\"></span>&nbsp;&nbsp;&nbsp;");
        $("#menuControl").click(_Init.hideMenu);
    },
    initNew: function () {
        $(".collapse").html("");
        var template_menu = "<li data-name=\"{title}\" data-id=\"{id}\" data-src=\"{limitUrl}\" data-icon=\"icon-{icon}\"><span class=\"icon-{icon}\"></span>&nbsp;{title}</li>";
        var template_more = $("#template_menu").html();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 18, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var moreHtml = "";
				            var subMenu = 0;
				            var active = "";
				            var isFirst = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                oi = o.List[i];
				                active = "";
				                if (i == 0) {
				                    active = "active";
				                }
				                if (oi.LimitType == 1) {
				                    tempHtml = template_more.replace("{Title}", oi.LimitName).replace("{icon}", oi.Icon).replace("{active}", active);
				                    subMenu = 0;
				                    moreHtml = "";
				                    for (var j = 0; j < o.List.length; j++) {
				                        oj = o.List[j];
				                        if (oj.LimitType == 0) {
				                            if (isFirst == 0) {
				                                $(".tab-nav").html("<li id=\"menuControl\" style=\"cursor:pointer;\" ><span class=\"icon-tasks\" style=\"font-size:20px;\"></span>&nbsp;&nbsp;&nbsp;</li>");
				                                $(".tab-nav").append("<li style=\"margin-right:5px;\" id=\"nav_li_" + oj.ID + "\" class=\"active now\"><a href=\"#tab-start" + oj.ID + "\">" + oj.LimitName + "&nbsp;&nbsp;<span class=\"icon-times\"></span></a></li>");
				                                $(".tab-body").html("<div class=\"tab-panel active\" id=\"tab-start" + oj.ID + "\"><iframe style=\"width:99%;height:100%;\" src=\"" + oj.LimitUrl + "\"></iframe></div>");
				                                $("#menuControl").click(_Init.hideMenu);
				                                isFirst = 1;
				                            }
				                            if (oj.PID == oi.ID) {
				                                moreHtml += template_menu.replace(/{title}/g, oj.LimitName).replace(/{icon}/, oj.Icon).replace("{limitUrl}", oj.LimitUrl).replace("{id}", oj.ID);
				                                subMenu++;
				                            }
				                        }
				                    }
				                    tempHtml = tempHtml.replace("{menu}", moreHtml);
				                    i = i + subMenu;
				                }
				                $(".collapse").append(tempHtml);
				            }
				            _Init.initEvent();
				        }
				        else {
				            window.location.href = "login.html";
				        }
				    }
				}
		);
    },
    initEvent: function () {
        $('.collapse .panel-head').each(function () {
            var e = $(this);
            e.click(function () {
                e.closest('.collapse').find(".panel").removeClass("active");
                e.closest('.panel').addClass("active");
            });
        });

        var h = window.screen.height;
        //alert(h);
        h = $(window).height();
        //alert(h);
        $("iframe").css("height", h-120 + "px");

        $(".icon-times").click(function () {
            var id = $(this).parent().attr("href");
            $(id).remove();
            $(this).parent().parent().remove();
            $(".tab-nav").find("li").eq(0).addClass("active");
            $(".tab-body").find(".tab-panel").eq(0).addClass("active");
        });

        $(".panel-body").find("ul li").click(function () {
            var id = $(this).attr("data-id");
            var src = $(this).attr("data-src");
            var icon = $(this).attr("data-icon");
            var name = $(this).attr("data-name");
            if (typeof ($("#nav_li_" + id).html()) == "undefined") {
                $(".tab-nav").find("li").removeClass("active").removeClass("now");
                $(".tab-nav").append("<li style=\"margin-right:5px;\" id=\"nav_li_" + id + "\" class=\"active now\"><a href=\"#tab-start" + id + "\">" + name + "&nbsp;&nbsp;&nbsp;<span class=\"icon-times\"></span></a></li>");
                $(".tab-body").find("tab-panel").removeClass("active");
                $(".tab-body").append("<div class=\"tab-panel active\" id=\"tab-start" + id + "\">\<iframe style=\"width:99%;height:100%;\" src=\"" + src + "\"></iframe>\</div>");
                $("iframe").css("height", h - 120 + "px");
                $('.tab .tab-nav li').each(function () {
                    var e = $(this);
                    if (e.attr("id") == "menuControl") {
                        return;
                    }
                    var trigger = e.closest('.tab').attr("data-toggle");
                    if (trigger == "hover") {
                        e.mouseover(function () {
                            $showtabs(e);
                        });
                        e.click(function () {
                            return false;
                        });
                    } else {
                        e.click(function () {
                            $(".tab-nav").find("li").removeClass("active").removeClass("now");
                            $(this).addClass("now");
                            $showtabs(e);
                            return false;
                        });
                    }
                });
            }
            $showtabs($("#nav_li_" + id));
            $(".icon-times").click(function () {
                var id = $(this).parent().attr("href");
                if ($(id).hasClass("active")) {
                    $(".tab-nav").find("li").eq(0).addClass("active").addClass("now");
                    $(".tab-body").find(".tab-panel").eq(0).addClass("active");
                }
                $(id).remove();
                $(this).parent().parent().remove();
            });
        });
    },
    C_ToCSS: function (x, obj) {
        obj.addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass(x + ' animated');
        });
    },
    getParam: function (pname) {
        var aQuery = window.location.href.split("?");
        var avar = "";
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("="); //分离key与Value
                if (aTmp[0] == pname) {
                    avar = aTmp[1];
                    break;
                }
            }
        }
        return avar;
    },
    login: function () {
        var user = $("#username").val();
        var pass = $("#password").val();
        if (user.length == 0 || pass.length == 0) {
            alert("请填写完整后再提交");
            return false;
        }
        $.ajax(
			        { url: "/Handler.ashx",
			            context: document.body,
			            dataType: "json",
			            cache: false,
			            data: { fn: 0, mobile: user, pass: pass, t: new Date() },
			            success: function (o) {
			                if (o.Return == 0) {
			                    var date = new Date();
			                    date.setTime(date.getTime() + (3 * 60 * 60 * 1000));
			                    var logOutUrl = window.location.href;
			                    $.cookie("_CorpName", o.Info.CorpName, { path: '/', expires: date });
			                    $.cookie("_LogOutUrl", logOutUrl, { path: '/', expires: date });
			                    $.cookie("_ID", o.Info.ID, { path: '/', expires: date });
			                    $.cookie("_RoleID", o.Info.RoleID, { path: '/', expires: date });
			                    $.cookie("_Account", o.Info.Account, { path: '/', expires: date });
			                    $.cookie(_Init.COOKIE_NAME, o.Info.ID, { path: '/', expires: date });
			                    window.location.href = "/index.html";
			                }
			                else {
			                    alert(o.Msg);
			                }
			            }
			        }
		         );
    },
    logout: function () {
        var mobile = $.cookie("_Mobile");
        $.ajax(
			        { url: "/Handler.ashx?mobile=" + mobile,
			            context: document.body,
			            dataType: "json",
			            cache: false,
			            data: { fn: 19, t: new Date() },
			            success: function (o) {
			                $.cookie("_CorpName", null, { path: '/' }); //删除cookie
			                $.cookie("_ID", null, { path: '/' }); //删除cookie
			                $.cookie("_RoleID", null, { path: '/' }); //删除cookie
			                var logOutUrl = $.cookie("_LogOutUrl");
			                if (logOutUrl != null && logOutUrl.length > 0) {
			                    window.location.href = logOutUrl;
			                }
			                else {
			                    window.location.href = "login.html";
			                }
			            }
			        }
		         );
    },
    //判断手机号码是否合法
    IsValidMobile: function (mobile) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            return false;
        }
        else {
            return true;
        }
    },
    //分页
    ShowPage: function (page, total) {
        $("#PagePanel").show();
        var pageNum = parseInt(page);
        var allPage = parseInt(parseInt(total) / parseInt(_Init.Default_Page_Size));
        if (parseInt(total) % parseInt(_Init.Default_Page_Size) > 0) {
            allPage++;
        }
        $("#allPage").html(allPage);
        $("#allNum").html(total);
        $("#Page_Info").html("");
        $("#Page_Info").append("<button type=\"button\" class=\"button\" data-page=\"1\">首页</button>");
        if (pageNum > 1) {
            $("#Page_Info").append("<button type=\"button\" class=\"button\" data-page=\"" + (pageNum - 1) + "\">上一页</button>");
        }
        $("#Page_Info").append("<button type=\"button\" class=\"button\" data-page=\"" + pageNum + "\">" + pageNum + "</button>");
        if (pageNum < allPage) {
            $("#Page_Info").append("<button type=\"button\" class=\"button\" data-page=\"" + (pageNum + 1) + "\">下一页</button>");
        }
        $("#Page_Info").append("<button type=\"button\" class=\"button\" data-page=\"" + allPage + "\">尾页</button>");
    }
}

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

window.onresize = function () {
    var h = $(window).height();
    $("iframe").css("height", h - 120 + "px");
}
