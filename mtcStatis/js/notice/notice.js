var noticePostData = {}
var noticePageNum = 1
var ghNotice = {}
var parentInd = $('#parentHref').attr('data-index')
// 获取已发布信息数据
function getNoticeList () {
	var url = parentInd == 26? 'gateway/selectNoticeTitleByMyself': 'gateway/selectNoticeTitleToMe'
	$.ajax({
		url: baseurl + url,
		type: 'post',
		data: JSON.stringify(noticePostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (noticeData) {
			var data = noticeData.rows
			if (data.length) {
				var noticeHtml = ''
				for (var i = 0; i < data.length; i++) {
					noticeHtml += '<tr><td><a href="/mtcStatis/pages/notice/viewNotice.html?id=' + data[i].id + '&ind=' + parentInd + '">' + data[i].noticeTitle + '</a></td><td>'
					switch (data[i].priority) {
						case 1: noticeHtml += '<span style="color: #F4ad5b">紧急</span>'
							break;
						case 2: noticeHtml += '一般'
							break;
					}
					noticeHtml += '</td><td>' + data[i].creator + '</td><td>' + getDate(data[i].createTime) + '</td></tr>'
				}
				$('.notice-box tbody').html(noticeHtml)
				getNoticePage(noticeData)
			} else {
				$('.notice-box tbody').html('')
				$('.notice-box .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取已发布信息分页数据
function getNoticePage (data) {
	$('.notice-box .page').paging({
		pageNo: noticePageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			noticePageNum = num
			Page.currentPage = num
			noticePostData.page = Page
			getNoticeList()
		}
	})
	$('.notice-box .page').parent().show()
}
$(function () {
	Page.showCount = 15
	Page.currentPage = 1
	noticePostData.page = Page
	noticePostData.ghNotice = ghNotice
	getNoticeList()
})