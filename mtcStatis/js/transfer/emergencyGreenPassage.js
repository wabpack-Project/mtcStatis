var ICDPostData = {}
var ICDPageNum = 1
// 获取接诊科室列表
function getDepartmentList () {
	var postData = {}
	postData.e_id = ghDoctor.eHospital.id
	postData.role_id = ghDoctor.roleId
	postData.menu_id = menu_id
	$.ajax({
		url: baseurl + 'mtc/queryDepartmentByHospitalId',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (ghDepartment) {
			var departmentHtml = '<option value="">请选择</option>'
			for (var i = 0; i < ghDepartment.length; i++) {
				departmentHtml += '<option value=' + ghDepartment[i].id + '>' + ghDepartment[i].departmentName + '</option>'
			}
			$('.reception-department select').html(departmentHtml)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取患者来源医院数据
function getFromHospitalData () {
	var hospitalInfo = getHospitalInfo('ghDoctor.ghDoctor.id', '1')
	var infoHtml = '<option value="">请选择</option>'
	for (var i = 0;i < hospitalInfo.length; i++) {
		infoHtml += '<option value=' + hospitalInfo[i].id + '>' + hospitalInfo[i].hospitalName + '</option>'
	}
	$('.from-hospital select').html(infoHtml)
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
$(function () {
	$('.consul-change .reception-hospital p').html(ghDoctor.eHospital.hospitalName)
	getDepartmentList()
	getFromHospitalData()
	$('body').on('click', '.select-box a', function () {
		// 点击选择文件
		$(this).parents('.select-box').find('input[type="file"]').click()
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
		ICDPostData.diseaseName = $('.disease-name select').val()? $('.disease-name select').val(): undefined
		ICDPostData.icdCode = $('.ICD-code input').val()? $('.ICD-code input').val(): undefined
		ICDPostData.pinyinCode = $('.disease-spell input').val()? $('.disease-spell input').val(): undefined
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
	}).on('click', '.button-box .submit', function () {
		// 提交数据
		if (!$(this).attr('disabled')) {
			$(".button-submit").attr("disabled","disabled");			
			setTimeout(function() {
				$(".button-submit").attr("disabled",false);
			}, 1000)
			// 验证填入信息
			var hospitalFrom = $('.from-hospital select').val()
			if (!hospitalFrom) {
				alert('患者来源医院不能为空')
				return
			}
			var patientPhone = $('.doctor-phone input').val()
			if (patientPhone) {
				if (!Number(patientPhone)) {
					alert('联系电话只能输入数字')
					return
				} else if (patientPhone.length > 16) {
					alert('联系电话不能超过16位')
					return
				}
			}
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
			var narrate = $('.patient-narrate input').val()
			if (!narrate) {
				alert('患者主诉不能为空')
				return
			} else if (narrate.length > 20) {
				alert('主诉不能超过20个字')
				return
			}
			var diagnosis = $('.clinical-diagnosis input').val()
			if (!diagnosis) {
				alert('临床诊断不能为空')
				return
			} else if(diagnosis.length > 1000) {
				alert('临床诊断不能超过1000个字')
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
						alert("临床诊断内容出现与性别男冲突词汇:["+illegalMale[i]+"]")
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
						alert("临床诊断内容出现与性别女冲突词汇:["+illegalFemale[i]+"]")
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
				var screenageBirth = screenageTr.eq(i).attr('data-birthday').replace('/', '-').substring(0,10)
				if (screenageBirth && screenageBirth != birthday) {
					alert('影像出生日期与输入出生日期不符')
					return
				}
			}
			var transferInfo = {}
			transferInfo.creator = ghUser.id
			transferInfo.transferKind = '0'
			transferInfo.applyHospitalId = ghDoctor.eHospital.id
			transferInfo.applyHospitalName = ghDoctor.eHospital.hospitalName
			transferInfo.applyDepartmentId = $('.reception-department select').val()
			transferInfo.applyDepartmentName = $('.reception-department select').val() ? $('.reception-department option:selected').text(): ''
			transferInfo.patientType = $('.reception-type select').val()
			transferInfo.reqHospitalId = hospitalFrom
			transferInfo.reqHospitalName = hospitalFrom ? $('.from-hospital option:selected').text(): ''
			transferInfo.reqDoctorName = $('.apply-doctor input').val()
			transferInfo.reqDoctorPhonenumber = patientPhone
			transferInfo.transferDisease = $('.transfer-disease select').val()
			transferInfo.mainSuit = narrate
			transferInfo.diagnosis = diagnosis
			var transferFlow = {}
			transferFlow.operId = ghUser.id
			var transferAttachment = {}
			transferAttachment.creator = ghUser.id
			var patientParm = {}
			var patientInfo = {}
			patientInfo.creator = ghUser.id
			patientInfo.patientName = patientName
			patientInfo.sex = sexName
			patientInfo.sexName = sexName ? $('.patient-gendar option:selected').text() : ''
			patientInfo.birthday = birthday
			patientInfo.healthTyp = insuranceType
			patientInfo.healthNo = insuranceNum
			patientParm.ghPatientInfo = patientInfo
			var patientProperties = {}
			patientProperties.creator = ghUser.id
			patientParm.ghPatientProperties = patientProperties
			var patientAddress = {}
			patientAddress.creator = ghUser.id
			patientParm.ghPatientAddress = patientAddress
			var patientCredential = {}
			patientCredential.creator = ghUser.id
			patientCredential.crendentialType = identityType
			patientCredential.crendentialNo = identityNum
			patientParm.ghPatientCredential = patientCredential
			var patientCrossindex = {}
			patientCrossindex.creator = ghUser.id
			patientParm.ghPatientCrossindex = patientCrossindex
			var patientExtra = {}
			patientExtra.creator = ghUser.id
			patientParm.ghPatientExtra = patientExtra
			var transferProperties = []
			var icdList = $('.icd10-disease .multiple-item')
			for (var i = 0; i < icdList.length; i++) {
				transferProperties[i].propertyName = icdList.eq(i).find('.disease-name').text()
				transferProperties[i].propertyValue = icdList.eq(i).attr('data-code')
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
			var postData = {}
			postData.ghTransferInfo = transferInfo
			postData.ghTransferFlow = transferFlow
			postData.ghTransferAttachment = transferAttachment
			postData.patientParm = patientParm
			postData.transferProperties = transferProperties
			postData.transferAttachmentListFJ = transferAttachmentListFJ
			$.ajax({
				url: baseurl + 'transfer/upGreenChannel',
				type: 'post',
				data: JSON.stringify(postData),
				dataType: 'json',
				contentType: 'application.json;charset=utf-8',
				success: function (msg) {
					console.log(msg)
				},
				error: function (err) {
					console.log(err)
				}
			})
 		}
	})
})