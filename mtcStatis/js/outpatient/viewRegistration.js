var searchArr = location.search.split(/[?=&]/)
var id = searchArr[searchArr.indexOf('id') + 1]
var state = searchArr[searchArr.indexOf('state') + 1]
var type = searchArr[searchArr.indexOf('type') + 1]
$(function () {
	$.ajax({
		url: baseurl + 'remoteclinic/remoteclinicInfoViewNew?remoteclinicId=' + id + '&state=' + state + '&type=' + type,
		type: 'get',
		success: function (msg) {
			var patientInfo = msg.patientParm.ghPatientInfo
			$('.outpatient-box .patient-name span').html(patientInfo.patientName)
			$('.outpatient-box .patient-gendar span').html(patientInfo.sexName)
			$('.outpatient-box .patient-phone span').html(patientInfo.mobile)
			$('.outpatient-box .patient-birth span').html(patientInfo.birthday ? new Date(patientInfo.birthday).Format('yyyy-MM-dd') : '')
			var remoteclinicInfo = msg.remoteclinicInfo
			$('.outpatient-box .attendance-date span').html(remoteclinicInfo.applyDate ? new Date(remoteclinicInfo.applyDate).Format('yyyy-MM-dd'): '')
			$('.outpatient-box .attendance-hospital span').html(remoteclinicInfo.applyHospitalName)
			$('.outpatient-box .outcall-doctor span').html(remoteclinicInfo.applyDoctorName)
			remoteclinicInfo.state == 30 ? $('.outpatient-box .outcall-state .waiting').hide() : $('.outpatient-box .outcall-state .waiting').show().find('.waiting-num').html('').siblings('.front-num').html('')
			remoteclinicInfo.state != 50 && remoteclinicInfo.state != 31 ? $('.outpatient-box .outcall-state .outcall').show() : $('.outpatient-box .outcall-state .outcall').hide()
			// 病历信息
			$('.medical-box .patient-narrate span').html(remoteclinicInfo.mainSuit)
			$('.medical-box .medical-history span').html(remoteclinicInfo.diseaseHistory)
			$('.medical-box .clinic-purpose span').html(remoteclinicInfo.clinicPurpose)
			var remoteclinicAttachmentList = msg.remoteclinicAttachmentList
			if (remoteclinicAttachmentList && remoteclinicAttachmentList.length) {
				var enclosureHtml = ''
				for (var i = 0; i < remoteclinicAttachmentList.length; i++) {
					enclosureHtml += '<a data-id="' + remoteclinicAttachmentList[i].storageId + '" data-description="' + remoteclinicAttachmentList[i].description + '" data-creator="' + remoteclinicAttachmentList[i].creator + '" data-time="' + new Date(remoteclinicAttachmentList[i].createTime).Format('yyyy-MM-dd hh:mm:ss')
					var name = remoteclinicAttachmentList[i].attachmentName.toLowerCase()
					var suffix = name.substr(name.lastIndexOf('.') + 1)
					var suffixList = ['png', 'bmp', 'jpg', 'gif', 'jpeg']
					enclosureHtml += suffixList.indexOf(suffix) > -1 ? '" class="openFile"' : '" href="' + msg.fileUrl + remoteclinicAttachmentList[i].storageId
					enclosureHtml += '">' + remoteclinicAttachmentList[i].attachmentName + '</a>'
				}
			}
			var prescriptionList = msg.prescriptionList
			if (prescriptionList && prescriptionList.length) {
				var report = msg.report
				var inventoryHtml = ''
				for (var i = 0; i < prescriptionList.length; i++) {
					inventoryHtml += '<div class="outpatient-apply-inventory border_box"><div class="inventory-title padding_20"><h2>远程门诊检验申请单</h2></div><div class="inventory-patient-info info-box padding_20 clearfix"><div class="patient-name">患者姓名：<span>' + patientInfo.patientName + '</span></div><div class="patient-gender">性别：<span>' + patientInfo.sexName + '</span></div><div class="patient-birth">出生日期：<span>'
					inventoryHtml += patientInfo.birthday ? new Date(patientInfo.birthday).Format('yyyy-MM-dd') : ''
					inventoryHtml += '</span></div><div class="patient-phone">联系电话：<span>'
					inventoryHtml += patientInfo.mobile ? patientInfo.mobile : ''
					inventoryHtml += '</span></div><div class="attendance-department">就诊科室：<span>' + remoteclinicInfo.applyRoomName + '</span></div><div class="attendance-date">就诊日期：<span>'
					inventoryHtml += remoteclinicInfo.applyDate ? new Date(remoteclinicInfo.applyDate).Format('yyyy-MM-dd') : ''
					inventoryHtml += '</span></div></div><div class="outpatient-info padding_20"><div class="patient-narrate">患者主诉：<span>' + remoteclinicInfo.mainSuit + '</span></div><div class="medical-history">病史：<span>' + remoteclinicInfo.diseaseHistory + '</span></div><div class="physique-examine">体格检查：<span>' + remoteclinicInfo.physicalExam + '</span></div><div class="primary-diagnosis">初步诊断：<span>' + report.diagnose + '</span></div><div class="dispose-suggest">处理意见：<span>' + report.advice + '</span></div></div><div class="doctor-info padding_20"><div class="doctor-name">医生姓名：<span>' + remoteclinicInfo.applyDoctorName + '</span></div><div class="belong-hospital">所属医院：<span>' + remoteclinicInfo.reqHospitalName + '</span></div><div class="outpatient-date">出诊日期：<span>'
					inventoryHtml += remoteclinicInfo.applyDate ? new Date(remoteclinicInfo.applyDate).Format('yyyy-MM-dd'): ''
					inventoryHtml += '</span></div><div class="doctor-signature">医生签名：<span></span></div></div></div>'
				}
				$('.inventory-wrap').html(inventoryHtml)
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
	$('body').on('click', '.outpatient-box .outcall-state .video-meeting', function () {
		// 视频会议
		window.open("https://rp.pexipdemo.cc/bbzy/?conference=6689&name="+ghDoctor.ghDoctor.doctorName+"&bw=1864&join=1&role=host&media=1")
	})
})