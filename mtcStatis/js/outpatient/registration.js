var weekNum = 0 //标记当前周数
// 获取每周的日期
function getWeekDay (weeknum) {
	var now;
	for (var i = 1; i <= 7; i++) {
		now = new Date();
		var num = 7 * weeknum - now.getDay() + i;
		now.setDate(now.getDate() + num);
		var year = now.getFullYear()
		var month = now.getMonth() + 1 >= 10? now.getMonth() + 1: '0' + (now.getMonth() + 1)
		var day = now.getDate() >= 10? now.getDate(): '0' + now.getDate()
		$('.scheduling-box th').eq(i).find('span').html(year + '-' + month + '-' + day)
	}
}
$(function () {
	getWeekDay(weekNum)
	$('body').on('click', '.scheduling-box .before-week', function () {
		// 获取上一周日期
		if ($(this).hasClass('hasweek')) {
			weekNum--
			getWeekDay(weekNum)
			if (weekNum == 0) {
				$(this).removeClass('hasweek')
			}
		}
	}).on('click', '.scheduling-box .next-week', function () {
		// 获取下一周日期
		weekNum++
		getWeekDay(weekNum)
		$(this).siblings('.before-week').addClass('hasweek')
	}).on('click', '.scheduling-box .current-week', function () {
		// 获取本周日期
		weekNum = 0
		getWeekDay(weekNum)
		$(this).siblings('.before-week').removeClass('hasweek')
	})
})