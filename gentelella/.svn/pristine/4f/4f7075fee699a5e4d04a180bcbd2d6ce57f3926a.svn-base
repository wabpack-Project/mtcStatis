$(function(){
	$("body").on("click", "table th input.checkbox-normal", function () {
		// 表格全选
		var tbody = $(this).parents("table").find("tbody");
		tbody.find("input.checkbox-normal").prop("checked",$(this).prop("checked"));
		tbody.find("tr").toggleClass("selected")
	}).on("click", "tbody input.checkbox-normal", function () {
		// 表格多选
		var table = $(this).parents("table");
		$(this).parents("tr").toggleClass("selected");
		if($(this).prop("checked")){
			if(table.find("tbody .checkbox-normal:checked").length == table.find("tbody .checkbox-normal").length){
				table.find("th .checkbox-normal").prop("checked",true)
			}
		}else{
			table.find("th .checkbox-normal").prop("checked",false)
		}
	}).on('click', '.mask .setBox-header .closeBox,.mask .setBox-footer .cancel', function () {
		// 取消弹框操作（关闭弹框）
		$(this).parents('.mask').hide()
	})
});