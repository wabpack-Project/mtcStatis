function checkLogin () {
	if ($('.user-name input').val() && $('.user-password input').val()) {
		// var postData = 'username=' + $('.user-name input').val() + '&password=' + $('.user-password input').val()
		// $.ajax({
		// 	url: '/gohealth-plat/login',
		// 	type: 'post',
		// 	data: JSON.stringify(postData),
		// 	success: function (msg) {
		// 		console.log(msg)
		// 	},
		// 	error: function (err) {
		// 		console.log(err)
		// 	}
		// })
		return true
	} else {
		return false
	}
	debugger
}
$(function () {
	$('.user-name input').blur(function () {
		if (!$(this).val()) {
			$('.errorText').html('用户名不可为空')
			$(this).focus()
		} else {
			$('.errorText').html('')
		}
	})
	$('.user-password input').blur(function () {
		if (!$(this).val()) {
			$('.errorText').html('密码不可为空')
			$(this).focus()
		} else {
			$('.errorText').html('')
		}
	})
})