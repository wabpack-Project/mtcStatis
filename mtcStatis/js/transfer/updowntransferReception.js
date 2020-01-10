var searchArr = location.search.split(/[?=&]/)
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var backlogPostData = {}
var backlogPageNum = 1
var verifyPostData = {}
var verifyPageNum = 1
var myReceptionPostData = {}
var myReceptionPageNum = 1
// 获取接诊办理数据
function getDownreception () {
	var dataurl = parentInd == '16'? 'transfer/getUpTransferAppHosAuditedListPage': 'transfer/getDownTransferAppHosAuditedListPage'
	$.ajax({
		url: baseurl + dataurl,
		type: 'post',
		data: JSON.stringify(backlogPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (backlogData) {
			var data = backlogData.rows
			if (data.length) {
				var receptionHtml = ''
				for (var i = 0; i < data.length; i++) {
					receptionHtml += '<tr><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghPatientInfo.sexName + '</td><td>' + data[i].ghPatientInfo.mobile + '</td><td>' + data[i].ghTransferInfo.reqHospitalName + '</td><td>' + data[i].ghTransferInfo.reqDoctorName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td>'
					switch (data[i].ghTransferInfo.state) {
						case -10:
							receptionHtml += '<span class="button button-orange">撤销</span>'
							break;
						case 0:
							receptionHtml += '<span class="button button-orange">暂存</span>'
							break;
						case 11:
						case 21:
							receptionHtml += '<span class="button button-orange">已拒绝</span>'
							break;
						case 20:
							receptionHtml += '<span class="button button-blue">待接诊</span>'
							break;
						case 30:
							receptionHtml += '<span class="button button-green">已接诊</span>'
							break;
					}
					receptionHtml += '</td><td><a class="look">查看</a></td></tr>'
				}
				$('.reception-box tbody').html(receptionHtml)
				getBacklogPage(backlogData)
			} else {
				$('.reception-box tbody').html('')
				$('.reception-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(er)
		}
	})
}
// 获取接诊办理分页数据
function getBacklogPage (data) {
	$('.reception-box .page').paging({
		pageNo: backlogPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			backlogPageNum = num
			Page.currentPage = num
			backlogPostData.page = Page
			getDownreception()
		}
	})
	$('.reception-box .page').parent().show()
}
// 获取到诊确认数据
function getVerifyDownreception () {
	var dataurl = parentInd == '16'? 'transfer/getUpTransferReceiveConfirmListPage': 'transfer/getDownTransferReceiveConfirmListPage'
	$.ajax({
		url: baseurl + dataurl,
		type: 'post',
		data: JSON.stringify(verifyPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (verifyData) {
			var data = verifyData.rows
			if (data.length) {
				var verifyHtml = ''
				for (var j = 0; j < data.length; j++) {
					verifyHtml += '<tr><td>' + data[j].ghTransferInfo.transferNo + '</td><td>' + data[j].ghPatientInfo.patientName + '</td><td>' + data[j].ghTransferInfo.reqHospitalName + '</td><td>' + data[j].ghTransferInfo.reqDoctorName + '</td><td>' + data[j].ghTransferInfo.createTime + '</td><td>' + data[j].ghTransferInfo.applyDoctorName + '</td><td>' + data[j].ghTransferInfo.applyDepartmentName + '</td><td>'
					switch (data[j].ghTransferInfo.state) {
						case -10:
							verifyHtml += '<span class="button button-orange">撤销</span>'
							break;
						case 0:
							verifyHtml += '<span class="button button-orange">暂存</span>'
							break;
						case 11:
						case 21:
							verifyHtml += '<span class="button button-orange">已拒绝</span>'
							break;
						case 20:
							verifyHtml += '<span class="button button-blue">待接诊</span>'
							break;
						case 30:
							verifyHtml += '<span class="button button-green">已接诊</span>'
							break;
					}
					verifyHtml += '</td><td><a class="look" data-id=' + data[j].ghTransferInfo.id + '>到诊</a></td></tr>'
				}
				$('.verify-box tbody').html(verifyHtml)
				getVerifyPage(verifyData)
			} else {
				$('.verify-box tbody').html('')
				$('.verify-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取接诊办理分页数据
function getVerifyPage (data) {
	$('.verify-box .page').paging({
		pageNo: verifyPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			verifyPageNum = num
			Page.currentPage = num
			verifyPostData.page = Page
			getDownreception()
		}
	})
	$('.verify-box .page').parent().show()
}
// 获取到诊确认数据
function getMyDownreception () {
	var dataurl = parentInd == '16'? 'transfer/getMyUpTransferReceiveListPage': 'transfer/getMyDownTransferReceiveListPage'
	$.ajax({
		url: baseurl + dataurl,
		type: 'post',
		data: JSON.stringify(myReceptionPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (myReceptionData) {
			var data = myReceptionData.rows
			if (data.length) {
				var myHtml = ''
				for (var k = 0; k < data.length; k++) {
					myHtml += '<tr><td>' + data[k].ghTransferInfo.transferNo + '</td><td>' + data[k].ghPatientInfo.patientName + '</td><td>' + data[k].ghTransferInfo.reqHospitalName + '</td><td>' + data[k].ghTransferInfo.reqDoctorName + '</td><td>' + data[k].ghTransferInfo.createTime + '</td><td>' + data[k].ghTransferInfo.applyDoctorName + '</td><td>' + data[k].ghTransferInfo.applyDepartmentName + '</td><td>'
					switch (data[k].ghTransferInfo.state) {
						case -10:
							myHtml += '<span class="button button-orange">撤销</span>'
							break;
						case 0:
							myHtml += '<span class="button button-orange">暂存</span>'
							break;
						case 10:
							myHtml += '<span class="button button-orange">待审核</span>'
							break;
						case 11:
						case 21:
							myHtml += '<span class="button button-orange">已拒绝</span>'
							break;
						case 20:
							myHtml += '<span class="button button-blue">待接诊</span>'
							break;
						case 30:
							myHtml += '<span class="button button-green">已接诊</span>'
							break;
						case 40:
							myHtml += '<span class="button button-green">已到诊</span>'
							break;
						case 50:
							myHtml += '<span class="button button-green">已回转</span>'
							break;
						case 60:
							myHtml += '<span class="button button-green">已完成</span>'
							break;
					}
					myHtml += '</td><td><a class="look" href="/mtcStatis/pages/transfer/viewTransfer.html?id=' + data[k].ghTransferInfo.id + '&ind=' + parentInd + '">查看</a></td></tr>'
				}
				$('.myreception-box tbody').html(myHtml)
				getMyReceptionPage(myReceptionData)
			} else {
				$('.myreception-box tbody').html('')
				$('.myreception-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取接诊办理分页数据
function getMyReceptionPage (data) {
	$('.myreception-box .page').paging({
		pageNo: myReceptionPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myReceptionPageNum = num
			Page.currentPage = num
			myReceptionPostData.page = Page
			getMyDownreception()
		}
	})
	$('.myreception-box .page').parent().show()
}
$(function () {
	$('.breadcrumb span[data-ind="' + parentInd + '"]').show()
	Page.showCount = 10
	Page.currentPage = 1
	backlogPostData.page = Page
	getDownreception()
	verifyPostData.page = Page
	getVerifyDownreception()
	myReceptionPostData.page = Page
	getMyDownreception()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询接诊办理数据
		backlogPostData.transferNo = $('.tab1 .apply-id input').val()? $('.tab1 .apply-id input').val(): undefined
		backlogPostData.patientName = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		backlogPostData.reqHospitalName = $('.tab1 .apply-hospital input').val()? $('.tab1 .apply-hospital input').val(): undefined
		backlogPostData.reqDoctorName = $('.tab1 .apply-doctor input').val()? $('.tab1 .apply-doctor input').val(): undefined
		backlogPostData.startDate = $('.tab1 .start-date input').val()? $('.tab1 .start-date input').val(): undefined
		backlogPostData.endDate = $('.tab1 .end-date input').val()? $('.tab1 .end-date input').val(): undefined
		backlogPageNum = 1
		Page.currentPage = 1
		backlogPostData.page = Page
		getDownreception()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询确认到诊数据
		verifyPostData.transferNo = $('.tab2 .apply-id input').val()? $('.tab2 .apply-id input').val(): undefined
		verifyPostData.patientName = $('.tab2 .patient-name input').val()? $('.tab2 .patient-name input').val(): undefined
		verifyPostData.reqHospitalName = $('.tab2 .apply-hospital input').val()? $('.tab2 .apply-hospital input').val(): undefined
		verifyPostData.reqDoctorName = $('.tab2 .apply-doctor input').val()? $('.tab2 .apply-doctor input').val(): undefined
		verifyPostData.startDate = $('.tab2 .start-date input').val()? $('.tab2 .start-date input').val(): undefined
		verifyPostData.endDate = $('.tab2 .end-date input').val()? $('.tab2 .end-date input').val(): undefined
		verifyPageNum = 1
		Page.currentPage = 1
		verifyPostData.page = Page
		getVerifyDownreception()
	}).on('click', '.tab3 .tab3-search', function () {
		// 根据搜索条件查询我的接诊数据
		myReceptionPostData.transferNo = $('.tab3 .apply-id input').val()? $('.tab3 .apply-id input').val(): undefined
		myReceptionPostData.patientName = $('.tab3 .patient-name input').val()? $('.tab3 .patient-name input').val(): undefined
		myReceptionPostData.reqHospitalName = $('.tab3 .apply-hospital input').val()? $('.tab3 .apply-hospital input').val(): undefined
		myReceptionPostData.reqDoctorName = $('.tab3 .apply-doctor input').val()? $('.tab3 .apply-doctor input').val(): undefined
		myReceptionPostData.startDate = $('.tab3 .start-date input').val()? $('.tab3 .start-date input').val(): undefined
		myReceptionPostData.endDate = $('.tab3 .end-date input').val()? $('.tab3 .end-date input').val(): undefined
		myReceptionPageNum = 1
		Page.currentPage = 1
		myReceptionPostData.page = Page
		getMyDownreception()
	})
})