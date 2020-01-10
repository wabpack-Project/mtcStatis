var searchArr = location.search.split(/[?=&]/)
var consultationNo = searchArr[searchArr.indexOf('no') + 1]
var toEvaluate = searchArr.indexOf('toEvaluate') > -1 ? searchArr[searchArr.indexOf('toEvaluate') + 1] : undefined
var review = searchArr.indexOf('review') > -1 ? searchArr[searchArr.indexOf('review') + 1] : undefined
var ind = searchArr[searchArr.indexOf('ind') + 1]
var evaluateId
var consultationId
$(function () {
	var url = toEvaluate ? 'consultation/getConsultationMessageNew?toEvaluate=1&consultationNo=' + consultationNo : review ? 'consultation/getConsultationMessageNew?review=1&consultationNo=' + consultationNo : 'consultation/getConsultationMessageNew?consultationNo=' + consultationNo
	$.ajax({
		url: baseurl + url,
		type: 'get',
		success: function (msg) {
			var consultationInfo = msg.consultationInfo
			consultationId = consultationInfo.id
			$('.breadcrumb span[data-type=' + consultationInfo.consultationType + ']').show()
			switch (consultationInfo.state) {
				case 10:
					if (menu_id == 13) {
						$('.button-box .refuse,.button-box .pass').show()
					}
					break;
				case 11:
					$('.refuse-content').show().find('span').html(msg.content)
					break;
				case 30: 
					$('.button-box .send-message').show()
					break;
				case 40:
				case 50:
					$('.button-box .video-meeting').show()
					break;
				case 60:
					$('.tabs li[name="tab3"]').show()
					break;
				case 70: 
					$('.tabs li[name="tab3"],.tabs li[name="tab5"]').show()
					break;
			}
			if (consultationInfo.visitFlag == 1) {
				$('.tabs li[name="tab4"]').show()
			}
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
			$('.consul-time span').html(consultationInfo.reqDiagnoseTime ? new Date(consultationInfo.reqDiagnoseTime).Format('yyyy-MM-dd hh:mm') : '')
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
			// 报告信息
			$('.reality-time span').html(consultationInfo.startTime ? new Date(consultationInfo.startTime).Format('yyyy-MM-dd'): '')
			var reportList = msg.reportList
			if (reportList.length) {
				var doctorHtml = ''
				var docotrLiHtml = ''
				var reportHtml = ''
				for (var i = 0; i < reportList.length; i++) {
					doctorHtml += '<span>' + reportList[i].doctor1Name + '</span>'
					docotrLiHtml += '<li data-id=' + reportList[i].id + ' data-doctor1Id=' + reportList[i].doctor1Id + ' data-reviewerId=' + reportList[i].reviewerId + '>' + reportList[i].doctor1Name
					docotrLiHtml += reportList[i].triMain == 0? '（主诊）': '（辅诊）'
					docotrLiHtml += '</li>'
					if (i > 0) {
						var ele = $('.tab3 .report-info .consul-list li:first').clone()
						appendData(reportList[i], $(ele))
					}
				}
				appendData(reportList[0], $('.tab3 .report-info .consul-list li:first'))
				function appendData (data, ele) {
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
			// 复诊信息
			var patientInfo_visit = msg.patientInfo_visit
			if (patientInfo_visit) {
				$('.tab4 .patient-name span').html(patientInfo_visit.patientName)
				$('.tab4 .patient-gendar span').html(patientInfo_visit.sexName)
				$('.tab4 .patient-birth span').html(patientInfo_visit.birthday ? new Date(patientInfo_visit.birthday).Format('yyyy-MM-dd') : '')
				$('.tab4 .identity-type span').html(patientInfo_visit.crendentialName).attr('data-type', patientInfo_visit.crendentialType)
				$('.tab4 .identity-num span').html(patientInfo_visit.crendentialNo)
				if (patientInfo_visit.age) {
					$('.tab4 .patient-age span').html(patientInfo_visit.age + '岁')
				}
				$('.tab4 .patient-phone span').html(patientInfo_visit.mobile)
				$('.tab4 .marital-status span').html(patientInfo_visit.maritalName)
				$('.tab4 .patient-nationality span').html(patientInfo_visit.nationalName)
				$('.tab4 .patient-peoples span').html(patientInfo_visit.folkName)
				$('.tab4 .patient-work span').html(patientInfo_visit.workUnits)
				if (patientInfo_visit.height) {
					$('.tab4 .patient-stature span').html(patientInfo_visit.height + 'cm')
				}
				if (patientInfo_visit.weight) {
					$('.tab4 .patient-weight span').html(patientInfo_visit.weight + 'kg')
				}
				$('.tab4 .patient-location span').html(patientInfo_visit.address)
			}
			var consultationInfo_visit = msg.consultationInfo_visit
			if (consultationInfo_visit) {
				$('.tab4 .consul-way span').html(consultationInfo_visit.consultationWayType == 0? '交互式': '离线式')
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
				$('.tab4 .consul-pattern span').html(pattern)
				$('.tab4 .is-emergency span').html(consultationInfo_visit.isEmergency == 0? '平诊': '急诊')
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
				$('.tab4 .discipline span').html(disciplineName)
				$('.tab4 .consul-time span').html(consultationInfo_visit.reqDiagnoseTime ? new Date(consultationInfo_visit.reqDiagnoseTime).Format('yyyy-MM-dd hh:mm') : '')
				if (consultationInfo_visit.reqDiagnoseDoctor) {
					var doctorList = consultationInfo_visit.reqDiagnoseDoctor.split('、')
					if (doctorList.length) {
						var doctorHtml = ''
						for (var i = 0; i < doctorList.length; i++) {
							doctorHtml += '<span>' + doctorList[i] + '</span>'
						}
						$('.tab4 .consul-doctor div').html(doctorHtml)
					}
				}
				$('.tab4 .hospital-apply span').html(consultationInfo_visit.reqHospitalName)
				$('.tab4 .department-apply span').html(consultationInfo_visit.departmentName)
				$('.tab4 .doctor-apply span').html(consultationInfo_visit.reqDoctorName)
				$('.tab4 .doctor-phone span').html(consultationInfo_visit.reqDoctorPhone)
			}
			var consultationExtra_visit = msg.consultationExtra_visit
			if (consultationExtra_visit) {
				$('.tab4 .patient-narrate span').html(consultationExtra_visit.complaint)
				$('.tab4 .primary-diagnosis span').html(consultationExtra_visit.preDiagnose)
				$('.tab4 .consul-purpose span').html(consultationExtra_visit.consultationAim)				
			}
			var patientExtra_visit = msg.patientExtra_visit
			if (patientExtra_visit) {
				$('.tab4 .medical-history span').html(patientExtra_visit.dieaseHistory)
				$('.tab4 .present-medical span').html(patientExtra_visit.nowHistory)
				$('.tab4 .yesterday-medical span').html(patientExtra_visit.pastHistory)
				$('.tab4 .allergy-history span').html(patientExtra_visit.allergicHistory)
				$('.tab4 .family-medical span').html(patientExtra_visit.familyHistory)
				$('.tab4 .hospital-medicine span').html(patientExtra_visit.medicineDose)
				$('.tab4 .cure-course span').html(patientExtra_visit.cureProcess)
				$('.tab4 .health-checkup span').html(patientExtra_visit.physicalExamination)
				$('.tab4 .additional-remarks span').html(patientExtra_visit.remark)
			}
			var dicomInfoList_visit = msg.dicomInfoList_visit
			if (dicomInfoList_visit && dicomInfoList_visit.length) {
				var dicomHtml = ''
				for (var i = 0; i < dicomInfoList_visit.length; i++) {
					dicomHtml + '<tr data-id=' + dicomInfoList_visit[i].studyId + '><td>' + dicomInfoList_visit[i].patientId + '</td><td>' + dicomInfoList_visit[i].patientName + '</td><td>' + dicomInfoList_visit[i].modility + '</td><td>'
					dicomHtml += dicomInfoList_visit[i].examTime ? new Date(dicomInfoList_visit[i].examTime).Format('yyyy-MM-dd hh:mm') : ''
					dicomHtml += '</td><td>' + dicomInfoList_visit[i].imageCount + '</td><td><a class="look">打开</a></td><tr>'
				}
				$('.tab4 .screenage-information tbody').html(dicomHtml)
			}
			var ghConsultationAttachmentList_visit = msg.ghConsultationAttachmentList_visit
			if (ghConsultationAttachmentList_visit && ghConsultationAttachmentList_visit.length) {
				var uploadHtml = ''
				for (var i = 0; i < ghConsultationAttachmentList_visit.length; i++) {
					uploadHtml += '<tr data-id=' + ghConsultationAttachmentList_visit[i].storageId + '><td>' + ghConsultationAttachmentList_visit[i].attachmentName + '</td><td>'
					uploadHtml += ghConsultationAttachmentList_visit[i].createTime ? new Date(ghConsultationAttachmentList_visit[i].createTime).Format('yyyy-MM-dd hh:mm:ss') : ''
					uploadHtml += '</td><td>' + ghConsultationAttachmentList_visit[i].description + '</td><td><a class="look">打开</a></td></tr>'
				}
				$('tab4 .medical-information tbody').html(uploadHtml)
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
						var ele = $('.tab4 .report-info .consul-list li:first').clone()
						appendData1(reportList_visit[i], $(ele))
					}
				}
				appendData1(reportList_visit[0], $('.tab4 .report-info .consul-list li:first'))
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
				$('tab4 .reality-doctor div').html(doctorHtml)
				$('.tab4 .report-info .doctor-list').html(docotrLiHtml)
			} else {
				$('.tab4 .report-info').hide()
			}
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
			// 评价
			var evaluate = msg.evaluate
			if (evaluate) {
				evaluateId = evaluate.id
				$('.apply-propcess input[value="' + evaluate.applyProcess + '"]').prop('checked', true)
				$('.triage-propcess input[value="' + evaluate.triageProcess + '"]').prop('checked', true)
				$('.consul-period input[value="' + evaluate.consultationPeriod + '"]').prop('checked', true)
				$('.consul-demand input[value="' + evaluate.consultationAppeal + '"]').prop('checked', true)
				$('.resolve-demand input[value="' + evaluate.consultationAchieve + '"]').prop('checked', true)
				$('.wish-change textarea').val(evaluate.consultationImprove)
				$('.wish-update input[value="' + evaluate.consultationReinforce + '"]').prop('checked', true)
				$('.other-advise textarea').val(evaluate.suggest)
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
	$('body').on('click', '.tabs li', function () {
		// 切换选项卡显隐性同时调整“提交“按钮显隐性
		if ($(this).attr('name') == 'tab5') {
			$('.button-box .save').show()
		} else {
			$('.button-box .save').hide()
		}
	}).on('click', '.medical-information tbody .openFile', function () {
		// 打开病历附件
		// $("#scankrakatoa").attr("src",storeURL + $(this).prev().val())
  //   	$("#scankrakatoa_desc").html($(this).prev().attr("desc"));
  //   	$("#scankrakatoa_creator").html($(this).prev().attr("creator"));
  //   	$("#scankrakatoa_createTime").html($(this).prev().attr("createTime"));
  //   	$('.krakatoa').scrollTop(0);
		// self = this;
  //   	viewer.show()
	}).on('click', '.button-box .save', function () {
		// 提交评价
		var evaluate={};
		evaluate.id = evaluateId
		evaluate.consultationId = consultationId
		evaluate.applyProcess = $('.apply-propcess input:checked').val() 
		evaluate.triageProcess = $('.triage-propcess input:checked').val()
		evaluate.consultationPeriod = $('.consul-period input:checked').val()
		evaluate.consultationAppeal = $('.consul-demand input:checked').val()
		evaluate.consultationAchieve = $('.resolve-demand input:checked').val()
		evaluate.consultationImprove = $('.wish-change textarea').val()
		evaluate.consultationReinforce = $('.wish-update input:checked').val()
		evaluate.suggest = $('.other-advise textarea').val()
		$.ajax({
			url: baseurl + "/consultation/evaluateApply",
			dataType: "json",
			type: 'POST',
			cache: false,
			data: evaluate,
			success: function(result) {
				if(result) {
					window.location = "/mtcStatis/pages/consultation/myApply.html";
				}
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('click', '.button-box .pass', function () {
		// 通过审核
		if (confirm('确认申请审核通过？')) {
			var consultationFlow = {}
			consultationFlow.flowNode = 0 //审核通过
			consultationFlow.state = -1 
			consultationFlow.beginState = 10 //开始处理的会诊主表的流程状态：10，表示审核流程；20，表示分诊流程。
			consultationFlow.consultationId = consultationNo //会诊ID
			$.ajax({
				url: baseurl + "/consultation/requestReviewer",
				dataType: "json",
				type: 'POST',
				cache: false,
				data: consultationFlow,
				success: function(res) {
					if (res.status == -1) {
						alert(res.result)
					}else if(res.status == 1){
						//转到会诊审核页面
						window.location = "/mtcStatis/pages/consultation/applyCheck.html"
					}
				},
				error: function (err) {
					console.log(err)
				}
			})
		}
	}).on('click', '.button-box .refuse', function () {
		// 审核拒绝
		$('.mask,.refuse-box').show()
	}).on('change', '.refuse-box .refuse-reason select', function () {
		// 切换拒绝理由 修改理由描述填写框状态
		$('.refuse-box .refuse-desc textarea').attr('disabled', $(this).val() == '其他' ? false: true)
	}).on('click', '.refuse-box .besure', function () {
		// 提交拒绝理由
		var text = $('.refuse-box .refuse-reason select').val() == '其他' ? $('.refuse-box .refuse-desc textarea').val() : $('.refuse-box .refuse-reason select').val()
		var consultationFlow = {}
		consultationFlow.flowNode = -1 //审核拒绝
		consultationFlow.state = -1
		consultationFlow.beginState = 10 //开始处理的会诊主表的流程状态：10，表示审核流程；20，表示分诊流程。
		consultationFlow.flowContent = text//退回理由
		consultationFlow.consultationId = consultationNo //会诊ID
		$.ajax({
			url: $("#baseurl").val()+"/consultation/requestReviewer",
			dataType: "json",
			type: 'POST',
			cache: false,
			data: consultationFlow,
			success: function(res) {
				if (res.status == -1) {
					alert(res.result)
				}else if(res.status == 1){
					//转到会诊审核页面
					window.location = "/mtcStatis/pages/consultation/applyCheck.html"
				}
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('click', '.button-box .back', function () {
		// 返回页面
		window.location.href = $('.sBox ul li a[data-index="' + ind + '"]').attr('href')
	})
})