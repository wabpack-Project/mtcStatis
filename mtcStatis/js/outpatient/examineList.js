var searchArr = location.search.split(/[?=&]/)
var remoteclinicType = searchArr[searchArr.indexOf('type') + 1]
var examinePostData = {}
var examinePageNum = 1
// 获取诊查列表数据
function getExamineList () {
	$.ajax({
		url: baseurl + 'clinicIndagation/getClinicIndagationListPage',
		type: 'post',
		data: JSON.stringify(examinePostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (outpatientExamineData) {
			var data = outpatientExamineData.rows
			if (data.length) {
				var examineHtml = ''
				for (var i = 0; i < data.length; i++) {
					examineHtml += '<tr><td>' + data[i].remoteclinicNo + '</td><td>' + data[i].patientName + '</td><td>' + data[i].sexName + '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].reqHospitalName + '</td><td>'
					if (data[i].remoteclinicType != 0) {
						examineHtml += data[i].applyDepartmentName + '</td><td>'
					} else {
						$('.examine-box th.clinic-department').hide()
					}
					examineHtml += data[i].applyDoctorName + '</td><td>' + getDate(data[i].applyDate) + '</td><td>'
					switch (data[i].state) {
						case -1:
							examineHtml += '<span class="button button-orange">已撤回</span>'
							break;
						case 10:
							examineHtml += '<span class="button button-orange">待缴费</span>'
							break;
						case 20:
							examineHtml += '<span class="button button-blue">排队中</span>'
							break;
						case 30:
							examineHtml += '<span class="button button-blue">诊断中</span>'
							break;
						case 31:
							examineHtml += '<span class="button button-blue">挂起</span>'
							break;
						case 32:
							examineHtml += '<span class="button button-orange">暂存</span>'
							break;
						case 40:
							examineHtml += '<span class="button button-orange">待下载</span>'
							break;
						case 50:
							examineHtml += '<span class="button button-green">已完成</span>'
							break;
					}
					examineHtml += '</td><td><a class="look" href='
					examineHtml += data[i].state == 40 ? '"/mtcStatis/pages/outpatient/viewOutpatientExamineLoad.html?id=' + data[i].id + '&type=' + data[i].remoteclinicType + '&state=' + data[i].state + '"' : '"/mtcStatis/pages/outpatient/viewOutpatientExamine.html?id=' + data[i].id + '&type=' + data[i].remoteclinicType + '&state=' + data[i].state + '"'
					examineHtml += '>查看</a></td></tr>'
				}
				$('.examine-box tbody').html(examineHtml)
				getOutpatientPage(outpatientExamineData)
			} else {
				$('.examine-box tbody').html('')
				$('.examine-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取诊查分页列表数据
function getOutpatientPage (data) {
	$('.examine-box .page').paging({
		pageNo: examinePageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			examinePageNum = num
			Page.currentPage = num
			examinePostData.page = Page
			getExamineList()
		}
	})
	$('.examine-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	examinePostData.page = Page
	examinePostData.remoteclinicType = remoteclinicType
	getExamineList()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询诊查数据
		examinePostData.remoteclinicNo = $('.outpatient-id input').val()? $('.outpatient-id input').val(): undefined
		examinePostData.reqHospitalName = $('.from-organization select').val()? $('.from-organization select').val(): undefined
		examinePostData.patientName = $('.patient-name input').val()? $('.patient-name input').val(): undefined
		examinePostData.state = $('.outpatient-state select').val()? $('.outpatient-state select').val(): undefined
		examinePostData.createTime = $('.start-date input').val()? new Date($('.start-date input').val() + ' 00:00:00').getTime(): undefined
		examinePostData.applyDate = $('.end-date input').val()? new Date($('.end-date input').val() + ' 23:59:59').getTime(): undefined
		examinePageNum = 1
		Page.currentPage = 1
		examinePostData.page = Page
		getExamineList()
	})
})