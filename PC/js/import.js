var _Import = {
    init: function () {
        $("#btn_ImportHis").click(function () {
            layer.confirm('确定要导入通讯录备份文件吗！', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                _Import.ImportHis();
            }, function () {

            });
            
        });
    },
    ImportHis: function () {
        var fileName = $("#importFile").val();
        if (fileName.length == 0) {
            layer.msg("请先上传备份文件", { icon: 2 });
            return;
        }
        layer.load(0, { shade: true });
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 120,fileName:fileName,t: new Date() },
				    success: function (o) {
				        layer.closeAll();
				        layer.msg("上传完成，请到通讯录仔细核对");
				        $("#importFile").val("");
				    }
				}
		);
    }
}

_Import.init();