var simplePostData = {}
var simplePageNum = 1
function getSimpleScheduling () {
	$.ajax({
		url: baseurl + 'remoteclinic/selectClinicArranageListPage',
		type: 'post',
		data: JSON.stringify(simplePostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (simpleSchedulingData) {
			var data = simpleSchedulingData.rows
			if (data.length) {
				var schedulingHtml = ''
				for (var i = 0; i < data.length; i++) {
					schedulingHtml += '<tr><td>' + (i + 1) + '</td><td>' + getDate(data[i].arranageDate) + '</td><td>' + data[i].week + '</td><td>' + data[i].dateType + '</td><td>' + data[i].totalNum + '</td><td>' + data[i].doctorName + '</td><td>' + data[i].charge + '</td><td><a class='
					schedulingHtml += data[i].curNum == 0? '"modify"': '"gray" disabled'
					schedulingHtml +='>修改</a><a class='
					schedulingHtml += data[i].curNum == 0? '"revocation"': '"gray" disabled'
					schedulingHtml += '>删除</a></td></tr>'
				}
				$('.scheduling-box tbody').html(schedulingHtml)
				getSimplePage(simpleSchedulingData)
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
function getSimplePage (data) {
	$('.scheduling-box .page').paging({
		pageNo: simplePageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			simplePageNum = num
			Page.currentPage = num
			simplePostData.page = Page
			getBacklog()
		}
	})
	$('.scheduling-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	simplePostData.page = Page
	simplePostData.hospitalId = ghDoctor.eHospital.id
	simplePostData.arranageType = 0
	getSimpleScheduling()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询门诊数据
		simplePostData.doctorName = $('.outpatient-doctor select').val()? $('.outpatient-doctor select').val(): undefined
		simplePostData.startDate = $('.start-date input').val()? $('.start-date input').val(): undefined
		simplePostData.endDate = $('.end-date input').val()? $('.end-date input').val(): undefined
		simplePageNum = 1
		Page.currentPage = 1
		simplePostData.page = Page
		getSimpleScheduling()
	})
})