var doctorPostData = {}
var doctorPageNum = 1
var noticeId
// 获取个人数据
function getDoctorList () {
 	$.ajax({
 		url: baseurl + 'getDoctorList',
 		type: 'post',
 		data: JSON.stringify(doctorPostData),
 		dataType: 'json',
 		contentType: 'application/json;charset=utf-8',
 		success: function (doctorList) {
 			var data = doctorList.rows
 			data=[{'doctorName': 'doctorName','sex': 'sex','phonenumber': 'phonenumber','doctorTitle': 'doctorTitle','departmentName': 'departmentName','departmentId': 'departmentId','doctorId': 'doctorId'}]
 			if (data.length) {
 				var doctorHtml = ''
 				for (var i = 0; i < data.length; i++) {
 					doctorHtml += '<tr><td>' + (i + 1) + '</td><td>' + data[i].doctorName + '</td><td>' + data[i].sex + '</td><td>' + data[i].phonenumber + '</td><td>' + data[i].doctorTitle + '</td><td>' + data[i].departmentName + '</td><td><a class="look" data-departmentId=' + data[i].departmentId + ' data-departmentName=' + data[i].departmentName + ' data-doctorId=' + data[i].doctorId + ' data-doctorName=' + data[i].doctorName + '>选择</a></td></tr>'
 				}
 				$('.selectDoctorBox tbody').html(doctorHtml)
 				getDoctorPage(doctorList)
 			} else {
 				$('.selectDoctorBox tbody').html('')
 				$('.selectDoctorBox .noData').show().siblings('.list-pagination').hide()
 			}
 		},
 		error: function (err) {
 			console.log(err)
 		}
 	})
}
// 获取个人分页数据
function getDoctorPage (data) {
	$('.selectDoctorBox .page').paging({
		pageNo: doctorPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			doctorPageNum = num
			Page.currentPage = num
			doctorPostData.page = Page
			getDoctorList()
		}
	})
	$('.selectDoctorBox .page').parent().show()
}
// 获取角色列表
function getRoleList () {
	var roleData
	$.ajax({
		url: baseurl + 'role/getGRoleDetailLists',
		type: 'post',
		dataType: 'json',
		async: false,
		success: function (msg) {
			roleData = msg
		},
		error: function (err) {
			console.log(err)
		}
	})
	return roleData
}
// 检测是否信息填充完整
function testInput () {
	var bodyType = $('.noticePeople input[type="radio"]:checked').val()
	if (!bodyType) {
		alert("请选择通知对象类别")
		return false
	} 
	var bodyId = "";
	if(bodyType == "1"){
		bodyId = $(".selectDoctor input").attr('data-doctorId')
	}else if(bodyType == "2" || bodyType == "3"){
		bodyId = $(".selectRole select").val()
	}
	if (!bodyId && bodyType != "4") {
		alert("请选择通知对象!")
		return false
	}
	var priority = $('.isUrgent input[type="radio"]:checked').val()
	if (!priority) {
		alert("请选择是否紧急")
		return false
	} 
	var noticeTitle = $(".noticeTitle input").val()
	if (!noticeTitle) {
		alert('请输入通知标题')
		return false
	}
	var noticeContent = $(".noticeContent textarea").val()
	if (!noticeContent) {
		alert('请输入通知内容')
		return false
	}
	var GhNotice = {}
	GhNotice.bodyType = Number(bodyType) // 主体类型：1单独用户 2群组用户 3角色用户 4全部用户
	GhNotice.noticeTitle = noticeTitle
	GhNotice.noticeContent = noticeContent
	GhNotice.state = 1 // 状态：0无效，1已保存，2已发布
	GhNotice.bodyId = bodyId
	GhNotice.priority = Number(priority)
	return GhNotice
}
$(function () {
	var ghDepartment = getGhDepartment(ghDoctor.eHospital.id)
	var departmentHtml = '<option value="">请选择</option>'
	for (var i = 0; i < ghDepartment.length; i++) {
		departmentHtml += '<option value=' + ghDepartment[i].id + '>' + ghDepartment[i].departmentName + '</option>'
	}
	$('.department-name select').html(departmentHtml)
	getSystemParameter(56, $('.doctor-title select'))
	$('body').on('click', '.noticePeople label', function () {
		// 选择通知对象
		switch ($(this).children('input').val()) {
			case '1': $(this).siblings('.selectDoctor').css('display', 'inline-block').siblings('.selectRole').hide() // 显示个人选择框
				break;
			case '3': 
				// 显示角色选择框
				var siblings = $(this).siblings('.selectRole')
				if (!siblings.find('select option').length) {
					var data = getRoleList()
					var roleHtml = '<option value="">请选择</option>'
					for (var i = 0; i < data.length; i++) {
						roleHtml += '<option value="' + data[i].roleId + '">' + data[i].roleName + '</option>'
					}
					siblings.find('select').html(roleHtml)
				}
				siblings.css('display', 'inline-block').siblings('.selectDoctor').hide() 
				break;
			case '4': 
				$(this).siblings('.selectDoctor,.selectRole').hide()
				break;
		}
	}).on('click', '.selectDoctor input', function () {
		// 选择通知个人
		Page.showCount = 5
		Page.currentPage = 1
		doctorPostData.page = Page
		doctorPostData.hospitalId = ghDoctor.eHospital.id
		doctorPostData.roleId = ghDoctor.roleId
		doctorPostData.menuId = menu_id
		getDoctorList()
		$('.mask,.selectDoctorBox').show()
	}).on('click', '.selectDoctorBox .search', function () {
		// 根据搜索条件查询个人数据
		doctorPostData.departmentId = $('.department-name select').val()? $('.department-name select').val(): undefined
		doctorPostData.doctorName = $('.doctor-name input').val()? $('.doctor-name input').val(): undefined
		doctorPostData.doctorTitle = $('.doctor-title select').val()? $('.doctor-title select').val(): undefined
		doctorPageNum = 1
		Page.currentPage = 1
		doctorPostData.page = Page
		getDoctorList()
	}).on('click', '.selectDoctorBox tbody .look', function () {
		// 选择个人数据
		var input = $('.selectDoctor input')
		input.attr({'data-departmentId': $(this).attr('data-departmentId'), 'data-departmentName': $(this).attr('data-departmentName'), 'data-doctorId': $(this).attr('data-doctorId')}).val($(this).attr('data-doctorName'))
		$('.mask,.selectDoctorBox').hide()
	}).on('click', '.button-box .save', function () {
		// 保存数据
		if (testInput()) {
			var ghNoticeInfo = {}
			ghNoticeInfo.ghNotice = testInput()
			$.ajax({
				async : false,
				url : baseurl + 'gateway/save',
				dataType : "json",
				type : 'POST',
				cache : false,
				data : JSON.stringify(ghNoticeInfo),
				contentType : 'application/json;charset=utf-8',
				success : function(msg) {
					if (msg) {
						alert("保存成功")
						noticeId = msg
					}
				},
				error : function(err) {
					console.log(err)
				}
			})
		}
	}).on('click', '.button-box .send', function () {
		// 发送通知
		if (testInput ()) {
			var ghNoticeInfo = {}
			ghNoticeInfo.ghNotice = testInput()
			$.ajax({
				async : false,
				url : baseurl + 'gateway/send',
				dataType : "json",
				type : 'POST',
				cache : false,
				data : JSON.stringify(ghNoticeInfo),
				contentType : 'application/json;charset=utf-8',
				success : function(msg) {
					if (msg) {
						alert("发布成功")
					}
				},
				error : function(err) {
					console.log(err)
				}
			})
		}
	})
})