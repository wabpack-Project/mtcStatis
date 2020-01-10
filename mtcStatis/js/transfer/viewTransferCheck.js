var searchArr = location.search.split(/[?=&]/)
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var id = searchArr[searchArr.indexOf('id') + 1]
$(function () {
	$('.breadcrumb span[data-ind="' + parentInd + '"]').show()
	var crendentialType = getSystemParameterByType("1")
	var healthTyp = getSystemParameterByType("52")
	var national = getSystemParameterByType("5")
	var folk = getSystemParameterByType("6")
	var transferType = getSystemParameterByType("50")
	$.ajax({
		url: baseurl + 'transfer/getTransferForExamNew?id=' + id,
		type: 'get',
		success: function (msg) {
			var transferInfo = msg.transferInfo
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
					icdHtml += '<p data-id=' + transferProperties[i].id + '>' + transferProperties[i].propertyName + '</p>'
				}
				$('.icd10-disease div').html(icdHtml)
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
	$('body').on('click', '.button-box .pass', function () {
		// 通过审核
		if (confirm('确认通过转诊审核吗')) {
			$.ajax({
				url: baseurl + 'transfer/subAppApprove?transferId=' + id,
				type: 'get',
				success: function (msg) {
					window.location.href = '/mtcStatis/pages/transfer/updowntransferCheck.html?&ind=' + parentInd
				},
				error: function (err) {
					console.log(err)
				}
			})
		}
	}).on('click', '.refuse', function () {
		// 点击拒绝按钮 弹出拒绝设置弹框
		$('.setBox.refuse-box,.mask').show()
	}).on('change', '.refuse-box .refuse-reason select', function () {
		// 切换拒绝理由 修改理由描述填写框状态
		$('.refuse-box .refuse-desc textarea').attr('disabled', $(this).val() == '其他' ? false: true)
	}).on('click', '.refuse-box .besure', function () {
		// 确认拒绝
		var text = $('.refuse-box .refuse-reason select').val() == '其他' ? $('.refuse-box .refuse-desc textarea').val() : $('.refuse-box .refuse-reason select').val()
		$.ajax({
				async : false,
				url : baseurl + "transfer/subAppDeny",
				dataType : "json",
				type : 'POST',
				cache : false,
				data : {
					transferId : id,
					exchangeInfo : text
				},
				success : function(result) {
					if (result) {
						window.location.href = '/mtcStatis/pages/transfer/updowntransferCheck.html?&ind=' + parentInd
					}
				},
				error: function(err) {
					console.log(err)
				}
			})
	}).on('click', '.button-box .back', function () {
		// 返回页面
		window.location.href = $('.sBox ul li a[data-index="' + ind + '"]').attr('href')
	})
})