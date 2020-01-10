var searchArr = location.search.split(/[?=&]/)
var id = searchArr[searchArr.indexOf('id') + 1]
var state = searchArr[searchArr.indexOf('state') + 1]
var type = searchArr[searchArr.indexOf('type') + 1]
$(function () {
	$('.breadcrumb span[data-type=' + type + ']').show().siblings('span').hide()
	$.ajax({
		url: baseurl + 'remoteclinic/remoteclinicInfoViewNew?remoteclinicId=' + id + '&type=' + type + '&state=' + state,
		type: 'get',
		success: function (msg) {},
		error: function (err) {
			console.log(err)
		}
	})
})