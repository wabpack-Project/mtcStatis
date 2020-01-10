// 填充月份信息
function initMonth () {
	var now = new Date()
	var year = now.getFullYear()
	var month = now.getMonth() + 1
	var monthHtml = ''
	for (var i = 0; i < 6; i++) {
		var newMonth = month +i
		var newYear = year
		if (newMonth > 12) {
			newMonth -= 12
			newYear++
		}
		monthHtml += '<li data-month="' + newYear + '-' + newMonth + '"'
		if (i == 0) {
			monthHtml += ' class="selected"'
		}
		monthHtml += '>' + newYear + '-' + newMonth + '</li>'
	}
	$('.month-list ul').html(monthHtml)
	initDate(year + '-' + month)
}
// 获取所选择的月份的日历信息
function initDate (monthData) {
	var arr = monthData.split('-')
	var year = arr[0]
	var month = arr[1]
	var monthstr = month > 10? month: '0' + month
	var firstDay = new Date(year, month - 1, 1).getDay() //当月第一天星期几
	if (firstDay == 0) {
		firstDay = 7
	}
	var allDates = new Date(year, month, 0).getDate() //当月一共有几天
	var allWeeks = Math.ceil((allDates + (firstDay - 1)) / 7) //当月一共占几周
	var dateHTML = ''
	var dateNum = 1
	for (var i = 0; i < allWeeks; i++) {
		dateHTML += '<tr>'
		for (var j = 0; j < 7; j++) {
			// 周日历中当月第一天的前几天为空位
			if ((i == 0 && j < firstDay - 1) || dateNum > allDates) {
				dateHTML += '<td></td>'
			} else {
				var datestr = dateNum > 10? dateNum: '0' + dateNum
				dateHTML += '<td class="activeTd" data-date=' + (year + '-' + monthstr + '-' + datestr) + '>' + dateNum + '</td>'
				dateNum++
			}
		}
		dateHTML += '<td><a class="look">排班</a><a class="revocation">清除</a></td></tr>'
	}
	$('.scheduling-date-box tbody').html(dateHTML)
}
$(function () {
	$('.hospital-bar span').html(ghDoctor.eHospital.hospitalName)
	initMonth()
	$('body').on('click', '.month-list li', function () {
		// 点击月标识 获取当月日期
		$(this).attr('class', 'selected').siblings('.selected').removeClass('selected')
		initDate($(this).attr('data-month'))
	}).on('click', '.scheduling-doctor-box .date-type input[type="radio"]', function () {
		// 选择日期 选择其他项时清空指定日期选择
		$(this).parent().siblings().find('select').val('')
	})
})