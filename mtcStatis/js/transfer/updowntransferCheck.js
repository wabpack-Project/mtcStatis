var searchArr = location.search.split(/[?=&]/)
// var type = searchArr.indexOf('?type') != -1? searchArr[searchArr.indexOf('?type') + 1]: searchArr[searchArr.indexOf('type') + 1]
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var backlogPostData = {}
var backlogPageNum = 1
var myCheckPostData = {}
var myCheckPageNum = 1
// 获取待办事项数据
function getBacklog () {
	var dataurl = parentInd == '12'? 'transfer/getUpTransferSubAppListPage': 'transfer/getDownTransferSubAppListPage'
	$.ajax({
		url: baseurl + dataurl,
		type: 'post',
		data: JSON.stringify(backlogPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (transferData) {
			var data = transferData.rows
			if (data.length) {
				var backlogHtml = ''
				for (var i = 0; i < data.length; i++) {
					backlogHtml += '<tr><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghPatientInfo.sexName + '</td><td>' + getDate(data[i].ghPatientInfo.birthday) + '</td><td>'
					backlogHtml += data[i].ghPatientInfo.mobile ? data[i].ghPatientInfo.mobile : ''
					backlogHtml += '</td><td>' + data[i].ghTransferInfo.applyHospitalName + '</td><td>' + data[i].ghTransferInfo.reqDoctorName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td>'
					switch (data[i].ghTransferInfo.state) {
						case -10: 
							backlogHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							backlogHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							backlogHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11:
						case 21: 
							backlogHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							backlogHtml += '<span class="button button-blue">待接诊</span>' 
							break;
						case 30: 
							backlogHtml += '<span class="button button-green">已接诊</span>' 
							break;
						case 40: 
							backlogHtml += '<span class="button button-green">已到诊</span>' 
							break;
						case 50: 
							backlogHtml += '<span class="button button-green">已回转</span>' 
							break;
						case 60: 
							backlogHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					backlogHtml += '</td><td><a class="look" href="/mtcStatis/pages/transfer/viewTransferCheck.html?id=' + data[i].ghPatientInfo.id + '&ind=' + parentInd + '">查看</a></td></tr>'
				}
				$('.backlog-box tbody').html(backlogHtml)
				getBacklogPage(transferData)
			} else {
				$('.backlog-box tbody').html('')
				$('.backlog-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取待办事项分页数据
function getBacklogPage (data) {
	$('.backlog-box .page').paging({
		pageNo: backlogPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			backlogPageNum = num
			Page.currentPage = num
			backlogPostData.page = Page
			getBacklog()
		}
	})
	$('.backlog-box .page').parent().show()
}
// 获取我的审核数据
function getMyCheck () {
	var dataurl = parentInd == '12'? 'transfer/getMyUpTransferExamPage': 'transfer/getMyDownTransferExamPage'
	$.ajax({
		url: baseurl + dataurl,
		type: 'post',
		data: JSON.stringify(myCheckPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (mycheckData) {
			var data = mycheckData.rows
			if (data.length) {
				var mycheckHtml = ''
				for (var i = 0; i < data.length; i++) {
					mycheckHtml += '<tr><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghPatientInfo.sexName + '</td><td>' + getDate(data[i].ghPatientInfo.birthday) + '</td><td>'
					mycheckHtml += data[i].ghPatientInfo.mobile ? data[i].ghPatientInfo.mobile : ''
					mycheckHtml += '</td><td>' + data[i].ghTransferInfo.applyHospitalName + '</td><td>' + data[i].ghTransferInfo.reqDoctorName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td>'
					switch (data[i].ghTransferInfo.state) {
						case -10: 
							mycheckHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							mycheckHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							mycheckHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11:
						case 21: 
							mycheckHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							mycheckHtml += '<span class="button button-blue">待接诊</span>' 
							break;
						case 30: 
							mycheckHtml += '<span class="button button-green">已接诊</span>' 
							break;
						case 40: 
							mycheckHtml += '<span class="button button-green">已到诊</span>' 
							break;
						case 50: 
							mycheckHtml += '<span class="button button-green">已回转</span>' 
							break;
						case 60: 
							mycheckHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					mycheckHtml += '</td><td><a class="look" href="/mtcStatis/pages/transfer/viewTransfer.html?id=' + data[i].ghTransferInfo.id + '&ind=' + parentInd + '">查看</a></td></tr>'
				}
				$('.mycheck-box tbody').html(mycheckHtml)
				getMyCheckPage(mycheckData)
			} else {
				$('.mycheck-box tbody').html('')
				$('.mycheck-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取待办事项分页数据
function getMyCheckPage (data) {
	$('.mycheck-box .page').paging({
		pageNo: myCheckPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myCheckPageNum = num
			Page.currentPage = num
			myCheckPostData.page = Page
			getMyCheck()
		}
	})
	$('.mycheck-box .page').parent().show()
}
$(function () {
	$('.breadcrumb span[data-ind="' + parentInd + '"]').show()
	Page.showCount = 10
	Page.currentPage = 1
	backlogPostData.page = Page
	getBacklog()
	myCheckPostData.page = Page
	getMyCheck()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询待办事项数据
		backlogPostData.transferNo = $('.tab1 .apply-id input').val()? $('.tab1 .apply-id input').val(): undefined
		backlogPostData.patientName = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		backlogPostData.applyHospitalName = $('.tab1 .reception-hospital input').val()? $('.tab1 .reception-hospital input').val(): undefined
		backlogPostData.reqDoctorName = $('.tab1 .apply-doctor input').val()? $('.tab1 .apply-doctor input').val(): undefined
		backlogPostData.startDate = $('.tab1 .start-date input').val()? $('.tab1 .start-date input').val(): undefined
		backlogPostData.endDate = $('.tab1 .end-date input').val()? $('.tab1 .end-date input').val(): undefined
		backlogPageNum = 1
		Page.currentPage = 1
		backlogPostData.page = Page
		getBacklog()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询我的审核数据
		myCheckPostData.transferNo = $('.tab2 .apply-id input').val()? $('.tab2 .apply-id input').val(): undefined
		myCheckPostData.patientName = $('.tab2 .patient-name input').val()? $('.tab2 .patient-name input').val(): undefined
		myCheckPostData.applyHospitalName = $('.tab2 .reception-hospital input').val()? $('.tab2 .reception-hospital input').val(): undefined
		myCheckPostData.reqDoctorName = $('.tab2 .apply-doctor input').val()? $('.tab2 .apply-doctor input').val(): undefined
		myCheckPostData.startDate = $('.tab2 .start-date input').val()? $('.tab2 .start-date input').val(): undefined
		myCheckPostData.endDate = $('.tab2 .end-date input').val()? $('.tab2 .end-date input').val(): undefined
		myCheckPageNum = 1
		Page.currentPage = 1
		myCheckPostData.page = Page
		getMyCheck()
	})
})