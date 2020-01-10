// 获取科室数据
function getDepartmentList () {
	var ghDepartment = getGhDepartment(ghDoctor.eHospital.id)
	var departmentHtml = ''
	for (var i = 0; i < ghDepartment.length; i++) {
		departmentHtml += '<li class="department-item" data-id="' + ghDepartment[i].id + '">' + ghDepartment[i].departmentName + '</li>'
	}
	$('.department-bar ul').html(departmentHtml)
}
$(function () {
	getDepartmentList()
	$('body').on('click', '.department-bar li', function () {
		// 选择科室
		$(this).addClass('selected').siblings('.selected').removeClass('selected')
		$('.scheduling-doctor-box .doctor-list').show()
	})
})