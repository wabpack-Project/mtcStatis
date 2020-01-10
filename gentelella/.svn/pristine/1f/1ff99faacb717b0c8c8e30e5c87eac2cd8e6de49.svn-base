var warningPostData = {}
var warningPageNum = 1
// 获取告警列表数据
function getWarningData () {
	$.ajax({
		url: '',
		type: 'post',
		data: JSON.stringify(warningPostData),
		contentType: 'application/json;charset=utf-8',
		dataType: 'json',
		success: function (msg) {
			var data = msg.rows
			if (data.length) {
				var warningHtml = ''
				for (var i = 0; i < data.length; i++) {
					warningHtml += '<tr><td><input type="checkbox" name="table_records" class="checkbox-normal"></td><td>' + data[i].serviceName + '</td><td>' + getDateTime(data[i].warningTime) + '</td><td>' + data[i].serviceClassName + '</td><td>' + data[i].link + '</td><td>' + data[i].warningType + '</td><td><a href="#">查看</a><a href="#">消除</a></td></tr>'
				}
				$('.warning-table table tbody').html(warningHtml)
			} else {
				$('.warning-table table tbody').empty()
				$('.warning-table .list-page').hide().siblings('.noData').show()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取告警分页数据
function getWarningPageData (data) {
	$(".warning-table .list-page").paging({
		pageNum: warningPageNum,
		totalNum: Math.ceil(data.total / Page.showCount),
		totalList: data.total,
		callback: function (num) {
			warningPageNum = num
			warningPostData.currentPage = num
			getWarningData()
		}
	})
	$('.warning-table .list-page').show().siblings('.noData').hide()
}
// 时间戳转换为日期格式
function getDateTime (date) {
	var newDate = date.length == 10 ? new Date(date * 1000) : new Date(date)
	var year = newDate.getFullYear()
	var month = newDate.getMonth() + 1 < 10 ? '0' + newDate.getMonth() + 1 : newDate.getMonth() + 1
	var date = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
	var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
	var minutes = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
	var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds()
	return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
}
$(function () {
	warningPostData.showCount = 10
	warningPostData.currentPage = 1
	// getWarningData()
})
