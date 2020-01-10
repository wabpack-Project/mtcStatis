var outpatientPostData = {}
var outpatientPageNum = 1
// 获取门诊列表数据
function getOutpatientData () {
	$.ajax({
		url: baseurl + 'remoteclinic/getRemoteclinicAppListPage',
		type: 'post',
		data: JSON.stringify(outpatientPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (outpatientRegistrationData) {
			var data = outpatientRegistrationData.rows
			if (data.length) {
				var outpatientHtml = ''
				for (var i = 0; i <  data.length; i++) {
					outpatientHtml += '<tr><td>' + data[i].ghRemoteclinicInfo.remoteclinicNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>'
					switch (data[i].ghRemoteclinicInfo.remoteclinicType) {
						case 0:
							outpatientHtml += '便民门诊'
							break;
						case 1:
							outpatientHtml += '普通门诊'
							break;
						case 2:
							outpatientHtml += '专家门诊'
							break;
					}
					outpatientHtml += '</td><td>' + getDate(data[i].ghPatientInfo.createTime) + '</td><td>' + data[i].ghRemoteclinicInfo.applyHospitalName + '</td><td>' + data[i].ghRemoteclinicInfo.applyDepartmentName + '</td><td>' + data[i].ghRemoteclinicInfo.applyDoctorName + '</td><td>' + getDate(data[i].ghRemoteclinicInfo.applyDate) + '</td><td>'
					switch (data[i].ghRemoteclinicInfo.state) {
						case -1:
							outpatientHtml += '<span class="button button-orange">已撤销</span>'
							break;
						case 10:
							outpatientHtml += '<span class="button button-orange">待缴费</span>'
							break;
						case 20:
							outpatientHtml += '<span class="button button-blue">排队中</span>'
							break;
						case 30:
							outpatientHtml += '<span class="button button-blue">诊断中</span>'
							break;
						case 31:
							outpatientHtml += '<span class="button button-blue">挂起</span>'
							break;
						case 32:
							outpatientHtml += '<span class="button button-blue">暂存</span>'
							break;
						case 40:
							outpatientHtml += '<span class="button button-blue">待下载</span>'
							break;
						case 50:
							outpatientHtml += '<span class="button button-green">已完成</span>'
							break;
					}
					outpatientHtml += '</td><td><a class="look"  href="/mtcStatis/pages/outpatient/viewRegistration.html?id=' + data[i].ghRemoteclinicInfo.id + '&state=' + data[i].ghRemoteclinicInfo.state + '&type=' + data[i].ghRemoteclinicInfo.remoteclinicType + '">查看</a>'
					switch (data[i].ghRemoteclinicInfo.state) {
						case 10:
							outpatientHtml += '<a class="modify" data-id=' + data[i].ghRemoteclinicInfo.id + '>修改</a><a class="revocation" data-id=' + data[i].ghRemoteclinicInfo.id + '>取消</a>'
							break;
						case 20:
							outpatientHtml += '<a class="revocation" data-id=' + data[i].ghRemoteclinicInfo.id + '>取消</a>'
							break;
					}
					outpatientHtml += '</td></tr>'
				}
				$('.outpatient-box tbody').html(outpatientHtml)
				getOutpatientPage(outpatientRegistrationData)
			} else {
				$('.outpatient-box tbody').html('')
				$('.outpatient-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取门诊分页列表数据
function getOutpatientPage (data) {
	$('.outpatient-box .page').paging({
		pageNo: outpatientPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			outpatientPageNum = num
			Page.currentPage = num
			outpatientPostData.page = Page
			getBacklog()
		}
	})
	$('.outpatient-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	outpatientPostData.page = Page
	getOutpatientData()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询门诊数据
		outpatientPostData.remoteclinicNo = $('.outpatient-id input').val()? $('.outpatient-id input').val(): undefined
		outpatientPostData.remoteclinicType = $('.outpatient-type select').val()? $('.outpatient-type select').val(): undefined
		outpatientPostData.patientName = $('.patient-name input').val()? $('.patient-name input').val(): undefined
		outpatientPostData.applyHospitalName = $('.objective-hospital input').val()? $('.objective-hospital input').val(): undefined
		outpatientPostData.applyDoctorName = $('.objective-doctor input').val()? $('.objective-doctor input').val(): undefined
		outpatientPostData.state = $('.outpatient-status select').val()? $('.outpatient-status select').val(): undefined
		outpatientPostData.startDate = $('.start-date input').val()? $('.start-date input').val(): undefined
		outpatientPostData.endDate = $('.end-date input').val()? $('.end-date input').val(): undefined
		outpatientPageNum = 1
		Page.currentPage = 1
		outpatientPostData.page = Page
		getOutpatientData()
	})
})