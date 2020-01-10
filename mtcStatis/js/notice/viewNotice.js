var searchArr = location.search.split(/[?=&]/)
var noticeId = searchArr[searchArr.indexOf('id') + 1]
$(function () {
	var postData = {'id': noticeId}
	$.ajax({
		url: baseurl + 'gateway/selectNoticeContentNew?id=' + noticeId,
		type: 'get',
		success: function (noticeData) {
			var data = noticeData.ghNotice
			$('.notice-main .noticeTitle').html(data.noticeTitle)
			$('.notice-main .sendTime span').html(data.createTime)
			$('.notice-main .author span').html(data.creator)
			$('.noticeInfo').html(data.noticeContent)
		},
		error: function (err) {
			console.log(err)
		}
	})

})