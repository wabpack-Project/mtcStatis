var logoName = '中电国康医联体平台'
var baseurl = '/gohealth-plat/'
var Page = {}
var ghDoctor
var menuid
var mtcdetails
var ghUser
// 加载页面公用页眉及左侧列表导航
function getLeftTop () {
	$.ajax({
		url: '/mtcStatis/base/nav-top.html',
		type: 'get',
		dataType: 'html',
		async: false,
		success: function (html) {
			$('.down-main').before(html)
		},
		error: function (err) {
			console.log(err)
		}
	})
	$.ajax({
		url: '/mtcStatis/base/left-main.html',
		type: 'get',
		dataType: 'html',
		async: false,
		success: function (html) {
			$('.down-main').prepend(html)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取日期
function getDate (time) {
	var date = ''
	if (time) {
		date = time.split(' ')[0]
	}
	return date
}
// 获取月份
function formatMonth(monthArray){
	for(var i=0;i<monthArray.length;i++){
		monthArray[i] = monthArray[i] + '月';
	}	
}
// 获取用户个人信息
function getsessiondoctor () {
	$.ajax({
		url: baseurl + '/getsessiondoctor',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		async: false,
		success: function (sessiondoctor) {
			ghDoctor = sessiondoctor
			$('#username').html(ghDoctor.ghDoctor.doctorName)
			$('.showinfo .admin-name span').html(ghDoctor.ghDoctor.doctorName)
			$('.showinfo .admin-organ span').html(ghDoctor.eHospital.hospitalName)
			$('.showinfo .admin-phone span').html(ghDoctor.ghDoctor.phonenumber)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
function getsessionuser () {
	$.ajax({
		url: baseurl + '/getsessionuser',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (sessionuser) {
			if (sessionuser.status == 200) {
				var ghUser = sessionuser.result
				$('.setuser .login-name input').val(ghUser.loginId).parents('.login-name').attr('data-id', ghUser.id)
				$('.setuser .admin-name input').val(ghUser.username)
				$('.setuser .admin-phone input').val(ghUser.phonenumber)
			} else {
				console.log(sessionuser)
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取医院下属医生
function queryDoctorByHospitalId(hospitalId){
	var ghDoctorList;
	var data = {};
	data.e_id = hospitalId;
	data.menu_id = menu_id
	data.role_id = ghDoctor.roleId;
	$.ajax({
		url: baseurl + 'mtc/queryDoctorByHospitalId',
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(obj) {
			ghDoctorList = obj;
		},
		error: function(err) {
			console.log(err);
		}
	});
	return ghDoctorList;
}
// 获取医院下属科室
function queryDepartmentByHospitalId(hospitalId){
	
	var ghDepartment;
	var data = {};
	data.e_id = hospitalId;
	data.menu_id = menu_id
	data.role_id = ghDoctor.roleId;
	$.ajax({
		url: baseurl + 'mtc/queryDepartmentByHospitalId',
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(obj) {
			ghDepartmentList = obj
		},
		error: function(err) {
			console.log(err)
		}
	});
	return ghDepartmentList
}
function getMtceByParentid(parentid){

	var mtce
	var data = {'parentid':parentid}
	data.menu_id = menu_id
	data.role_id = ghDoctor.roleId
	$.ajax({
		url: baseurl + 'mtc/mtceparent',//"getDepartmentInfo",
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(obj) {
			mtce = obj
		},
		error: function(err) {
			console.log(err)
		}
	});
	return mtce
}

// 获取所属学科数据
function getGhMedical (box) {
	var medicalHtml = '<option value="">请选择</option>'
	$.ajax({
		url: baseurl + 'doctorManagement/getGhMedicalSubjectParent',
		type: 'post',
		data: {'parentId': '0'},
		dataType: 'json',
		async: false,
		success: function (medicalSubject) {
			for (var i = 0; i < medicalSubject.length; i++) {
				medicalHtml += '<option value=' + medicalSubject[i].id + '>' + medicalSubject[i].subjectName + '</option>'
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
	return medicalHtml
}
// 获取医院下属科室
function getGhDepartment (hospitalId) {
	var ghDepartment
	var postData = {'hospitalId': hospitalId}
	$.ajax({
		url: baseurl + 'getDepartmentInfo',
		type: 'post',
		async: false,
		data: postData,
		dataType: 'json',
		success: function (data) {
			ghDepartment = data
		},
		error: function (err) {
			console.log(err)
		}
	})
	return ghDepartment
}
//根据类型查询系统参数子项_不分页
function getSystemParameterByType(value) {
	var resultData;
	data = {};
	data.type = value;
	$.ajax({
		async: false,
		url: baseurl + '/system/getSystemParameterByType',
		dataType: "json",
		type: 'POST',
		cache: false,
		data: data,
		success: function(parameterData) {
			resultData = parameterData;
		},
		error: function(err) {
			console.log(err)
		}
	});
	return resultData;
}
function getHospitalInfo(userid,transferKind){
	if(userid =='')return;
	var hospitalInfo = [];
	var data = {'type':'hospital','user_id':userid};
	data.role_id = ghDoctor.roleId;
	data.menu_id = menu_id
	var reqUrl = baseurl + 'mtc/mtcUp';
	if(transferKind != undefined&&transferKind == '1'){
		reqUrl = baseurl + 'mtc/mtcDown';
	}
	$.ajax({
		url: reqUrl,
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(hospitalData) {
		  	if(hospitalData != undefined &&hospitalData.length > 0){
				var mtcdetail = {};
				for(var i=0;i< hospitalData.length;i++){
					var hosp = {'id':hospitalData[i].e_id,'hospitalName':hospitalData[i].e_name,'eid':hospitalData[i].id};
					if(mtcdetail[hospitalData[i].mtc_detail_id]==undefined||mtcdetail[hospitalData[i].mtc_detail_id].length ==0){
						mtcdetail[hospitalData[i].mtc_detail_id] =hospitalData[i].mtc_detail_id;
					}
					hospitalInfo.push(hosp);
				}	 
				mtcdetails = jsonObjToStringSplit(mtcdetail,',');
		  	}
		},
		error: function(err) {
			console.log(err);
		}
	})
	return hospitalInfo;
}
//json对象转换成带分隔符的字符串
function jsonObjToStringSplit(jobj,split){
   var jarr = [];
   $.each(jobj, function(idx, obj) {
	   jarr.push('\''+obj+'\'');
	});
     return jarr.join(split);
}
// 获取各类数据列表
function getSystemParameter (type, ele) {
	if (ele.length) {
		var identityTypeList =  getSystemParameterByType(type)
		var typeHtml = '<option value="">请选择</option>'
		for (var i = 0; i < identityTypeList.length; i++) {
			typeHtml += '<option value=' + identityTypeList[i].parameterCode + '>' + identityTypeList[i].name + '</option>'
		}
		ele.html(typeHtml)
	}
}
// 获取年龄单位
function getAgeType (obj) {
	if (obj.length) {
		var ageList =  getSystemParameterByType(4)
		var ageHtml = '<option value="">请选择</option>'
		for (var i = 0; i < sexList.length; i++) {
			ageHtml += '<option value=' + sexList[i].parameterCode + '>' + sexList[i].name + '</option>'
		}
		obj.html(sexHtml)
	}
}
// 获取设备类型
function getEquipment (obj) {
	if (obj.length) {
		var equipmentList =  getSystemParameterByType(9)
		var equipmentHtml = '<option value="">请选择</option>'
		for (var i = 0; i < equipmentList.length; i++) {
			equipmentHtml += '<option value=' + equipmentList[i].parameterCode + '>' + equipmentList[i].name + '</option>'
		}
		obj.html(equipmentHtml)
	}
}
// 获取医院类型
function getHospitalType (obj) {
	if (obj.length) {
		var hospitalList = getSystemParameterByType(58)
		var hospitalHtml = '<option value="">请选择</option>'
		for (var i = 0; i < hospitalList.length; i++) {
			hospitalHtml += '<option value=' + hospitalList[i].parameterCode + '>' + hospitalList[i].name + '</option>'
		}
		obj.html(hospitalHtml)
	}
}
// 获取转诊类型
function getTransferType (obj) {
	if (obj.length) {
		var transferList = getSystemParameterByType(110)
		var transferHtml = '<option value="">请选择</option>'
		for (var i = 0; i < transferList.length; i++) {
			if (transferList[i].parameterCode !=2 && transferList[i].parameterCode !=4) {
				transferHtml += '<option value=' + transferList[i].parameterCode + '>' + transferList[i].name + '</option>'
			}
		}
		obj.html(transferHtml)
	}
}
// 获取诊断类型
function getDiagnoseType (obj) {
	if (obj.length) {
		var diagnoseList =  getSystemParameterByType(200)
		var diagnoseHtml = '<option value="">请选择</option>'
		for (var i = 0; i < diagnoseList.length; i++) {
			diagnoseHtml += '<option value=' + diagnoseList[i].parameterCode + '>' + diagnoseList[i].name + '</option>'
		}
		obj.html(diagnoseHtml)
	}
}
//根据权限获取 医院 科室 医生信息 type: doctor hospital department
function getRemoteclinicApplyInfo(type,parent_id){
	var applyInfo;
	var data = {};
	data.user_id = ghDoctor.ghDoctor.id;
	data.menu_id = menu_id
	data.role_id = ghDoctor.roleId;
	if(type != '' && type != null){
		data.type = type;
	}
	if(parent_id != '' && parent_id != null){
		data.parent_id = parent_id;
	}
	$.ajax({
		url: baseurl + "mtc/mtcUp",
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(infoData) {
			applyInfo = infoData
		},
		error: function(err) {
			console.log(err)
		}
	});
	return applyInfo;
}
// 根据类型、编码查询系统参数名称
function getSysParaName(type, value) {
    var retname = value;
    var resultData = getSystemParameterByType(type)
	for (var i = 0; i < resultData.length; i++) {
		if (value == resultData[i].parameterCode) {
			retname = resultData[i].name;
			break;
		}
	}
	if (type == "2") {
		retname = retname.substring(0,1);
	}
	return retname;
}
//根据设备类型获取检查项目
function getGhSysOrderitemJCList(itemType){
	var sysOrderitemJCList;
	var data = {};
	data.itemType = itemType;
	$.ajax({
		url: baseurl + "getSysOrderitemJC",
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(obj) {
			sysOrderitemJCList = obj;
		},
		error: function(err) {
			console.log(err)
		}
	});
	return sysOrderitemJCList;
}
//获取检验项目
function getGhSysOrderitemJYList(){
	var sysOrderitemJYList;
	var data = {};
	$.ajax({
		url: baseurl + "getSysOrderitemJY",
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(obj) {
			sysOrderitemJYList = obj;
		},
		error: function(err) {
			console.log(err)
		}
	});
	return sysOrderitemJYList;
}
// 验证身份证号
function verifyIdentity(code) {   
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};  
    var text = "";  
    var pass= true;  
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){  
        text = "身份证号格式错误";  
        pass = false;  
    }  
   else if(!city[code.substr(0,2)]){  
        text = "身份证号地址编码错误";  
        pass = false;  
    }  
    else{  
        //18位身份证需要验证最后一位校验位  
        if(code.length == 18){  
            code = code.split('');  
            //∑(ai×Wi)(mod 11)  
            //加权因子  
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];  
            //校验位  
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];  
            var sum = 0;  
            var ai = 0;  
            var wi = 0;  
            for (var i = 0; i < 17; i++)  
            {  
                ai = code[i];  
                wi = factor[i];  
                sum += ai * wi;  
            }  
            var last = parity[sum % 11];  
            if(parity[sum % 11] != code[17]){  
                text = "身份证号校验位错误";  
                pass =false;  
            }  
        }  
    }  
    return {'text': text, 'pass': pass}  
}
// 验证日期格式
function verifyDate (date) {
	var result = date.match(/^(\d{4,4})(\d{2,2})(\d{2,2})$/)
	if (result == null){
		return false
	}
    var d = new Date(result[1], result[2] - 1, result[3]);
	result = (d.getFullYear() == result[1] && d.getMonth() + 1 == result[2] && d.getDate() == result[3])
    return result
}
function ehr(){
	var crendentialType = $(".identity-type span").attr('data-type')
	if(crendentialType.length == 1){
		crendentialType = "0" + crendentialType;
	}
	var sec = "jmxxBz=1&jgdm=13221230400&jgmc=金山医院&jryydm=yy002&jryymc=健康档案系统&jryh=fddxfsjsyy&jrmm=2016010020&czrydm=021" +
			"&czryxm=陈悠悠&czrysfzh=310228195602016612&zjlx=" + crendentialType + "&zjhm=" + $(".identity-type span").text() + "&klx=8&kh=Q301431";
	sec = encodeURIComponent(DES3.encrypt(sec));
	$.ajax({
		url: baseurl + "/getEHRUrl",
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		contentType: 'application/json;charset=utf-8',
		data: {},
		success: function(ehrUrl) {
			window.open(ehrUrl+"?sec="+sec);;
		},
		error: function(msg) {
			console.info("调用失败");
			
		}
	});
}
// 打开影像资料
function callDicomBrower(dicomStudyId,issecret){
	var dicomparam = {};
	dicomparam.studyId = dicomStudyId;
	if(issecret){
		dicomparam.issecret = issecret;//脱敏标记
	}
	$.ajax({
		url: baseurl + "/opendicomstudy",
		dataType: "json",
		type: 'POST',
		cache: false,
		data: dicomparam,
		success: function(obj) {
			if(obj.status == 100){
				var token = obj.result.token;
				var weburl = obj.result.weburl;
				var imgUrl = weburl + "?xeguid="+dicomStudyId+"&username=sss&token=" + token;
				window.open(imgUrl,"_blank");
			}
		},
		error: function(err) {
			console.log(err)
		}
	});

}
$(function () {
	getLeftTop()
	var searchArr = location.search.split(/[?=&]/)
	var parentInd = $('#parentHref').attr('data-index')? $('#parentHref').attr('data-index'): searchArr[searchArr.indexOf('ind') + 1]
	$('.sBox ul li a[data-index="' + parentInd + '"]').parents('li').addClass('cur').parents('.sBox').addClass('slideDown active')
	menu_id = $('.navContent .cur a').attr('data-id')
	$('.logo-name,title').text(logoName)
	getsessiondoctor()
	getsessionuser()
	// 获取证件类型
	getSystemParameter(1, $('.identity-type select'))
	// 获取性别列表
	getSystemParameter(2, $('.patient-gendar select'))
	// 获取婚姻状况
	getSystemParameter(3, $('.marital-status select'))
	// 获取患者国籍
	getSystemParameter(5, $('.patient-nationality select'))
	// 获取患者民族
	getSystemParameter(6, $('.patient-peoples select'))
	// 获取接诊类型数据
	getSystemParameter(50, $('.reception-type select'))
	// 获取医保类型列表
	getSystemParameter(52, $('.insurance-type select'))
	// 获取医院级别
	getSystemParameter(53, $('.apply-hospital-level select'))
	// 获取病种列表
	getSystemParameter(111, $('.transfer-disease select'))
	getGhMedical($('.discipline select'))
	Date.prototype.Format = function (fmt) { 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	if ($('.input-date:not(.input-time):not(.afterNow)').length) {
		$('.input-date:not(.input-time):not(.afterNow)').datetimepicker({
			format: 'yyyy-mm-dd',
			autoclose: true,
			minView: 'month',
			language: 'zh-CN'
		})
	}
	if ($('.input-date.input-time:not(.afterNow)').length) {
		$('.input-date.input-time:not(.afterNow)').datetimepicker({
			format: 'yyyy-mm-dd hh:ii',
			autoclose: true,
			language: 'zh-CN'
		})
	}
	// 设置当前页对应导航项样式
	/*var path
	if ($('#parentHref').length) {
		var searchArr = location.search.split(/[=&]/)
		var parentType = searchArr.indexOf('?type') != -1? searchArr[searchArr.indexOf('?type') + 1]: searchArr.indexOf('type') != -1? searchArr[searchArr.indexOf('type') + 1]: undefined
		if (parentType) {
			path = $('#parentHref').val() + '?type=' + parentType
		}
	} else {
		path = location.pathname + location.search
	}
	$('.sBox ul li a[href="' + path + '"]').parents('li').addClass('cur').parents('.sBox').addClass('slideDown active')*/
	$("body").on('click', '.right-nav .dropdown-menu li', function () {
		// 显示管理员信息、个人设定弹框、密码修改弹框
		var className = $(this).attr('name')
		$('.mask,.setBox.' + className).show()
	}).on('click', '.setBox .close,.setBox .cancel', function () {
		// 取消或关闭弹框
		$('.mask').hide()
		$(this).parents('.setBox').hide()
	}).on('click', '.listBox .close,.listBox .cancel', function () {
		// 取消或关闭弹框
		$('.mask').hide()
		$(this).parents('.listBox').hide()
	}).on('click', '.setuser .besure', function () {
		// 确定修改用户信息
		var name = $('.setuser .admin-name input').val()
		var phone = $('.setuser .admin-phone input').val()
		if (!name) {
			alert('用户名不能为空')
			return
		}
		if (!phone) {
			alert('用户手机号不能为空')
			return
		}
		var Page = {}
		Page.showCount = 3
		Page.currentPage = 1
		var userManagement = {}
		userManagement.page = Page
		var user = {}
		user.id = $('.setuser .login-name').attr('data-id')
		user.username = name
		user.phonenumber = phone
		userManagement.ghUser = user
		$.ajax({
			url: baseurl + "userManagement/updateUsers",
			dataType: "json",
			type: 'POST',
			cache: false,
			contentType: 'application/json;charset=utf-8',
			data: JSON.stringify(userManagement),
			success: function(msg) {
				$(".showinfo .admin-name span").html(name)
				$(".showinfo .admin-phone span").html(phone)
				$('.setBox.setuser,.mask').hide()
			},
			error: function(err) {
				console.info(err)
			}
		})
	}).on('click', '.setpassword .besure', function () {
		// 修改用户密码
		var oldPassword = $(".old-password input").val()
		var newPassword1 = $(".new-password input").val()
		var newPassword2 = $(".besure-password input").val()
		if (oldPassword && newPassword1 && newPassword2) {
			if (newPassword1 != newPassword2) {
				alert("新密码与确认密码不一致")
				return
			}
			$.ajax({
				url: baseurl + 'userManagement/updateUsersPassword',
				type: 'post',
				data: JSON.stringify({'oldPassword': oldPassword, 'newPassword': newPassword1}),
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				success: function (msg) {
					if (msg == '修改成功') {
						var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
						if (keys) {
							for (var i = keys.length; i--;)
								document.cookie = keys[i] + '=0;expires=' + new Date( 0).toUTCString();
						} 
						location.href = baseurl + 'login';
						alert(msg)
					}
				},
				error: function (err) {
					console.log(err)
				}
			})
		} else {
			alert("密码不能为空");
			return;
		}
	}).on('click' ,'.subNav', function(){
		/*左侧导航栏显示隐藏功能*/
		$(this).parents('.sBox').toggleClass('active')			
		$(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(300);
	}).on('click', '.tabs>li', function () {
		// 点击选项卡切换页面内容显示
		$(this).addClass('current').siblings('.current').removeClass('current')
		var name = $(this).attr('name')
		$(this).parent().siblings('.tab_content').children('.' + name).addClass('current').siblings('.current').removeClass('current')
	}).on('click', '.show_more', function () {
		// 配置下拉
		$(this).toggleClass('slidedown')
		$(this).parent().toggleClass('slidedown')
	}).on('click', 'table thead input[type="checkbox"]', function () {
		// 表格表头多选操作对表格主体内多选框的影响
		var checked = $(this).prop('checked')
		$(this).parents('table').find('tbody input[type="checkbox"]').prop('checked', checked)
	}).on('click', 'table tbody input[type="checkbox"]', function () {
		// 表格主体内多选操作对表格表头多选框的影响
		var table = $(this).parents('table')
		var checkbox = table.find('thead input[type="checkbox"]')
		if ($(this).prop('checked')) {
			if (!table.find('tbody input[type="checkbox"]:not(:checked)').length) {
				checkbox.prop('checked', true)
			}
		} else {
			checkbox.prop('checked', false)
		}
	}).on('click','.search-box .reset', function () {
		// 重置搜索条件
		var parent = $(this).parents('.search-box')
		parent.find('input').val('')
		parent.find('select').each(function () {
			$(this).attr('data-value')? $(this).val($(this).attr('data-value')): $(this).val('')
		})
	})
})