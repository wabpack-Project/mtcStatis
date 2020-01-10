var scheduleList
var doctorId
// 动态构建医生信息列表
function initDoctor() {
	ghDoctorInfo = queryDoctorByHospitalId(ghDoctor.eHospital.id);
	var doctorBox = $('.scheduling-doctor-box .doctor-list .list-box')
	var listHtml = '<span class="doctor-item" id="45" draggable="true" ondragstart=drag(event)>黄金果/男/主任医师</span>'
	// 循环创建医生组件对象
	for (var i = 0; i < ghDoctorInfo.length; i++) {
		var valStr = ghDoctorInfo[i].doctorName + "/" + getSysParaName("2", ghDoctorInfo[i].sex) + "/" + getSysParaName("56", ghDoctorInfo[i].doctorTitle)
		listHtml += '<span class="doctor-item" id=' + ghDoctorInfo[i].id + ' title=' + valStr + ' draggable="true" ondragstart=drag(event)>' + valStr + '</span>'
	}
	doctorBox.html(listHtml)
}
//按科室、月份加载已排班信息
function loadScheduleInfo(obj){
	var scheduleMonth = obj.attr('data-month')
	var year = scheduleMonth.split("-")[0]
	var month = scheduleMonth.split("-")[1]
	var monthStr = month > 10? month: '0' + month
	var allDates = new Date(year, month, 0).getDate() //当月一共有几天
	var monthBegin = year + "-" + monthStr  + "-" +  "01"; 
	var monthEnd = year + "-" + monthStr  + "-" +  allDates
	//获取已排班信息
	getScheduleInfo(monthBegin, monthEnd);
	//初始化一个全月的无排班标志数位
	initConfig(scheduleMonth + "-1" ,scheduleMonth + "-" + allDates ,"0");
	for(var i = 0;i < scheduleList.length; i++){
		var arrDate = new Date(scheduleList[i].arranageDate+" GMT+0800 ").Format("yyyy-MM-dd");
		initConfig(arrDate ,"1",arrConfig);
	}
	//更新日历控件
	// updateMonthData(year, month,arrConfig)
}
//获取已排班信息
function getScheduleInfo(monthBegin,monthEnd){
	var postData = {}
	postData.hospitalId = ghDoctor.eHospital.id
	postData.arranageType = 0
	postData.startDate = monthBegin
	postData.endDate = monthEnd
	$.ajax({
		async: false,
		url: baseurl + 'remoteclinic/selectClinicArranageList',
		dataType: "json",
		type: 'POST',
		cache: false,
		data: JSON.stringify(postData),
		contentType: 'application/json;charset=utf-8',
		success: function(msg) {
			if (msg) {
				scheduleList = msg
			}
		},
		error: function(err) {
			console.log(err)
		}
	});
}

function initConfig(strStart,isConfig) {
	var startDate = strStart
	var endDate = strStart
	var arrConfig = []
	//清空周日历
	var str = startDate;
	while (str <= endDate) {
		//重置标识位
		var exists = false;
		for(var j = 0;j<arrConfig.length;j++){
			//已存在，则更新标志
			if(arrConfig[j].strDate == str){
				exists = true;
				arrConfig[j].isConfig = isConfig;
				break;
			}
		}
		//不存在则新增
		if(!exists){
			var config = {};
			config.strDate = str
			config.isConfig = isConfig;
			arrConfig.push(config);
		}
		//日期+1
		str = new Date(str)
		str = new Date(str.setTime(str.getTime() + 24 * 60 * 60 * 1000)).Format('yyyy-MM-dd')
		// str = new Date(new Date(str.getFullYear(), str.getMonth(), str.getDate()).getTime() + (1 * 24 * 60 * 60 * 1000));
	}
}
// 获取可排班信息
function getCanSchedule (startDate, endDate) {
	week = []
	var str = startDate;
	while (str <= endDate) {
		var exists = false;
		//已排班的过滤掉
		for(var j = 0;j<scheduleList.length;j++){
			if(new Date(scheduleList[j].arranageDate+" GMT+0800 ").Format("yyyy-MM-dd") == str){
				exists = true;
				break;
			}
		}
		//未排班的加入到周日历中
		if(!exists){
			week.push(str);
		}
		str = new Date(str)
		str = new Date(str.setTime(str.getTime() + 24 * 60 * 60 * 1000)).Format('yyyy-MM-dd')
	}
	if (week.length == 0) {
		alert("本周无可排班信息，请确认！")
		$(".doctor-container").html("请将所需医生拖拽到此处")
		return;
	}
	if($(".doctor-container").html() == ""){
		$(".doctor-container").html("请将所需医生拖拽到此处")
	}
}
// 重置出诊信息选择
function resetOutpatient () {
	$('.selectInfo-box .date-type input[type="radio"]').prop('checked', false).siblings('select').val('').find('option:not(:first)').remove()
	$('.selectInfo-box').find('.registration-cost input,.outpatient-num input').val('')
	$('.selectInfo-box .set').addClass('disabled')
}
function drag(ev) {
	ev.dataTransfer.setData("Text", ev.target.id);
	doctorId = ev.target.id;
}
function drop(ev) {
	if(!$('.selectInfo-box .doctor-content .doctor-item').length){
		$(".selectInfo-box .doctor-content").html("");
	}
	ev.preventDefault();
	var isdrag = true;
	if ($('.selectInfo-box .doctor-content .doctor-item').length) {
		$(".selectInfo-box .doctor-content .doctor-item").each(function(index, item) {
			if (item.id === doctorId) {
				isdrag = false;
				alert("这个医生您刚才已经选择过了哦！")
			}
		});
	}
	if (isdrag) {
		var data = ev.dataTransfer.getData("Text");
		var item = document.getElementById(data).cloneNode(true);
		ev.target.appendChild(item);
		$(".selectInfo-box .doctor-content .doctor-item").attr("draggable", "flase");
		$(item).addClass("dragged");
	}
}
function allowDrop(ev) {
	ev.preventDefault();
}
$(function () {
	initDoctor()
	loadScheduleInfo($('.month-list li.selected'))
	$('body').on('click', '.scheduling-date-box tbody .look', function () {
		// 选择排班信息
		var parents = $(this).parents('tr')
		$('.doctor-container').show()
		parents.addClass('selected').siblings('.selected').removeClass('selected')
		resetOutpatient()
		getCanSchedule(parents.find('td.activeTd:first').attr('data-date'), parents.find('td.activeTd:last').attr('data-date'))
	}).on('click', '.scheduling-date-box tbody .revocation', function () {
		// 清除排班信息
		$(this).parents('tr').removeClass('selected')
		// $('.scheduling-doctor-box .list-box').empty()
		resetOutpatient()
		$('.selectInfo-box .doctor-content').html('请将所需医生拖拽到此处')
	}).on('click', '.selectInfo-box .date-type label input', function () {
		// 选择出诊日期类型
		$('.selectInfo-box .set').removeClass('disabled')
		// 增加指定日期日期选项
		if ($(this).val() == 'given' && $(this).siblings('select').find('option').length == 1) {
			var selectTd = $('.scheduling-date-box tr.selected .activeTd')
			for (var i = 0; i < selectTd.length; i++) {
				var option = document.createElement('option')
				var date = selectTd.eq(i).attr('data-date')
				option.value = date
				option.innerHTML = date
				$(this).siblings('select').append(option)
			}
		}
	}).on('click', '.selectInfo-box .reset', function () {
		resetOutpatient()
	})
})