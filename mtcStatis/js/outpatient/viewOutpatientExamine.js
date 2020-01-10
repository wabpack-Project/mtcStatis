var searchArr = location.search.split(/[?=&]/)
var id = searchArr[searchArr.indexOf('id') + 1]
var state = searchArr[searchArr.indexOf('state') + 1]
var type = searchArr[searchArr.indexOf('type') + 1]
//提交按钮显示与否
function validDocadv(){
    	var noSubmit = false;
    	$(".apply-box .examine-apply tbody").find("tr").each(function(){
    		var state = $(this).children().eq(2).text();
    		if(state == '待检查'){
    			noSubmit = true;
    		}
    	});
    	$("apply-box .check-apply tbody").find("tr").each(function(){
    		var state = $(this).children().eq(1).text();
    		if(state == '待检验'){
    			noSubmit = true;
    		}
    	});
    	if(noSubmit){
    		$(".button-box .submit").hide();
    	}else{
    		$(".button-box .submit").show();
    	}
    }
$(function () {
	$('.breadcrumb span[data-type=' + type + ']').show().siblings('span').hide()
	// 获取设备类型数据
	getSystemParameter(9, $('.applyExamine .apply-wrap .equipment-type select'))
	$.ajax({
		url: baseurl + 'clinicIndagation/getIndagationLookOverNew?id=' + id + '&remoteclinicType=' + type + '&state=' + state,
		type: 'get',
		success: function (msg) {
			var queryClinicIndagation = msg.queryClinicIndagation
			$('.outpatient-box .patient-name span,.applyExamine .patient-info .patient-name span').html(queryClinicIndagation.patientName)
			$('.outpatient-box .patient-gendar span,.applyExamine .patient-info .patient-gendar span').html(queryClinicIndagation.sexName)
			$('.outpatient-box .patient-phone span').html(queryClinicIndagation.mobile? queryClinicIndagation.mobile: '')
			$('.outpatient-box .patient-birth span').html(queryClinicIndagation.birthday ? new Date(queryClinicIndagation.birthday).Format('yyyy-MM-dd') : '')
			$('.outpatient-box .attendance-date span').html(queryClinicIndagation.applyDate ? new Date(queryClinicIndagation.applyDate).Format('yyyy-MM-dd') : '')
			$('.outpatient-box .attendance-hospital span').html(queryClinicIndagation.applyHospitalName)
			$('.outpatient-box .attendance-department span').html(queryClinicIndagation.applyDepartmentName)
			type == 1 ? $('.outpatient-box .attendance-room').show().find('span').html(queryClinicIndagation.applyRoomName) : $('.outpatient-box .attendance-room').hide()
			$('.outpatient-box .outcall-doctor span').html(queryClinicIndagation.applyDoctorName)
			state != 50 && state != 31 ? $('.outpatient-box .outcall-state,.apply-box a.apply,.prescription-box .prescription-header a,.prescription-box table th.operate,.button-box .button:not(.back)').show() : $('.outpatient-box .outcall-state,.apply-box a.apply,.prescription-box .prescription-header a,.prescription-box table th.operate,.button-box .button:not(.back)').hide()
			// 病历信息
			$('.medical-box .patient-narrate span').html(queryClinicIndagation.mainSuit)
			$('.medical-box .medical-history span').html(queryClinicIndagation.diseaseHistory)
			$('.medical-box .clinic-purpose span').html(queryClinicIndagation.clinicPurpose)
			var remoteclinicAttachmentList = msg.remoteclinicAttachmentList
			if (remoteclinicAttachmentList && remoteclinicAttachmentList.length) {
				var attachmentHtml = ''
				for (var i = 0; i < remoteclinicAttachmentList.length; i++) {
					attachmentHtml += '<a data-id="' + remoteclinicAttachmentList[i].storageId + '" data-description="' + remoteclinicAttachmentList[i].description + '" data-creator="' + remoteclinicAttachmentList[i].creator + '" data-time="' + new Date(remoteclinicAttachmentList[i].createTime).Format('yyyy-MM-dd hh:mm:ss')
					var name = remoteclinicAttachmentList[i].attachmentName.toLowerCase()
					var suffix = name.substr(name.lastIndexOf('.') + 1)
					var suffixList = ['png', 'bmp', 'jpg', 'gif', 'jpeg']
					attachmentHtml += suffixList.indexOf(suffix) > -1 ? '" class="openFile"' : '" href="' + msg.fileUrl + remoteclinicAttachmentList[i].storageId
					attachmentHtml += '">' + remoteclinicAttachmentList[i].attachmentName + '</a>'
				}
				$('.medical-box .enclosure-box').html(attachmentHtml)
			}
			// 病情描述
			$('.conditionofapatient-info .patient-narrate input').val(queryClinicIndagation.remoteclinicReport.mainSuit)
			$('.applyExamine .medical-info .patient-narrate span').html(queryClinicIndagation.remoteclinicReport.mainSuit)
			$('.conditionofapatient-info .medical-history input').val(queryClinicIndagation.remoteclinicReport.diseaseHistory)
			$('.applyExamine .medical-info .medical-history span').html(queryClinicIndagation.remoteclinicReport.diseaseHistory)
			$('.conditionofapatient-info .health-checkup input').val(queryClinicIndagation.remoteclinicReport.physicalExam)
			$('.applyExamine .medical-info .health-checkup span').html(queryClinicIndagation.remoteclinicReport.physicalExam)
			// 检查检验申请
			var docadvList = queryClinicIndagation.docadvList
			if (docadvList && docadvList.length) {
				var examinHtml = ''
				var checkHtml = ''
				for (var i = 0; i < docadvList.length; i++) {
					if (docadvList[i].adviceType == 1) {
						examinHtml += '<tr data-id="' + docadvList[i].itemId + '" data-content="' + (docadvList[i].itemType + '#@!' + docadvList[i].itemName + '#@!' + docadvList[i].itemDesc + '#@!' + docadvList[i].itemId) + '">' + '<td>' + docadvList[i].itemType + '</td><td>' + docadvList[i].itemName + '</td><td>'
						examinHtml += docadvList[i].state == 0 ? '待检查' : '检查完成'
						examinHtml += '</td><td>'
						if (state != 31 && docadvList[i].state == 0) {
							examinHtml += '<a class="revocation delete">删除</a>'
						}
						if (docadvList[i].state == 1) {
							var docadvAttachmSet = docadvList[i].docadvAttachmSet
							if (docadvAttachmSet && docadvAttachmSet.length) {
								for (var j = 0; j < docadvAttachmSet.length; j++) {
									examinHtml += '<a data-id="' + docadvAttachmSet[j].storageId + '" data-description="' + docadvAttachmSet[j].description + '" data-creator="' + docadvAttachmSet[j].creator + '" data-time="' + new Date(docadvAttachmSet[j].createTime).Format('yyyy-MM-dd hh:mm:ss') + '"" class="look'
									var name = docadvAttachmSet[j].attachmentName.toLowerCase()
									var suffix = name.substr(name.lastIndexOf('.') + 1)
									var suffixList = ['png', 'bmp', 'jpg', 'gif', 'jpeg']
									examinHtml += suffixList.indexOf(suffix) > -1 ? ' openFile"' : '" href="' + msg.fileUrl + docadvAttachmSet[j].storageId
									examinHtml += '">浏览</a>'
								}
							}
						}
						examinHtml += '</td></tr>'
					} else if (docadvList[i].adviceType == 2) {
						checkHtml += '<tr data-id="' + docadvList[i].itemId + '" data-content="' + (docadvList[i].itemType + '#@!' + docadvList[i].itemName + '#@!' + docadvList[i].itemDesc + '#@!' + docadvList[i].itemId) + '"><td>' + docadvList[i].itemName + '</td><td>'
						checkHtml += docadvList[i].state == 0 ? '待检验' : '检验完成'
						checkHtml += '</td><td>'
						if (state != 31 && docadvList[i].state == 0) {
							checkHtml += '<a class="revocation delete">删除</a>'
						}
						if (docadvList[i].state == 1) {
							var docadvAttachmSet = docadvList[i].docadvAttachmSet
							if (docadvAttachmSet && docadvAttachmSet.length) {
								for (var j = 0; j < docadvAttachmSet.length; j++) {
									checkHtml += '<a data-id="' + docadvAttachmSet[j].storageId + '" data-description="' + docadvAttachmSet[j].description + '" data-creator="' + docadvAttachmSet[j].creator + '" data-time="' + new Date(docadvAttachmSet[j].createTime).Format('yyyy-MM-dd hh:mm:ss') + '"" class="look'
									var name = docadvAttachmSet[j].attachmentName.toLowerCase()
									var suffix = name.substr(name.lastIndexOf('.') + 1)
									var suffixList = ['png', 'bmp', 'jpg', 'gif', 'jpeg']
									checkHtml += suffixList.indexOf(suffix) > -1 ? ' openFile"' : '" href="' + msg.fileUrl + docadvAttachmSet[j].storageId
									checkHtml += '">浏览</a>'
								}
							}
						}
						checkHtml += '</td></tr>'
					}
				}
				$('.apply-box .examine-apply tbody').html(examinHtml)
				$('.apply-box .check-apply tbody').html(checkHtml)
			}
			// 处方
			var prescriptionInfoList = queryClinicIndagation.prescriptionInfoList
			if (prescriptionInfoList && prescriptionInfoList.length) {
				var prescriptionHtml = ''
				for (var i = 0; i < prescriptionInfoList.length; i++) {
					prescriptionHtml += '<tr data-content="' + prescriptionInfoList[i].content + '#@!' + prescriptionInfoList[i].drugSpec + '#@!' + prescriptionInfoList[i].drugNum + '#@!' + prescriptionInfoList[i].drugUnit + '#@!' + prescriptionInfoList[i].usage + '#@!' + prescriptionInfoList[i].dose + '#@!' + prescriptionInfoList[i].frequency + '#@!' + prescriptionInfoList[i].treatment + '#@!' + prescriptionInfoList[i].specialRemark + '"><td>' + prescriptionInfoList[i].content + '</td><td>' + prescriptionInfoList[i].drugSpec + '</td><td>' + prescriptionInfoList[i].drugNum + '</td><td>' +  prescriptionInfoList[i].drugUnit + '</td><td>' + prescriptionInfoList[i].usage + '</td><td>' + prescriptionInfoList[i].dose + '</td><td>' + prescriptionInfoList[i].frequency + '次/日</td><td>' + prescriptionInfoList[i].treatment + '</td><td>' + prescriptionInfoList[i].specialRemark + '</td>'
					if (state != 50 && state != 31) {
						prescriptionHtml += '<td><a class="revocation delete">删除</a></td>'
					}
					prescriptionHtml += '</tr>'
				}
				$('.prescription-box tbody').html(prescriptionHtml)
			}
			// 诊断结果
			$('.diagnose-result .tentative-diagnosis span').html(queryClinicIndagation.diagnose)
			$('.diagnose-result .dispose-advice span').html(queryClinicIndagation.advice)
		},
		err: function (err) {
			console.log(err)
		}
	})
	$('body').on('click', '.apply-box .examine-apply .apply', function () {
		// 检查申请
		$('.mask,.applyExamine').show()
	}).on('change', '.applyExamine .apply-wrap .equipment-type select', function () {
		// 切换检查申请单中设备类型 修改检查医嘱列表数据
		var adviceHtml = $('.applyExamine .apply-wrap .medical-advice select option')[0].outerHTML
		if ($(this).val()) {
			var adviceList = getGhSysOrderitemJCList($(this).find('option:selected').html())
			for (var i = 0; i < adviceList.length; i++) {
				adviceHtml += '<option value=' + adviceList[i].itemName + ' data-desc='
				adviceHtml += adviceList[i].itemDesc ? adviceList[i].itemDesc : '""'
				adviceHtml += ' data-id=' + adviceList[i].id + '>' + adviceList[i].itemName + '</option>'
			}
		}
		$('.applyExamine .apply-wrap .medical-advice select').html(adviceHtml)
	}).on('change', '.applyExamine .apply-wrap .medical-advice select', function () {
		// 切换检查申请单中检查医嘱 修改项目说明内容
		$('.applyExamine .object-explain span').html($(this).val() ? $(this).find('option:selected').attr('data-desc') : '')
	}).on('click', '.applyExamine .button-box .besure', function () {
		// 提交检查申请单
		if ($('.applyExamine .apply-wrap .medical-advice select').val()) {
			var dot = "#@!"
			var equipmentType = $('.applyExamine .apply-wrap .equipment-type select option:selected').html()
			var adviceOption = $('.applyExamine .apply-wrap .medical-advice select option:selected')
			var medicalAdvice = adviceOption.html()
			var objectExplain = adviceOption.attr('data-desc')
			var objectId = adviceOption.attr('data-id')
			var content = equipmentType + dot + medicalAdvice + dot + objectExplain + dot + objectId
			var tr = document.createElement('tr')
			$(tr).attr({'data-id': objectId, 'data-content': content})
			tr.innerHTML = '<td>' + equipmentType + '</td><td>' + medicalAdvice + '</td><td>待检查</td><td><a class="revocation delete">删除</a></td>'
			$('.apply-box .examine-apply tbody').append(tr)
			$(".button-box .submit").hide()
			$('.mask,.applyExamine').hide()
		} else {
			alert('请先选择检查医嘱数据')
		}
	}).on('click', '.apply-box .examine-apply tbody a.delete', function () {
		// 删除检查申请单数据
		if (confirm('确认删除该项检查？')) {
			$(this).parents('tr').remove()
			validDocadv()
		}
	}).on('click', '.apply-box .check-apply .apply', function () {
		// 检验申请
		if ($('.applyCheck .check-object option').length == 1) {
			var objectList = getGhSysOrderitemJYList
			var objectHtml = $('.applyCheck .check-object option')[0].outerHTML
			for (var i = 0;i < objectList.length; i++) {
				objectHtml += '<option value=' + objectList[i].itemName + ' data-desc='
				outerHTML += objectList[i].itemDesc ? objectList[i].itemDesc : '""'
				outerHTML += ' data-id=' + objectList[i].id + '>' + objectList[i].itemName + '</option>'
			}
			$('.applyCheck .check-object select').html(outerHTML)
		}
		$('.mask,.applyCheck').show()
	}).on('change', '.applyCheck .check-object select', function () {
		// 切换检验项目数据 修改项目说明内容
		$('.applyCheck .object-explain span').html($(this).val() ? $(this).find('option:selected').attr('data-desc') : '')
	}).on('click', '.applyCheck .button-box .besure', function () {
		// 提交检验申请单
		if ($('.applyCheck .apply-wrap .medical-advice select').val()) {
			var dot = "#@!"
			var equipmentType = 'LIS'
			var checkObject = $('.applyCheck .check-object select option:selected')
			var medicalAdvice = checkObject.html()
			var objectExplain = checkObject.attr('data-desc')
			var objectId = checkObject.attr('data-id')
			var content = equipmentType + dot + medicalAdvice + dot + objectExplain + dot + objectId
			var tr = document.createElement('tr')
			$(tr).attr({'data-id': objectId, 'data-content': content})
			tr.innerHTML = '<td>' + medicalAdvice + '</td><td>待检查</td><td><a class="revocation delete">删除</a></td>'
			$('.apply-box .check-apply tbody').append(tr)
			$(".button-box .submit").hide()
			$('.mask,.applyCheck').hide()
		} else {
			alert('请先选择检验项目')
		}
	}).on('click', '.apply-box .check-apply tbody a.delete', function () {
		// 删除检查申请单数据
		if (confirm('确认删除该项检验？')) {
			$(this).parents('tr').remove()
			validDocadv()
		}
	}).on('click', '.prescription-box .add-prescription', function () {
		// 添加处方
		$('.mask,.addPrescription').show()
	}).on('click', '.addPrescription .button-box .besure', function () {
		// 提交处方
		var medicineName = $('.medicine-name input').val()
		if (!medicineName) {
			alert('药品名称不能为空')
			return
		} else if (medicineName.length > 50) {
			alert('药品名称在50个字以内')
			return
		}
		var medicineSpecification = $('.medicine-specification input').val()
		if (!medicineSpecification) {
			alert('规格不能为空')
			return
		} else if (medicineSpecification.length > 32) {
			alert('规格在32个字以内')
			return
		}
		var medicineCount = $('.medicine-count input').val()
		if (medicineCount && (!Number(medicineCount) || medicineCount < 0 || medicineCount >= 1000)) {
			alert('数量请输入大于0小于1000的数字')
			return
		}
		var medicineDosage = $('.medicine-dosage input').val()
		if (!medicineDosage) {
			alert('剂量不能为空')
			return
		} else if (medicineDosage.length > 32) {
			alert('剂量在32个字以内')
			return
		}
		var medicineFrequency = $('.medicine-frequency input').val()
		if (!medicineFrequency) {
			alert('频次不能为空')
			return
		} else if (medicineFrequency.length > 32) {
			alert('频次在32个字以内')
			return
		}
		var medicineTreatment = $('.medicine-treatment input').val()
		if (medicineTreatment && (!Number(medicineTreatment) || medicineTreatment < 0 || medicineTreatment >= 100)) {
			alert('疗程请输入大于0小于100的数字')
			return
		}
		var specialExplain = $('.special-explain input').val()
		if (!specialExplain) {
			alert('特殊说明不能为空')
			return
		} else if (specialExplain.length > 500) {
			alert('特殊说明在500个字以内')
			return
		}
		var dot = "#@!";
		var content = medicineName + dot + medicineSpecification + dot + medicineCount + dot + $(".medicine-unit select").val() + dot + $(".medicine-use select").val() + dot + medicineDosage + dot + medicineFrequency + dot + medicineTreatment + dot + specialExplain
		var tr = document.createElement('tr')
		tr.setAttribute('data-content', content.replace(/[\r\n]/g, ''))
		tr.innerHTML = "<td>" + medicineName + "</td><td>"+ medicineSpecification +"</td><td>"+ medicineCount +"</td><td>" + $(".medicine-unit select").val() + "</td><td>" + $(".medicine-use select").val() + "</td><td>" + medicineDosage +"</td><td>"+ medicineFrequency +"次/日</td><td>"+ medicineTreatment +"</td><td>"+ specialExplain +"</td><td><a class='revocation delete'>删除</a></td>"
		$('.prescription-box tbody').append(tr)
		$('.mask,.addPrescription').hide()
	}).on('click', '.prescription-box .tbody a.delete', function () {
		// 删除处方
		if (confirm('确认删除该项处方？')) {
			$(this).parents('tr').remove()
		}
	}).on('click', '.button-box .button-submit', function () {
		// 暂存、提交、挂起
		//检查
		var narrate = $('.patient-narrate input').val()
		if (!narrate) {
			alert('主诉不能为空')
			return
		} else if (narrate.length > 20) {
			alert('主诉不能超过20个字')
			return
		}
		var medicalHistory = $('.medical-history input').val()
		if (medicalHistory.length > 500) {
			alert('病史不能超过500个字')
			return
		}
		var healthCheckup = $('.health-checkup input').val()
		if (healthCheckup.length > 500) {
			alert('体格检查不能超过500个字')
			return
		}
		if ($(this).attr('data-id') != 3) {
			var tentativeDiagnosis = $('.tentative-diagnosis input').val()
			if (!tentativeDiagnosis) {
				alert('初步诊断不能为空')
				return
			} else if (tentativeDiagnosis.length > 500) {
				alert('初步诊断不能超过500个字')
				return
			}
			var disposeAdvice = $('.dispose-advice input').val()
			if (!disposeAdvice) {
				alert('处理意见不能为空')
				return
			} else if (disposeAdvice.length > 500) {
				alert('处理意见不能超过500个字')
				return
			}
		}
		var docadvJC = ""
		if($(".apply-box .examine-apply tbody tr").length){
			$(".apply-box .examine-apply tbody tr").each(function(){
				var state = $(this).children().eq(2).text()
				if(state == '待检查'){
					docadvJC += $(this).attr("data-content") + "---"
				}
			})
		}
		//检验
		var docadvJY = ""
		if($(".apply-box .check-apply tbody tr").length){
			$(".apply-box .check-apply tbody tr").each(function(){
				var state = $(this).children().eq(1).text()
				if (state == '待检验') {
					docadvJY += $(this).attr("data-content") + "---"
				}
			})
		}
		//处方字段
		var prescription = ""
		if($(".prescription-box .tbody tr").length){
			$(".prescription-box .tbody tr").each(function(){
				//赋值
				prescription += $(this).attr("data-content") + "---"
			})
		}
		var postData = {'id': id, 'mainSuit': narrate, 'diseaseHistory': medicalHistory, 'physicalExam': healthCheckup, 'tentative_diagnosis': tentativeDiagnosis, 'handling_suggestion': disposeAdvice, 'prescription': prescription, 'docadvJC': docadvJC, 'docadvJY': docadvJY, 'state': $(this).attr('data-id')}
		$.ajax({
			url: baseurl + 'clinicIndagation/submitState',
			type: 'post',
			data: postData,
			dataType: 'json',
			success: function (msg) {
				window.location.href = '/mtcStatis/pages/outpatient/examineList.html?type=' + type
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('click', '.button-box .back', function () {
		window.location.href = '/mtcStatis/pages/outpatient/examineList.html?type=' + type
	})
})