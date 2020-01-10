// 获取科室数据
function getDepartmentList () {
	var ghDepartment = getGhDepartment(ghDoctor.eHospital.id)
	var departmentHtml = ''
	for (var i = 0; i < ghDepartment.length; i++) {
		departmentHtml += '<li class="department-item" data-id="' + ghDepartment[i].id + '">' + ghDepartment[i].departmentName + '</li>'
	}
	$('.department-bar ul').html(departmentHtml)
}
// 获取专家数据
function getDoctorList (departmentId) {
	var postData = {}
	// $.ajax({
	// 	url: baseurl + 'mtc/queryDoctorByDepartmentId',
	// 	type: 'post',
	// 	data: JSON.stringify(postData),
	// 	dataType: 'json',
	// 	contentType: 'application/json;charset=utf-8',
	// 	success: function (ghDoctorList) {
			var doctorHtml = ''
			for (var i = 0; i < ghDoctorList.length; i++) {
				doctorHtml += '<li class="doctor-item" data-id="' + ghDoctorList[i].id + '">' + ghDoctorList[i].doctorName + '</li>'
			}
			$('.expert-bar ul').html(doctorHtml)
	// 	},
	// 	error: function (err) {
	// 		console.log(err)
	// 	}
	// })
}
$(function () {
	getDepartmentList()
	$('body').on('click', '.department-bar li', function () {
		// 选择科室
		$(this).addClass('selected').siblings('.selected').removeClass('selected')
		getDoctorList($(this).attr('data-id'))
	}).on('click', '.expert-bar li', function () {
		// 选择专家
		$(this).addClass('selected').siblings('.selected').removeClass('selected')
		$('.scheduling-doctor-box').find('.doctor-container,.outpatient-container').show()
	}).on('click', '.outpatient-container .set-timeperiod', function () {
		// 设置出诊时段
		var boxWrap = $('.outpatient-container>div:not(.button-box):not(.outpatient-cost)')
		for (var i = 0; i < boxWrap.length; i++) {
			if (!boxWrap.eq(i).find('input').val()) {
				alert('请输入' + boxWrap.eq(i).children('span').text())
				return
			}
		}
		// 获取起始时间结束时间 根据出诊时长和出诊数量计算总时长 总时长要在时间节点范围内
		var beginTime = new Date($('.outpatient-container .start-time input').val()).getTime()
		var endTime = new Date($('.outpatient-container .end-time input').val()).getTime()
		var outpatientCount = Number($('.outpatient-container .outpatient-count input').val())
		var outpatientDuration = Number($('.outpatient-container .outpatient-duration input').val())
		if (beginTime + (outpatientCount * outpatientDuration * 60 * 1000) + ((outpatientCount - 1) * 60 * 1000) <= endTime) {
			// 起始时间+出诊时间+出诊间1分钟时间间隔 不大于结束时间
			var periodHTML = ''
			var nowTime = beginTime
			for (var j = 0; j < outpatientCount; j++) {
				periodHTML += '<div class="time-period">时间段' + (j + 1) + '：<input type="text" name="" class="start-time" value="'
				periodHTML += new Date(nowTime).Format('yyyy-MM-dd hh:mm')
				periodHTML += '"><span>~</span><input type="text" name="" class="end-time" value="'
				nowTime += outpatientDuration * 60 * 1000
				periodHTML += new Date(nowTime).Format('yyyy-MM-dd hh:mm')
				periodHTML += '"></div>'
				nowTime += 60 * 1000
			}
			$('.timeperiod-container').html(periodHTML).show().siblings('.button-box').show()
		} else {
			alert('请输入合理的时间范围')
		}
	})
})