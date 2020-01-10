var processPostData = {}
var processPageNum = 1
// 获取流程列表数据
function getProcessData () {
	$.ajax({
		url: baseurl + 'transfer/getCloseList',
		type: 'post',
		data: JSON.stringify(processPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (processList) {
			var data = processList.rows
			if (data.length) {
				var processHtml = ''
				for (var i = 0; i < data.length; i++) {
					processHtml += '<tr><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghPatientInfo.sexName + '</td><td>' + getDate(data[i].ghPatientInfo.birthday) + '</td><td>'
					processHtml += data[i].ghPatientInfo.mobile ? data[i].ghPatientInfo.mobile : ''
					processHtml += '</td><td>' + data[i].ghTransferInfo.applyHospitalName + '</td><td>' + data[i].ghTransferInfo.reqDoctorName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td>'
					switch (data[i].ghTransferInfo.state) {
						case -10: 
							processHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							processHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							processHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11:
						case 21: 
							processHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							processHtml += '<span class="button button-blue">待接诊</span>' 
							break;
						case 30: 
							processHtml += '<span class="button button-green">已接诊</span>' 
							break;
						case 40: 
							processHtml += '<span class="button button-green">已到诊</span>' 
							break;
						case 50: 
							processHtml += '<span class="button button-green">已回转</span>' 
							break;
						case 60: 
							processHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					processHtml += '</td><td>'
					if (data[i].ghTransferInfo.state != 60) {
						processHtml += '<a class="modify closeProcess" data-id=' + data[i].ghTransferInfo.id + '>关闭</a>'
					}
					processHtml += '</td></tr>'
				}
				$('.process-box tbody').html(processHtml)
				getProcessPage(processList)
			} else {
				$('.process-box tbody').html('')
				$('.process-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取流程分页数据
function getProcessPage (data) {
	$('.process-box .page').paging({
		pageNo: processPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			processPageNum = num
			Page.currentPage = num
			processPostData.page = Page
			getProcessData()
		}
	})
	$('.process-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	processPostData.page = Page
	getProcessData()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询流程数据
		processPostData.transferNo = $('.search-box .apply-id input').val()? $('.search-box .apply-id input').val(): undefined
		processPostData.patientName = $('.search-box .patient-name input').val()? $('.search-box .patient-name input').val(): undefined
		processPostData.applyHospitalName = $('.search-box .reception-hospital input').val()? $('.search-box .reception-hospital input').val(): undefined
		processPostData.reqDoctorName = $('.search-box .apply-doctor input').val()? $('.search-box .apply-doctor input').val(): undefined
		processPostData.startDate = $('.search-box .start-date input').val()? $('.search-box .start-date input').val(): undefined
		processPostData.endDate = $('.search-box .end-date input').val()? $('.search-box .end-date input').val(): undefined
		processPageNum = 1
		Page.currentPage = 1
		processPostData.page = Page
		getProcessData()
	}).on('click', '.process-box tbody tr .closeProcess', function () {
		// 关闭流程
		if (confirm('确认关闭此转诊吗?')) {
			var id = $(this).attr('data-id')
			$.ajax({
				url: baseurl + 'transfer/closeTransferAndFlow?transferId=' + id,
				type:'get',
				success: function (msg) {
					location.reload()
				},
				error: function (err) {
					console.log(err)
				}
			})
		}
	})
})