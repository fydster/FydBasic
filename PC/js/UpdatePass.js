var _UpdatePass = {
    init:function(){
        $("#btn_UpdatePass").unbind().bind("click", _UpdatePass.upPass);
    },
    upPass: function () {
        var oldPass = $("#oldPass").val();
        var newPass = $("#newPass").val();
        var repeatPass = $("#repeatPass").val();
        if (oldPass.length == 0 || newPass.length == 0 || repeatPass.length == 0) {
            alert("请填写完整后再提交");
            return false;
        }
        if (newPass != repeatPass) {
            alert("两次输入的密码不匹配");
            return false;
        }
        var re = new RegExp("[a-zA-Z]");
        var s1 = re.test(newPass);
        re = new RegExp("[0-9]");
        var s2 = re.test(newPass);
        var s3 = true;
        if (newPass.length < 5 || newPass.length > 20) {
            s3 = false;
        }
        if (!s1 || !s2 || !s3) {
            alert("密码必须同时包含字母和数字，长度在6到20位之间！");
            return false;
        }
        $.ajax(
			        {
			            url: _Init.ServerUrl,
			            context: document.body,
			            dataType: "json",
			            cache: false,
			            data: { fn: 90, oldPass: oldPass, newPass: newPass, t: new Date() },
			            success: function (o) {
			                alert(o.Msg);
			                if (o.Return == 0) {
			                    $("#oldPass").val("");
			                    $("#newPass").val("");
			                    $("#repeatPass").val("");
			                }
			            }
			        }
		         );
    }
}