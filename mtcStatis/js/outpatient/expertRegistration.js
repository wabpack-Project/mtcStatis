var expertPostData = {}
var expertPageNum = 1
// 获取专家列表及各专家详情
function getExpertInfo () {
	$.ajax({
		url: baseurl + 'mtc/mtcDoctors',
		type: 'post',
		data: expertPostData,
		dataType: 'json',
		async: false,
		success: function (expertList) {
			var data = expertList.rmtceVo
			var listHtml = ''
			for (var i = 0; i < data.length; i++) {
				var id = data[i].e_id
				var doctor = queryEntity('doctor', id)
				if (doctor) {
					var hospitalList = queryEntity("hosp", doctor.hospitalId)
					var departmentList = queryEntity("dept", doctor.departmentId)
					listHtml += '<li class="expert-item padding_20 clearfix"><div class="expert-icon"></div><div class="expert-info">' + doctor.doctorName + '<div class="expert-name">职称：' + doctor.doctorName + '</div><div class="expert-hospital">医院：' + hospitalList.hospitalName + '</div><div class="expert-department">科室：' + departmentList.departmentName + '</div><div class="expert-speciality">特长：' + doctor.speciality + '</div></div></li>'
				}
			}
			$('.expert-wrap ul').html(listHtml)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
function setLiWidth () {
	var listWidth = $('.expert-wrap .expert-list').width()
	$('.expert-wrap .expert-list li').css('width', listWidth * 0.32 + 'px').siblings('li:not(:nth-child(3n))').css('margin-right', listWidth * 0.02 + 'px')
	$('.expert-list').height($('.expert-wrap .expert-list ul').css('height'))
}
function queryEntity(type,id){
	var doctor
	var method = "";
	if(type=="doctor"){
		method = "doctorManagement/queryDoctor";
	}else if(type=="dept"){
		method = "doctorManagement/queryDepartment";
	}else if(type=="hosp"){
		method = "doctorManagement/queryHospital";
	}
	$.ajax({
		url: baseurl + method,
		dataType: "json",
		type: 'POST',
		async: false,
		data: {'id': id},
		success: function(obj) {
			doctor = obj;
		},
		error: function (err) {
			console.log(err)
		}
	});
	return doctor;
}
window.onresize = function () {
	setLiWidth()
}
$(function () {
	// 获取医生级别
	getSystemParameter(56, $('.expert-title select'))
	expertPostData.userid = ghDoctor.ghDoctor.id
	expertPostData.mtcid = ghDoctor.mtc.id
	expertPostData.menu_id = menu_id
	expertPostData.role_id = ghDoctor.roleId
	expertPostData.pageNum = expertPageNum
	expertPostData.pageSize = 3
	getExpertInfo()
	setLiWidth()
	if ($('.expert-wrap ul').width() > $('.expert-wrap .expert-list').width()) {
		$('.expert-wrap .right-button').addClass('hasmore')
	}
	$('body').on('click', '.search-box .search', function () {
		// 根据搜索条件查询专家列表
		// alert('waiting...')
	}).on('click', '.expert-wrap .expert-item', function () {
		// 选择专家
		$(this).addClass('expert-selected').siblings('.expert-selected').removeClass('expert-selected')
	}).on('click', '.expert-wrap .right-button', function () {
		// 向右显示更多专家列表
		if ($(this).hasClass('hasmore')) {
			// var ul = $('.expert-wrap ul')
			// var left = parseInt(ul.css('left'))
			// var parentWidth = parseInt(ul.parents('.expert-list').width())
			// ul.css('left', left - parentWidth + 'px')
			// $(this).siblings('.left-button').addClass('hasmore')
			// // 如果ul向左移动距离加上父元素宽度大于ul宽度 即ul没有下一页数据 向右按钮不可用
			// if ((-parseInt(ul.css('left').slice(0, -2)) + parentWidth) > parseInt(ul.width())) {
			// 	$(this).removeClass('hasmore')
			// }
			expertPageNum++
			expertPostData.pageNum = expertPageNum
			getExpertInfo()
		}
	}).on('click', '.expert-wrap .left-button', function () {
		// 向左显示医院列表
		if ($(this).hasClass('hasmore')) {
			// var ul = $('.expert-wrap ul')
			// var left = parseInt(ul.css('left'))
			// var parentWidth = parseInt(ul.parents('.expert-list').width())
			// ul.css('left', left + parentWidth + 'px')
			// $(this).siblings('.right-button').addClass('hasmore')
			// if (parseInt(ul.css('left')) >= 0) {
			// 	$(this).removeClass('hasmore')
			// }
			expertPageNum--
			expertPostData.pageNum = expertPageNum
			getExpertInfo()
		}
	})
})