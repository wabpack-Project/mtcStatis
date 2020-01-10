var backlogPostData = {}
var backlogPageNum = 1
var backlogGhConsultationInfo = {}
var myConsulPostData = {}
var myConsulPageNum = 1
var myConsulGhConsultationInfo = {}
// 获取待办事项数据
function getConsulBacklog () {
	$.ajax({
		url: baseurl + 'myConsultation/selectMyApplyListPage',
		type: 'post',
		data: JSON.stringify(backlogPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (consulBacklog) {
			var data = consulBacklog.rows
			if (data.length) {
				var backlogHtml = ''
				for (var i = 0; i < data.length; i++) {
					backlogHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case 0: 
							backlogHtml += '临床' 
							break;
						case 1: 
							backlogHtml += '影像' 
							break;
					}
					backlogHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + data[i].reqDoctorName + '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].startTime + '</td><td>'
					switch (data[i].reportState) {
						case 30: 
							backlogHtml += '<span class="button button-blue">待会诊</span>'
							break;
						case 40: 
							backlogHtml += '<span class="button button-blue">会诊中</span>'
							break;
						case 50: 
						case 51:
							backlogHtml += '<span class="button button-blue">报告中</span>'
							break;
						case 11: 
							backlogHtml += '<span class="button button-orange">报告驳回</span>'
							break;
					}
					backlogHtml += '</td><td>'
					switch (data[i].reportState) {
						case 11:
						case 30:
						case 40:
							backlogHtml += '<a class="look">查看</a>'
							break;
						case 50:
							backlogHtml += '等待审核'
							break;
						case 51:
							backlogHtml += '报告通过'
							break;
					}
					
					backlogHtml += '</td></tr>'
				}
				$('.backlog-box tbody').html(backlogHtml)
				getBacklogPage(consulBacklog)
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
			getConsulBacklog()
		}
	})
	$('.backlog-box .page').parent().show()
}
// 获取我的分诊数据
function getMyConsul () {
	$.ajax({
		url: baseurl + 'myConsultation/selectMyApplyListPage',
		type: 'post',
		data: JSON.stringify(myConsulPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (myConsulData) {
			var data = myConsulData.rows
			if (data.length) {
				var consulHtml = ''
				for (var i = 0; i < data.length; i++) {
					consulHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>'
					switch (data[i].consultationType) {
						case 0: 
							consulHtml += '临床' 
							break;
						case 1: 
							consulHtml += '影像' 
							break;
					}
					consulHtml += '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].departmentName + '</td><td>' + data[i].reqDoctorName + '</td><td>' + getDate(data[i].createTime) + '</td><td>' + data[i].startTime + '</td><td>'
					switch (data[i].state) {
						case -10: 
						consulHtml += '<span class="button button-orange">撤销</span>' 
						break;
					case 0: 
						consulHtml += '<span class="button button-orange">暂存</span>' 
						break;
					case 10: 
						consulHtml += '<span class="button button-orange">待审核</span>' 
						break;
					case 11: 
						consulHtml += '<span class="button button-orange">已拒绝</span>' 
						break;
					case 20: 
						consulHtml += '<span class="button button-blue">待分诊</span>' 
						break;
					case 30: 
						consulHtml += '<span class="button button-blue">待会诊</span>' 
						break;
					case 50: 
						if (data[i].reportState == 11) {
							consulHtml += '<span class="button button-orange">报告驳回</span>' 
						} else {
							consulHtml += '<span class="button button-blue">报告中</span>' 
						}
						break;
					case 70: 
						consulHtml += '<span class="button button-green">已完成</span>' 
						break;
					}
					consulHtml += '</td><td><a class="look">查看</a></td></tr>'
				}
				$('.myconsul-box tbody').html(consulHtml)
				getMyConsulPage(myConsulData)
			} else {
				$('.myconsul-box tbody').html('')
				$('.myconsul-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取我的分诊分页数据
function getMyConsulPage (data) {
	$('.myconsul-box .page').paging({
		pageNo: myConsulPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			myConsulPageNum = num
			Page.currentPage = num
			myConsulPostData.page = Page
			getMyConsul()
		}
	})
	$('.myconsul-box .page').parent().show()
}
$(function () {
	Page.showCount = 10
	Page.currentPage = 1
	backlogPostData.page = Page
	backlogGhConsultationInfo.state = $('.tab1 .consul-status select').val()
	backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
	getConsulBacklog()
	myConsulPostData.page = Page
	myConsulGhConsultationInfo.state = $('.tab2 .consul-status select').val()
	myConsulPostData.ghConsultationInfo = myConsulGhConsultationInfo
	getMyConsul()
	$('body').on('click', '.tab1 .tab1-search', function () {
		// 根据搜索条件查询待办事项数据
		backlogGhConsultationInfo.consultationNo = $('.tab1 .apply-id input').val()? $('.tab1 .apply-id input').val(): undefined
		backlogGhConsultationInfo.bizType = $('.tab1 .patient-name input').val()? $('.tab1 .patient-name input').val(): undefined
		backlogGhConsultationInfo.reqHospitalName = $('.tab1 .apply-hospital input').val()? $('.tab1 .apply-hospital input').val(): undefined
		backlogGhConsultationInfo.departmentName = $('.tab1 .apply-division input').val()? $('.tab1 .apply-division input').val(): undefined
		backlogGhConsultationInfo.reqDoctorName = $('.tab1 .apply-doctor input').val()? $('.tab1 .apply-doctor input').val(): undefined
		backlogGhConsultationInfo.consultationType = $('.tab1 .consul-type select').val() != -100? $('.tab1 .consul-type select').val(): undefined
		backlogGhConsultationInfo.reqTime = $('.tab1 .apply-start-date input').val()? new Date($('.tab1 .apply-start-date input').val() + ' 00:00:00').getTime(): undefined
		backlogGhConsultationInfo.createTime = $('.tab1 .apply-end-date input').val()? new Date($('.tab1 .apply-end-date input').val() + ' 23:59:59').getTime(): undefined
		backlogGhConsultationInfo.reportHospitalName = $('.tab1 .consul-organization input').val()? $('.tab1 .consul-organization input').val(): undefined
		backlogGhConsultationInfo.reportDoctorName = $('.tab1 .consul-doctor input').val()? $('.tab1 .consul-doctor input').val(): undefined
		backlogGhConsultationInfo.state = $('.tab1 .consul-status select').val()
		backlogPageNum = 1
		Page.currentPage = 1
		backlogPostData.page = Page
		backlogPostData.ghConsultationInfo = backlogGhConsultationInfo
		getConsulBacklog()
	}).on('click', '.tab2 .tab2-search', function () {
		// 根据搜索条件查询我的会诊数据
		myConsulGhConsultationInfo.consultationNo = $('.tab2 .apply-id input').val()? $('.tab2 .apply-id input').val(): undefined
		myConsulGhConsultationInfo.bizType = $('.tab2 .patient-name input').val()? $('.tab2 .patient-name input').val(): undefined
		myConsulGhConsultationInfo.reqHospitalName = $('.tab2 .apply-hospital input').val()? $('.tab2 .apply-hospital input').val(): undefined
		myConsulGhConsultationInfo.departmentName = $('.tab2 .apply-division input').val()? $('.tab2 .apply-division input').val(): undefined
		myConsulGhConsultationInfo.reqDoctorName = $('.tab2 .apply-doctor input').val()? $('.tab2 .apply-doctor input').val(): undefined
		myConsulGhConsultationInfo.consultationType = $('.tab2 .consul-type select').val() != -100? $('.tab2 .consul-type select').val(): undefined
		myConsulGhConsultationInfo.reqTime = $('.tab2 .apply-start-date input').val()? new Date($('.tab2 .apply-start-date input').val() + ' 00:00:00').getTime(): undefined
		myConsulGhConsultationInfo.createTime = $('.tab2 .apply-end-date input').val()? new Date($('.tab2 .apply-end-date input').val() + ' 23:59:59').getTime(): undefined
		myConsulGhConsultationInfo.reportHospitalName = $('.tab2 .consul-organization input').val()? $('.tab2 .consul-organization input').val(): undefined
		myConsulGhConsultationInfo.reportDoctorName = $('.tab2 .consul-doctor input').val()? $('.tab2 .consul-doctor input').val(): undefined
		myConsulGhConsultationInfo.state = $('.tab2 .consul-status select').val()
		myConsulPageNum = 1
		Page.currentPage = 1
		myConsulPostData.page = Page
		myConsulPostData.ghConsultationInfo = myConsulGhConsultationInfo
		getMyConsul()
	})
})