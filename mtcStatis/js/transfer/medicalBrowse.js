var medicalPostData = {}
var medicalPageNum = 1
// 获取病例数据
function getMedicalList () {
	$.ajax({
		url: baseurl + 'transfer/getExtraList',
		type: 'post',
		data: JSON.stringify(medicalPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (medicalData) {
			var data = medicalData.rows
			if (data.length) {
				var medicalHtml
				for (var i = 0; i < data.length; i++) {
					medicalHtml += '<tr><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghPatientInfo.sexName + '</td><td>' + getDate(data[i].ghPatientInfo.birthday) + '</td><td>' + data[i].ghPatientInfo.mobile + '</td><td>' + data[i].ghTransferInfo.applyHospitalName + '</td><td>' + data[i].ghTransferInfo.reqDoctorName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td>'
					switch (data[i].ghTransferInfo.state) {
						case -10: 
							medicalHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							medicalHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							medicalHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11:
						case 21: 
							medicalHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							medicalHtml += '<span class="button button-blue">待接诊</span>' 
							break;
						case 30: 
							medicalHtml += '<span class="button button-green">已接诊</span>' 
							break;
						case 40: 
							medicalHtml += '<span class="button button-green">已到诊</span>' 
							break;
						case 50: 
							medicalHtml += '<span class="button button-green">已回转</span>' 
							break;
						case 60: 
							medicalHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					medicalHtml += '</td><td><a class="look" href="/mtcStatis/pages/transfer/viewTransfer.html?id=' + data[i].ghTransferInfo.id + '&ind=17">查看</a></td></tr>'
				}
				$('.medical-box tbody').html(medicalHtml)
				getMedicalPage(medicalData)
			} else {
				$('.medical-box tbody').html('')
				$('.medical-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取病例分页数据
function getMedicalPage (data) {
	$('.medical-box .page').paging({
		pageNo: medicalPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			medicalPageNum = num
			Page.currentPage = num
			medicalPostData.page = Page
			getMedicalList()
		}
	})
	$('.medical-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	medicalPostData.page = Page
	getMedicalList()
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询病例数据
		medicalPostData.transferNo = $('.search-box .apply-id input').val()? $('.search-box .apply-id input').val(): undefined
		medicalPostData.patientName = $('.search-box .patient-name input').val()? $('.search-box .patient-name input').val(): undefined
		medicalPostData.applyHospitalName = $('.search-box .reception-hospital input').val()? $('.search-box .reception-hospital input').val(): undefined
		medicalPostData.reqDoctorName = $('.search-box .apply-doctor input').val()? $('.search-box .apply-doctor input').val(): undefined
		medicalPostData.startDate = $('.search-box .start-date input').val()? $('.search-box .start-date input').val(): undefined
		medicalPostData.endDate = $('.search-box .end-date input').val()? $('.search-box .end-date input').val(): undefined
		medicalPageNum = 1
		Page.currentPage = 1
		medicalPostData.page = Page
		getMedicalList()
	})
})