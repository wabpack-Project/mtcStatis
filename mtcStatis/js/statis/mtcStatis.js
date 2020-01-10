var uptransferCount
var downtransferCount
var clinicalConCount
var pacsConCount
var simpleRemotecCount
var commonRemotecCount
var expertRemotecCount
$(function() {
	getStatisData()
	initMTCHospital();
	
	initHospBusiness();
	//统计双转接诊明星
	initDocBizTop();
    var transferLegendData = ['上转患者', '下转患者'];
    var transferData = [{ value: uptransferCount, name: '上转患者' }, { value: downtransferCount, name: '下转患者' }];
    circleCharts("turn_accepts", transferLegendData, transferData,"转诊类型");
    
    var conLegendData = ['临床会诊', '影像会诊'];
    var conData = [{ value: clinicalConCount, name: '临床会诊' }, { value: pacsConCount, name: '影像会诊' }];
    circleCharts("turn_accepts1", conLegendData, conData,"会诊类型");
    
    var remoteLegendData = ['便民门诊', '普通门诊','专家门诊'];
    var remoteData = [{ value: simpleRemotecCount, name: '便民门诊' }, { value: commonRemotecCount, name: '普通门诊' }, { value: expertRemotecCount, name: '专家门诊' }];
    circleCharts("turn_accepts2", remoteLegendData, remoteData,"门诊类型");
   
    statisTransfer();
    
    statisConsultation();
    
    statisRemoteclinic();
});
// 获取统计数值
function getStatisData () {
	$.ajax({
		url: baseurl + 'statis/mtcStatisNew',
		type: 'get',
		async: false,
		success: function (msg) {
			uptransferCount = msg.uptransferCount
			downtransferCount = msg.downtransferCount
			clinicalConCount = msg.clinicalConCount
			pacsConCount = msg.pacsConCount
			simpleRemotecCount = msg.simpleRemotecCount
			commonRemotecCount = msg.commonRemotecCount
			expertRemotecCount = msg.expertRemotecCount
			$('.hospital-total .font_num').html(msg.signHospCount)
			$('.doctor-total .font_num').html(msg.registDocCount)
			$('.medical-total .font_num').html(msg.registDocCount)
			$('.transfer-total .font_num').html(msg.transferCount)
			$('.consultant-total .font_num').html(msg.consultationCount)
			$('.outpatient-total .font_num').html(msg.remotecCount)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
//统计转诊近半年趋势
function statisTransfer(){
	$.ajax({
		url: baseurl + 'statis/statisTransfer',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (statisTransferData) {
			var monthArray = new Array();
			var traArray;
			//统计远程会诊
			var newObj = statisTransferData.reverse();//月份升序排列
			//日期去掉年存入数组
			for(var i=0;i<newObj.length;i++){
				var month = newObj[i].month.split('-')[1];
			   		monthArray.push(month);
			}
			traArray = new Array(monthArray.length);
			for(var i=0;i<newObj.length;i++){
				var count = newObj[i].transferMount;
				var month = newObj[i].month.split('-')[1];
				orgData(monthArray,traArray,month,count);
			}
			formatMonth(monthArray);
			trend_echart("trend_echart", traArray,monthArray,"双向转诊近半年趋势",'转诊');
		},
		error: function (err) {
			console.log(err)
		}
	})
}

//统计会诊近半年趋势
function statisConsultation(){
	$.ajax({
		url: baseurl + 'statis/statisConsultation',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (statisConsultationData) {
			var monthArray = new Array();
			var conArray;
			//统计远程会诊
			var newObj = statisConsultationData.reverse();//月份升序排列
			//日期去掉年存入数组
			for(var i=0;i<newObj.length;i++){
				var month = newObj[i].month.split('-')[1];
			   		monthArray.push(month);
			}
			conArray = new Array(monthArray.length);
			for(var i=0;i<newObj.length;i++){
				var count = newObj[i].consultationMount;
				var month = newObj[i].month.split('-')[1];
				orgData(monthArray,conArray,month,count);
			}
			formatMonth(monthArray);
			trend_echart("trend_echart1", conArray,monthArray,"远程会诊近半年趋势",'会诊');	 
		},
		error: function (err) {
			console.log(err)
		}
	})
}

//统计门诊近半年趋势
function statisRemoteclinic(){
	$.ajax({
		url: baseurl + 'statis/statisRemoteclinic',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (statisRemoteclinicData) {
			var monthArray = new Array();
			var remArray;
			//统计远程门诊
			var newObj = statisRemoteclinicData.reverse();//月份升序排列
			//日期去掉年存入数组
			for(var i=0;i<newObj.length;i++){
				var month = newObj[i].month.split('-')[1];
			   		monthArray.push(month);
			}
			conArray = new Array(monthArray.length);
			for(var i=0;i<newObj.length;i++){
				var count = newObj[i].clinicMount;
				var month = newObj[i].month.split('-')[1];
				orgData(monthArray,conArray,month,count);
			}
			formatMonth(monthArray);
			trend_echart("trend_echart2", conArray,monthArray,"远程门诊近半年趋势",'门诊');
		},
		error: function (err) {
			console.log(err)
		}
	})
}
function orgData(monthArray,bizArray,month,count){
	for(var i=0;i<monthArray.length;i++){
		if(monthArray[i]==month){
			bizArray[i] = count;
		}
	}
}

// 趋势统计图
function trend_echart(dom, data, statisDate,title,biz) {
    var trend_echart = echarts.init(document.getElementById(dom));
    option = {
        color: ['#1cb394'],
        // title: {
        //     text: title,
        // },
        grid: {
        	top: '8%'
        },
        tooltip: {
            trigger: 'axis'
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: statisDate,
            axisTick: {
                alignWithLabel: false,
                show: false
            },
            axisLine: {
                lineStyle: {
                	type: 'dashed',
                	color: '#e7e7e7'
                }
            },
            axisLabel: {
            	color: '#666'
            },
            splitLine: {
            	show: false
            }
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                	type: 'dashed',
                	color: '#e7e7e7'
                }
            },
            axisLabel: {
            	color: '#666'
            },
            splitLine: {
            	lineStyle: {
            		type: 'dashed',
                	color: '#e7e7e7'
            	}
            }
        }],
        series: [{
            name: biz,
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            smooth: true,
            label: {
                normal: {
                    show: false,
                    position: 'top'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '12'
                    }
                },
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            areaStyle: {
            	color: {
            		type: 'linear',
				    x: 0,
				    y: 0,
				    x2: 0,
				    y2: 1,
				    colorStops: [{
				        offset: 0, color: '#D7F0EA' // 0% 处的颜色
				    }, {
				        offset: 1, color: '#fff' // 100% 处的颜色
				    }],
				    global: false
            	}
            },
            data: data
        }]
    };
    trend_echart.setOption(option);
    $(window).resize(function(){
        trend_echart.resize();
    });
}

//环形图
function circleCharts(dom, legendData, data,name) {
    var turn_accepts = echarts.init(document.getElementById(dom));
    option = {
        color: ['#6aceba', '#1cb394', '#B6E6DB'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            y: 'bottom',
            data: legendData,
            icon: 'circle',
            bottom: 50
        },
        series: [{
            name: name,
            type: 'pie',
            center: ['50%', '27%'],
            radius:'54%',
            avoidLabelOverlap: false,
            label: {
            	show: false
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: data
        }]
    };

    turn_accepts.setOption(option);
    $(window).resize(function(){
        turn_accepts.resize();
    });
}

function initMTCHospital(){
	$("#threeLevel").html('')
	$("#twoLevel").html('')
	$("#oneLevel").html('')
	$.ajax({
		url: baseurl + 'statis/getEHospitalList',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (MTCHospitalData) {
			for(var i=0;i<MTCHospitalData.length;i++){
				var hospitalLevel = MTCHospitalData[i].hopsitalLevel;
				var hospitalName = MTCHospitalData[i].hospitalName;
				if(hospitalLevel == '1' || hospitalLevel =='2' || hospitalLevel=='3'){
					$("#threeLevel").append("<li>"+hospitalName+"</li>");
				}else if(hospitalLevel == '4' || hospitalLevel =='5' || hospitalLevel=='6'){
					$("#twoLevel").append("<li>"+hospitalName+"</li>");
				}else if(hospitalLevel == '7' || hospitalLevel =='8' || hospitalLevel=='9'){
					$("#oneLevel").append("<li>"+hospitalName+"</li>");
				}
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}

function initHospBusiness(){
	$.ajax({
		url: baseurl + 'statis/statisBizByMTC',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (HospBusinessData) {
			for(var i=0;i<HospBusinessData.length;i++){
				var hospitalLevel = HospBusinessData[i].hospitalLevel;
				var hospitalName = HospBusinessData[i].name;
				var transferApp = HospBusinessData[i].transferApp;
				var consultationApp = HospBusinessData[i].consultationApp;
				var remotecApp = HospBusinessData[i].remotecApp;
				var transferRec = HospBusinessData[i].transferRec;
				var consultationRec = HospBusinessData[i].consultationRec;
				var remotecRec = HospBusinessData[i].remotecRec;
				var level = '';
				if(hospitalLevel == '1' || hospitalLevel =='2' || hospitalLevel=='3'){
					level = "三级";
				}else if(hospitalLevel == '4' || hospitalLevel =='5' || hospitalLevel=='6'){
					level = "二级";
				}else if(hospitalLevel == '7' || hospitalLevel =='8' || hospitalLevel=='9'){
					level = "一级";
				}
				var hospBusiness = "<tr><td>"+hospitalName+"</td><td>"+level+"</td><td>"+transferApp+"</td><td>"+consultationApp+"</td><td>"+remotecApp+"</td><td>"+transferRec+"</td><td>"+consultationRec+"</td><td>"+remotecRec+"</td></tr>"
				
				$("#hospBusiness").append(hospBusiness);
			}
			var transferAppArray = HospBusinessData.sort(compare('transferApp')).reverse();
			orginHospTop(transferAppArray,"ul_transferApp","transferApp");
			
			var consultationAppArray = HospBusinessData.sort(compare('consultationApp')).reverse();
			orginHospTop(consultationAppArray,"ul_consultationApp","consultationApp");
			
			var remotecApp = HospBusinessData.sort(compare('remotecApp')).reverse();
			orginHospTop(remotecApp,"ul_remoteclinicApp","remotecApp");
			
			var transferRecArray = HospBusinessData.sort(compare('transferRec')).reverse();
			orginHospTop(transferRecArray,"ul_transferRec","transferRec");
			
			var consultationRecArray = HospBusinessData.sort(compare('consultationRec')).reverse();
			orginHospTop(consultationRecArray,"ul_consultationRec","consultationRec");
			
			var remotecRecArray = HospBusinessData.sort(compare('remotecRec')).reverse();
			orginHospTop(remotecRecArray,"ul_remoteclinicRec","remotecRec");
		},
		error: function (err) {
			console.log(err)
		}
	})
}

/**
 * 统计平台医生明星
 */
function initDocBizTop(){
	$.ajax({
		url: baseurl + 'statis/statisBizTop',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (DocBizTopData) {
			for(var i=0;i<DocBizTopData.length;i++){
				var recType = DocBizTopData[i].recType;
				var title = '';
				var recDoctroName = DocBizTopData[i].recDoctorName;
				var recHospitalName = DocBizTopData[i].recHospitalName;
				var recCount = DocBizTopData[i].recCount;
				var id='';
				if(recType == '0'){//转诊接诊明星
					id="transfer";
				}else if(recType == '1'){//会诊接诊明星
					id="consultation";
				}else if(recType == '2'){//便民接诊明星
					id="simple";
				}else if(recType == '3'){//普通接诊明星
					id="common";
				}else if(recType == '4'){//专家接诊明星
					id="expert";
				}
				$("#"+id+"_top_doc").html(recDoctroName);
				$("#"+id+"_top_hosp").html(recHospitalName);
				$("#"+id+"_top_count").html("累计接诊："+recCount+"例");
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
/**
 * 组织医院排行
 * @param bizArray
 * @param htmlId
 */
function orginHospTop(bizArray,htmlId,key){
	$("#"+htmlId).html('');
	for(var i=0;i<bizArray.length;i++){
		var hospitalName = bizArray[i].name;
		var transferApp = bizArray[i][key];
		var num = i+1;
		if(i<5){
			var bizHTML = " <li><div class='rank_num'><img src='/mtcStatis/images/u09.png' alt=''><i>"+num+"</i></div><span title='"+hospitalName+"'>"+hospitalName+"</span><span class='pull-right' style='color: #999999'>"+transferApp+"</span></li>";
			$("#"+htmlId).append(bizHTML);
		}
	}
}

//根据属性比较
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}




