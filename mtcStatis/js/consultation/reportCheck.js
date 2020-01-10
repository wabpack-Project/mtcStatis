var checkPostData = {}
var checkPageNum = 1
var consultationReport = {}
// 获取报告审核数据
function getReportCheck () {
	$.ajax({
		url: baseurl + 'diagnosticReport/selectVaguereportApply',
		type: 'post',
		data: JSON.stringify(checkPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (reportCheckData) {
			var data = reportCheckData.rows
			if (data.length) {
				var reportCheckHtml = ''
				for (var i = 0; i < data.length; i++) {
					reportCheckHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].patientName + '</td><td>' + data[i].sexName + '</td><td>'
					switch (data[i].consultationType) {
						case 0: 
							reportCheckHtml += '临床' 
							break;
						case 1: 
							reportCheckHtml += '影像' 
							break;
						case 2: 
							reportCheckHtml += '心电' 
							break;
						case 3: 
							reportCheckHtml += '病理' 
							break;
					}
					reportCheckHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].reqDoctorName + '</td><td>' + data[i].doctor1Name + '</td><td>'
					switch (data[i].reqType) {
						case 0: 
							reportCheckHtml += '单方' 
							break;
						case 1: 
							reportCheckHtml += 'MDT' 
							break;
						case 2: 
							reportCheckHtml += '特需' 
							break;
						case 3: 
							reportCheckHtml += '点名' 
							break;
					}
					reportCheckHtml += '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].startTime + '</td><td><a class="look">审核</a></td></tr>'
				}
				$('.reportCheck-box tbody').html(reportCheckHtml)
				getReportCheckPage(reportCheckData)
			} else {
				$('.reportCheck-box tbody').html('')
				$('.reportCheck-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取报告审核分页数据
function getReportCheckPage (data) {
	$('.reportCheck-box .page').paging({
		pageNo: checkPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			checkPageNum = num
			Page.currentPage = num
			checkPostData.page = Page
			getReportCheck()
		}
	})
	$('.reportCheck-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	checkPostData.page = Page
	checkPostData.consultationReport = consultationReport
	getReportCheck()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询数据
		consultationReport.consultationNo = $('.tab1 .apply-id input').val()? $('.tab1 .apply-id input').val(): undefined
		consultationReport.patientName = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		consultationReport.reqHospitalName = $('.tab1 .apply-hospital input').val()? $('.tab1 .apply-hospital input').val(): undefined
		consultationReport.reqType = $('.tab1 .consul-pattern select').val() != -100? $('.tab1 .consul-pattern select').val(): undefined
		consultationReport.consultationType = $('.tab1 .consul-type select').val() != -100? $('.tab1 .consul-type select').val(): undefined
		consultationReport.reqTime = $('.tab1 .start-date input').val()? new Date($('.tab1 .start-date input').val() + ' 00:00:00').getTime(): undefined
		consultationReport.createTime = $('.tab1 .end-date input').val()? new Date($('.tab1 .end-date input').val() + ' 23:59:59').getTime(): undefined
		checkPageNum = 1
		Page.currentPage = 1
		checkPostData.page = Page
		checkPostData.consultationReport = consultationReport
		getReportCheck()
	})
})