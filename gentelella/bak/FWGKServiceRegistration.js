var servicePageNum = 1 //当前页码
var serviceShowCount = 10 //当前显示页数
var totalData; // 服务注册所有数据
var showData = []; //当前页数据
var mySwitch;
// 获取列表数据
function getServiceData () {
	$.ajax({
		url: '',
		type: 'post',
		success: function (msg) {
			var data = msg.rows
			if (data.length) {
				totalData = msg
				getServicePageData()
			} else {
				$('.service-table table tbody').empty()
				$('.service-table .list-page').hide().siblings('.noData').show()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取分页列表数据
function getServicePageData () {
	$(".service-table .list-page").paging({
		pageNum: servicePageNum,
		totalNum: Math.ceil(totalData.total / Page.showCount),
		totalList: totalData.total,
		callback: function (num) {
			servicePageNum = num
			var listHtml = ''
			for (var i = (servicePageNum - 1) * serviceShowCount; i < servicePageNum * serviceShowCount; i++) {

			}
			$('.service-table table tbody').html(listHtml);

			// 启用Switchery
			initSwitchery(".js-switch1");

		}
	})
	$('.service-table .list-page').show().siblings('.noData').hide()
}

// 字段属性列表页面的开关按钮（小按钮、并响应点击事件）
function formatSwitchInWidgetFieldAttrList() {
	var elemsSwitchList = Array.prototype.slice.call(document
	.querySelectorAll('.js-switch1'));
	elemsSwitchList.forEach(function (elem) {
		var flag = $(elem).attr(attr_disable);
		console.log(elem.checked);
		var switchery = new Switchery(elem, {
			color: '#1AB394',
			size: 'small'
		});
		// 响应点击事件。点击后直接修改其值。
		elem.onchange = function () {
			var url = 'widgetfield.do?action=changeattr&fieldName=' + elem.name + '&fieldId=' + elem.value
				+ '&isChecked=' + elem.checked;
			//请求网络
			$.ajax({
				type: "get",
				dataType: "json",
				url: url,
				success: function (data, textStatus, xhr) {
					if (data.success === true) {
						// 显示提示信息
						toastr.success(data.info, '操作成功');
					} else {
						toastr.warning(data.info, '操作失败');
						//还原开关按钮状态
						switchery.element.checked = !elem.checked;
						switchery.setPosition();
					}
				},
				error: function ajaxError(xhr, textStatus) {
					toastr.error(xhr.responseText, '错误');
					//还原
					switchery.element.checked = !elem.checked;
					switchery.setPosition();
				}
			});
		};
	});
};


$(function () {
	// getServiceData()

	formatSwitchInWidgetFieldAttrList();

	// setSwitchery(mySwitch, true);
});