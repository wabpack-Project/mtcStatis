var backlogPostData = {}
var backlogPageNum = 1
var myCheckPostData = {}
var myCheckPageNum = 1
var backlogGhConsultationInfo = {}
var myCheckGhConsultationInfo = {}
// 获取待办事项数据
function getBacklog () {
	$.ajax({
		url: baseurl + 'consultation/selectVagueConsultationApply',
		type: 'post',
		data: JSON.stringify(backlogPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (applyCheckBacklog) {
			var data = applyCheckBacklog.rows
			if (data.length) {
				var backlogHtml = ''
				for (var i = 0; i < data.length; i++) {
					backlogHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case '0': 
							backlogHtml += '临床' 
							break;
						case '1': 
							backlogHtml += '影像' 
							break;
					}
					backlogHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + data[i].reqDoctorName + '</td><td>' + getDate(data[i].createTime) + '</td><td>'
					backlogHtml += data[i].reqDiagnoseTime ? data[i].reqDiagnoseTime : ''
					backlogHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewApply.html?no=' + data[i].consultationNo + '&review=1&ind=4">查看</a></td></tr>'
				}
				$('.backlog-box tbody').html(backlogHtml)
				getBacklogPage(applyCheckBacklog)
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
	$.ajax({
		url: baseurl + 'consultation/selectVagueConsultationApply',
		type: 'post',
		data: JSON.stringify(myCheckPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (myCheckData) {
			var data = myCheckData.rows
			if (data.length) {
				var myCheckHtml = ''
				for (var i = 0; i < data.length; i++) {
					myCheckHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case '0': 
							myCheckHtml += '临床' 
							break;
						case '1': 
							myCheckHtml += '影像' 
							break;
					}
					myCheckHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + data[i].reqDoctorName + '</td><td>' + getDate(data[i].createTime) + '</td><td>'
					myCheckHtml += data[i].reqDiagnoseTime ? data[i].reqDiagnoseTime : ''
					myCheckHtml += '</td><td>'
					switch (data[i].state) {
						case -10: 
							myCheckHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							myCheckHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							myCheckHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11: 
							myCheckHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							myCheckHtml += '<span class="button button-blue">待分诊</span>' 
							break;
						case 30: 
							myCheckHtml += '<span class="button button-blue">待会诊</span>' 
							break;
						case 40: 
							myCheckHtml += '<span class="button button-blue">会诊中</span>' 
							break;
						case 50: 
							myCheckHtml += '<span class="button button-blue">报告中</span>' 
							break;
						case 60: 
							myCheckHtml += '<span class="button button-green">待下载</span>' 
							break;
						case 70: 
							myCheckHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					myCheckHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewApply.html?no=' + data[i].consultationNo + '&review=1&ind=4">查看</a></td></tr>'
				}
				$('.mycheck-box tbody').html(myCheckHtml)
				getMyCheckPage(myCheckData)
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
// 获取我的申请分页数据
function getMyCheckPage (data) {
	$('.mycheck-box .page').paging({
		pageNo: myCheckPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myCheckPageNum = num
			Page.currentPage = num
			backlogPostData.page = Page
			getMyCheck()
		}
	})
	$('.mycheck-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	backlogPostData.page = Page
	backlogGhConsultationInfo.state = 10
	backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
	getBacklog()
	myCheckPostData.page = Page
	myCheckPostData.ghConsultationInfo = myCheckGhConsultationInfo
	getMyCheck()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询待办事项数据
		backlogGhConsultationInfo.consultationNo = $('.tab1 .apply-id input').val()? $('.tab1 .apply-id input').val(): undefined
		backlogGhConsultationInfo.bizType = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		backlogGhConsultationInfo.reqHospitalName = $('.tab1 .apply-hospital input').val()? $('.tab1 .apply-hospital input').val(): undefined
		backlogGhConsultationInfo.reqDoctorName = $('.tab1 .apply-doctor input').val()? $('.tab1 .apply-doctor input').val(): undefined
		backlogGhConsultationInfo.reqTime = $('.tab1 .apply-start-date input').val()? new Date($('.tab1 .apply-start-date input').val() + ' 00:00:00').getTime(): undefined
		backlogGhConsultationInfo.createTime = $('.tab1 .apply-end-date input').val()? new Date($('.tab1 .apply-end-date input').val() + ' 23:59:59').getTime(): undefined
		backlogGhConsultationInfo.reqStartDate = $('.tab1 .wish-start-date input').val()? new Date($('.tab1 .wish-start-date input').val() + ' 00:00:00').getTime(): undefined
		backlogGhConsultationInfo.reqEndDate = $('.tab1 .wish-end-date input').val()? new Date($('.tab1 .wish-end-date input').val() + ' 23:59:59').getTime(): undefined
		backlogGhConsultationInfo.consultationType = $('.tab1 .consul-type select').val() != -100? $('.tab1 .consul-type select').val(): undefined
		backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
		backlogPageNum = 1
		Page.currentPage = 1
		backlogPostData.page = Page
		getBacklog()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询我的审核数据
		myCheckGhConsultationInfo.consultationNo = $('.tab2 .apply-id input').val()? $('.tab2 .apply-id input').val(): undefined
		myCheckGhConsultationInfo.bizType = $('.tab2 .patient-name input').val()? $('.tab2 .patient-name input').val(): undefined
		myCheckGhConsultationInfo.reqHospitalName = $('.tab2 .apply-hospital input').val()? $('.tab2 .apply-hospital input').val(): undefined
		myCheckGhConsultationInfo.reqDoctorName = $('.tab2 .apply-doctor input').val()? $('.tab2 .apply-doctor input').val(): undefined
		myCheckGhConsultationInfo.consultationType = $('.tab2 .consul-type select').val() != -100? $('.tab2 .consul-type select').val(): undefined
		myCheckGhConsultationInfo.state = $('.tab2 .consul-state select').val() != -100? $('.tab2 .consul-state select').val(): undefined
		myCheckGhConsultationInfo.reqTime = $('.tab2 .start-date input').val()? new Date($('.tab2 .start-date input').val() + ' 00:00:00').getTime(): undefined
		myCheckGhConsultationInfo.createTime = $('.tab2 .end-date input').val()? new Date($('.tab2 .end-date input').val() + ' 23:59:59').getTime(): undefined
		myCheckPostData.ghConsultationInfo = myCheckGhConsultationInfo
		myCheckPageNum = 1
		Page.currentPage = 1
		myCheckPostData.page = Page
		getMyCheck()
	})
})