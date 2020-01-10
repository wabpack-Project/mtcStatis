var transferPostData = {}
var transferPageNum = 1
var transferGhConsultationInfo = {}
var myTransferPostData = {}
var myTransferPageNum = 1
var myTransferGhConsultationInfo = {}
// 获取待办事项数据
function getTransferData () {
	$.ajax({
		url: baseurl + 'consultationTriage/selectTransferTriageApply',
		type: 'post',
		data: JSON.stringify(transferPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (transferTriageData) {
			var data = transferTriageData.rows
			if (data.length) {
				var backlogHtml = ''
				for (var i = 0; i < data.length; i++) {
					backlogHtml += '<tr><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case '0': 
							backlogHtml += '临床' 
							break;
						case '1': 
							backlogHtml += '影像' 
							break;
					}
					backlogHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + getDate(data[i].createTime) + '</td><td>'
					backlogHtml += data[i].reqDiagnoseTime ? data[i].reqDiagnoseTime : ''
					backlogHtml += '</td><td>'
					switch (data[i].reqType) {
						case 0: 
							backlogHtml += '单方'
							break;
						case 1: 
							backlogHtml += 'MDT'
							break;
						case 2: 
							backlogHtml += '特需'
							break;
						case 3: 
							backlogHtml += '点名'
							break;
					}
					backlogHtml += '</td><td>'
					switch (data[i].isEmergency) {
						case 0: 
							backlogHtml += '平诊'
							break;
						case 1: 
							backlogHtml += '<span style="color: #f00;">急诊</span>'
							break;
					}
					backlogHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewTriage.html?no=' + data[i].consultationNo + '&ind=9">查看</a></td></tr>'
				}
				$('.backlog-box tbody').html(backlogHtml)
				getTransferPage(transferTriageData)
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
function getTransferPage (data) {
	$('.backlog-box .page').paging({
		pageNo: transferPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			transferPageNum = num
			Page.currentPage = num
			transferPostData.page = Page
			getTransferData()
		}
	})
	$('.backlog-box .page').parent().show()
}
// 获取我已转入数据
function getMyTransfer () {
	$.ajax({
		url: baseurl + 'consultationTriage/selectMyTransferTriage',
		type: 'post',
		data: JSON.stringify(transferPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (myTransferredData) {
			var data = myTransferredData.rows
			if (data.length) {
				var mytransferHtml = ''
				for (var i = 0; i < data.length; i++) {
					mytransferHtml += '<tr><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case '0': 
							mytransferHtml += '临床' 
							break;
						case '1': 
							mytransferHtml += '影像' 
							break;
					}
					mytransferHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].startTime + '</td><td>'
					switch (data[i].reqType) {
						case 0: 
							mytransferHtml += '单方'
							break;
						case 1: 
							mytransferHtml += 'MDT'
							break;
						case 2: 
							mytransferHtml += '特需'
							break;
						case 3: 
							mytransferHtml += '点名'
							break;
					}
					mytransferHtml += '</td><td>'
					switch (data[i].state) {
						case -10: 
							mytransferHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							mytransferHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							mytransferHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11: 
							mytransferHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							mytransferHtml += '<span class="button button-blue">待分诊</span>' 
							break;
						case 30: 
							mytransferHtml += '<span class="button button-blue">待会诊</span>' 
							break;
						case 40: 
							mytransferHtml += '<span class="button button-blue">会诊中</span>' 
							break;
						case 50: 
							mytransferHtml += '<span class="button button-blue">报告中</span>' 
							break;
						case 60: 
							mytransferHtml += '<span class="button button-green">待下载</span>' 
							break;
						case 70: 
							mytransferHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					mytransferHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewMyTriage.html?no=' + data[i].consultationNo + '&flag=2&ind=9">查看</a></td></tr>'
				}
				$('.mytransfer-box tbody').html(mytransferHtml)
				getMyTransferPage(myTransferredData)
			} else {
				$('.mytransfer-box tbody').html('')
				$('.mytransfer-box .noData').show().siblings('.list-pagination').hide()
			}
	},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取我已转入分页数据
function getMyTransferPage (data) {
	$('.mytransfer-box .page').paging({
		pageNo: myTransferPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myTransferPageNum = num
			Page.currentPage = num
			myTransferPostData.page = Page
			getMyTransfer()
		}
	})
	$('.mytransfer-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	transferPostData.page = Page
	transferGhConsultationInfo.state = 20
	transferPostData.ghConsultationInfo = transferGhConsultationInfo
	getTransferData()
	myTransferPostData.page = Page
	myTransferPostData.ghConsultationInfo = myTransferGhConsultationInfo
	getMyTransfer()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询待办事项数据
		transferGhConsultationInfo.bizType = $('.tab1 .patient-name input').val() ? $('.tab1 .patient-name input').val(): undefined
		transferGhConsultationInfo.reqHospitalName = $('.tab1 .apply-hospital input').val() ? $('.tab1 .apply-hospital input').val(): undefined
		transferGhConsultationInfo.consultationType = $('.tab1 .consul-type select').val() != -100 ? $('.tab1 .consul-type select').val(): undefined
		transferGhConsultationInfo.reqTime = $('.tab1 .start-date input').val() ? new Date($('.tab1 .start-date input').val() + ' 00:00:00').getTime(): undefined
		transferGhConsultationInfo.createTime = $('.tab1 .end-date input').val() ? new Date($('.tab1 .end-date input').val() + ' 23:59:59').getTime(): undefined
		transferPageNum = 1
		Page.currentPage = 1
		transferPostData.page = Page
		transferPostData.ghConsultationInfo = transferGhConsultationInfo
		getTransferData()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询我已转入数据
		myTransferGhConsultationInfo.bizType = $('.tab2 .patient-name input').val() ? $('.tab2 .patient-name input').val(): undefined
		myTransferGhConsultationInfo.reqHospitalName = $('.tab2 .apply-hospital input').val() ? $('.tab2 .apply-hospital input').val(): undefined
		myTransferGhConsultationInfo.consultationType = $('.tab2 .consul-type select').val() != -100 ? $('.tab2 .consul-type select').val(): undefined
		myTransferGhConsultationInfo.state = $('.tab2 .consul-state select').val() != -100 ? $('.tab2 .consul-state select').val(): undefined
		myTransferGhConsultationInfo.reqTime = $('.tab2 .start-date input').val() ? new Date($('.tab2 .start-date input').val() + ' 00:00:00').getTime(): undefined
		myTransferGhConsultationInfo.createTime = $('.tab2 .end-date input').val() ? new Date($('.tab2 .end-date input').val() + ' 23:59:59').getTime(): undefined
		myTransferPageNum = 1
		Page.currentPage = 1
		myTransferPostData.page = Page
		myTransferPostData.ghConsultationInfo = myTransferGhConsultationInfo
		getMyTransfer()
	})
})