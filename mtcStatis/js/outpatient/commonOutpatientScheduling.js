var commonPostData = {}
var commonPageNum = 1
function getCommonScheduling () {
	$.ajax({
		url: baseurl + 'remoteclinic/selectClinicArranageListPage',
		type: 'post',
		data: JSON.stringify(commonPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (commonSchedulingData) {
			var data = commonSchedulingData.rows
			if (data.length) {
				var schedulingHtml = ''
				for (var i = 0; i < data.length; i++) {
					schedulingHtml += '<tr><td>' + (i + 1) + '</td><td>' + getDate(data[i].arranageDate) + '</td><td>' + data[i].week + '</td><td>' + data[i].dateType + '</td><td>' + data[i].totalNum + '</td><td>' + data[i].doctorName + '</td><td>' + data[i].roomName + '</td><td>' + data[i].charge +  '</td><td>' + data[i].departmentName + '</td><td><a class='
					schedulingHtml += data[i].curNum == 0? '"modify"': '"gray" disabled'
					schedulingHtml +='>修改</a><a class='
					schedulingHtml += data[i].curNum == 0? '"revocation"': '"gray" disabled'
					schedulingHtml += '>删除</a></td></tr>'
				}
				$('.scheduling-box tbody').html(schedulingHtml)
				getCommonPage(commonSchedulingData)
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
function getCommonPage (data) {
	$('.scheduling-box .page').paging({
		pageNo: commonPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			commonPageNum = num
			Page.currentPage = num
			commonPostData.page = Page
			getBacklog()
		}
	})
	$('.scheduling-box .page').parent().show()
}
// 获取科室列表
function getDepartmentList () {
	var departmentList = getGhDepartment(ghDoctor.eHospital.id)
	var departmentHtml = '<option value="">请选择</option>'
	for (var i = 0; i < departmentList.length; i++) {
		departmentHtml += '<option value=' + departmentList[i].id + '>' + departmentList[i].departmentName + '</option>'
	}
	$('.belong-department select').html(departmentHtml)
}
$(function () {
	getDepartmentList()
	Page.showCount = 10
	Page.currentPage = 1
	commonPostData.page = Page
	commonPostData.hospitalId = ghDoctor.eHospital.id
	commonPostData.arranageType = 1
	getCommonScheduling()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询排班信息
		commonPostData.doctorName = $('.outpatient-doctor select').val()? $('.outpatient-doctor select').val(): undefined
		commonPostData.departmentId = $('.belong-department select').val()? $('.belong-department select').val(): undefined
		commonPostData.startDate = $('.start-date input').val()? $('.start-date input').val(): undefined
		commonPostData.endDate = $('.end-date input').val()? $('.end-date input').val(): undefined
		commonPageNum = 1
		Page.currentPage = 1
		commonPostData.page = Page
		getCommonScheduling()
	})
})