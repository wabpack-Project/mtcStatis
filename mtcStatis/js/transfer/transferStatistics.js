var statisticsPostData = {}
var statisticsPageNum = 1
// 获取统计数据
function getStatistics () {
	$.ajax({
		url: baseurl + 'transfer/getTransferStatisticsListPage',
		type: 'post',
		data: JSON.stringify(statisticsPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (transferStatistics) {
			var data = transferStatistics.rows
			$('.statistics-box .total-info span').text(transferStatistics.total)
			if (data.length) {
				var statisticsHtml = ''
				for (var i = 0; i < data.length; i++) {
					statisticsHtml += '<tr><td>' + data[i].patientName + '</td><td>' + data[i].sex + '</td><td>' + getDate(data[i].birthday) + '</td><td>' + data[i].hospitalName + '</td><td>' + getDate(data[i].createTime) + '</td><td>'
					statisticsHtml += data[i].transferDisease ? data[i].transferDisease: '无'
					statisticsHtml += '</td><td>' + data[i].applyHospitalName + '</td><td>' + data[i].accepterName + '</td></tr>'
				}
				$('.transfer-box tbody').html(statisticsHtml)
				getStatisticsPage(transferStatistics)
			} else {
				$('.transfer-box tbody').html('')
				$('.transfer-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取统计分页数据
function getStatisticsPage (data) {
	$('.transfer-box .page').paging({
		pageNo: statisticsPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			statisticsPageNum = num
			Page.currentPage = num
			statisticsPostData.page = Page
			getStatistics()
		}
	})
	$('.transfer-box .page').parent().show()
}
function getHospitalItem () {
	$.ajax({
		url: baseurl + 'transfer/getTransferStatistics',
		type: 'post',
		data: JSON.stringify(statisticsPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (hospitalStatistics) {
			for (var j = 0; j < hospitalStatistics.length; j++) {
				var p = document.createElement('p')
				p.innerHTML = hospitalStatistics[j].applyHospitalName + '：' + hospitalStatistics[j].hospitalCount + '例'
				$('.statistics-box .item-info').append(p)
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
$(function () {
	Page.showCount = 5
	Page.currentPage = 1
	statisticsPostData.page = Page
	getStatistics()
	getHospitalItem()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询统计数据
		statisticsPostData.hospitalLevel = $('.apply-hospital-level select').val() ? $('.apply-hospital-level select').val(): undefined
		statisticsPostData.transferDisease = $('.transfer-disease select').val() ? $('.transfer-disease select').val(): undefined
		statisticsPostData.startTime = $('.start-date input').val() ? new Date($('.start-date input').val() + ' 00:00:00').getTime(): undefined
		statisticsPostData.endTime = $('.end-date input').val() ? new Date($('.end-date input').val() + ' 23:59:59').getTime(): undefined
		Page.currentPage = 1
		statisticsPostData.page = Page
		statisticsPageNum = 1
		getHospitalItem()
	})
})