var reportPostData = {}
var reportPageNum = 1
var reportGhConsultationInfo = {}
// 获取报告查询数据
function getReport () {
	$.ajax({
		url: baseurl + 'consultation/selectMyApplyReport',
		type: 'post',
		data: JSON.stringify(reportPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (reportData) {
			var data = reportData.rows
			if (data.length) {
				var reportHtml = ''
				for (var i = 0; i < data.length; i++) {
					reportHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>' + data[i].reqDoctorName + '</td><td>' + data[i].reqDoctorPhone + '</td><td>' + data[i].disciplineId + '</td><td>'
					switch (data[i].consultationType) {
						case '0':
							reportHtml += '临床'
							break;
						case '1':
							reportHtml += '影像'
							break;
					}
					reportHtml += '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].reqDiagnoseTime + '</td><td>'
					switch (data[i].state) {
						case 60: 
							reportHtml += '<span class="button button-green">待下载</span>' 
							break;
						case 70: 
							reportHtml += '<span class="button button-orange">已完成</span>' 
							break;
					}
					reportHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewApply.html?no=' + data[i].consultationNo + '&ind=10">查看</a></td></tr>'
				}
				$('.report-box tbody').html(reportHtml)
				gettReportPage(reportData)
			} else {
				$('.report-box tbody').html('')
				$('.report-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取报告查询分页数据
function gettReportPage (data) {
	$('.report-box .page').paging({
		pageNo: reportPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			reportPageNum = num
			Page.currentPage = num
			reportPostData.page = Page
			getReport()
		}
	})
	$('.report-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	reportPostData.page = Page
	reportGhConsultationInfo.state = $('.search-box .status select').val()
	reportPostData.ghConsultationInfo = reportGhConsultationInfo
	getReport()
	$('body').on('click', '.tab_content .search', function () {
		// 根据搜索条件查询已转出的数据
		reportGhConsultationInfo.consultationNo = $('.tab_content .apply-id input').val() ? $('.tab_content .apply-id input').val(): undefined
		reportGhConsultationInfo.bizType = $('.tab_content .patient-name input').val() ? $('.tab_content .patient-name input').val(): undefined
		reportGhConsultationInfo.disciplineId = $('.tab_content .identity-num input').val() != -100 ? $('.tab_content .identity-num input').val(): undefined
		reportGhConsultationInfo.state = $('.search-box .status select').val()
		reportGhConsultationInfo.reqTime = $('.tab_content .start-date input').val() ? new Date($('.tab_content .start-date input').val() + ' 00:00:00').getTime(): undefined
		reportGhConsultationInfo.createTime = $('.tab_content .end-date input').val() ? new Date($('.tab_content .end-date input').val() + ' 23:59:59').getTime(): undefined
		reportPageNum = 1
		Page.currentPage = 1
		reportPostData.page = Page
		reportPostData.ghConsultationInfo = reportGhConsultationInfo
		getReport()
	})
})