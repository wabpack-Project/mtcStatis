var dicomPostData = {}
var returnPostData = {}
var screenagePageNum = 1
var returnvisitPageNum = 1
var GhConsultationInfo = {}
var searchArr = location.search.split(/[?=&]/)
var consulType = searchArr[searchArr.indexOf('type') + 1]
var parentInd = searchArr[searchArr.indexOf('ind') + 1]
var doctorPostData = {}
var doctorPageNum = 1
var patientPostData = {}
var patientPageNum = 1
var applyId = '' // 申请数据id
var visitFlag = 0 //是否复诊 1是0否
var visitId = '' //复诊记录id
var consulNo = '' //复诊记录编号
// 获取复诊记录数据
function getReturnRecord () {
	$.ajax({
		url: baseurl + 'consultation/selectApplyFinishedListPage',
		type: 'post',
		data: JSON.stringify(returnPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (returnvisitData) {
			var data = returnvisitData.rows
			var returnHtml = ''
			if (data.length) {
				for (var i = 0; i < data.length; i++) {
					returnHtml += '<tr><td>' + data[i].consultationNo + '</td><td>' + data[i].bizType + '</td><td>' + data[i].reqHospitalName + '</td><td>' + data[i].createTime + '</td><td><a class="look" data-patient=' + data[i].creator + ' data-no=' + data[i].consultationNo + '>复诊</a></td></tr>'
				}
				$('.selectReturnvisit tbody').html(returnHtml)
				getReturnPage(returnvisitData)
			} else {
				$('.selectReturnvisit tbody').html('')
				$('.selectReturnvisit .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取复诊记录分页数据
function getReturnPage (data) {
	$('.selectReturnvisit .page').paging({
		pageNo: returnvisitPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			returnvisitPageNum = num
			Page.currentPage = num
			returnPostData.page = Page
			getReturnRecord(returnPostData)
		}
	})
	$('.selectReturnvisit .page').parent().show()
}
// 获取患者记录数据
function getPatientData () {
	$.ajax({
		url: baseurl + 'diagnoseApply/getPatientMessage',
		type: 'post',
		data: JSON.stringify(patientPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (patientData) {
			if (patientData.patient) {
				var patientHtml = ''
				for (var i = 0; i < data.record.length; i++) {
					var sexName
					switch (data.patient[i].sexName) {
						case '1': 
							sexName += '男'
							break;
						case '2': 
							sexName += '女'
							break;
						case '3': 
							sexName += '未说明'
							break;
						case '4': 
							sexName += '未知'
							break;
					}
					patientHtml += '<tr><td>' + data.patient[i].patientName + '</td><td>' + sexName + '</td><td>' + data.patient[i].credentialCode + '</td><td>' + data.record[i].medicalVisitId + '</td><td>' + getDate(data.record[i].inTime) + '</td><td>'
					if (data.record[i].inDeptName) {
						patientHtml += data.record[i].inDeptName
					}
					patientHtml += '</td><td><a class="look" data-id="' + data.record[i].id + '" data-birthday="' + getDate(data.patient[i].birthday) + '" data-chiefComplaint="' + data.record[i].chiefComplaint + '" data-patientName="' + data.patient[i].patientName + '" data-sexName="' + data.patient[i].sexName + '" data-credentialCode="' + data.patient[i].credentialCode + '" data-allergyHistory="' + data.record[i].allergyHistory + '" data-dieaseCode="' + data.record[i].dieaseCode + '" data-dieaseDesc="' + data.record[i].dieaseDesc + '" data-dieaseName="' + data.record[i].dieaseName + '" data-disposal="' + data.record[i].disposal + '" data-heredityHistory="' + data.record[i].heredityHistory + '" data-pastHistory="' + data.record[i].pastHistory + '" data-physicalExamination="' + data.record[i].physicalExamination + '" data-presentHistory="' + data.record[i].presentHistory + '" data-phonenumber="' + data.patient[i].phonenumber + '">选择</a></td></tr>'
				}
				$('.selectPatient tbody').html(patientHtml)
				getPatientPage(patientData.page)
			} else {
				$('.selectPatient tbody').empty()
				$('.selectPatient .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
			// 报错暂时按空数据处理
			$('.selectPatient .noData').show().siblings('.list-pagination').hide()
		}
	})
}
// 获取患者记录分页数据
function getPatientPage (data) {
	$('.selectPatient .page').paging({
		pageNo: patientPageNum,
		totalPage: Math.ceil(data.totalResult/Page.showCount),
		totalSize: data.totalResult,
		callback: function(num) {
			patientPageNum = num
			Page.currentPage = num
			patientPostData.page = Page
			getPatientData()
		}
	})
	$('.selectPatient .page').parent().show()
}
// 获取期望会诊专家数据
function getDoctorData () {
	$('.selectDoctor input[type="checkbox"]').prop('checked', false)
	$.ajax({
		url: baseurl + 'doctorManagement/getDoctorSelectorList',
		type: 'post',
		data: JSON.stringify(doctorPostData),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (wishDoctorData) {
			var data = wishDoctorData.rows
			if (data.length) {
				var dataHtml = ''
				for (var i = 0; i < data.length; i++) {
					dataHtml += '<tr><td><input type="checkbox"'
					if ($('.consul-doctor .multiple-item[data-id=' + data[i].id + ']').length) {
						dataHtml += ' checked'
					}
					dataHtml += ' class="default" data-id="' + data[i].id + '" data-hospital="' + data[i].hospitalId + '" data-department="' + data[i].departmentId + '" data-hospitalId="' + data[i].personDetails + '" data-departmentId="' + data[i].speciality + '"/></td><td class="doctor-name">' + data[i].doctorName + '</td><td>'
					dataHtml += data[i].sex == '1'? '男': '女'
					dataHtml += '</td><td>'
					dataHtml += new Date(data[i].birthday).getFullYear() + '-' + (new Date(data[i].birthday).getMonth() + 1) + new Date(data[i].birthday).getDate() + '</td><td>' + data[i].doctorTitle + '</td><td class="hospitalName">' + data[i].hospitalId + '</td><td class="departmentName">' + data[i].departmentId + '</td></tr>'
				}
				$('.selectDoctor tbody').html(dataHtml)
				if ($('.selectDoctor tbody input:checked').length == $('.selectDoctor tbody input[type="checkbox"]').length) {
					$('.selectDoctor thead input[type="checkbox"]').prop('checked', true)
				}
			} else {
				$('.selectDoctor tbody').html('')
				$('.selectDoctor .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取期望会诊专家分页数据
function getDoctorPageData (data) {
	$('.selectDoctor .page').paging({
		pageNo: doctorPageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			doctorPageNum = num
			Page.currentPage = num
			doctorPostData.page = Page
			getDicomData()
		}
	})
	$('.selectDoctor .page').parent().show()
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
					dicomHTML += "<tr><td><input class='default' data-id='" + result[i].id + "' data-sex='" + result[i].sex + "' data-age='" + result[i].age + "' data-birthday='" + result[i].patientBirthday + "' type='checkbox'"
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
// 获取年龄
function getAge (birth, ele) {
	var bir = birth
	var birJudge = '';
	var date = new Date();
	var age = 0;
	var ageUnits = 0;
	if (bir) {
		birJudge = bir.substring(0, 4);
		age = date.getFullYear() - birJudge;
		ele.val(age)
	} else {
		ele.val("")
	}
}
// 还原患者申请信息
function resetConfig () {
	$.ajax({
		url: baseurl + 'consultation/getApplyMessageNew?id=' + applyId +  '&consultationType=' + consulType,
		type: 'get',
		success: function (msg) {
			var ghConsultationInfo = msg.mess.ghConsultationInfo
			var ghPatientInfo = msg.mess.ghPatientInfo
			var ghPatientCredential = msg.mess.ghPatientCredential
			var ghConsultationExtra = msg.mess.ghConsultationExtra
			var ghPatientExtra = msg.mess.ghPatientExtra
			var dicomInfoList = msg.mess.dicomInfoList
			var ghConsultationAttachmentSet = msg.mess.ghConsultationAttachmentSet
			visitFlag = ghConsultationInfo.visitFlag
			visitId = ghConsultationInfo.visitId
			consulNo = ghConsultationInfo.consultationNo
			// 申请信息-患者信息
			$('.returnvisit input[value=' + ghConsultationInfo.visitFlag + ']').prop('checked', true)
			if (ghConsultationInfo.visitFlag == 1) {
				$('.returnvisit .selectRecord').show()
			}
			$('.patient-name input').val(ghPatientInfo.patientName)
			$('.patient-gendar select').val(ghPatientInfo.sex)
			$('.patient-birth input').val(new Date(ghPatientInfo.birthday).Format('yyyy-MM-dd'))
			$('.identity-type select').val(ghPatientCredential.crendentialType)
			$('.identity-num input').val(ghPatientCredential.crendentialNo)
			$('.patient-age input').val(ghPatientInfo.age)
			$('.patient-phone input').val(ghPatientInfo.mobile)
			$('.marital-status select').val(ghPatientInfo.marital)
			$('.patient-nationality select').val(ghPatientInfo.national)
			$('.patient-peoples select').val(ghPatientInfo.folk)
			$('.patient-work input').val(ghPatientInfo.workUnits)
			$('.patient-stature input').val(ghPatientInfo.height)
			$('.patient-weight input').val(ghPatientInfo.weight)
			$('.patient-location input').val(ghPatientInfo.address)
			// 申请信息-会诊信息
			$('.consul-type input[value=' + ghConsultationInfo.consultationWayType + ']').prop('checked', true)
			ghConsultationInfo.reqType == 0 ? $('.consul-pattern input').prop('checked', true): $('.consul-pattern input').prop('checked', false)
			$('.is-emergency input[value=' + ghConsultationInfo.isEmergency + ']').prop('checked', true)
			$('.discipline select').val(ghConsultationInfo.disciplineId)
			$('.consul-time input').val(ghConsultationInfo.reqDiagnoseTime)
			$('.consul-doctor input').val(ghConsultationInfo.reqDiagnoseDoctor)
			$('.department-apply select').val(ghConsultationInfo.departmentId)
			$('.doctor-apply input').val(ghConsultationInfo.reqDoctorId)
			$('.doctor-phone input').val(ghConsultationInfo.reqDoctorPhone)
			// 病历信息
			$('.patient-narrate input').val(ghConsultationExtra.complaint)
			$('.primary-diagnosis input').val(ghConsultationExtra.preDiagnose)
			$('.consul-purpose input').val(ghConsultationExtra.consultationAim)
			$('.medical-history input').val(ghPatientExtra.dieaseHistory)
			$('.present-medical input').val(ghPatientExtra.nowHistory)
			$('.yesterday-medical input').val(ghPatientExtra.pastHistory)
			$('.allergy-history input').val(ghPatientExtra.allergicHistory)
			$('.family-medical input').val(ghPatientExtra.familyHistory)
			$('.hospital-medicine input').val(ghPatientExtra.medicineDose)
			$('.cure-course input').val(ghPatientExtra.cureProcess)
			$('.health-checkup').val(ghPatientExtra.physicalExamination)
			$('.additional-remarks input').val(ghPatientExtra.remark)
			// 病历信息-资料信息
			if (dicomInfoList.length) {
				var dicomHtml = ''
				for (var i = 0; i < dicomInfoList.length; i++) {
					dicomHtml += '<tr data-id=' + dicomInfoList[i].studyId + '><td>' + dicomInfoList[i].patientId + '</td><td>' + dicomInfoList[i].patientName + '</td><td>' + dicomInfoList[i].modility + '</td><td>' + new Date(dicomInfoList[i].examTime).Format('yyyy-MM-dd hh:mm') + '</td><td>' + dicomInfoList[i].imageCount + '</td><td><a class="look">打开</a><a class="revocation">删除</a></td><tr>'
				}
				$('.screenage-information tbody').html(dicomHtml)
			}
			if (ghConsultationAttachmentSet.length) {
				var uploadHtml = ''
				for (var i = 0; i < ghConsultationAttachmentSet.length; i++) {
					uploadHtml += '<tr data-id=' + ghConsultationAttachmentSet[i].storageId + '><td>' + new Date(ghConsultationAttachmentSet[i].createTime).Format('yyyy-MM-dd hh:mm:ss') + '</td><td>' + ghConsultationAttachmentSet[i].description + '</td><td><a class="look">打开</a><a class="revocation">删除</a><a class="modify">修改描述</a></td></tr>'
				}
				$('.medical-information tbody').html(uploadHtml)
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
$(function () {
	$('.breadcrumb span[data-ind="' + parentInd + '"]').show()
	var ghDepartment = getGhDepartment(ghDoctor.eHospital.id)
	var departmentHtml = '<option value="">请选择</option>'
	for (var i = 0; i < ghDepartment.length; i++) {
		departmentHtml += '<option value=' + ghDepartment[i].id + '>' + ghDepartment[i].departmentName + '</option>'
	}
	$('.department-apply select').html(departmentHtml)
	$('.hospital-apply span').text(ghDoctor.eHospital.hospitalName).attr('data-id', ghDoctor.eHospital.id)
	$('.discipline select').html(getGhMedical())
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
	// 如果是修改页面 还原待修改信息
	if (searchArr.indexOf('id') > -1) {
		applyId = searchArr[searchArr.indexOf('id') + 1]
		resetConfig()
	}
	$('body').on('click', '.returnvisit input', function () {
		// 选择是否复诊切换‘选择复诊信息’按钮显隐性
		if ($(this).val() == '1') {
			$(this).parents('.returnvisit').find('.selectRecord').show()
		} else {
			$(this).parents('.returnvisit').find('.selectRecord').hide()
			var ele = $('.tab1 .change-box>div:not(.returnvisit)')
			ele.find('input').val('')
			ele.find('select').each(function () {
				if ($(this).attr('data-value')) {
					$(this).val($(this).attr('data-value'))
				} else {
					$(this).val('')
				}
			})
		}
		visitFlag = $(this).val()
	}).on('click', '.returnvisit .selectRecord', function () {
		// 选择复诊记录
		$('.mask,.selectReturnvisit').show()
		returnvisitPageNum = 1
		Page.showCount = 5;
		Page.currentPage = 1;
		returnPostData.page = Page
		GhConsultationInfo.consultationType = consulType
		returnPostData.ghConsultationInfo = GhConsultationInfo
		getReturnRecord()
	}).on('click', '.selectReturnvisit .search', function () {
		// 根据搜索条件查询复诊记录
		GhConsultationInfo.consultationNo = $('.selectReturnvisit .consul-id input').val()
		GhConsultationInfo.patientName = $('.selectReturnvisit .petient-name input').val()
		GhConsultationInfo.reqTime = $('.selectReturnvisit .start-date input').val()
		GhConsultationInfo.createTime = $('.selectReturnvisit .end-date input').val()
		returnPostData.ghConsultationInfo = GhConsultationInfo
		returnvisitPageNum = 1
		Page.currentPage = 1;
		returnPostData.page = Page
		getReturnRecord()
	}).on('click', '.selectReturnvisit tbody .look', function () {
		// 选择复诊数据
		var patientId = $(this).attr('data-patient')
		visitId = $(this).attr('data-no')
		returnPostData.id = patientId
		$.ajax({
			url: baseurl + 'consultation/getPatientForVisit',
			type: 'post',
			data: returnPostData,
			dataType: 'json',
			success: function (returnvisitPatientData) {
				$('.patient-name input').val(returnvisitPatientData.ghPatientInfo.patientName)
				$('.patient-gendar select').val(returnvisitPatientData.ghPatientInfo.sex)
				$('.patient-birth input').val(returnvisitPatientData.ghPatientInfo.birthday.substr(0,10))
				$('.identity-type select').val(returnvisitPatientData.ghPatientCredential.crendentialType)
				$('.identity-num input').val(returnvisitPatientData.ghPatientCredential.crendentialNo)
				$('.patient-age input').val(returnvisitPatientData.ghPatientInfo.age)
				$('.patient-phone input').val(returnvisitPatientData.ghPatientInfo.mobile)
				$('.marital-status select').val(returnvisitPatientData.ghPatientInfo.marital)
				$('.patient-nationality select').val(returnvisitPatientData.ghPatientInfo.national)
				$('.patient-peoples select').val(returnvisitPatientData.ghPatientInfo.folk)
				$('.patient-work input').val(returnvisitPatientData.ghPatientInfo.workUnits)
				$('.patient-stature input').val(returnvisitPatientData.ghPatientInfo.height)
				$('.patient-weight input').val(returnvisitPatientData.ghPatientInfo.weight)
				$('.patient-location input').val(returnvisitPatientData.ghPatientInfo.address)
				$('.selectReturnvisit,.mask').hide()
			},
			error: function (err) {
				console.log(err)
			}
		})
	}).on('click', '.patient-name .choicePatient', function () {
		// 选择患者信息
		Page.showCount = 5
		Page.currentPage = 1
		patientPostData.page = Page
		getPatientData()
		$('.mask,.selectPatient').show()
	}).on('click', '.selectPatient .search', function () {
		// 根据搜索条件查询患者记录数据
		patientPostData.patientType = $('.patient-type select').val()? $('.patient-type select').val(): undefined
		patientPostData.patientNo = $('.outpatient-num input').val()? $('.outpatient-num input').val(): undefined
		patientPageNum = 1
		Page.currentPage = 1
		patientPostData.page = Page
		getPatientData()
	}).on('click', '.selectPatient tbody .look', function () {
		// 选择患者记录数据
		var box1 = $('.tab1 .change-box')
		var box2 = $('.tab2 .medical-box')
		box1.find('.patient-name input').val($(this).attr('data-patientName'))
		box1.find('.patient-gendar select').val($(this).attr('data-sexName'))
		box1.find('.patient-birth input').val($(this).attr('data-birthday'))
		box1.find('.identity-num input').val($(this).attr('data-credentialCode'))
		getAge($(this).attr('data-birthday'), box1.find('.patient-age input'))
		box1.find('.patient-phone input').val($(this).attr('data-phonenumber'))
		box2.find('.patient-narrate input').val($(this).attr('data-chiefComplaint'))
		box2.find('.patient-diagnosis input').val($(this).attr('data-dieaseName'))
		box2.find('.present-medical input').val($(this).attr('data-presentHistory'))
		box2.find('.yesterday-medical input').val($(this).attr('data-pastHistory'))
		box2.find('.allergy-history input').val($(this).attr('data-allergyHistory'))
		box2.find('.family-medical input').val($(this).attr('data-heredityHistory'))
		box2.find('.cure-course input').val($(this).attr('data-disposal'))
		box2.find('.health-checkup input').val($(this).attr('data-physicalExamination'))
		$('.mask,.selectPatient').hide()
	}).on('click', '.consul-doctor .multiple-box', function () {
		// 选择期望会诊专家
		var hospitalInfo = getHospitalInfo(1)
		var hospitalHtml = '<option value="">请选择</option>'
		for (var i = 0; i < hospitalInfo.length; i++) {
			hospitalHtml += '<option value=' + hospitalInfo[i].id + ' data-id=' + hospitalInfo[i].eid + '>' + hospitalInfo[i].hospitalName + '</option>'
		}
		$('.selectDoctor .doctor-hospital select').html(hospitalHtml)
		// 获取医生级别
		getSystemParameter(56, $('.selectDoctor .doctor-title select'))
		Page.showCount = 5
		Page.currentPage = 1
		doctorPostData.page = Page
		getDoctorData()
		$('.mask,.selectDoctor').show()
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
		getDoctorData()
	}).on('click', '.selectDoctor .besure', function () {
		// 确认添加期望会诊专家
		if ($('.selectDoctor tbody input:checked').length) {
			$('.selectDoctor tbody input:checked').each(function () {
				if (!$('.consul-doctor .multiple-box .multiple-item[data-id="' + $(this).attr('data-id') + '"]').length) {
					var parents = $(this).parents('tr')
					var div = document.createElement('div')
					$(div).attr({'data-id': $(this).attr('data-id'), 'data-value': parents.find('.hospital-name').text() + '#@!' + parents.find('.department-name').text() + '#@!' + parents.find('.doctor-name').text(), 'data-hospitalId': $(this).attr('data-hospitalId'), 'data-departmentId': $(this).attr('data-departmentId')})
					div.className = 'multiple-item'
					div.innerHTML = '<s class="delete">x</s><div class="doctor-name">' + parents.find('.doctor-name').text() + '</div>'
					$('.consul-doctor .multiple-box').append(div)
				}
			})
			$('.mask,.selectDoctor').hide()
		} else {
			alert('请先选择要添加的专家')
		}
	}).on('click', '.consul-doctor .multiple-item .delete', function () {
		// 删除已选择专家
		if (confirm('确认删除该项')) {
			$(this).parents('.multiple-item').remove()
		}
		return false
	}).on('click', '.screenage-information .add-screenage', function () {
		// 点击影像资料添加
		$('.mask,.selectScreenage').show()
		$('.selectScreenage input:checked').prop('checked', false)
		dicomPostData.hospitalId = ghDoctor.eHospital.id
		screenagePageNum = 1
		Page.showCount = 5;
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
					$(tr).attr({'data-id': $(this).attr('data-id'), 'data-age': $(this).attr('data-age'), 'data-birthday': $(this).attr('data-birthday')})
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
	}).on('click', '.selectScreenage .search', function () {
		// 根据搜索条件查新影像资料数据
		dicomPostData.patientId = $('.selectScreenage .screenage-id input').val()
		dicomPostData.patientName = $('.selectScreenage .petient-name input').val()
		dicomPostData.startDate = $('.selectScreenage .start-date input').val()
		dicomPostData.endDate = $('.selectScreenage .end-date input').val()
		screenagePageNum = 1
		Page.currentPage = 1
		dicomPostData.page = Page
		getDicomData(dicomPostData)
	}).on('click', '.select-box a', function () {
		// 点击选择文件
		$(this).parents('.select-box').find('input[type="file"]').click()
	}).on('click', '.button-submit', function () {
		// 保存或提交数据
		if (!$(this).attr('disabled')) {
			$(".button-submit").attr("disabled","disabled");			
			setTimeout(function() {
				$(".button-submit").attr("disabled",false);
			}, 1000)
			var stateId = $(this).attr('data-id')
			var smartComparisonList = []
			if (visitFlag) {
				if (!visitId) {
					alert('当前为复诊，请选择复诊记录')
					return
				}
			}
			if ($('.consul-pattern input[type="checkbox"]').is(':checked') && $('.consul-doctor .multiple-item').length > 1) {
				alert('单方会诊不能选择多个专家')
				return
			}
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
			var purpose = $('.consul-purpose input').val()
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
			var ghConsultationQuery = {}
			//会诊附件表
			var ghConsultationAttachmentSet = []
			var ghConsultationAttachment = {}
			$('.screenage-information tbody tr').each(function () {
				var dicomStudyId = $(this).attr('data-id')
		    	var description = $(this).find('td').eq(4).text()
			    if (dicomStudyId || description) {
			    	ghConsultationAttachment.dicomStudyId = dicomStudyId;
					ghConsultationAttachment.description = description;
					ghConsultationAttachment.state = 0;
					ghConsultationAttachment.attachmentType = 0;
					ghConsultationAttachmentSet.push(ghConsultationAttachment);
					ghConsultationAttachment = {};
			    }
			})
			$('.medical-information tbody tr').each(function () {
				var attachmentName = $(this).find('td').eq(0).text()
				var storageId = $(this).find('td').eq(0).attr('data-id')
				var createTime = $(this).find('td').eq(1).text()
				var description = $(this).find('td').eq(2).text()
			    ghConsultationAttachment.attachmentName = attachmentName;
			    ghConsultationAttachment.createTime = new Date(createTime).getTime();
			    ghConsultationAttachment.storageId = storageId;
				ghConsultationAttachment.description = description;
				ghConsultationAttachment.state = 0;
				ghConsultationAttachment.attachmentType = 1;
				ghConsultationAttachmentSet.push(ghConsultationAttachment);
				ghConsultationAttachment = {};
			})
			uploadFileArray.map(function (item){
				if (item.fileId) {//判断是否正常上传
					ghConsultationAttachment.storageId = item.fileId;
					ghConsultationAttachment.description = item.description;
					ghConsultationAttachment.state = 0;
					ghConsultationAttachment.attachmentType = 1;
					ghConsultationAttachment.attachmentName = item.fileName;
					ghConsultationAttachmentSet.push(ghConsultationAttachment);
					ghConsultationAttachment = {};
				}
			})
			//患者表
			var ghPatientInfo = {};
			ghPatientInfo.patientName = patientName
			ghPatientInfo.sex = sexName
			ghPatientInfo.sexName = sexName? $('.patient-gendar option:selected').text(): ''
			ghPatientInfo.birthday = new Date(birthday).getTime()
			ghPatientInfo.national = $('.patient-nationality select').val()
			ghPatientInfo.nationalName = $('.patient-nationality select').val()? $('.patient-nationality option:selected').text(): ''
			ghPatientInfo.folk = $('.patient-peoples select').val()
			ghPatientInfo.folkName = $('.patient-peoples select').val()? $('.patient-peoples option:selected').text(): ''
			ghPatientInfo.marital = $('.marital-status select').val()
			ghPatientInfo.maritalName = $('.marital-status select').val()? $('.marital-status option:selected').text(): ''
			ghPatientInfo.age = age
			ghPatientInfo.workUnits = workAdress
			ghPatientInfo.mobile = phone
			ghPatientInfo.height = height
			ghPatientInfo.weight = weight
			ghPatientInfo.address = location
			ghPatientInfo.ageUnits = '岁'
			//证件表
			var ghPatientCredential = {};
			ghPatientCredential.crendentialType = identityType
			ghPatientCredential.crendentialName = $('.identity-type option:selected').text()
			ghPatientCredential.crendentialNo = identityNum
			//会诊表
			var ghConsultationInfo = {};
			ghConsultationInfo.state = stateId
			ghConsultationInfo.consultationNo = consulNo
			ghConsultationInfo.consultationWayType = $('.consul-type input:checked').val()
			ghConsultationInfo.isEmergency = $('.is-emergency input:checked').val()
			//期望会诊时间
			if($(".consul-time input").val()){
				ghConsultationInfo.reqDiagnoseTime = new Date($(".consul-time input").val() + ":00").getTime();
			}
			ghConsultationInfo.reqType = $('.consul-pattern input').is(':checked')? '1': '0'
			ghConsultationInfo.reqHospitalId = $('.hospital-apply span').attr('data-id')
			ghConsultationInfo.reqHospitalName = $('.hospital-apply span').text()
			ghConsultationInfo.departmentId = $('.department-apply select').val()
			ghConsultationInfo.departmentName = $('.department-apply select').val()? $('.department-apply option:selected').text(): ''
			ghConsultationInfo.reqDoctorName = applyDoctor
			ghConsultationInfo.reqDoctorPhone = $('.doctor-phone input').val()
			var doctorStr = ''
			var itemList = $('.consul-doctor .multiple-item')
			for (var i = 0; i < itemList.length; i++) {
				if (i > 0) {
					doctorStr += '、'
				}
				doctorStr += itemList.eq(i).attr('data-value')
			}
			ghConsultationInfo.reqDiagnoseDoctor = doctorStr
			ghConsultationInfo.consultationType = consulType
			ghConsultationInfo.disciplineId = $('.discipline select').val()
			ghConsultationInfo.disciplineName = $('.discipline select').val()? $('.discipline option:selected').text(): ''
			ghConsultationInfo.reqDemand = purpose
			ghConsultationInfo.reqDoctorId = '1'
			//复诊需求
			ghConsultationInfo.visitFlag = visitFlag
			ghConsultationInfo.visitId = visitId
			//会诊申请附属表
			var ghConsultationExtra = {};
			ghConsultationExtra.complaint = narrate
			ghConsultationExtra.preDiagnose = diagnosis
			ghConsultationExtra.consultationAim = purpose
			//患者病史表
			var ghPatientExtra = {};
			ghPatientExtra.dieaseHistory = medicalHistory
			ghPatientExtra.nowHistory = presentMedical
			ghPatientExtra.pastHistory = yesterdayMedical
			ghPatientExtra.allergicHistory = allergyHistory
			ghPatientExtra.familyHistory = familyMedical
			ghPatientExtra.medicineDose = hospitalMedicine
			ghPatientExtra.cureProcess = cureCourse
			ghPatientExtra.physicalExamination = healthCheckup
			ghPatientExtra.remark = remarks
			var removeTriageId = ''
			//会诊专家表
			var ghConsultationTriageSet = [];
		    var ghConsultationTriage = {};
			$('.consul-doctor .multiple-item').each(function(i){
		    	var triDoctorId = $(this).attr('data-id')
		    	var triHospId = $(this).attr('data-hospitalId')
		    	var triDeptId = $(this).attr('data-departmentId')
		    	var id = ''
			    if (triDoctorId || triHospId || triDeptId) {
			    	ghConsultationTriage.triDoctorId = triDoctorId;
					ghConsultationTriage.triHospId = triHospId;
					ghConsultationTriage.triDeptId = triDeptId;
					ghConsultationTriage.id = id;
					ghConsultationTriage.state = 0;
					ghConsultationTriage.triMain = 0;
					ghConsultationTriage.consultationState = 10;
					ghConsultationTriageSet.push(ghConsultationTriage);
					ghConsultationTriage = {};
			    } 
			});
			var id = applyId
			if (id) {
				ghConsultationInfo.id = id;
				ghPatientInfo.id = id;
				ghPatientCredential.id = id;
				ghConsultationExtra.id = id;
				ghPatientExtra.id = id;
			}
			ghConsultationQuery.id = id;
			ghConsultationQuery.ghConsultationInfo = ghConsultationInfo;
			ghConsultationQuery.ghPatientInfo = ghPatientInfo;
			ghConsultationQuery.ghPatientCredential = ghPatientCredential;
			ghConsultationQuery.ghConsultationExtra = ghConsultationExtra;
			ghConsultationQuery.ghPatientExtra = ghPatientExtra;
			ghConsultationQuery.ghConsultationAttachmentSet = ghConsultationAttachmentSet;
			ghConsultationQuery.ghConsultationTriageSet = ghConsultationTriageSet;
			ghConsultationQuery.smartComparisonList = smartComparisonList;
			var url
			if (stateId == 0) {
				url = 'consultation/saveConsultation'
			} else {
				url = 'consultation/applyConsultation'
			}
			$.ajax({
				url: baseurl + url,
				type: 'POST',
				data:JSON.stringify(ghConsultationQuery),
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				async: false,
				success: function(res) {
					if (res.status == -1) {
						alert(res.result)
						$(".button-submit").attr("disabled",false)
					}else if(res.status == 1){
						if (stateId == 0) {//暂存跳待办事项tab
							tab = 'tab1';
						}else if(stateId == 10){//提交跳我的申请tab
							tab = 'tab2';
						}
						window.location.href = '/mtcStatis/pages/consultation/myApply.html?tab='+tab //点击后返回我的申请页面
					}
				},
				error: function (err) {
					console.log(err)
				}
			})
		}
	})
})