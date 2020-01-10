var searchArr = location.search.split(/[?=&]/)
var backlogPostData = {}
var backlogPageNum = 1
var backlogGhConsultationInfo = {}
var myApplyPostData = {}
var myApplyPageNum = 1
var myApplyGhConsultationInfo = {}
// 获取待办事项数据
function getBacklog () {
	$.ajax({
		url: baseurl + 'consultation/selectMyApplyListPage',
		type: 'post',
		data: JSON.stringify(backlogPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (backlogData) {
			var data = backlogData.rows
			if (data.length) {
				var backlogHtml = ''
				for (var i = 0; i < data.length; i++) {
					backlogHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>' + data[i].reqDoctorName + '</td><td>'
					backlogHtml += data[i].reqDoctorPhone ? data[i].reqDoctorPhone : ''
					backlogHtml += '</td><td>' + data[i].disciplineId + '</td><td>'
					switch (data[i].consultationType) {
						case '0':
							backlogHtml += '临床'
							break;
						case '1':
							backlogHtml += '影像'
							break;
					}
					backlogHtml += '</td><td>' + getDate(data[i].createTime) + '</td><td>'
					backlogHtml += data[i].reqDiagnoseTime ? data[i].reqDiagnoseTime : ''
					backlogHtml += '</td><td>'
					switch (data[i].state) {
						case 0: 
							backlogHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 11: 
							backlogHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 60: 
							backlogHtml += '<span class="button button-green">待下载</span>' 
							break;
					}
					backlogHtml += '</td><td>'
					switch (data[i].state) {
						case 0:
						case 11:
							backlogHtml += '<a class="modify" href="/mtcStatis/pages/consultation/clinicalApply.html?ind=3&id=' + data[i].id + '&type=' + data[i].consultationType + '">修改</a>'
							break;
						case 60:
							backlogHtml += '<a class="look" href="/mtcStatis/pages/consultation/viewApply.html?no=' + data[i].consultationNo + '&ind=3">查看</a>'
							break;
					}
					backlogHtml += '</td></tr>'
				}
				$('.backlog-box tbody').html(backlogHtml)
				getBacklogPage(backlogData)
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
// 获取我的申请数据
function getMyApply () {
	$.ajax({
		url: baseurl + 'consultation/selectMyApplyListPage',
		type: 'post',
		data: JSON.stringify(myApplyPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (myApplyData) {
			var data = myApplyData.rows
			if (data.length) {
				var myapplyHtml = ''
				for (var i = 0; i < data.length; i++) {
					myapplyHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>' + data[i].reqDoctorName + '</td><td>'
					myapplyHtml += data[i].reqDoctorPhone ? data[i].reqDoctorPhone : ''
					myapplyHtml += '</td><td>' + data[i].disciplineId + '</td><td>'
					switch (data[i].consultationType) {
						case '0':
							myapplyHtml += '临床'
							break;
						case '1':
							myapplyHtml += '影像'
							break;
					}
					myapplyHtml += '</td><td>' + getDate(data[i].createTime) + '</td><td>'
					myapplyHtml += data[i].reqDiagnoseTime ? data[i].reqDiagnoseTime : ''
					myapplyHtml += '</td><td>'
					switch (data[i].state) {
						case -10: 
							myapplyHtml += '<span class="button button-orange">撤销</span>' 
							break;
						case 0: 
							myapplyHtml += '<span class="button button-orange">暂存</span>' 
							break;
						case 10: 
							myapplyHtml += '<span class="button button-orange">待审核</span>' 
							break;
						case 11: 
							myapplyHtml += '<span class="button button-orange">已拒绝</span>' 
							break;
						case 20: 
							myapplyHtml += '<span class="button button-blue">待分诊</span>' 
							break;
						case 30: 
							myapplyHtml += '<span class="button button-blue">待会诊</span>' 
							break;
						case 40: 
							myapplyHtml += '<span class="button button-blue">会诊中</span>' 
							break;
						case 50: 
							myapplyHtml += '<span class="button button-blue">报告中</span>' 
							break;
						case 60: 
							myapplyHtml += '<span class="button button-green">待下载</span>' 
							break;
						case 70: 
							myapplyHtml += '<span class="button button-green">已完成</span>' 
							break;
					}
					myapplyHtml += '</td><td><a class="look" href="/mtcStatis/pages/consultation/viewApply.html?no=' + data[i].consultationNo + '&ind=3">查看</a>'
					if (data[i].state == 70 && data[i].evaluateId == null) {
						myapplyHtml += '<a class="modify" href="/mtcStatis/pages/consultation/viewApply.html?no=' + data[i].consultationNo + '&toEvaluate=1&ind=3>评价</a>'
					}
					myapplyHtml += '</td></tr>'
				}
				$('.myApply-box tbody').html(myapplyHtml)
				getMyApplyPage(myApplyData)
			} else {
				$('.myApply-box tbody').html('')
				$('.myApply-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取我的申请分页数据
function getMyApplyPage (data) {
	$('.myApply-box .page').paging({
		pageNo: myApplyPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myApplyPageNum = num
			Page.currentPage = num
			myApplyPostData.page = Page
			getMyApply()
		}
	})
	$('.myApply-box .page').parent().show()
}
$(function () {
	if (searchArr.indexOf('tab') > -1) {
		$('.' + searchArr[searchArr.indexOf('tab') + 1]).addClass('curren').siblings('.current').removeClass('current')
	}
	Page.showCount = 10
	Page.currentPage = 1
	backlogPostData.page = Page
	backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
	getBacklog()
	myApplyPostData.page = Page
	myApplyGhConsultationInfo.state = $('.tab2 .status select').val()
	myApplyGhConsultationInfo.id = '1'
	myApplyPostData.ghConsultationInfo = myApplyGhConsultationInfo
	getMyApply()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询待办事项数据
		backlogGhConsultationInfo.consultationNo = $('.tab1 .apply-id input').val()? $('.tab1 .apply-id input').val(): undefined
		backlogGhConsultationInfo.bizType = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		backlogGhConsultationInfo.disciplineId = $('.tab1 .identity-num input').val()? $('.tab1 .identity-num input').val(): undefined
		backlogGhConsultationInfo.state = $('.tab1 .status select').val()? $('.tab1 .status select').val(): undefined
		backlogGhConsultationInfo.reqTime = $('.tab1 .start-date input').val()? new Date($('.tab1 .start-date input').val() + ' 00:00:00').getTime(): undefined
		backlogGhConsultationInfo.createTime = $('.tab1 .end-date input').val()? new Date($('.tab1 .end-date input').val() + ' 23:59:59').getTime(): undefined
		backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
		backlogPageNum = 1
		Page.currentPage = 1
		backlogPostData.page = Page
		getBacklog()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询我的申请数据
		myApplyGhConsultationInfo.consultationNo = $('.tab2 .apply-id input').val()? $('.tab2 .apply-id input').val(): undefined
		myApplyGhConsultationInfo.bizType = $('.tab2 .patient-name input').val()? $('.tab2 .patient-name input').val(): undefined
		myApplyGhConsultationInfo.disciplineId = $('.tab2 .identity-num input').val()? $('.tab2 .identity-num input').val(): undefined
		myApplyGhConsultationInfo.state = $('.tab2 .status select').val()
		myApplyGhConsultationInfo.reqTime = $('.tab2 .start-date input').val()? new Date($('.tab2 .start-date input').val() + ' 00:00:00').getTime(): undefined
		myApplyGhConsultationInfo.createTime = $('.tab2 .end-date input').val()? new Date($('.tab2 .end-date input').val() + ' 23:59:59').getTime(): undefined
		myApplyPostData.ghConsultationInfo = myApplyGhConsultationInfo
		myApplyPageNum = 1
		Page.currentPage = 1
		myApplyPostData.page = Page
		getMyApply()
	})
})