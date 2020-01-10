var searchArr = location.search.split(/[?=&]/)
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var id = searchArr[searchArr.indexOf('id') + 1]
$(function () {
	var transferStr = parentInd == '11' ? '0transfer': '1transfer'
	var crendentialType = getSystemParameterByType("1")
	var healthTyp = getSystemParameterByType("52")
	var national = getSystemParameterByType("5")
	var folk = getSystemParameterByType("6")
	var transferType = getSystemParameterByType("50")
	var url = parentInd == 11 || parentInd == 14 ? url = 'transfer/getTransferForViewNew?from=' + transferStr + '&hasPrint=1&id=' + id : 'transfer/getTransferForViewNew?id=' + id
	$.ajax({
		url: baseurl + url,
		type: 'get',
		success: function (msg) {
			var transferInfo = msg.transferInfo
			if (transferInfo.state == 11 || transferInfo.state == 21) {
				$('.refuse-content').show().find('span').html(transferInfo.exchangeInfo)
			}
			// 申请信息-患者信息
			var patientInfo = msg.patientInfo
			$('.patient-name span').html(patientInfo.patientName)
			$('.patient-gendar span').html(patientInfo.sexName)
			$('.patient-birth span').html(patientInfo.birthday ? new Date(patientInfo.birthday).Format('yyyy-MM-dd') : '')
			var patientCredential = msg.patientCredential
			for (var i = 0; i < crendentialType.length; i++) {
				if (patientCredential.crendentialType == crendentialType[i].parameterCode) {
					$('.identity-type span').html(crendentialType[i].name).attr('data-type', patientCredential.crendentialType)
					break
				}
			}
			$('.identity-num span').html(patientCredential.crendentialNo)
			for (var i = 0; i < healthTyp.length; i++) {
				if (patientInfo.healthTyp == healthTyp[i].parameterCode) {
					$('.insurance-type span').html(healthTyp[i].name).attr('data-type', patientInfo.healthTyp)
				}
			}
			$('.insurance-num span').html(patientInfo.healthNo ? patientInfo.healthNo : '')
			$('.patient-age span').html(patientInfo.age ? patientInfo.age + '岁' : '')
			$('.patient-phone span').html(patientInfo.mobile)
			for (var i = 0; i < national.length; i++) {
				if (patientInfo.national == national[i].parameterCode) {
					$('.patient-nationality span').html(national[i].name).attr('data-type', patientInfo.national)
				}
			}
			for (var i = 0; i < folk.length; i++) {
				if (patientInfo.folk == folk[i].parameterCode) {
					$('.patient-peoples span').html(folk[i].name).attr('data-type', patientInfo.folk)
				}
			}
			$('.patient-work span').html(patientInfo.workUnits)
			$('.patient-job span').html(patientInfo.occupationName)
			$('.patient-stature span').html(patientInfo.height ? patientInfo.height + 'cm' : '')
			$('.patient-weight span').html(patientInfo.weight ? patientInfo.weight + 'kg' : '')
			$('.patient-location span').html(patientInfo.address)
			// 申请信息-会诊信息
			$('.reception-hospital span').html(transferInfo.applyHospitalName)
			$('.reception-department span').html(transferInfo.applyDepartmentName)
			for (var i = 0; i < transferType.length; i++) {
				if (patientInfo.patientType == transferType[i].parameterCode) {
					$('.reception-type span').html(transferType[i].name).attr('data-type', patientInfo.patientType)
				}
			}
			$('.is-emergency span').html(transferInfo.isEmergency == 0? '平诊': '急诊')
			$('.antipate-time span').html(transferInfo.attendingTime ? new Date(transferInfo.attendingTime).Format('yyyy-MM-dd hh:mm') : '')
			$('.bunk span').html(transferInfo.bunkNum)
			$('.hospital-apply span').html(transferInfo.reqHospitalName)
			$('.department-apply span').html(transferInfo.reqDepartmentName)
			$('.doctor-apply span').html(transferInfo.reqDoctorName)
			$('.doctor-phone span').html(transferInfo.reqDoctorPhonenumber)
			// 病历信息
			var transferProperties = msg.transferProperties
			if (transferProperties && transferProperties.length) {
				var icdHtml = ''
				for (var i = 0;i < transferProperties.lenth; i++) {
					icdHtml += '<p data-id=' + transferProperties[i].id + '>' + transferProperties[i].propertyValue + '&nbsp;' + transferProperties[i].propertyName + '</p>'
				}
			}
			$('.patient-narrate span').html(transferInfo.mainSuit)
			$('.clinical-diagnosis span').html(transferInfo.diagnosis)
			$('.transfer-purpose span').html(transferInfo.transferPurpose)
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
			var dicomList = msg.dicomList
			if (dicomList.length) {
				var dicomHtml = ''
				for (var i = 0; i < dicomList.length; i++) {
					dicomHtml += '<tr data-id=' + dicomList[i].studyId + '><td>' + dicomList[i].patientId + '</td><td>' + dicomList[i].patientName + '</td><td>' + dicomList[i].deviceTypeId + '</td><td>'
					dicomHtml += dicomList[i].examTime ? new Date(dicomList[i].examTime).Format('yyyy-MM-dd hh:mm') : ''
					dicomHtml += '</td><td>' + dicomList[i].imageCount + '</td><td><a class="look" onclick="callDicomBrower(\'' + dicomList[i].studyId + '\')">打开</a></td><tr>'
				}
				$('.tab2 .screenage-information tbody').html(dicomHtml)
			}
			var transferAttachmentList = msg.transferAttachmentList
			if (transferAttachmentList.length) {
				var uploadHtml = ''
				for (var i = 0; i < transferAttachmentList.length; i++) {
					uploadHtml += '<tr data-id=' + transferAttachmentList[i].id + '><td>' + transferAttachmentList[i].attachmentName + '</td><td>'
					uploadHtml += transferAttachmentList[i].createTime ? new Date(transferAttachmentList[i].createTime).Format('yyyy-MM-dd hh:mm:ss') : ''
					uploadHtml += '</td><td>'
					uploadHtml += transferAttachmentList[i].description ? transferAttachmentList[i].description : ''
					uploadHtml += '</td><td><a class="look'
					if (transferAttachmentList[i].attachmentName) {
						var name = transferAttachmentList[i].attachmentName.toLowerCase()
						var suffix = name.substr(name.lastIndexOf('.') + 1)
						var suffixList = ['png', 'bmp', 'jpg', 'gif', 'jpeg']
						if (suffixList.indexOf(suffix) > -1) {
							uploadHtml += ' openFile"'
						} else {
							uploadHtml += '" href="' + msg.fileUrl + transferAttachmentList[i].storageId + '"'
						}
					}
					uploadHtml += '>打开</a></td></tr>'
				}
				$('.tab2 .medical-information tbody').html(uploadHtml)
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
	$('body').on('click', '.button-box .back', function () {
		// 返回页面
		window.location.href = $('.sBox ul li a[data-index="' + ind + '"]').attr('href')
	})
})