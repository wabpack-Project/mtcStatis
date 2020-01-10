var backlogPostData = {}
var backlogPageNum = 1
var backlogGhConsultationInfo = {}
var myTriagePostData = {}
var myTriagePageNum = 1
var myTriageGhConsultationInfo = {}
// 获取待办事项数据
function getTriageBacklog () {
	$.ajax({
		url: baseurl + 'consultationTriage/selectVagueTriageApply',
		type: 'post',
		data: JSON.stringify(backlogPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (triageBacklogData) {
			var data = triageBacklogData.rows
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
					backlogHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewTriage.html?no=' + data[i].consultationNo + '&ind=5">查看</a></td></tr>'
				}
				$('.backlog-box tbody').html(backlogHtml)
				getBacklogPage(triageBacklogData)
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
			getTriageBacklog()
		}
	})
	$('.backlog-box .page').parent().show()
}
// 获取我的分诊数据
function getMyTriage () {
	$.ajax({
		url: baseurl + 'consultationTriage/selectMyConsultationTriage',
		type: 'post',
		data: JSON.stringify(myTriagePostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (myTriageData) {
			var data = myTriageData.rows
			if (data.length) {
				var mytriageHtml = ''
				for (var i = 0; i < data.length; i++) {
					mytriageHtml += '<tr><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case '0': 
							mytriageHtml += '临床' 
							break;
						case '1': 
							mytriageHtml += '影像' 
							break;
					}
					mytriageHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].startTime + '</td><td>'
					switch (data[i].reqType) {
						case 0: 
							mytriageHtml += '单方'
							break;
						case 1: 
							mytriageHtml += 'MDT'
							break;
						case 2: 
							mytriageHtml += '特需'
							break;
						case 3: 
							mytriageHtml += '点名'
							break;
					}
					mytriageHtml += '</td><td>'
					switch (data[i].state) {
						case -10: 
							mytriageHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							mytriageHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							mytriageHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11: 
							mytriageHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							mytriageHtml += '<span class="button button-blue">待分诊</span>' 
							break;
						case 30: 
							mytriageHtml += '<span class="button button-blue">待会诊</span>' 
							break;
						case 40: 
							mytriageHtml += '<span class="button button-blue">会诊中</span>' 
							break;
						case 50: 
							mytriageHtml += '<span class="button button-blue">报告中</span>' 
							break;
						case 60: 
							mytriageHtml += '<span class="button button-green">待下载</span>' 
							break;
						case 70: 
							mytriageHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					mytriageHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewMyTriage.html?no=' + data[i].consultationNo + '&flag=1&ind=5">查看</a></td></tr>'
				}
				$('.mytriage-box tbody').html(mytriageHtml)
				getMyTriagePage(myTriageData)
			} else {
				$('.mytriage-box tbody').html('')
				$('.mytriage-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取我的分诊分页数据
function getMyTriagePage (data) {
	$('.mytriage-box .page').paging({
		pageNo: myTriagePageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myTriagePageNum = num
			Page.currentPage = num
			myTriagePostData.page = Page
			getMyTriage()
		}
	})
	$('.mytriage-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	backlogPostData.page = Page
	backlogGhConsultationInfo.state = 20
	backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
	getTriageBacklog()
	myTriagePostData.page = Page
	myTriagePostData.ghConsultationInfo = myTriageGhConsultationInfo
	getMyTriage()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询待办事项数据
		backlogGhConsultationInfo.bizType = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		backlogGhConsultationInfo.reqHospitalName = $('.tab1 .apply-hospital input').val()? $('.tab1 .apply-hospital input').val(): undefined
		backlogGhConsultationInfo.consultationType = $('.tab1 .consul-type select').val() != -100? $('.tab1 .consul-type select').val(): undefined
		backlogGhConsultationInfo.reqTime = $('.tab1 .start-date input').val()? new Date($('.tab1 .start-date input').val() + ' 00:00:00').getTime(): undefined
		backlogGhConsultationInfo.reqTime = $('.tab1 .end-date input').val()? new Date($('.tab1 .end-date input').val() + ' 23:59:59').getTime(): undefined
		backlogPageNum = 1
		Page.currentPage = 1
		backlogPostData.page = Page
		backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
		getTriageBacklog()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询待办事项数据
		myTriageGhConsultationInfo.bizType = $('.tab2 .patient-name input').val()? $('.tab2 .patient-name input').val(): undefined
		myTriageGhConsultationInfo.reqHospitalName = $('.tab2 .apply-hospital input').val()? $('.tab2 .apply-hospital input').val(): undefined
		myTriageGhConsultationInfo.consultationType = $('.tab2 .consul-type select').val() != -100? $('.tab2 .consul-type select').val(): undefined
		myTriageGhConsultationInfo.state = $('.tab2 .consul-state select').val() != -100? $('.tab2 .consul-state select').val(): undefined
		myTriageGhConsultationInfo.reqTime = $('.tab2 .start-date input').val()? new Date($('.tab2 .start-date input').val() + ' 00:00:00').getTime(): undefined
		myTriageGhConsultationInfo.reqTime = $('.tab2 .end-date input').val()? new Date($('.tab2 .end-date input').val() + ' 23:59:59').getTime(): undefined
		myTriagePageNum = 1
		Page.currentPage = 1
		myTriagePostData.page = Page
		myTriagePostData.ghConsultationInfo = myTriageGhConsultationInfo
		getMyTriage()
	})
})