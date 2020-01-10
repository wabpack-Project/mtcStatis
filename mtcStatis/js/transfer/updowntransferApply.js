var searchArr = location.search.split(/[?=&]/)
// var type = searchArr.indexOf('?type') != -1? searchArr[searchArr.indexOf('?type') + 1]: searchArr[searchArr.indexOf('type') + 1]
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var transferPostData = {}
var transferPageNum = 1
var transferGhConsultationInfo = {}
var tranferType = parentInd == "11" ? 0 : 1
// 获取上转申请数据
function getTransfer () {
	var dataurl = parentInd == "11" ?'transfer/getMyUpTransferSubAppListPage': 'transfer/getMyDownTransferSubAppListPage'
	$.ajax({
		url: baseurl + dataurl,
		type: 'post',
		data: JSON.stringify(transferPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (transferData) {
			var data = transferData.rows
			if (data.length) {
				var transferHtml = ''
				for (var i = 0; i < data.length; i++) {
					transferHtml += '<tr><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghPatientInfo.sexName + '</td><td>' + getDate(data[i].ghPatientInfo.birthday) + '</td><td>'
					transferHtml += data[i].ghPatientInfo.mobile ? data[i].ghPatientInfo.mobile : ''
					transferHtml += '</td><td>' + data[i].ghTransferInfo.applyHospitalName + '</td><td>' + data[i].ghTransferInfo.reqDoctorName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td>'
					switch (data[i].ghTransferInfo.state) {
						case -10: 
							transferHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							transferHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							transferHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11:
						case 21: 
							transferHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							transferHtml += '<span class="button button-blue">待接诊</span>' 
							break;
						case 30: 
							transferHtml += '<span class="button button-green">已接诊</span>' 
							break;
						case 40: 
							transferHtml += '<span class="button button-green">已到诊</span>' 
							break;
						case 50: 
							transferHtml += '<span class="button button-green">已回转</span>' 
							break;
						case 60: 
							transferHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					transferHtml += '</td><td><a class="look" href="/mtcStatis/pages/transfer/viewTransfer.html?id=' + data[i].ghTransferInfo.id + '&ind=' + parentInd + '">查看</a>'
					switch (data[i].ghTransferInfo.state) {
						case 10:
							transferHtml += '<a class="revocation withdraw" data-id=' + data[i].ghTransferInfo.id + '>撤回</a>'
							break;
						case -10:
						case 0:
						case 11:
						case 21:
							transferHtml += '<a class="modify" href="/mtcStatis/pages/transfer/transferApply.html?id=' + data[i].ghTransferInfo.id + '&edit=1&ind=' + parentInd + '">修改</a>'
					}
					transferHtml += '</td></tr>'
				}
				$('.transfer-box tbody').html(transferHtml)
				getTransferPage(transferData)
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
// 获取上转申请分页数据
function getTransferPage (data) {
	$('.transfer-box .page').paging({
		pageNo: transferPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			transferPageNum = num
			Page.currentPage = num
			transferPostData.page = Page
			getTransfer()
		}
	})
	$('.transfer-box .page').parent().show()
}
$(function () {
	$('.breadcrumb span[data-ind="' + parentInd + '"]').show()
	// 修改“转诊申请”按钮跳转链接 标记转诊方式 方便在“转诊申请”页面标记对应导航按钮
	$('.top-button a').attr('href', $('.top-button a').attr('href') + '?ind=' + parentInd)
	Page.showCount = 10
	Page.currentPage = 1
	transferPostData.page = Page
	getTransfer()
	$('body').on('click', '.search-box .search', function (){
		// 根据搜索条件查询上转申请数据
		transferPostData.transferNo = $('.tab_content .apply-id input').val() ? $('.tab_content .apply-id input').val(): undefined
		transferPostData.patientName = $('.tab_content .patient-name input').val() ? $('.tab_content .patient-name input').val(): undefined
		transferPostData.applyHospitalName = $('.tab_content .reception-hospital input').val() != -100 ? $('.tab_content .reception-hospital input').val(): undefined
		transferPostData.reqDoctorName = $('.tab_content .apply-doctor input').val() != -100 ? $('.tab_content .apply-doctor input').val(): undefined
		transferPostData.state = $('.tab_content .transfer-status select').val()
		transferPostData.reqTime = $('.tab_content .start-date input').val() ? new Date($('.tab_content .start-date input').val() + ' 00:00:00').getTime(): undefined
		transferPostData.createTime = $('.tab_content .end-date input').val() ? new Date($('.tab_content .end-date input').val() + ' 23:59:59').getTime(): undefined
		transferPageNum = 1
		Page.currentPage = 1
		transferPostData.page = Page
		getTransfer()
	}).on('click', '.transfer-box tbody tr .withdraw', function () {
		// 申请撤回
		if (confirm('确认撤回该条申请？')) {
			var id = $(this).attr('data-id')
			$.ajax({
				url: baseurl + 'transfer/withdrawTransferNew?id=' + id,
				type: 'get',
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