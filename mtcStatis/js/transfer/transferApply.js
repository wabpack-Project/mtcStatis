var searchArr = location.search.split(/[?=&]/)
// var type = searchArr.indexOf('?type') != -1? searchArr[searchArr.indexOf('?type') + 1]: searchArr[searchArr.indexOf('type') + 1]
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var ICDPostData = {}
var ICDPageNum = 1
var searchArr = location.search.split(/[?=&]/)
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var edit = searchArr.indexOf('edit') > -1 ? searchArr[searchArr.indexOf('edit') + 1] : undefined
var id = searchArr[searchArr.indexOf('id') + 1]
var transferKind = parentInd == 11 ? 0 : 1
var dicomPostData = {}
var screenagePageNum = 1
var recordPostData = {}
var recordPageNum = 1
var transferId
var transferNo
var patientId
var transferFlowId
var patientInfoId
var patientExtraId
var extraPatientId
var patientCredentialId
var credentialPatientId
var isGreen
var auditorId
var accepterId
var toclinId
var relationTransferId
// 获取上转记录数据
function getRecordData () {
	$.ajax({
		url: baseurl + 'transfer/queryUpRecordInfo',
		type: 'post',
		data: JSON.stringify(recordPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (recordData) {
			var data = recordData.rows
			if (data.length) {
				var recordHtml = ''
				for (var i = 0; i < data.length; i++) {
					recordHtml += '<tr data-patientId=' + data[i].ghTransferInfo.patientId + ' data-id=' + data[i].ghTransferInfo.id + ' data-reqHospitalId=' + data[i].ghTransferInfo.reqHospitalId + ' data-reqHospitalName=' + data[i].ghTransferInfo.reqHospitalName + ' data-reqDepartmentId=' + data[i].ghTransferInfo.reqDepartmentId + '><td>' + data[i].ghTransferInfo.transferNo + '</td><td>' + data[i].ghPatientInfo.patientName + '</td><td>' + data[i].ghTransferInfo.reqHospitalName + '</td><td>' + data[i].ghTransferInfo.createTime + '</td><td><a class="look">回转</a></td></tr>'
				}
				$('.listBox.selectRecord tbody').html(recordHtml)
				getRecordPageData(recordData)
			} else {
				$('.listBox.selectRecord tbody').html('')
				$('.listBox.selectRecord .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取上转记录分页数据
function getRecordPageData (data) {
	$('.listBox.selectRecord .page').paging({
		pageNo: recordPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			recordPageNum = num
			Page.currentPage = num
			recordPostData.page = Page
			getRecordData()
		}
	})
	$('.listBox.selectRecord .page').parent().show()
}
// 获取ICD-10病种数据
function getICDData () {
	$.ajax({
		url: baseurl + 'queryDiseaseInfo',
		type: 'post',
		data: JSON.stringify(ICDPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (ICDData) {
			var data = ICDData.rows
			if (data.length) {
				var ICDHtml = ''
				for (var i = 0; i < data.length; i++) {
					ICDHtml += '<tr><td><input type="checkbox"'
					if ($('.icd10-disease .multiple-item[data-id="' + data[i].id + '"]').length) {
						ICDHtml += ' checked'
					}
					ICDHtml += ' class="default" data-id="' + data[i].id + '"></td><td class="disease-name">' + data[i].diseaseName + '</td><td class="ICD-code">' + data[i].icdCode + '</td><td class="parent-desc">' + data[i].parentDesc + '</td></tr>'
				}
				$('.selectICDdisease tbody').html(ICDHtml)
				getICDPageData(ICDData)
				if ($('.selectICDdisease tbody input:checked').length == $('.selectICDdisease tbody input[type="checkbox"]').length) {
					$('.selectICDdisease thead input[type="checkbox"]').prop('checked', true)
				}
			} else {
				$('.selectICDdisease tbody').html('')
				$('.selectICDdisease .noData').show().siblings('.list-pagination').hide()
			}
		}
	})
}
// 获取ICD-10病种分页数据
function getICDPageData (data) {
	$('.selectICDdisease .page').paging({
		pageNo: ICDPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			ICDPageNum = num
			Page.currentPage = num
			ICDPostData.page = Page
			getICDData()
		}
	})
	$('.selectICDdisease .page').parent().show()
}
// 获取影像资料数据
function getDicomData () {
	$.ajax({
		url: baseurl + 'dicom/queryDicomInfo',
		type: 'post',
		data: JSON.stringify(dicomPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function(dicomData){
			var result = dicomData.rows
			if (result.length) {
				var dicomHTML = '';
				for(var i=0;i<result.length;i++){
					dicomHTML += "<tr><td><input class='default' data-id='" + result[i].id + "' type='checkbox'"
					if ($('.screenage-information tbody tr[data-id="' + result[i].id + '"]').length) {
						dicomHTML += ' checked'
					}
					dicomHTML += "></input></td><td class='screenage-id'>"+result[i].patientId+"</td><td class='patient-name'>" + result[i].patientName + "</td><td class='equipment-type'>" + result[i].modility + "</td><td class='exam-time'>" + result[i].examTime + "</td><td class='screenage-count'>"  + result[i].imageCount + "</td></tr>";
				}
				$(".listBox.selectScreenage table tbody").html(dicomHTML)
				if ($('.selectScreenage tbody input:checked').length == $('.selectScreenage tbody input[type="checkbox"]').length) {
					$('.selectScreenage thead input[type="checkbox"]').prop('checked', true)
				}
				getDicomPage(dicomData)
			} else {
				$(".listBox.selectScreenage table tbody").html('')
				$('.listBox.selectScreenage .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取影像资料分页数据
function getDicomPage (data) {
	$('.selectScreenage .page').paging({
		pageNo: screenagePageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			screenagePageNum = num
			Page.currentPage = num
			dicomPostData.page = Page
			getDicomData(dicomPostData)
		}
	})
	$('.selectScreenage .page').parent().show()
}
// 获取接诊医院列表
function getReceptionHospital () {
	var hospitalList = getHospitalInfo(ghDoctor.ghDoctor.id, transferKind)
	var hospitalHtml = '<option value="">请选择</option>'
	for (var i = 0; i < hospitalList.length; i++) {
		hospitalHtml += '<option value=' + hospitalList[i].id + ' data-id=' + hospitalList[i].eid + '>' + hospitalList[i].hospitalName + '</option>'
	}
	$('.reception-hospital select').html(hospitalHtml)
}
// 获取接诊科室列表
function getReceptionDepartment (id) {
	var departmentList = getMtceByParentid(id)
	var departmentHtml = '<option value="">请选择</option>'
	for (var i = 0; i < departmentList.length; i++) {
		departmentHtml += '<option value=' + departmentList[i].e_id + ' data-id=' + departmentList[i].id + '>' + departmentList[i].e_name + '</option>'
	}
	$('.reception-department select').html(departmentHtml)
}
// 获取床位数据
function getBunkList (hospitalId, departmentId) {
	var data = {'hospitalId':hospitalId, 'departmentId':departmentId}
	var bunkHtml = '<option value="">请选择</option>'
	$.ajax({
		url: baseurl + 'transfer/getBunkList',
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(bunkList) {
			for (var i = 0;i < bunkList.length; i++) {
				bunkHtml += "<option value='"+bunkList[i].id+"' data-id='"+bunkList[i].id+"'>"+bunkList[i].bunkNum+"</option>"
			}
		},
		error: function(err) {
			console.log(err)
		}
	});
	return bunkHtml
}
$(function () {
	edit ? $('.breadcrumb span[data-ind="edit"]').show() : $('.breadcrumb span[data-ind="' + parentInd + '"]').show()
	getReceptionHospital()
	$('.hospital-apply span').html(ghDoctor.eHospital.hospitalName).attr('data-id', ghDoctor.eHospital.id)
	// 获取申请科室内容
	var applyDepartmentList = queryDepartmentByHospitalId(ghDoctor.eHospital.id)
	var applyDepartmentHtml = '<option value="">请选择</option>'
	for (var i = 0; i < applyDepartmentList.length; i++) {
		applyDepartmentHtml += '<option value=' + applyDepartmentList[i].id + '>' + applyDepartmentList[i].departmentName + '</option>'
	}
	$('.department-apply select').html(applyDepartmentHtml).val(ghDoctor.eDepartment.id)
	if (edit) {
		$.ajax({
			url: baseurl + 'transfer/editTransferNew?id=' + id,
			type: 'get',
			success: function (msg) {
				// 申请信息
				var patientInfo = msg.patientInfo
				patientInfoId = patientInfo.id
				$('.patient-name input').val(patientInfo.patientName)
				$('.patient-gendar select').val(patientInfo.sex)
				$('.patient-birth input').val(patientInfo.birthday ? new Date(patientInfo.birthday).Format('yyyy-MM-dd') : '')
				var patientCredential = msg.patientCredential
				patientCredentialId = patientCredential.id
				credentialPatientId = patientCredential.patientId
				$('.identity-type select').val(patientCredential.crendentialType)
				$('.identity-num input').val(patientCredential.crendentialNo)
				$('.insurance-type select').val(patientInfo.healthTyp)
				$('.insurance-num input').val(patientInfo.healthNo)
				$('.patient-age input').val(patientInfo.age)
				$('.patient-phone input').val(patientInfo.mobile)
				$('.patient-nationality select').val(patientInfo.national)
				$('.patient-peoples select').val(patientInfo.folk)
				$('.patient-work input').val(patientInfo.workUnits)
				$('.patient-job input').val(patientInfo.occupationName)
				$('.patient-stature input').val(patientInfo.height)
				$('.patient-weight input').val(patientInfo.weight)
				$('.patient-location input').val(patientInfo.address)
				var transferInfo = msg.transferInfo
				transferNo = transferInfo.transferNo
				patientId = transferInfo.patientId
				isGreen = transferInfo.isGreen
				auditorId = transferInfo.auditorId
				accepterId = transferInfo.accepterId
				toclinId = transferInfo.toclinId
				relationTransferId = transferInfo.relationTransferId
				$('.is-emergency input[value=' + transferInfo.isEmergency + ']').prop('checked', true)
				$('.reception-hospital select').val(transferInfo.applyHospitalId)
				getReceptionDepartment($('.reception-hospital option:selected').attr('data-id'))
				$('.reception-department select').val(transferInfo.applyDepartmentId)
				$('.reception-type select').val(transferInfo.patientType)
				$('.antipate-time input').val(transferInfo.attendingTime ? new Date(transferInfo.attendingTime).Format('yyyy-MM-dd hh:mm') : '')
				getBunkList(transferInfo.applyHospitalId, transferInfo.applyDepartmentId)
				$('.bunk select').val(transferInfo.bunkId)
				$('.doctor-apply input').val(transferInfo.reqDoctorName)
				$('.doctor-phone input').val(transferInfo.reqDoctorPhonenumber)
				var transferFlow = msg.transferFlow
				transferId = transferFlow.transferId
				transferFlowId = transferFlow.id
				// 病历信息
				$('.transfer-disease select').val(transferInfo.transferDisease)
				var transferProperties = msg.transferProperties
				if (transferProperties && transferProperties.length) {
					var icdHtml = ''
					for (var i = 0; i < transferProperties.length; i++) {
						icdHtml += '<div class="multiple-item" data-id=' + transferProperties[i].id + ' data-code=' + transferProperties[i].propertyValue + '><s class="delete">x</s><div class="disease-name">' + transferProperties[i].transferProperties + '</div></div>'
					}
					$('.icd10-disease .multiple-box').html(icdHtml)
				}
				$('.patient-narrate input').val(transferInfo.mainSuit)
				$('.clinical-diagnosis input').val(transferInfo.diagnosis)
				$('.transfer-purpose input').val(transferInfo.transferPurpose)
				var patientExtra = msg.patientExtra
				patientExtraId = patientExtra.id
				extraPatientId = patientExtra.patientId
				$('.medical-history input').val(patientExtra.dieaseHistory)
				$('.present-medical input').val(patientExtra.nowHistory)
				$('.yesterday-medical input').val(patientExtra.pastHistory)
				$('.allergy-history input').val(patientExtra.allergicHistory)
				$('.family-medical input').val(patientExtra.familyHistory)
				$('.hospital-medicine input').val(patientExtra.medicineDose)
				$('.cure-course input').val(patientExtra.cureProcess)
				$('.health-checkup input').val(patientExtra.physicalExamination)
				$('.additional-remarks input').val(patientExtra.remark)
				var dicomList = msg.dicomList
				if (dicomList.length) {
					var dicomHtml = ''
					for (var i = 0; i < dicomList.length; i++) {
						dicomHtml += '<tr data-id=' + dicomList[i].studyId + ' data-bizId=' +  dicomList[i].bizId + '><td>' + dicomList[i].patientId + '</td><td>' + dicomList[i].patientName + '</td><td>' + dicomList[i].deviceTypeId + '</td><td>'
						dicomHtml += dicomList[i].examTime ? new Date(dicomList[i].examTime).Format('yyyy-MM-dd hh:mm') : ''
						dicomHtml += '</td><td>' + dicomList[i].imageCount + '</td><td><a class="look" onclick="callDicomBrower(\'' + dicomList[i].studyId + '\')">打开</a></td><tr>'
					}
					$('.tab2 .screenage-information tbody').html(dicomHtml)
				}
				var transferAttachmentList = msg.transferAttachmentList
				if (transferAttachmentList.length) {
					var uploadHtml = ''
					for (var i = 0; i < transferAttachmentList.length; i++) {
						uploadHtml += '<tr data-id=' + transferAttachmentList[i].id + ' data-storageId=' + transferAttachmentList[i].storageId + '><td>' + transferAttachmentList[i].attachmentName + '</td><td>'
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
	}
	parentInd == '14' ? $('.transfer-type').show() : $('.transfer-type').hide()
	$('body').on('click', '.transfer-type label', function () {
		// 切换转诊类型 修改选择记录显隐性
		$(this).children('input').val() == 1 ? $(this).siblings('a.selectRecord').show() : $(this).siblings('a.selectRecord').hide()
		$(this).children('input').val() == 1 ? $('.reception-hospital span').css('display', 'inline-block').html('&#x3000;').siblings('select').hide() : $('.reception-hospital span').hide().siblings('select').show()
	}).on('click', '.transfer-type .selectRecord', function () {
		// 点击选择记录
		Page.showCount = 5
		Page.currentPage = 1
		recordPostData.page = Page
		getRecordData()
		$('.mask,.listBox.selectRecord').show()
	}).on('click', '.listBox.selectRecord .search', function () {
		// 根据搜索条件查询上转申请记录数据
		recordPostData.transferNo = $('.selectRecord .record-id input').val() ? $('.selectRecord .record-id input').val() : undefined
		recordPostData.patientName = $('.selectRecord .petient-name input').val() ? $('.selectRecord .petient-name input').val() : undefined
		recordPostData.reqHospitalName = $('.selectRecord .hospitl-apply input').val() ? $('.selectRecord .hospitl-apply input').val() : undefined
		recordPostData.startDate = $('.selectRecord .start-date input').val() ? $('.selectRecord .start-date input').val() : undefined
		recordPostData.endDate = $('.selectRecord .end-date input').val() ? $('.selectRecord .end-date input').val() : undefined
		Page.currentPage = 1
		recordPageNum = 1
		recordPostData.page = Page
		getRecordData()
	}).on('click', '.listBox.selectRecord tbody .look', function () {
		// 选择回转记录
		var tr = $(this).parents('tr')
		$.ajax({
			url: baseurl + 'transfer/getPatientForReturn',
			dataType: "json",
			type: 'POST',
			cache: false,
			data: {'id': tr.attr('data-patientId')},
			success: function(result) {
				if(result) {
					$('.patient-name input').val(result.ghPatientInfo.patientName);
					$('.patient-birth input').val(result.ghPatientInfo.birthday.substr(0,10));
					$('.patient-gendar select').val(result.ghPatientInfo.sex);
					$('.identity-type select').val(result.ghPatientCredential.crendentialType);
					$('.identity-num input').val(result.ghPatientCredential.crendentialNo);
					$('.insurance-type select').val(result.ghPatientInfo.healthTyp);
					$('.insurance-num input').val(result.ghPatientInfo.healthNo);
					$('.patient-nationality select').val(result.ghPatientInfo.national);
					$('.patient-peoples select').val(result.ghPatientInfo.folk);
					$('.patient-phone input').val(result.ghPatientInfo.mobile);
					$('.patient-age input').val(result.ghPatientInfo.age);
					$('.patient-job input').val(result.ghPatientInfo.occupationName);
					$('.patient-work input').val(result.ghPatientInfo.workUnits);
					$('.patient-stature input').val(result.ghPatientInfo.height);
					$('.patient-weight input').val(result.ghPatientInfo.weight);
					$('.patient-location input').val(result.ghPatientInfo.address);
					$('.reception-hospital span').text(tr.attr('data-reqHospitalName')).attr('data-id', tr.attr('data-reqHospitalId'))
					var ghReqDepartment = queryDepartmentByHospitalId(tr.attr('data-reqHospitalId'));
					var departmentHtml = '<option value="">请选择</option>'
					if (ghReqDepartment!=null && ghReqDepartment.length >0) {
					 	for(var i = 0;i < ghReqDepartment.length;i++){
					 		departmentHtml += '<option value=' + ghReqDepartment[i].id + '>' + ghReqDepartment[i].departmentName + '</option>'
					   	}
					}
					$('.reception-department select').html(departmentHtml).val(tr.attr('data-reqDepartmentId'))
				}
			},
			error: function(msg) {
				console.info("调用失败");
			}
		})
		$('.mask,.listBox.selectRecord').hide()
	}).on('change', '.identity-type select', function () {
		// 切换医保类型 修改医保号必填类型
		if ($(this).val() && $(this).val() != 0) {
			$('.identity-num s.emphasis').show()
		} else {
			$('.identity-num s.emphasis').hide()
		}
	}).on('change', '.reception-hospital select', function () {
		// 切换接诊医院 修改接诊科室内容
		getReceptionDepartment($(this).find('option:selected').attr('data-id'))
	}).on('click', '.select-box a', function () {
		// 点击选择文件
		$(this).parents('.select-box').find('input[type="file"]').click()
	}).on('click', '.screenage-information .add-screenage', function () {
		// 点击影像资料添加
		$('.selectScreenage input[type="checkbox"]').prop('checked', false)
		$('.mask,.selectScreenage').show()
		dicomPostData.hospitalId = ghDoctor.eHospital.id
		screenagePageNum = 1
		Page.showCount = 5;
		Page.currentPage = 1;
		dicomPostData.page = Page
		getDicomData()
	}).on('click', '.selectScreenage .search-box .search', function () {
		// 根据搜索条件查询影像资料
		dicomPostData.patientId = $('.selectScreenage .screenage-id input').val() ? $('.selectScreenage .screenage-id input').val() : undefined
		dicomPostData.patientName = $('.selectScreenage .petient-name input').val() ? $('.selectScreenage .petient-name input').val() : undefined
		dicomPostData.startDate = $('.selectScreenage .start-date input').val() ? $('.selectScreenage .start-date input').val() : undefined
		dicomPostData.endDate = $('.selectScreenage .end-date input').val() ? $('.selectScreenage .end-date input').val() : undefined
		screenagePageNum = 1
		Page.currentPage = 1;
		dicomPostData.page = Page
		getDicomData()
	}).on('click', '.selectScreenage .besure', function () {
		// 确认添加影像资料
		if ($('.selectScreenage tbody input:checked').length) {
			$('.selectScreenage tbody input:checked').each(function () {
				// 当前选择资料没有填充到影像资料表格
				if (!$('.screenage-information tbody tr[data-id="' + $(this).attr('data-id') + '"]').length) {
					var parents = $(this).parents('tr')
					var tr = document.createElement('tr')
					tr.setAttribute('data-id', $(this).attr('data-id'))
					tr.innerHTML = '<td>' + parents.find('.screenage-id').text() + '</td><td>' + parents.find('.patient-name').text() + '</td><td>' + parents.find('.equipment-type').text() + '</td><td>' + parents.find('.exam-time').text() + '</td><td>' + parents.find('.screenage-count').text() + '</td><td><a class="look">打开</a><a class="revocation">删除</a></td>'
					$('.screenage-information tbody').append(tr)
				}
			})
			$('.selectScreenage,.mask').hide()
		} else {
			alert('请先选择要添加的资料')
		}
	}).on('click', '.screenage-information tbody .revocation', function () {
		// 删除已选择影像资料
		if (confirm('确认删除该项？')) {
			$(this).parents('tr').remove()
		}
	}).on('click', '.icd10-disease div.multiple-box', function () {
		// 选择ICD-10病种
		$('.selectICDdisease input[type="checkbox"]').prop('checked', false)
		$('.mask,.selectICDdisease').show()
		Page.showCount = 5
		Page.currentPage = 1
		ICDPostData.page = Page
		getICDData()
	}).on('click', '.selectICDdisease .search-box .search', function () {
		// 根据搜索条件查询ICD-10病种数据
		ICDPostData.diseaseName = $('.selectICDdisease .disease-name select').val()? $('.selectICDdisease .disease-name select').val(): undefined
		ICDPostData.icdCode = $('.selectICDdisease .ICD-code input').val()? $('.selectICDdisease .ICD-code input').val(): undefined
		ICDPostData.pinyinCode = $('.selectICDdisease .disease-spell input').val()? $('.selectICDdisease .disease-spell input').val(): undefined
		ICDPageNum = 1
		Page.currentPage = 1
		ICDPostData.page = Page
		getICDData()
	}).on('click', '.selectICDdisease .besure', function () {
		// 确认添加icd病种
		if ($('.selectICDdisease tbody input:checked').length) {
			$('.selectICDdisease tbody input:checked').each(function () {
				if (!$('.icd10-disease .multiple-box .multiple-item[data-id="' + $(this).attr('data-id') + '"]').length) {
					var parents = $(this).parents('tr')
					var div = document.createElement('div')
					$(div).attr({'data-id': $(this).attr('data-id'), 'data-code': parents.find('.ICD-code').text()})
					div.className = 'multiple-item'
					div.innerHTML = '<s class="delete">x</s><div class="disease-name">' + parents.find('.disease-name').text() + '</div>'
					$('.icd10-disease .multiple-box').append(div)
				}
			})
			$('.mask,.selectICDdisease').hide()
		} else {
			alert('请先选择要添加的病种')
		}
	}).on('click', '.icd10-disease .multiple-item .delete', function () {
		// 删除已选择病种
		if (confirm('确认选择该项')) {
			$(this).parents('.multiple-item').remove()
		}
		return false
	}).on('click', '.button-box .button-submit', function () {
		// 保存或提交数据
		if (!$(this).attr('disabled')) {
			$(".button-submit").attr("disabled","disabled");			
			setTimeout(function() {
				$(".button-submit").attr("disabled",false);
			}, 1000)
			// 验证填入信息
			var patientName = $('.patient-name input').val()
			if (!patientName) {
				alert('患者姓名不能为空')
				return
			} else if (patientName.length > 32) {
				alert('患者姓名不能超过32个字')
				return
			}
			var sexName = $('.patient-gendar select').val()
			if (!sexName) {
				alert('请选择患者性别')
				return
			}
			var birthday = $('.patient-birth input').val()
			if (!birthday) {
				alert('出生日期不能为空')
				return
			}
			var identityType = $('.identity-type select').val()
			if (!identityType) {
				alert('请选择证件类型')
				return
			}
			var identityNum = $('.identity-num input').val()
			if (!identityNum) {
				alert('证件号码不能为空')
				return
			} else if (identityNum.length > 18) {
				alert('证件号不能超过18位')
				return
			} else {
				var msg = verifyIdentity(identityNum)
				if (!msg.pass) {
					alert(msg.text)
					return
				}
			}
			var insuranceType = $('.insurance-type select').val()
			if (!insuranceType) {
				alert('请选择医保类型')
				return
			}
			var insuranceNum = $('.identity-num input').val()
			if (insuranceType && insuranceType != 0 && !insuranceNum) {
				alert('请输入医保卡号')
				return
			}
			var identitySex = identityNum.substring(16,17) % 2
			if (identitySex == 0 && sexName == 1 || (identitySex == 1 && sexName == 2)) {
				alert('身份证性别与输入性别不符')
				return
			} 
			var identityBirth = identityNum.substr(6, 4) + '-' + identityNum.substr(10, 2) + '-' + identityNum.substr(12, 2)
			if (birthday != identityBirth) {
				alert('身份证出生日期与输入出生日期不符')
				return
			}
			var age = $('.patient-age input').val()
			if (age) {
				if (!Number(age)) {
					alert('患者年龄只能为数字')
					return
				} else if (age < 0 || age > 120) {
					alert('年龄为大于0小于120的数值')
					return
				}
				var identityAge = new Date().getFullYear() - identityNum.substr(6, 4)
				if (age != identityAge) {
					alert('身份证年龄与输入年龄不符')
					return
				}
			}
			var phone = $('.patient-phone input').val()
			if (phone.length > 16) {
				alert('联系电话不能超过16位')
				return
			}
			var job = $('.patient-job input').val()
			if (job.length > 16) {
				alert('职业不能超过16个字')
				return
			}
			var workAdress = $('.patient-work input').val()
			if (workAdress.length > 50) {
				alert('工作单位不能超过50个字')
				return
			}
			var height = $('.patient-stature input').val()
			if (height && !Number(height)) {
				alert('患者身高只能为数字')
				return
			}
			var weight = $('.patient-weight input').val()
			if (weight && !Number(height)) {
				alert('患者体重只能为数字')
				return
			}
			var location = $('.patient-location input').val() 
			if (location.length > 128) {
				alert('住址不能超过128个字')
				return
			}
			var receptionHospital = $('.reception-hospital select').is(':visible') ? $('.reception-hospital select').val() : $('.reception-hospital span').attr('data-id')
			if (!receptionHospital) {
				alert('请选择接诊医院')
				return
			}
			var receptionHospitalName = $('.reception-hospital select').is(':visible') ? $('.reception-hospital option:selected').text() : $('.reception-hospital span').text()
			var receptionType = $('.reception-type select').val()
			if (!receptionType) {
				alert('请选择接诊类型')
				return
			}
			var antipateTime = $('.antipate-time input').val()
			if (!antipateTime) {
				alert('请填写预计到诊时间')
				return
			}
			var applyDepartment = $('.department-apply select').val()
			if (!applyDepartment) {
				alert('请选择申请科室')
				return
			}
			var applyDoctor = $('.doctor-apply input').val()
			if (!applyDoctor) {
				alert('申请医生不能为空')
				return
			} else if (applyDoctor.length > 16) {
				alert('申请医生不能超过16个字')
				return
			}
			var doctorPhone = $('.doctor-phone input').val()
			if (!doctorPhone) {
				alert('联系电话不能为空')
				return
			} else if (!Number(doctorPhone)) {
				alert('联系电话只能输入数字')
				return
			} else if (doctorPhone.length > 16) {
				alert('联系电话不能超过16位')
				return
			}
			var narrate = $('.patient-narrate input').val()
			if (!narrate) {
				alert('患者主诉不能为空')
				return
			} else if (narrate.length > 20) {
				alert('主诉不能超过20个字')
				return
			}
			var diagnosis = $('.primary-diagnosis input').val()
			if (!diagnosis) {
				alert('初步诊断不能为空')
				return
			} else if(diagnosis.length > 1000) {
				alert('初步诊断不能超过1000个字')
				return
			}
			var purpose = $('.transfer-purpose input').val()
			if (!purpose) {
				alert('会诊目的不能为空')
				return
			} else if (purpose.length > 1000) {
				alert('会诊目的不能超过1000个字')
				return
			}
			var medicalHistory = $('.medical-history input').val()
			if (medicalHistory.length > 1000) {
				alert('患者病史不能超过1000个字')
				return
			}
			var presentMedical = $('.present-medical input').val()
			if (presentMedical.length > 1000) {
				alert('现病史不能超过1000个字')
				return
			}
			var yesterdayMedical = $('.yesterday-medical input').val()
			if (yesterdayMedical.length > 1000) {
				alert('既往史不能超过1000个字')
				return
			}
			var allergyHistory = $('.allergy-history input').val()
			if (allergyHistory.length > 1000) {
				alert('过敏史不能超过1000个字')
				return
			}
			var familyMedical = $('.family-medical input').val()
			if (familyMedical.length > 1000) {
				alert('家族史不能超过1000个字')
				return
			}
			var hospitalMedicine = $('.hospital-medicine input').val()
			if (hospitalMedicine.length > 1000) {
				alert('入院用药不能超过1000个字')
				return
			}
			var cureCourse = $('.cure-course input').val()
			if (cureCourse.length > 1000) {
				alert('治疗经过不能超过1000个字')
				return
			}
			var healthCheckup = $('.health-checkup input').val()
			if (healthCheckup.length > 1000) {
				alert('体格检查不能超过1000个字')
				return
			}
			var remarks = $('.additional-remarks input').val()
			if (remarks.length > 1000) {
				alert('补充说明不能超过1000个字')
				return
			}
			getUploadFile() //获取全部上传文件
			isAllUpload()
			if(!isAllUpload()){
				if (!confirm("有上传失败的文件，是否继续?")) {
					return false
				}
			}
			var illegalMale = ['子宫', '女阴', '阴道', '输卵管', '阴蒂', '会阴', '阴唇', '处女膜', '输乳管', '阴阜', '卵巢']
			var illegalFemale = ['睾丸', '前列腺', '精囊', '附睾', '输精管', '射精管', '阴茎', '包皮', '精索', '阴囊']
			if (sexName == 1) {
				for (var i = 0; i < illegalMale.length; i++){
					if(narrate.indexOf(illegalMale[i]) >= 0 ){
						alert("主诉内容出现与性别男冲突词汇:["+illegalMale[i]+"]")
						return
					}
				}
				for (var i = 0; i < illegalMale.length; i++){
					if(diagnosis.indexOf(illegalMale[i]) >= 0 ){
						alert("初步诊断内容出现与性别男冲突词汇:["+illegalMale[i]+"]")
						return
					}
				}
			} else if (sexName == 2) {
				for (var i = 0; i < illegalFemale.length; i++){
					if(mainSuit.indexOf(illegalFemale[i]) >= 0 ){
						alert("主诉内容出现与性别女冲突词汇:["+illegalFemale[i]+"]")
						return
					}
			  	}
			  	for (var i = 0; i < illegalFemale.length; i++){
					if(diagnosis.indexOf(illegalFemale[i]) >= 0 ){
						alert("初步诊断内容出现与性别女冲突词汇:["+illegalFemale[i]+"]")
						return
					}
				}
			}
			var screenageTr = $('.screenage-information tbody tr')
			for (var i = 0; i < screenageTr.length; i++) {
				var screenageSex = screenageTr.eq(i).attr('data-sex')
				if (sexName == 1 && screenageSex == 'F' || (sexName == 2 && screenageSex == 'M')) {
					alert('影像性别信息与输入性别不符')
					return
				}
				var screenageAge = screenageTr.eq(i).attr('data-age')
				if (screenageAge && screenageAge != age) {
					alert('影像年龄信息与输入年龄不符')
					return
				}
				var screenageBirth = screenageTr.eq(i).attr('data-birthday').replace('/', '-').substring(0,10)
				if (screenageBirth && screenageBirth != birthday) {
					alert('影像出生日期与输入出生日期不符')
					return
				}
			}
			//患者表
			var patientParm = {}
			var patientInfo = {}
			patientInfo.id = patientInfoId
			if (edit) {
				patientInfo.updator = ghUser.id
			} else {
				patientInfo.creator = ghUser.id
			}
			patientInfo.patientName = patientName
			patientInfo.sex = sexName
			patientInfo.sexName = sexName? $('.patient-gendar option:selected').text(): ''
			patientInfo.birthday = birthday
			patientInfo.healthTyp = insuranceType
			patientInfo.healthNo = insuranceNum
			patientInfo.age = age
			patientInfo.ageUnits = '岁'
			patientInfo.mobile = phone
			patientInfo.occupationName = job
			patientInfo.national = $('.patient-nationality select').val()
			// ghPatientInfo.nationalName = $('.patient-nationality select').val()? $('.patient-nationality option:selected').text(): ''
			patientInfo.folk = $('.patient-peoples select').val()
			// ghPatientInfo.folkName = $('.patient-peoples select').val()? $('.patient-peoples option:selected').text(): ''
			patientInfo.workUnits = workAdress
			patientInfo.height = height
			patientInfo.weight = weight
			patientInfo.address = location
			patientParm.ghPatientInfo = patientInfo
			//证件表
			var patientCredential = {}
			if (edit) {
				patientCredential.id = patientCredentialId
				patientCredential.patientId = credentialPatientId
				patientCredential.updator = ghUser.id
			} else {
				patientCredential.creator = ghUser.id
			}
			patientCredential.crendentialType = identityType
			patientCredential.crendentialNo = identityNum
			patientParm.ghPatientCredential = patientCredential
			//会诊表
			var transferInfo = {};
			if (edit) {
				transferInfo.id = id
				transferInfo.transferNo = transferNo
				transferInfo.patientId = patientId
				transferInfo.updator = ghUser.id
				transferInfo.isGreen = isGreen
				transferInfo.reqCreatorId = ghDoctor.ghDoctor.id
				transferInfo.auditorId = auditorId
				transferInfo.accepterId = accepterId
				transferInfo.toclinId = toclinId
			} else {
				transferInfo.creator = ghUser.id
			}
			transferInfo.transferKind = transferKind
			transferInfo.relationTransferId = relationTransferId
			transferInfo.applyHospitalId = receptionHospital
			transferInfo.applyHospitalName = receptionHospitalName
			transferInfo.applyDepartmentId = $('.reception-department select').val()
			transferInfo.applyDepartmentName = $('.reception-department select').val() ? $('.reception-department option:selected').text() : ''
			transferInfo.patientType = receptionType
			transferInfo.isEmergency = $('.is-emergency input:checked').val()
			transferInfo.attendingTime = antipateTime
			transferInfo.bunkId = $('.bunk select').val()
			transferInfo.bunkNum = $('.bunk select').val() ? $('.bunk option:selected').text() : ''
			transferInfo.reqHospitalId = $('.hospital-apply span').attr('data-id')
			transferInfo.reqHospitalName = $('.hospital-apply span').text()
			transferInfo.reqDepartmentId = applyDepartment
			transferInfo.reqDepartmentName = $('.department-apply option:selected').text()
			transferInfo.reqDoctorName = applyDoctor
			transferInfo.reqDoctorPhonenumber = doctorPhone
			transferInfo.transferDisease = $('.transfer-disease select').val()
			transferInfo.mainSuit = narrate
			transferInfo.diagnosis = diagnosis
			transferInfo.transferPurpose = purpose
			// 病史表
			var patientExtra = {}
			if (edit) {
				patientExtra.id = patientExtraId
				patientExtra.patientId = extraPatientId
				patientExtra.updator = ghUser.id
			} else {
				patientExtra.creator = ghUser.id
			}
			patientExtra.dieaseHistory = medicalHistory
			patientExtra.nowHistory = presentMedical
			patientExtra.pastHistory = yesterdayMedical
			patientExtra.allergicHistory = allergyHistory
			patientExtra.familyHistory = familyMedical
			patientExtra.medicineDose = hospitalMedicine
			patientExtra.cureProcess = cureCourse
			patientExtra.physicalExamination = healthCheckup
			patientExtra.remark = remarks
			patientParm.ghPatientExtra = patientExtra
			var transferFlow = {}
			if (edit) {
				transferFlow.id = transferFlowId
				transferFlow.transferId = transferId
			}
			transferFlow.operId = ghUser.id
			var transferAttachment = {}
			if (edit) {
				transferAttachment.updator = ghUser.id
			} else {
				transferAttachment.creator = ghUser.id
			}
			var patientProperties = {}
			if (edit) {
				patientProperties.updator = ghUser.id
			} else {
				patientProperties.creator = ghUser.id
			}
			patientParm.ghPatientProperties = patientProperties
			var patientAddress = {}
			if (edit) {
				patientAddress.updator = ghUser.id
			} else {
				patientAddress.creator = ghUser.id
			}
			patientParm.ghPatientAddress = patientAddress
			var patientCrossindex = {}
			if (edit) {
				patientCrossindex.updator = ghUser.id
			} else {
				patientCrossindex.creator = ghUser.id
			}
			patientParm.ghPatientCrossindex = patientCrossindex
			// 资料
			var transferProperties = []
			var icdList = $('.icd10-disease .multiple-item')
			for (var i = 0; i < icdList.length; i++) {
				transferProperties[i] = {}
				transferProperties[i].propertyName = icdList.eq(i).find('.disease-name').text()
				transferProperties[i].propertyValue = icdList.eq(i).attr('data-code')
				transferProperties[i].id = icdList.eq(i).attr('data-id')
			}
			var transferAttachmentListYX = []
			var dicomList = $('.screenage-information tbody tr')
			for (var i = 0; i < dicomList.length; i++) {
				transferAttachmentListYX[i] = {}
				transferAttachmentListYX[i].dicomStudyId = dicomList.eq(i).attr('data-id')
				transferAttachmentListYX[i].description = dicomList.eq(i).find('td').eq(3).text()
				transferAttachmentListYX[i].id = dicomList.eq(i).attr('data-bizId')
			}
			var transferAttachmentListFJXG = []
			var medicalRecord = $('.medical-information tbody tr')
			for (var i = 0; i < medicalRecord.length; i++) {
				transferAttachmentListFJXG[i] = {}
				transferAttachmentListFJXG[i].storageId = medicalRecord.eq(i).attr('data-storageId')
				transferAttachmentListFJXG[i].description = medicalRecord.eq(i).find('td').eq(2).text()
				transferAttachmentListFJXG[i].id = medicalRecord.eq(i).attr('data-id')
			}
			var transferAttachmentListFJ = []
			for (var i = 0; i < uploadFileArray.length; i++) {
				if (uploadFileArray[i].isUpload()) {
					var uploadObj = {}
					uploadObj.storageId = uploadFileArray[i].fileId
					uploadObj.description = uploadFileArray[i].description
					uploadObj.attachmentName = uploadFileArray[i].fileName
					transferAttachmentListFJ.push(uploadObj)
				}
			}
			var smartComparisonList = []
			var postData = {}
			postData.patientParm = patientParm
			postData.ghTransferInfo = transferInfo
			postData.ghTransferFlow = transferFlow
			postData.ghTransferAttachment = transferAttachment
			postData.transferProperties = transferProperties
			postData.transferAttachmentListYX = transferAttachmentListYX
			postData.transferAttachmentListFJXG = transferAttachmentListFJXG
			postData.transferAttachmentListFJ = transferAttachmentListFJ
			postData.smartComparisonList = smartComparisonList
			var url
			if ($(this).hasClass('save')) {
				url = 'transfer/saveTransferInfo'
			} else {
				url = 'transfer/upTransferApply'
			}
			$.ajax({
				url: baseurl + url,
				type: 'POST',
				data:JSON.stringify(postData),
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				async: false,
				success: function(res) {
					if (res.status == -1) {
						alert(res.result)
						$(".button-submit").attr("disabled",false)
					}else if(res.status == 1){
						window.location.href = '/mtcStatis/pages/transfer/updowntransferApply.html?ind=' + parentInd
					}
				},
				error: function (err) {
					console.log(err)
				}
			})
		}
	}).on('click', '.button-box .back', function () {
		// 返回页面
		window.location.href = $('.sBox ul li a[data-index="' + ind + '"]').attr('href')
	})
})