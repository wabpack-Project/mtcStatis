var servicePageNum = 1; //当前页码
var serviceShowCount = 5; //每页显示条数
var totalData; // 服务注册所有数据
var showData = []; //当前页数据
var mySwitch;
// 获取列表数据
function getServiceData () {
	$.ajax({
		url: '../data/tsconfig.json',
		type: 'get',
		success: function (msg) {
			var data = msg.rows;
			//判断数据是否存在
			if (data.length) {
				totalData = msg;
				//遍历数据
                eachData(servicePageNum);
                getServicePageData();
			} else {
				$('.service-table table tbody').empty();
				$('.service-table .list-page').hide().siblings('.noData').show()
			}
		},
		error: function (err) {
			console.log(err);
		}
	})
}
// 获取分页列表数据
function getServicePageData () {
	$(".service-table .list-page").paging({
		pageNum: servicePageNum,
		totalNum: Math.ceil(totalData.total / serviceShowCount),
		totalList: totalData.total,
		callback: function (num) {
			servicePageNum = num;
            eachData(servicePageNum);
		}
	});

    // formatSwitchInWidgetFieldAttrList();

	// $('.service-table .list-page').show().siblings('.noData').hide()
}

// 字段属性列表页面的开关按钮（小按钮、并响应点击事件）
function formatSwitchInWidgetFieldAttrList() {
	var elemsSwitchList = Array.prototype.slice.call(document
	.querySelectorAll('.js-switch1'));
	elemsSwitchList.forEach(function (elem) {
		var switchery = new Switchery(elem, {
			color: '#1AB394',
			size: 'small',
		});
		// 响应点击事件。点击后直接修改其值。
		elem.onchange = function () {
			console.log(elem.checked);
			var _id = $(elem).parents("tr").attr("id");
			//向服务端发送请求 post？get
			var url = 'widgetfield.do?action=changeattr&fieldName=' + elem.name + '&fieldId=' + elem.value
				+ '&isChecked=' + elem.checked;
			setServiceOpen(url, switchery, elem);
		};
	});
}
// 设置服务状态
function setServiceOpen(url, switchery, elem) {
	//请求网络
	$.ajax({
		type: "get",
		dataType: "json",
		url: url,
		success: function (data, textStatus, xhr) {
			if (data.success === true) {
				// 显示提示信息
				// toastr.success(data.info, '操作成功');

			} else {
				// toastr.warning(data.info, '操作失败');
				//还原开关按钮状态
				switchery.element.checked = !elem.checked;
				switchery.setPosition();
			}
		},
		error: function ajaxError(xhr, textStatus) {
			// toastr.error(xhr.responseText, '错误');
			//还原
			switchery.element.checked = !elem.checked;
			switchery.setPosition();
		}
	});
}

// 遍历数据，并触发开关事件
function eachData(num) {
    var len, data = totalData.rows;
    // 判断服务数据条数对应展示
    if(totalData.total > num * serviceShowCount) {
        len = num * serviceShowCount;
    } else {
        len = totalData.total;
    }
    //数据展示
    var listHtml = '';
    for (var i = (num - 1) * serviceShowCount; i < len; i++) {
        listHtml += loadHtml(data[i]);
    }
    $('.service-table table tbody').html(listHtml);

    formatSwitchInWidgetFieldAttrList();
}

// 载入html
function loadHtml(data) {
	var isCheck = data.open ? "checked" : '';
    var status_res = parseInt(data.Status) ? "正常" : "异常";
	var tpl = '<tr id="'+data.id+'">\n' +
		'  <td>\n' +
		'    <input type="checkbox" name="table_records" class="checkbox-normal">\n' +
		'  </td>\n' +
		'  <td>'+data.serviceClassName+'</td>\n' +
		'  <td>'+data.serviceName+'</td>\n' +
		'  <td>'+data.serviceVersion+'</td>\n' +
		'  <td>'+data.framework+'</td>\n' +
		'  <td>'+data.registerTime+'</td>\n' +
		'  <td>'+data.link+'</td>\n' +
		'  <td class="status_res">'+status_res+'</td>\n' +
		'  <td>\n' +
		'    <input type="checkbox" '+isCheck+' class="js-switch"/>\n' +
		'  </td>\n' +
		'  <td>'+data.count+'</td>\n' +
		'  <td><a href="javascript:;" class="viewDetails">查看 </a><a href="javascript:;" class="update_service">修改 </a><a href="javascript:;" class="del_service">删除 </a>\n' +
		'  </td>\n' +
		'</tr>';
		console.log(tpl);
		return tpl;
}

// 删除服务数据
function delServiceData(id ,el) {
	var obj = {
		id: id
	};
	console.log(obj)
	//请求网络
	$.ajax({
		type: "post",
		dataType: "json",
		url: '/gohealth-plat/login',
		data: obj,
		success: function (data, textStatus, xhr) {
			if (data.success === true) {
				// 显示提示信息
				// toastr.success(data.info, '操作成功');
                $(this).parents("tr").remove();

			} else {
				// toastr.warning(data.info, '操作失败');
			}
		},
		error: function ajaxError(xhr, textStatus) {
			// toastr.error(xhr.responseText, '错误');
		}
	});
}

// 删除服务操作
function delService() {
	console.log(this);
	var _id = $(this).parents("tr").attr("id");
    var _tr = $(this).parents("tr");
	console.log(_id);
	delServiceData(_id,_tr);
}

// 添加服务数据
function addService() {
    console.log(this);
    var _id = $(this).parents("tr").attr("id");
    console.log(_id);
    // 查看服务数据详情
    $('.mask').show();
}

// 修改服务数据
function updateService() {
	console.log(this);
	var _id = $(this).parents("tr").attr("id");
	console.log(_id);
	// 查看服务数据详情
	$('.mask').show();
}

// 查看服务数据
function viewService() {
	console.log(this);
	var _id = $(this).parents("tr").attr("id");
	console.log(_id);
	// 查看服务数据详情
    $('.mask').show();
}

$(function () {
	getServiceData()

    // 绑定添加
    $('body').on('click', '.add_service', delService);

	// 绑定删除
    $('body').on('click', '.del_service', delService);

	// 绑定修改
    $('body').on('click', '.update_service', updateService);

	// 绑定查看
    $('body').on('click', '.viewDetails', viewService);

});