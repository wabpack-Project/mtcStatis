var searchArr = location.search.split(/[?=&]/)
var consultationNo = searchArr[searchArr.indexOf('no') + 1]
$(function () {
	$.ajax({
		url: baseurl + 'consultationTriage/getConTransferMessage_lookNew?consultationNo=' + consultationNo,
		type: 'get',
		success: function (msg) {
			var consultationInfo = msg.consultationInfo
			if (consultationInfo.visitFlag == 1) {
				$('.tabs li[name="tab3"]').show()
			} else {
				$('.tabs li[name="tab3"]').hide()
			}
			if (consultationInfo.state == 11) {
				$('.refuse-content').show().find('span').html(msg.content)
			}
			consultationInfo.state == 20 ? $('.button-box .pass,.button-box .refuse').show() : $('.button-box .pass,.button-box .refuse').hide()
			consultationInfo.state == 30 ? $('.button-box .send-message').show() : $('.button-box .send-message').hide()
			// 申请信息-患者信息
			var patientInfo = msg.patientInfo
			$('.patient-name span').html(patientInfo.patientName)
			$('.patient-gendar span').html(patientInfo.sexName)
			$('.patient-birth span').html(patientInfo.birthday ? new Date(patientInfo.birthday).Format('yyyy-MM-dd') : '')
			var patientCredential = msg.patientCredential
			$('.identity-type span').html(patientCredential.crendentialName).attr('data-type', patientCredential.crendentialType)
			$('.identity-num span').html(patientCredential.crendentialNo)
			if (patientInfo.age) {
				$('.patient-age span').html(patientInfo.age + '岁')
			}
			$('.patient-phone span').html(patientInfo.mobile)
			$('.marital-status span').html(patientInfo.maritalName)
			$('.patient-nationality span').html(patientInfo.nationalName)
			$('.patient-peoples span').html(patientInfo.folkName)
			$('.patient-work span').html(patientInfo.workUnits)
			if (patientInfo.height) {
				$('.patient-stature span').html(patientInfo.height + 'cm')
			}
			if (patientInfo.weight) {
				$('.patient-weight span').html(patientInfo.weight + 'kg')
			}
			$('.patient-location span').html(patientInfo.address)
			// 申请信息-会诊信息
			$('.consul-way span').html(consultationInfo.consultationWayType == 0? '交互式': '离线式')
			var pattern
			switch (consultationInfo.reqType) {
				case 0: pattern = '单方'
					break;
				case 1: pattern = 'MDT'
					break;
				case 2: pattern = '特需'
					break;
				case 3: pattern = '点名'
					break;
			}
			$('.consul-pattern span').html(pattern)
			$('.is-emergency span').html(consultationInfo.isEmergency == 0? '平诊': '急诊')
			$('.discipline span').html(consultationInfo.disciplineName)
			$('.wish-consul-time span').html(consultationInfo.reqDiagnoseTime ? new Date(consultationInfo.reqDiagnoseTime).Format('yyyy-MM-dd hh:mm') : '')
			if (consultationInfo.reqDiagnoseDoctor) {
				var doctorList = consultationInfo.reqDiagnoseDoctor.split('、')
				if (doctorList.length) {
					var doctorHtml = ''
					for (var i = 0; i < doctorList.length; i++) {
						doctorHtml += '<span>' + doctorList[i] + '</span>'
					}
					$('.consul-doctor div').html(doctorHtml)
				}
			}
			$('.hospital-apply span').html(consultationInfo.reqHospitalName)
			$('.department-apply span').html(consultationInfo.departmentName)
			$('.doctor-apply span').html(consultationInfo.reqDoctorName)
			$('.doctor-phone span').html(consultationInfo.reqDoctorPhone)
			// 病历信息
			var consultationExtra = msg.consultationExtra
			$('.patient-narrate span').html(consultationExtra.complaint)
			$('.primary-diagnosis span').html(consultationExtra.preDiagnose)
			$('.consul-purpose span').html(consultationExtra.consultationAim)
			var patientExtra = msg.patientExtra
			$('.medical-history span').html(patientExtra.dieaseHistory)
			$('.present-medical span').html(patientExtra.nowHistory)
			$('.yesterday-medical span').html(patientExtra.pastHistory)
			$('.allergy-history span').html(patientExtra.allergicHistory)
			$('.family-medical span').html(patientExtra.familyHistory)
			$('.hospital-medicine span').html(patientExtra.medicineDose)
			$('.cure-course span').html(patientExtra.cureProcess)
			$('.health-checkup span').html(patientExtra.physicalExamination)
			$('.additional-remarks span').html(patientExtra.remark)
			// 病历信息-资料信息
			var dicomInfoList = msg.dicomInfoList
			if (dicomInfoList.length) {
				var dicomHtml = ''
				for (var i = 0; i < dicomInfoList.length; i++) {
					dicomHtml += '<tr data-id=' + dicomInfoList[i].studyId + '><td>' + dicomInfoList[i].patientId + '</td><td>' + dicomInfoList[i].modility + '</td><td>'
					dicomHtml += dicomInfoList[i].examTime ? new Date(dicomInfoList[i].examTime).Format('yyyy-MM-dd hh:mm') : ''
					dicomHtml += '</td><td>' + dicomInfoList[i].imageCount + '</td><td><a class="look" onclick="callDicomBrower(\'' + dicomInfoList[i].studyId + '\')">打开</a></td><tr>'
				}
				$('.tab2 .screenage-information tbody').html(dicomHtml)
			}
			var ghConsultationAttachmentList = msg.ghConsultationAttachmentList
			if (ghConsultationAttachmentList.length) {
				var uploadHtml = ''
				for (var i = 0; i < ghConsultationAttachmentList.length; i++) {
					uploadHtml += '<tr data-id=' + ghConsultationAttachmentList[i].storageId + '><td>' + ghConsultationAttachmentList[i].attachmentName + '</td><td>'
					uploadHtml += ghConsultationAttachmentList[i].createTime ? new Date(ghConsultationAttachmentList[i].createTime).Format('yyyy-MM-dd hh:mm:ss') : ''
					uploadHtml += '</td><td>'
					uploadHtml += ghConsultationAttachmentList[i].description ? ghConsultationAttachmentList[i].description : ''
					uploadHtml += '</td><td><a class="look'
					if (ghConsultationAttachmentList[i].attachmentName) {
						var name = ghConsultationAttachmentList[i].attachmentName.toLowerCase()
						var suffix = name.substr(name.lastIndexOf('.') + 1)
						var suffixList = ['png', 'bmp', 'jpg', 'gif', 'jpeg']
						if (suffixList.indexOf(suffix) > -1) {
							uploadHtml += ' openFile"'
						} else {
							uploadHtml += '" href="' + msg.fileUrl + ghConsultationAttachmentList[i].storageId + '"'
						}
					}
					uploadHtml += '>打开</a></td></tr>'
				}
				$('.tab2 .medical-information tbody').html(uploadHtml)
			}
			// 复诊信息
			var patientInfo_visit = msg.patientInfo_visit
			if (patientInfo_visit) {
				$('.tab3 .patient-name span').html(patientInfo_visit.patientName)
				$('.tab3 .patient-gendar span').html(patientInfo_visit.sexName)
				$('.tab3 .patient-birth span').html(patientInfo_visit.birthday ? new Date(patientInfo_visit.birthday).Format('yyyy-MM-dd') : '')
				$('.tab3 .identity-type span').html(patientInfo_visit.crendentialName).attr('data-type', patientInfo_visit.crendentialType)
				$('.tab3 .identity-num span').html(patientInfo_visit.crendentialNo)
				if (patientInfo_visit.age) {
					$('.tab3 .patient-age span').html(patientInfo_visit.age + '岁')
				}
				$('.tab3 .patient-phone span').html(patientInfo_visit.mobile)
				$('.tab3 .marital-status span').html(patientInfo_visit.maritalName)
				$('.tab3 .patient-nationality span').html(patientInfo_visit.nationalName)
				$('.tab3 .patient-peoples span').html(patientInfo_visit.folkName)
				$('.tab3 .patient-work span').html(patientInfo_visit.workUnits)
				if (patientInfo_visit.height) {
					$('.tab3 .patient-stature span').html(patientInfo_visit.height + 'cm')
				}
				if (patientInfo_visit.weight) {
					$('.tab3 .patient-weight span').html(patientInfo_visit.weight + 'kg')
				}
				$('.tab3 .patient-location span').html(patientInfo_visit.address)
			}
			var consultationInfo_visit = msg.consultationInfo_visit
			if (consultationInfo_visit) {
				$('.tab3 .consul-way span').html(consultationInfo_visit.consultationWayType == 0? '交互式': '离线式')
				var pattern
				switch (consultationInfo_visit.reqType) {
					case 0: pattern = '单方'
						break;
					case 1: pattern = 'MDT'
						break;
					case 2: pattern = '特需'
						break;
					case 3: pattern = '点名'
						break;
				}
				$('.tab3 .consul-pattern span').html(pattern)
				$('.tab3 .is-emergency span').html(consultationInfo_visit.isEmergency == 0? '平诊': '急诊')
				var disciplineName = ''
				switch (consultationInfo_visit.disciplineId) {
					case '1': 
						disciplineName = '临床诊断学'
						break;
					case '9': 
						disciplineName = '保健医学'
						break;
					case '14': 
						disciplineName = '理疗学'
						break;
					case '15': 
						disciplineName = '麻醉学'
						break;
					case '20': 
						disciplineName = '内科学'
						break;
					case '32': 
						disciplineName = '外科学'
						break;
					case '46': 
						disciplineName = '妇产科学'
						break;
					case '54': 
						disciplineName = '儿科学'
						break;
					case '55': 
						disciplineName = '眼科学'
						break;
					case '56': 
						disciplineName = '耳鼻咽喉科学'
						break;
					case '57': 
						disciplineName = '口腔医学'
						break;
					case '68': 
						disciplineName = '皮肤病学'
						break;
					case '69': 
						disciplineName = '性医学'
						break;
					case '70': 
						disciplineName = '神经病学'
						break;
					case '71': 
						disciplineName = '精神病学(包括精神卫生及行为医学等)'
						break;
					case '72': 
						disciplineName = '急诊医学'
						break;
					case '73': 
						disciplineName = '核医学'
						break;
					case '74': 
						disciplineName = '肿瘤学'
						break;
					case '83': 
						disciplineName = '护理学'
						break;
				}
				$('.tab3 .discipline span').html(disciplineName)
				$('.tab3 .consul-time span').html(consultationInfo_visit.reqDiagnoseTime ? new Date(consultationInfo_visit.reqDiagnoseTime).Format('yyyy-MM-dd hh:mm') : '')
				if (consultationInfo_visit.reqDiagnoseDoctor) {
					var doctorList = consultationInfo_visit.reqDiagnoseDoctor.split('、')
					if (doctorList.length) {
						var doctorHtml = ''
						for (var i = 0; i < doctorList.length; i++) {
							doctorHtml += '<span>' + doctorList[i] + '</span>'
						}
						$('.tab3 .consul-doctor div').html(doctorHtml)
					}
				}
				$('.tab3 .hospital-apply span').html(consultationInfo_visit.reqHospitalName)
				$('.tab3 .department-apply span').html(consultationInfo_visit.departmentName)
				$('.tab3 .doctor-apply span').html(consultationInfo_visit.reqDoctorName)
				$('.tab3 .doctor-phone span').html(consultationInfo_visit.reqDoctorPhone)
			}
			var consultationExtra_visit = msg.consultationExtra_visit
			if (consultationExtra_visit) {
				$('.tab3 .patient-narrate span').html(consultationExtra_visit.complaint)
				$('.tab3 .primary-diagnosis span').html(consultationExtra_visit.preDiagnose)
				$('.tab3 .consul-purpose span').html(consultationExtra_visit.consultationAim)				
			}
			var patientExtra_visit = msg.patientExtra_visit
			if (patientExtra_visit) {
				$('.tab3 .medical-history span').html(patientExtra_visit.dieaseHistory)
				$('.tab3 .present-medical span').html(patientExtra_visit.nowHistory)
				$('.tab3 .yesterday-medical span').html(patientExtra_visit.pastHistory)
				$('.tab3 .allergy-history span').html(patientExtra_visit.allergicHistory)
				$('.tab3 .family-medical span').html(patientExtra_visit.familyHistory)
				$('.tab3 .hospital-medicine span').html(patientExtra_visit.medicineDose)
				$('.tab3 .cure-course span').html(patientExtra_visit.cureProcess)
				$('.tab3 .health-checkup span').html(patientExtra_visit.physicalExamination)
				$('.tab3 .additional-remarks span').html(patientExtra_visit.remark)
			}
			var dicomInfoList_visit = msg.dicomInfoList_visit
			if (dicomInfoList_visit && dicomInfoList_visit.length) {
				var dicomHtml = ''
				for (var i = 0; i < dicomInfoList_visit.length; i++) {
					dicomHtml + '<tr data-id=' + dicomInfoList_visit[i].studyId + '><td>' + dicomInfoList_visit[i].patientId + '</td><td>' + dicomInfoList_visit[i].patientName + '</td><td>' + dicomInfoList_visit[i].modility + '</td><td>'
					dicomHtml += dicomInfoList_visit[i].examTime ? new Date(dicomInfoList_visit[i].examTime).Format('yyyy-MM-dd hh:mm') : ''
					dicomHtml += '</td><td>' + dicomInfoList_visit[i].imageCount + '</td><td><a class="look">打开</a></td><tr>'
				}
				$('.tab3 .screenage-information tbody').html(dicomHtml)
			}
			var ghConsultationAttachmentList_visit = msg.ghConsultationAttachmentList_visit
			if (ghConsultationAttachmentList_visit && ghConsultationAttachmentList_visit.length) {
				var uploadHtml = ''
				for (var i = 0; i < ghConsultationAttachmentList_visit.length; i++) {
					uploadHtml += '<tr data-id=' + ghConsultationAttachmentList_visit[i].storageId + '><td>' + ghConsultationAttachmentList_visit[i].attachmentName + '</td><td>'
					uploadHtml += ghConsultationAttachmentList_visit[i].createTime ? new Date(ghConsultationAttachmentList_visit[i].createTime).Format('yyyy-MM-dd hh:mm:ss') : ''
					uploadHtml += '</td><td>' + ghConsultationAttachmentList_visit[i].description + '</td><td><a class="look">打开</a></td></tr>'
				}
				$('tab3 .medical-information tbody').html(uploadHtml)
			}
			var reportList_visit = msg.reportList_visit
			if (reportList_visit && reportList_visit.length) {
				var doctorHtml = ''
				var docotrLiHtml = ''
				var reportHtml = ''
				for (var i = 0; i < reportList_visit.length; i++) {
					doctorHtml += '<span>' + reportList_visit[i].doctor1Name + '</span>'
					docotrLiHtml += '<li data-id=' + reportList_visit[i].id + ' data-doctor1Id=' + reportList_visit[i].doctor1Id + ' data-reviewerId=' + reportList_visit[i].reviewerId + '>' + reportList_visit[i].doctor1Name
					docotrLiHtml += reportList_visit[i].triMain == 0? '（主诊）': '（辅诊）'
					docotrLiHtml += '</li>'
					if (i > 0) {
						var ele = $('.tab3 .report-info .consul-list li:first').clone()
						appendData1(reportList_visit[i], $(ele))
					}
				}
				appendData1(reportList_visit[0], $('.tab3 .report-info .consul-list li:first'))
				function appendData1 (data, ele) {
					if (data.ghReportPropertiesSet.length) {
						var icdHtml = ''
						for (var j = 0; j < data.ghReportPropertiesSet.length; j++) {
							icdHtml += '<p>' + data.ghReportPropertiesSet[j].propertyName + '</p>'
						}
					}
					ele.find('.icd-10 div').html(icdHtml)
					ele.find('.diagnose-desc span').html(data.diagnose)
					ele.find('.cure-opinion span').html(data.advice)
					ele.find('.report-doctor span').html(data.doctor1Name).attr('data-id', data.doctor1Id)
					ele.find('.report-time span').html(data.updateTime ? new Date(data.updateTime).Format('yyyy-MM-dd') : data.createTime ? new Date(data.createTime).Format('yyyy-MM-dd') : '')
					ele.find('.checked-doctor span').html(data.reviewerName).attr('data-id', data.reviewerId)
					ele.find('.checked-time span').html(data.reviewTime ? new Date(data.reviewTime).Format('yyyy-MM-dd') : '')
				}
				$('tab3 .reality-doctor div').html(doctorHtml)
				$('.tab3 .report-info .doctor-list').html(docotrLiHtml)
			} else {
				$('.tab3 .report-info').hide()
			}
			$('.triage-box .consul-time span').html(consultationInfo.reqDiagnoseTime ? new Date(consultationInfo.reqDiagnoseTime).Format('yyyy-MM-dd hh:mm') : '')
			$('.triage-box .desMtc-box span').html(msg.mtcName)
			// 流程状态
			var flow10 = msg.flow10
			if (flow10) {
				var ele = $('.timeline-box .consul-apply')
				ele.addClass('active').find('.operation-user').html(flow10.operUserName).siblings('.operation-hospital').html(flow10.operUserHospital).siblings('.operation-time').html(flow10.operTime ? new Date(flow10.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			var flow20 = msg.flow20
			if (flow20) {
				var ele = $('.timeline-box .apply-check')
				ele.addClass('active').find('.operation-user').html(flow20.operUserName).siblings('.operation-hospital').html(flow20.operUserHospital).siblings('.operation-time').html(flow20.operTime ? new Date(flow20.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			var flow30 = msg.flow30
			if (flow30) {
				var ele = $('.timeline-box .triage')
				ele.addClass('active').find('.operation-user').html(flow30.operUserName).siblings('.operation-hospital').html(flow30.operUserHospital).siblings('.operation-time').html(flow30.operTime ? new Date(flow30.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			var flow40 = msg.flow40
			if (flow40) {
				var ele = $('.timeline-box .diagnose')
				ele.addClass('active').find('.operation-user').html(flow40.operUserName).siblings('.operation-hospital').html(flow40.operUserHospital).siblings('.operation-time').html(flow40.operTime ? new Date(flow40.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			var flow50 = msg.flow50
			if (flow50) {
				var ele = $('.timeline-box .report-check')
				ele.addClass('active').find('.operation-user').html(flow50.operUserName).siblings('.operation-hospital').html(flow50.operUserHospital).siblings('.operation-time').html(flow50.operTime ? new Date(flow50.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			var flow60 = msg.flow60
			if (flow60) {
				var ele = $('.timeline-box .report-load')
				ele.addClass('active').find('.operation-user').html(flow60.operUserName).siblings('.operation-hospital').html(flow60.operUserHospital).siblings('.operation-time').html(flow60.operTime ? new Date(flow60.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			var flow70 = msg.flow70
			if (flow70) {
				var ele = $('.timeline-box .finished')
				ele.addClass('active').find('.operation-user').html(flow70.operUserName).siblings('.operation-hospital').html(flow70.operUserHospital).siblings('.operation-time').html(flow70.operTime ? new Date(flow70.operTime).Format('yyyy-MM-dd hh:mm') : '')
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
	$('body').on('click', '.button-box .pass', function () {
		// 通过分诊转出
		var desMtc = $('.triage-box .desMtc-box select').val()
		if(!desMtc){
			alert("请选择转出医联体")
			return
		}
		if (confirm('确定通过此会诊分诊吗')) {
			$.ajax({
				url: baseurl + "/consultationTriage/conTransfer?desMtcId=" + desMtc + "&consultationNo="+consultationNo,
				dataType: "json",
				type: 'POST',
				cache: false,
				data: {},
				success: function(result) {
					var status = result.status
					if(status == 1) {
						window.location = '/mtcStatis/pages/consultation/consultationTransfer.html'
					}else if(status == -1){
						alert(result.result)
					}
				},
				error: function(err) {
					console.log(err)
					window.location = '/mtcStatis/pages/consultation/consultationTransfer.html'
				}
			})
		}
	}).on('click', '.button-box .refuse', function () {
		// 点击拒绝按钮 弹出拒绝设置弹框
		$('.setBox.refuse-box,.mask').show()
	}).on('change', '.refuse-box .refuse-reason select', function () {
		// 切换拒绝理由 修改理由描述填写框状态
		$('.refuse-box .refuse-desc textarea').attr('disabled', $(this).val() == '其他' ? false: true)
	}).on('click', '.refuse-box .besure', function () {
		// 确认拒绝
		var text = $('.refuse-box .refuse-reason select').val() == '其他' ? $('.refuse-box .refuse-desc textarea').val() : $('.refuse-box .refuse-reason select').val()
		var consultationFlow = {}
		consultationFlow.flowNode = -1 //拒绝
		consultationFlow.state = -1 
		consultationFlow.beginState = 20 //开始处理的会诊主表的流程状态：10，表示审核流程；20，表示分诊流程。
		consultationFlow.flowContent = text;//退回理由
		consultationFlow.consultationId = consultationNo
		$.ajax({
			url: baseurl + "/consultationTriage/requestReviewer",
			dataType: "json",
			type: 'POST',
			cache: false,
			data: consultationFlow,
			success: function(result) {
				if(result) {
					//转到会诊审核页面
					window.location = '/mtcStatis/pages/consultation/consultationTransfer.html'
				}
			},
			error: function(err) {
				//转到会诊审核页面
				window.location = '/mtcStatis/pages/consultation/consultationTransfer.html'
			}
		})
	})
})