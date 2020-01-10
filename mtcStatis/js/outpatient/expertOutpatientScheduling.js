var expertPostData = {}
var expertPageNum = 1
// 获取科室列表
function getDepartmentList () {
	var departmentList = getGhDepartment(ghDoctor.eHospital.id)
	var departmentHtml = '<option value="">请选择</option>'
	for (var i = 0; i < departmentList.length; i++) {
		departmentHtml += '<option value=' + departmentList[i].id + '>' + departmentList[i].departmentName + '</option>'
	}
	$('.belong-department select').html(departmentHtml)
}
function getExpertScheduling () {
	$.ajax({
		url: baseurl + 'remoteclinic/selectClinicArranageListPage',
		type: 'post',
		data: JSON.stringify(expertPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (expertSchedulingData) {
			var data = expertSchedulingData.rows
			if (data.length) {
				var schedulingHtml = ''
				for (var i = 0; i < data.length; i++) {
					schedulingHtml += '<tr><td>' + (i + 1) + '</td><td>' + getDate(data[i].arranageDate) + '</td><td>' + data[i].week + '</td><td>' + data[i].dateType + '</td><td>' + data[i].totalNum + '</td><td>' + data[i].doctorName + '</td><td>' + data[i].charge + '</td><td>' + data[i].departmentName + '</td><td>' + data[i].beginTime + '</td><td>' + data[i].endTime + '</td><td><a class='
					schedulingHtml += data[i].curNum == 0? '"modify"': '"gray" disabled'
					schedulingHtml +='>修改</a><a class='
					schedulingHtml += data[i].curNum == 0? '"revocation"': '"gray" disabled'
					schedulingHtml += '>删除</a></td></tr>'
				}
				$('.scheduling-box tbody').html(schedulingHtml)
				getExpertPage(expertSchedulingData)
			} else {
				$('.scheduling-box tbody').html('')
				$('.scheduling-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取门诊分页列表数据
function getExpertPage (data) {
	$('.scheduling-box .page').paging({
		pageNo: expertPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			expertPageNum = num
			Page.currentPage = num
			expertPostData.page = Page
			getExpertScheduling()
		}
	})
	$('.scheduling-box .page').parent().show()
}
$(function () {
	getDepartmentList()
	Page.currentPage = 1
	Page.showCount = 10
	expertPostData.page = Page
	expertPostData.hospitalId = ghDoctor.eHospital.id
	expertPostData.arranageType = 2
	getExpertScheduling()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询排班数据
		expertPostData.doctorName = $('.outpatient-doctor select').val()? $('.outpatient-doctor select').val(): undefined
		expertPostData.departmentId = $('.belong-department select').val()? $('.belong-department select').val(): undefined
		expertPostData.startDate = $('.start-date input').val()? $('.start-date input').val(): undefined
		expertPostData.endDate = $('.end-date input').val()? $('.end-date input').val(): undefined
		expertPageNum = 1
		Page.currentPage = 1
		expertPostData.page = Page
		getExpertScheduling()
	})
})