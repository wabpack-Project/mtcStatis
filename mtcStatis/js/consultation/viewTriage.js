var searchArr = location.search.split(/[?=&]/)
var consultationNo = searchArr[searchArr.indexOf('no') + 1]
var doctorPostData = {}
var doctorPageNum = 1
var reqType //会诊模式
// 获取医生列表
function getDoctorList () {
	$.ajax({
		url: baseurl + 'doctorManagement/getDoctorSelectorList',
		type: 'post',
		data: JSON.stringify(doctorPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (doctorList) {
			var data = doctorList.rows
			if (data.length) {
				var length = data.length > 5? 5: data.length
				var listHtml = ''
				for (var i = 0; i < data.length; i++) {
					listHtml += '<tr><td><input type="checkbox" class="default" data-id="' + data[i].id + '"'
					if ($('.reality-doctor tbody tr[data-id=' + data[i].id + ']').length) {
						listHtml += ' checked'
					}
					listHtml += ' /></td><td class="doctor-name">' + data[i].doctorName + '</td><td>'
					switch (data[i].sex) {
						case '1':
							listHtml += '男'
							break;
						case '2':
							listHtml += '女'
							break;
						case '4':
							listHtml += '未知'
							break;
					}
					listHtml += '</td><td>'
					listHtml += data[i].birthday ? new Date(data[i].birthday).Format('yyyy-MM-dd') : ''
					listHtml += '</td><td class="doctor-title">' + data[i].doctorTitle + '</td><td class="doctor-hospital">' + data[i].hospitalId + '</td><td class="doctor-department">' + data[i].departmentId + '</td></tr>'
				}
				$('.selectDoctor .doctor-list tbody').html(listHtml)
				getDoctorPageData(doctorList)
			} else {
				$('.selectDoctor .doctor-list tbody').html('')
				$('.selectDoctor .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取医生分页数据
function getDoctorPageData (data) {
	$('.bselectDoctor .page').paging({
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
	$('.selectDoctor .page').parent().show()
}
// // 设置固定表头宽度与表格一致
// function changeTheadWidth () {
// 	$('.selectDoctor .select-content thead th').each(function (i) {
// 		$('.selectDoctor .select-head thead th').eq(i).width($(this).width() + 'px')
// 	})
// }
$(function () {
	$.ajax({
		url: baseurl + 'consultation/getConsultationMessageNew?consultationNo=' + consultationNo,
		type: 'get',
		success: function (msg) {
			var consultationInfo = msg.consultationInfo
			reqType = consultationInfo.reqType
			if (consultationInfo.visitFlag == 1) {
				$('.tabs li[name="tab3"]').show()
			} else {
				$('.tabs li[name="tab3"]').hide()
			}
			if (consultationInfo.state == 11) {
				$('.refuse-content').show().find('span').html(msg.content)
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
			// 分诊数据
			if (consultationInfo.reqDiagnoseTime) {
				$('.triage-box .wish-time span').html(consultationInfo.reqDiagnoseTime ? new Date(consultationInfo.reqDiagnoseTime).Format('yyyy-MM-dd hh:mm') : '')
			}
			if (consultationInfo.reqDiagnoseDoctor) {
				var doctorList = consultationInfo.reqDiagnoseDoctor.split('、')
				if (doctorList.length) {
					var doctorHtml = ''
					for (var i = 0; i < doctorList.length; i++) {
						doctorHtml += '<p>' + doctorList[i] + '</p>'
					}
					$('.triage-box .wish-doctor div').html(doctorHtml)
				}
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
		},
		error: function (err) {
			console.log(err)
		}
	})
	// 设置只能选择当前之后的时间
	if ($('.input-date.afterNow').length) {
		var startDate = new Date()
		$('.input-date.afterNow').datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			autoclose: true,
			language: 'zh-CN',
			startDate: startDate
		})
	}
	$('body').on('click', '.reality-consul .select-doctor', function () {
		// 显示选择专家弹框
		var hospitalInfo = getHospitalInfo(1)
		var hospitalHtml = '<option value="">请选择</option>'
		for (var i = 0; i < hospitalInfo.length; i++) {
			hospitalHtml += '<option value=' + hospitalInfo[i].id + ' data-id=' + hospitalInfo[i].eid + '>' + hospitalInfo[i].hospitalName + '</option>'
		}
		$('.selectDoctor .doctor-hospital select').html(hospitalHtml)
		// 获取医生级别
		getSystemParameter(56, $('.selectDoctor .doctor-title select'))
		$('.mask,.selectDoctor').show()
		Page.showCount = 5
		Page.currentPage = 1
		doctorPostData.page = Page
		doctorPostData.mtcdetails = mtcdetails ? mtcdetails : "'-1'"
		getDoctorList()
	}).on('change', '.selectDoctor .doctor-hospital select', function () {
		// 修改专家选择所在医院 获取所在科室数据
		var postData = {}
		postData.parentid = $(this).find('option:selected').attr('data-id')
		postData.menu_id = menu_id
		postData.role_id = ghDoctor.roleId
		$.ajax({
			url: baseurl + 'mtc/mtceparent',
			type: 'post',
			data: postData,
			dataType: 'json',
			success: function (departmentList) {
				var departmentHtml = '<option value="">请选择</option>'
				if (departmentList.length) {
					for (var i = 0; i < departmentList.length; i++) {
						departmentHtml += '<option value="' + departmentList[i].e_id + '" data-id="' + departmentList[i].id + '">' + departmentList[i].e_name + '</option>'
					}
				}
				$('.selectDoctor .doctor-department select').html(departmentHtml)
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('change', '.selectDoctor .doctor-department select', function () {
		// 修改专家选择所在科室 获取医生姓名
		var postData = {}
		postData.parentid = $(this).find('option:selected').attr('data-id')
		$.ajax({
			url: baseurl + 'mtc/mtceparent',
			type: 'post',
			data: postData,
			dataType: 'json',
			success: function (doctorList) {
				var doctorHtml = '<option value="">请选择</option>'
				if (doctorList.length) {
					for (var i = 0; i < doctorList.length; i++) {
						doctorHtml += '<option value="' + doctorList[i].e_id + '" data-id="' + doctorList[i].id + '">' + doctorList[i].e_name + '</option>'
					}
				}
				$('.selectDoctor .doctor-name select').html(doctorHtml)
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('click', '.selectDoctor .search-box .search', function () {
		// 根据搜索条件查询专家数据
		var parents = $(this).parents('.search-box')
		doctorPostData.hospitalName = parents.find('.doctor-hospital select').val()? parents.find('.doctor-hospital select option:selected').text(): undefined
		doctorPostData.departmentName = parents.find('.doctor-department select').val()? parents.find('.doctor-department select option:selected').text(): undefined
		doctorPostData.doctorName = parents.find('.doctor-name select').val()? parents.find('.doctor-name select option:selected').text(): undefined
		doctorPostData.doctorTitle = parents.find('.doctor-title select').val()? parents.find('.doctor-title select').val(): undefined
		doctorPostData.mtcdetails = mtcdetails ? mtcdetails: "'-1'"
		doctorPageNum = 1
		Page.currentPage = 1
		doctorPostData.page = Page
		getDoctorList()
	}).on('click', '.selectDoctor .besure', function () {
		// 确认添加会诊专家
		if ($('.selectDoctor tbody input:checked').length) {
			$('.selectDoctor tbody input:checked').each(function () {
				var parents = $(this).parents('tr')
				var doctorId = $(this).attr('data-id')
				// 会诊专家列表中没有当前项
				if (!$('.reality-doctor table tbody tr[data-id="' + doctorId + '"]').length) {
					var name = parents.find('.doctor-name').text()
					var title = parents.find('.doctor-title').text()
					var hospital = parents.find('.doctor-hospital').text()
					var department = parents.find('.doctor-department').text()
					var tr = document.createElement('tr')
					tr.setAttribute('data-id', doctorId)
					tr.innerHTML = '<td class="doctor-name">' + name + '</td><td class="doctor-title">' + title + '</td><td class="doctor-hospital">' + hospital + '</td><td class="doctor-department">' + department + '</td><td><textarea placeholder="请输入30字以内备注"></textarea></td><td><a class="look">设为主诊</a><a class="modify doctor-remove">移除</a></td>'
					$('.reality-doctor table tbody').append(tr)
				}
			})
			$('.listBox.selectDoctor,.mask').hide()
		} else {
			alert('请先选择专家')
		}
	}).on('click', '.reality-doctor table tbody .look', function () {
		// 设为主诊
		if (!$(this).hasClass('gray')) {
			$(this).parents('tr').attr('data-main', 1)
			$(this).addClass('gray')
		}
	}).on('click', '.reality-doctor table tbody .doctor-remove', function () {
		// 移除已添加专家
		if (confirm('确认移除该项？')) {
			$(this).parents('tr').remove()
		}
	}).on('click', '.button-box .pass', function () {
		// 通过审核
		var doctorTr = $('.reality-consul .reality-doctor tbody tr')
		if (!$('.reality-consul .reality-time input').val()) {
	    	alert("会诊时间不能为空")
	    	return
	    }
	    if (doctorTr.length == 0) {
	    	alert("请选择会诊专家")
	    	return
	    }
	    //单方模式必须选择1个会诊专家
	    if(reqType == 0){
	    	if(doctorTr.length > 1){
	    		alert("单方模式只能选择一个会诊专家")
	    		return
	    	}
	    }
	    if ($('.reality-consul .reality-doctor tbody tr[data-main=1]').length == 0) {
	    	alert('请设置主诊医生')
	    	return
	    }
	    //获取医院、科室、专家
	    for (var i = 0; i < doctorTr.length; i++) {
	    	if (doctorTr.eq(i).find('textarea').val().length > 30) {
	    		alert('请输入30个字以内备注')
	    		return
	    	}
			var s = "";
	    	var main = doctorTr.eq(i).attr('data-main') ? doctorTr.eq(i).attr('data-main') : 0
	    	var value = doctorTr.eq(i).find('textarea').val() ? doctorTr.eq(i).find('textarea').val() : 'null'
	    	s = main + "-" + doctorTr.eq(i).data("id")+ "-" + value
		    str = str + s + ","
	    }
		if (confirm('确定此会诊分诊通过吗？')) {
			var createConf = {"LOGICNAME":"ArtificialConference","TOKEN": "1","MESSAGEID":"1","DATAS":{"serverType":"Pexip","conferenceName":consultationNo}}
			var time = new Date($('.reality-consul .reality-time input').val()).getTime()
			//加上时间
			str= str +time
			var consultationFlow={};
			consultationFlow.flowNode = 0 //分诊通过
			consultationFlow.state = -1 
			consultationFlow.beginState = 20 //开始处理的会诊主表的流程状态：10，表示审核流程；20，表示分诊流程。
			consultationFlow.consultationId = consultationNo //会诊ID
			consultationFlow.flowContent = str
			$.ajax({
				url: baseurl + "/consultationTriage/requestReviewer",
				dataType: "json",
				type: 'POST',
				cache: false,
				data: consultationFlow,
				success: function(res) {
					if (res.status == -1) {
						alert(res.result)
					}else if(res.status == 1){
						$.ajax({
							url: "http://"+window.location.host+"/ConferenceServer-0.0.1-SNAPSHOT/FastStart",
							dataType: "json",
							type: 'POST',
							contentType: "application/json;charset=UTF-8",
							cache: false,
							data: JSON.stringify(createConf),
							success: function(res) {
								console.log(res)
							},
							error: function (err) {
								console.log(err)
							}
						})
						window.location.href = '/mtcStatis/pages/consultation/triage.html'
					}
				}
			});
			var appointmentVo = {
					"fromAppType":"1",
					"fromConsultationPurposes":"讨论一下手术方案!",
					"fromDataUrl":"http://biadu.com",
					"fromDeptName":"心内科",
					"fromDevice":"2",
					"fromDoctorFirstVisit":"第一诊断为白血病",
					"fromDoctorMobile":"13301302643",
					"fromDoctorName":"张全科",
					"fromExpectDate":"2018-12-10 10:20:30",
					"fromOrgCode":"110",
					"fromOrgName":"北京市",
					"fromPatientAddress":"北京西城区广安门",
					"fromPatientAge":"30",
					"fromPatientGender":"男",
					"fromPatientHeight":"178",
					"fromPatientIdcard":"110198512261214563",
					"fromPatientMainSuit":"主诉:身体不舒服,头晕,呕吐！",
					"fromPatientMobile":"15632145698",
					"fromPatientName":"张强",
					"fromPatientWeight":"86",
					"fromType":"0",
					"toDeptName":"心外专科",
					"toDoctorMobile":"18801302640",
					"toDoctorName":"邢大夫",
					"toOrgCode":"310",
					"toOrgName":"上海"
			};
			$.ajax({
				url: baseurl + "/consultationTriage/postAppointment",
				dataType: "json",
				type: 'POST',
				cache: false,
				data: appointmentVo,
				success: function(res) {
					console.log(res)
				},
				error: function (err) {
					console.log(err)
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
		var text = $('.refuse-box .refuse-reason select').val() == '其他' ? $('.refuse-box .refuse-desc textarea').val() : $('.refuse-box .refuse-reason select').val()
		var consultationFlow={};
		consultationFlow.flowNode = -1; //拒绝
		consultationFlow.state = -1; 
		consultationFlow.beginState = 20; //开始处理的会诊主表的流程状态：10，表示审核流程；20，表示分诊流程。
		consultationFlow.flowContent = text //退回理由
		consultationFlow.consultationId = consultationNo //会诊ID
		$.ajax({
			url: baseurl + "/consultationTriage/requestReviewer",
			dataType: "json",
			type: 'POST',
			cache: false,
			data: consultationFlow,
			success: function(res) {
				if (res.status == -1) {
					alert(res.result)
				}else if(res.status == 1){
					window.location.href = '/mtcStatis/pages/consultation/triage.html'
				}
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('click', '.button-box .back', function () {
		// 返回页面
		window.location.href = $('.sBox ul li a[data-index="' + ind + '"]').attr('href')
	})// .on('click', '.selectDoctor .doctor-list input[type="checkbox"]', function () {
		// 选择专家
	// 	var doctorId = $(this).attr('data-id')
	// 	var tbody = $('.selectDoctor .select-content tbody')
	// 	if ($(this).prop('checked')) {
	// 		var parent = $(this).parents('tr')
	// 		var name = parent.find('.doctor-name').text()
	// 		var title = parent.find('.doctor-title').text()
	// 		var hospital = parent.find('.doctor-hospital').text()
	// 		var department = parent.find('.doctor-department').text()
	// 		var tr = document.createElement('tr')
	// 		tr.setAttribute('data-id', doctorId)
	// 		tr.innerHTML = '<td class="doctor-name">' + name + '</td><td class="doctor-title">' + title + '</td><td class="doctor-hospital">' + hospital + '</td><td class="doctor-department">' + department + '</td><td><a class="modify doctor-remove">移除</a></td>'
	// 		tbody.append(tr)
	// 	} else {
	// 		tbody.find('tr[data-id="' + doctorId + '"]').remove()
	// 	}
	// 	changeTheadWidth()
	// }).on('click', '.selectDoctor .doctor-selected .cleanall', function () {
	// 	// 清空已选择专家
	// 	if (confirm('确认清空已选专家？')) {
	// 		$('.selectDoctor .select-content tbody').empty()
	// 		changeTheadWidth()
	// 		$('.selectDoctor .doctor-list input[type="checkbox"]').prop('checked', false)
	// 	}
	// }).on('click', '.selectDoctor .select-content tbody .doctor-remove', function () {
	// 	// 移除已选择专家
	// 	if (confirm('确认移除该项？')) {
	// 		var doctorId = $(this).parents('tr').attr('data-id')
	// 		$(this).parents('tr').remove()
	// 		changeTheadWidth()
	// 		$('.selectDoctor .doctor-list input[data-id="' + doctorId + '"]').prop('checked', false)
	// 	}
	// })
})