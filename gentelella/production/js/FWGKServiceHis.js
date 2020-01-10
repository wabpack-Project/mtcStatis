var visitPostData = {}
var visitPageNum = 1
// 获取告警列表数据
function getVisitData () {
	$.ajax({
		url: '',
		type: 'post',
		data: JSON.stringify(visitPostData),
		contentType: 'application/json;charset=utf-8',
		dataType: 'json',
		success: function (msg) {
			var data = msg.rows
			if (data.length) {
				var visitHtml = ''
				for (var i = 0; i < data.length; i++) {
					visitHtml += '<tr><td>' + data[i].serviceName + '</td><td>' + data[i].serviceClassName + '</td><td>' + data[i].visitTime + '</td><td>' + data[i].visitDelay + '</td><td>' + data[i].status + '</td><td><a class="viewDetails" href="javascript:;">查看</a></td></tr>'
				}
				$('.visit-table table tbody').html(visitHtml)
			} else {
				$('.visit-table table tbody').empty()
				$('.visit-table .list-page').hide().siblings('.noData').show()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取告警分页数据
function getVisitPageData (data) {
	$(".visit-table .list-page").paging({
		pageNum: visitPageNum,
		totalNum: Math.ceil(data.total / Page.showCount),
		totalList: data.total,
		callback: function (num) {
			visitPageNum = num
			visitPostData.currentPage = num
			getVisitData()
		}
	})
	$('.visit-table .list-page').show().siblings('.noData').hide()
}
$(function () {
	// dateRangePicker插件绑定
	$('.form-search .visit-time-range').daterangepicker({
		autoUpdateInput: false, //是否设置默认值
		timePicker24Hour: true, //是否为24小时制
		timePicker: false, //是否可选中时分
		locale: {
			applyLabel: '确定',
			cancelLabel: '取消',
			fromLabel: '起始时间',
			toLabel: '结束时间',
			daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
		}
	}).on('apply.daterangepicker', function (e, picker) {
		$('.form-search .visit-time-range').val(picker.startDate.format('YYYY-MM-DD') + '~' + picker.endDate.format('YYYY-MM-DD'))
	}).on('cancel.daterangepicker', function () {
		$('.form-search .visit-time-range').val('')
	})
	visitPostData.showCount = 10
	visitPostData.currentPage = 1
	getVisitData()
	$('body').on('click', '.form-search .search', function () {
		// 根据搜索条件查询告警历史数据
		visitPostData.serviceName = $('.form-search .service-name').val() ? $('.form-search .service-name').val() : undefined
		visitPostData.serviceClassName = $('.form-search .service-class-name').val() ? $('.form-search .service-class-name').val() : undefined
		var timeRange = $('.form-search .visit-time-range').val()
		if (timeRange) {
			visitPostData.startTime = timeRange.split('~')[0]
			visitPostData.endTime = timeRange.split('~')[1]
		} else {
			visitPostData.startTime = undefined
			visitPostData.endTime = undefined
		}
		visitPostData.showCount = 10
		visitPostData.currentPage = 1
		visitPageNum = 1
		getVisitData()
	}).on('click', '.visit-table tbody .viewDetails', function () {
		// 查看告警历史数据详情
		$('.mask').show()
	})
})
