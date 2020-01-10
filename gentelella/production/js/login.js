var postData = {}
function login () {
	$.ajax({
		url: '',
		type: 'post',
		data: postData,
		success: function (msg) {
			console.log(msg)
			window.location.href = ''
		},
		error: function (err) {
			console.log(err)
		}
	})		
}
$(function () {
	$('.user-name input').focus()
	$('.user-name input').blur(function () {
		if (!$(this).val()) {
			$('.errorText').html('用户名不可为空')
		} else {
			$('.errorText').html('')
		}
	})
	$('.user-password input').blur(function () {
		if (!$(this).val()) {
			$('.errorText').html('密码不可为空')
		} else {
			$('.errorText').html('')
		}
	})
	$('.login-button').on('click', function () {
		if ($('.user-name input').val() && $('.user-password input').val()) {
			postData = {'username': $('.user-name input').val(), 'password': $('.user-password input').val(), 'rememberMe': $('.login-auto input[type="checkbox"]').is(':checked')}
			login()
		}
	})
	$('#loginform').bind('keydown', function (e) {
		var e = e || window.event
		var code = e.keyCode || e.which || e.charCode
		if (code == 13) {
			$('.login-button').click()
		}
	})
})