// 获取医院列表
function getHospitalList () {
	var hospitalList = getRemoteclinicApplyInfo('hospital', '')
	var hospitalHtml = ''
	for (var i = 0; i < hospitalList.length; i++) {
		hospitalHtml += '<li data-id=' + hospitalList[i].id + ' data-hospitalid=' + hospitalList[i].e_id + '>' + hospitalList[i].e_name + '</li>'
	}
	$('.hospital-department-box .hospital-list ul').html(hospitalHtml)
}
// 获取科室数据
function getDepartment (id) {
	var departmentList = getRemoteclinicApplyInfo('department', id)
	var departmentHtml = ''
	for (var j = 0; j < departmentList.length; j++) {
		departmentHtml += '<div class="department-item" data-id=' + departmentList[j].e_id + '><span>' + departmentList[j].e_name + '</span></div>'
	}
	$('.hospital-department-box .department-wrap').html(departmentHtml)
}
$(function () {
	getHospitalList()
	if ($('.hospital-department-box .hospital-list ul').width() > $('.hospital-department-box .hospital-list').width()) {
		$('.hospital-wrap .right-button').addClass('hasmore')
	}
	$('body').on('click', '.hospital-list li', function () {
		// 选择挂号医院
		$(this).addClass('hospital-selected').siblings('.hospital-selected').removeClass('hospital-selected')
		getDepartment($(this).attr('data-id'))
	}).on('click', '.hospital-wrap .right-button', function () {
		// 向右显示更多医院列表
		if ($(this).hasClass('hasmore')) {
			var ul = $('.hospital-department-box .hospital-list ul')
			var left = parseInt(ul.css('left'))
			var parentWidth = parseInt(ul.parents('.hospital-list').width())
			ul.css('left', left - parentWidth + 'px')
			$(this).siblings('.left-button').addClass('hasmore')
			// 如果ul向左移动距离加上父元素宽度大于ul宽度 即ul没有下一页数据 向右按钮不可用
			if ((-parseInt(ul.css('left')) + parentWidth) > parseInt(ul.width())) {
				$(this).removeClass('hasmore')
			}
		}
	}).on('click', '.hospital-wrap .left-button', function () {
		// 向左显示医院列表
		if ($(this).hasClass('hasmore')) {
			var ul = $('.hospital-department-box .hospital-list ul')
			var left = parseInt(ul.css('left'))
			var parentWidth = parseInt(ul.parents('.hospital-list').width())
			ul.css('left', left + parentWidth + 'px')
			$(this).siblings('.right-button').addClass('hasmore')
			if (parseInt(ul.css('left')) >= 0) {
				$(this).removeClass('hasmore')
			}
		}
	}).on('click', '.department-wrap .department-item', function () {
		// 选择挂号科室
		$(this).addClass('department-selected').siblings('.department-selected').removeClass('department-selected')
	})
})