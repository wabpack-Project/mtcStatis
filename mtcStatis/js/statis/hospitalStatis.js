var bizData
// 获取医院加入平台天数
function getJoinDay () {
	var createDate = new Date(ghDoctor.eHospital.createTime.split(' ')[0])
	var nowDate = new Date()
	return parseInt(Math.abs(createDate - nowDate) / 1000 / 24 / 60 / 60)
}
// 获取双向转诊业务量折线图
function getTransferStatisByMonth () {
	$.ajax({
		url: baseurl + 'statis/getTransferStatisByMonth',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (transferStatisByMonth) {
			var newObj = transferStatisByMonth.reverse();//月份升序排列
			var monthArray = []
			//日期去掉年存入数组
			for(var i=0;i<newObj.length;i++){
				var month = newObj[i].month.split('-')[1];
				var index = $.inArray(month,monthArray);
	   	   		if(index >=0 ){
	   	   			continue;
	   	   		}
	   	   		monthArray.push(month);
			}
			var appArray = new Array(monthArray.length);
			var recArray = new Array(monthArray.length);
			for(var i=0;i<newObj.length;i++){
				var count = newObj[i].transferMount;
				var type = newObj[i].statisType;
				var month = newObj[i].month.split('-')[1];
				if(type == '0'){//申请
					orgData(monthArray,appArray,month,count);
				}else if(type == '1'){//接诊
					orgData(monthArray,recArray,month,count);
				}
			}
			formatMonth(monthArray)
			var statistics_charts = echarts.init(document.getElementById('transfer-echart'));
		    option = {
		        color: ['#6aceba', '#1cb394'],
		        grid: {
		        	top: '8%'
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
		        legend: {
		            orient: 'horizontal',
		            x: 'center',
		            y: 'bottom',
		            data: ['申请业务', '接诊业务'],
		            itemGap: 80
		        },
		        calculable: false,
		        xAxis: [{
		            type: 'category',
		            boundaryGap: false,
		            data: monthArray,
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
		                name: '申请业务',
		                type: 'line',
		                symbol: 'circle',
            			symbolSize: 6,
		                smooth: true,
		                data: appArray,
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
			            }
		            },
		            {
		                name: '接诊业务',
		                type: 'line',
		                symbol: 'circle',
            			symbolSize: 6,
		                smooth: true,
		                data: recArray,
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
			            }
		            }
		        ]
		    };
		    statistics_charts.setOption(option);
		    $(window).resize(function() {
		        statistics_charts.resize();
		    })
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
// 获取转诊业务量数据
function getBizByDep () {
	$.ajax({
		url: baseurl + 'statis/statisBizByDep',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		async: false,
		success: function (bizByDep) {
			bizData = bizByDep
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取转诊申请业务量列表
function getTransferApplyTraffic () {
	var transferAppArray = bizData.sort(compare('transferApp')).reverse()
	for(var i=0;i<transferAppArray.length;i++){
		var depName = transferAppArray[i].name;
		var num = i+1;
		var transferApp = transferAppArray[i].transferApp;
		var upTransferApp = transferAppArray[i].upTransferApp;
		var downTransferApp = transferAppArray[i].downTransferApp;
		var appHTML = "<li><div class='rank_num'><img src='/mtcStatis/images/u09.png'><i>" + num + "</i></div><span title=" + depName + ">" + depName + "</span><div class='pull-right info-count'><span>上转<em>" + upTransferApp + "</em></span><span>下转<em>" + downTransferApp + "</em></span><span>合计<em>" + transferApp + "</em></span></div></li>";
		$("#transfer-apply").append(appHTML);
	}
}
// 获取转诊接诊业务量列表
function getTransferReceptionTraffic () {
	var transferRecArray = bizData.sort(compare('transferRec')).reverse()
	for(var i=0;i<transferRecArray.length;i++){
		var depName = transferRecArray[i].name;
		var num = i+1;
		var transferRec = transferRecArray[i].transferRec;
		var upTransferRec = transferRecArray[i].upTransferRec;
		var downTransferRec = transferRecArray[i].downTransferRec
		var appHTML = "<li><div class='rank_num'><img src='/mtcStatis/images/u09.png'><i>" + num + "</i></div><span title=" + depName + ">" + depName + "</span><div class='pull-right info-count'><span>上转<em>" + upTransferRec + "</em></span><span>下转<em>" + downTransferRec + "</em></span><span>合计<em>" + transferRec + "</em></span></div></li>";
		$("#transfer-reception").append(appHTML);
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
// 获取病种业务量占比
function getDiseaseAnalysis () {
	$.ajax({
		url: baseurl + 'statis/diseaseAnalysis',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (diseaseAnalysis) {
			if (diseaseAnalysis.length > 0) {
				var diseases = diseaseAnalysis[0];
				progressBar($('#apply-bar-left'),diseases.applyDisease1.diseaseName,diseases.applyDisease1.diseaseNum,"#B6E6DB")
				progressBar($('#apply-bar-left'),diseases.applyDisease2.diseaseName,diseases.applyDisease2.diseaseNum,"#6aceba")
				progressBar($('#apply-bar-left'),diseases.applyDisease3.diseaseName,diseases.applyDisease3.diseaseNum,"#1cb394")
				progressBar($('#apply-bar-left'),diseases.applyDisease4.diseaseName,diseases.applyDisease4.diseaseNum,"#23C6C7")
				progressBar($('#apply-bar-right'),diseases.applyDisease5.diseaseName,diseases.applyDisease5.diseaseNum,"#77D8D9")
				progressBar($('#apply-bar-right'),diseases.applyDisease6.diseaseName,diseases.applyDisease6.diseaseNum,"#29E0B2")
				progressBar($('#apply-bar-right'),diseases.applyDisease7.diseaseName,diseases.applyDisease7.diseaseNum,"#00FAC4")
				progressBar($('#apply-bar-right'),diseases.applyDisease8.diseaseName,diseases.applyDisease8.diseaseNum,"#12EA8E")
				
				progressBar($('#reception-bar-left'),diseases.reqDisease1.diseaseName,diseases.reqDisease1.diseaseNum,"#B6E6DB")
				progressBar($('#reception-bar-left'),diseases.reqDisease2.diseaseName,diseases.reqDisease2.diseaseNum,"#6aceba")
				progressBar($('#reception-bar-left'),diseases.reqDisease3.diseaseName,diseases.reqDisease3.diseaseNum,"#1cb394")
				progressBar($('#reception-bar-left'),diseases.reqDisease4.diseaseName,diseases.reqDisease4.diseaseNum,"#23C6C7")
				progressBar($('#reception-bar-right'),diseases.reqDisease5.diseaseName,diseases.reqDisease5.diseaseNum,"#77D8D9")
				progressBar($('#reception-bar-right'),diseases.reqDisease6.diseaseName,diseases.reqDisease6.diseaseNum,"#29E0B2")
				progressBar($('#reception-bar-right'),diseases.reqDisease7.diseaseName,diseases.reqDisease7.diseaseNum,"#00FAC4")
				progressBar($('#reception-bar-right'),diseases.reqDisease8.diseaseName,diseases.reqDisease8.diseaseNum,"#12EA8E")
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 填充业务量占比条形图
function progressBar(obj,name,num,color){
	var div = document.createElement('div')
	div.className = "top_box sick_process"
	div.innerHTML = '<div class="top_box process"><p class="ellipsis" title="'+name+'（'+deletePointPart(num)+'%）">'+name+'</p><span>（'+deletePointPart(num)+'%）</span><div class="process_box"><div style="background-color:'+color+';width:'+deletePointPart(num)+'%;" class="process_color"></div></div></div>'
	obj.append(div);
}
function deletePointPart(diseaseNum){
	return diseaseNum.substring(0,diseaseNum.indexOf("."));
}
// 获取申请医院业务量占比饼状图
function getHospitalApplyProportion () {
	var postData = {'type': 'transferAppTo'}
	$.ajax({
		url: baseurl + 'statis/appToApp',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (hospitalApplyProportion) {
			circleCharts('hospital-apply-pie', hospitalApplyProportion, '申请医院')
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取接诊医院业务量占比饼状图
function getHospitalReceptionProportion () {
	var postData = {'type': 'transferToApp'}
	$.ajax({
		url: baseurl + 'statis/appToApp',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (hospitalReceptionProportion) {
			circleCharts('hospital-reception-pie', hospitalReceptionProportion, '接诊医院')
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 绘制饼状图
function circleCharts(dom, data,name) {
    var turn_accepts = echarts.init(document.getElementById(dom));
    if(data.length){
    	option = {
    		color: ['#6aceba', '#1cb394', '#B6E6DB', '#77D8D9', '#12EA8E'],
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			series: [{
				name: name,
				type: 'pie',
				center: ['50%', '40%'],
				radius: '60%',
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
					}
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
    	$(window).resize(function() {
    		turn_accepts.resize();
    	});
    }else{
    	$("#"+dom).html("<p style='text-align:center;font-size:20px;color:#999999;padding-top:50px;'>暂时还没有数据</p>");
    }
}
// 获取远程会诊业务量占比折线图
function getConsulStatisByMonth () {
	$.ajax({
		url: baseurl + 'statis/getConsultationStatisByMonth',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (consulStatisByMonth) {
			var newObj = consulStatisByMonth.reverse();//月份升序排列
			var monthArray = []
			//日期去掉年存入数组
			for(var i=0;i<newObj.length;i++){
				var month = newObj[i].month.split('-')[1];
				var index = $.inArray(month,monthArray);
	   	   		if(index >=0 ){
	   	   			continue;
	   	   		}
	   	   		monthArray.push(month);
			}
			appArray = new Array(monthArray.length);
			recArray = new Array(monthArray.length)
			for(var i=0;i<newObj.length;i++){
				var count = newObj[i].consultationMount;
				var type = newObj[i].consultationType;
				var month = newObj[i].month.split('-')[1];
				if(type == '0'){//申请
					orgData(monthArray,appArray,month,count);
				}else if(type == '1'){//接诊
					orgData(monthArray,recArray,month,count);
				}
			}
			formatMonth(monthArray)
			var statistics_charts = echarts.init(document.getElementById('consul-echart'));
		    option = {
		        color: ['#6aceba', '#1cb394'],
		        grid: {
		        	top: '8%'
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
		        legend: {
		            orient: 'horizontal',
		            x: 'center',
		            y: 'bottom',
		            data: ['申请业务', '接诊业务'],
		            itemGap: 80
		        },
		        calculable: false,
		        xAxis: [{
		            type: 'category',
		            boundaryGap: false,
		            data: monthArray,
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
		                name: '申请业务',
		                type: 'line',
		                symbol: 'circle',
            			symbolSize: 6,
		                smooth: true,
		                data: appArray,
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
			            }
		            },
		            {
		                name: '接诊业务',
		                type: 'line',
		                symbol: 'circle',
            			symbolSize: 6,
		                smooth: true,
		                data: recArray,
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
			            }
		            }
		        ]
		    };
		    statistics_charts.setOption(option);
		    $(window).resize(function() {
		        statistics_charts.resize();
		    })
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取转诊申请业务量列表
function getConsulApplyTraffic () {
	var consulAppArray = bizData.sort(compare('consultationApp')).reverse()
	for(var i=0;i<consulAppArray.length;i++){
		var depName = consulAppArray[i].name;
		var num = i+1;
		var consulApp = consulAppArray[i].consultationApp;
		var clinicalConsultationApp = consulAppArray[i].clinicalConsultationApp;
		var pacsConsultationApp = consulAppArray[i].pacsConsultationApp;
		var appHTML = "<li><div class='rank_num'><img src='/mtcStatis/images/u09.png'><i>" + num + "</i></div><span title=" + depName + ">" + depName + "</span><div class='pull-right info-count'><span>临床<em>" + clinicalConsultationApp + "</em></span><span>影像<em>" + pacsConsultationApp + "</em></span><span>合计<em>" + consulApp + "</em></span></div></li>";
		$("#consul-apply").append(appHTML);
	}
}
// 获取转诊申请业务量列表
function getConsulReceptionTraffic () {
	var transferRecArray = bizData.sort(compare('consultationRec')).reverse()
	for(var i=0;i<transferRecArray.length;i++){
		var depName = transferRecArray[i].name;
		var num = i+1;
		var consultationRec = transferRecArray[i].consultationRec;
		var clinicalConsultationRec = transferRecArray[i].clinicalConsultationRec;
		var pacsConsultationRec = transferRecArray[i].pacsConsultationRec
		var appHTML = "<li><div class='rank_num'><img src='/mtcStatis/images/u09.png'><i>" + num + "</i></div><span title=" + depName + ">" + depName + "</span><div class='pull-right info-count'><span>临床<em>" + clinicalConsultationRec + "</em></span><span>影像<em>" + pacsConsultationRec + "</em></span><span>合计<em>" + consultationRec + "</em></span></div></li>";
		$("#consul-reception").append(appHTML);
	}
}
// 获取申请医院业务量占比饼状图
function getHospitalApplyEchart () {
	var postData = {'type': 'consultationAppTo'}
	$.ajax({
		url: baseurl + 'statis/appToApp',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (hospitalApplyEchart) {
			circleCharts('hospital-apply-echart', hospitalApplyEchart, '申请医院')
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取科室业务量占比柱状图
function getDepartmentApplyEchart () {
	var depArray = []
	var appArray = []
	var recArray = []
	for(var i=0;i<bizData.length;i++){
		depArray[i] = bizData[i].name
		appArray[i] = bizData[i].consultationApp
		recArray[i] = bizData[i].consultationRec
	}
	barCharts('department-apply-echart', depArray, appArray, '申请')
	barCharts('department-reception-echart', depArray, recArray, '接诊')
}
// 绘制柱状图
function barCharts (dom, nameArray, dataArray, name) {
	var turn_accepts = echarts.init(document.getElementById(dom));
    option = {
    	color: ['#6aceba', '#1cb394', '#B6E6DB', '#77D8D9', '#12EA8E'],
        tooltip: {
            trigger: 'axis'
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: nameArray,
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
        grid: {
            y: 25
        },
        series: [{
            name: name,
            type: 'bar',
            barWidth: 16,
            data: dataArray,
            itemStyle: {
                normal: { 
                    barBorderRadius: [5, 5, 0, 0]
                },
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
            }
        }]
    };
    turn_accepts.setOption(option);
    $(window).resize(function() {
        turn_accepts.resize();
    })
}
// 获取会诊模式门诊类型数据
function getConsulOutpatientEchart () {
	$.ajax({
		url: baseurl + 'statis/statisBizByHosp',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (consulOutpatientData) {
			// 会诊模式业务量占比
			var appmdtwaytypecount = consulOutpatientData.appmdtwaytypecount;
			var appwaytypecount = consulOutpatientData.appwaytypecount;
			var recmdtwaytypecount = consulOutpatientData.recmdtwaytypecount;
			var recwaytypecount = consulOutpatientData.recwaytypecount;
			
			var polarChart = echarts.init(document.getElementById("consul-pattern-echart"));
			option = {
					color: ['#6aceba', '#1cb394', '#B6E6DB', '#77D8D9', '#12EA8E'],
					tooltip: {
						trigger: 'item',
				        formatter: "{a} <br/>{b}: {c}"
				    },
					angleAxis: {
						splitLine: {
				            show: true,
				            lineStyle: {
				                color: '#999',
				                type: 'dashed'
				            }
				        },
				        axisTick: {
				        	show: false
				        },
				        axisLabel: {
				        	show: false
				        },
				        axisLine: {
				            show: false
				        }
					},
					radiusAxis: {
						type: 'category',
						data: ['周一', '周二', '周三', '周四'],
						z: 10,
						show: false
					},
					polar: {
						center: ['50%', '30%'],
						radius: '50%'
					},
					series: [{
						type: 'bar',
						data: [appwaytypecount, 0, 0, 0],
						coordinateSystem: 'polar',
						name: '单方会诊申请',
						stack: 'a'
					}, {
						type: 'bar',
						data: [0, appmdtwaytypecount, 0, 0],
						coordinateSystem: 'polar',
						name: 'MDT会诊申请',
						stack: 'a'
					}, {
						type: 'bar',
						data: [0, 0, recwaytypecount, 0],
						coordinateSystem: 'polar',
						name: '单方会诊接诊',
						stack: 'a'
					}, {
						type: 'bar',
						data: [0, 0, 0, recmdtwaytypecount],
						coordinateSystem: 'polar',
						name: 'MDT会诊接诊',
						stack: 'a'
					}],
					legend: {
						show: true,
						orient: 'horizontal',
						icon: 'circle',
						x: 'center',
						y: 'bottom',
						bottom: 0,
						textStyle: {
							fontSize: 12
						},
						data: ['单方会诊申请', 'MDT会诊申请', '单方会诊接诊', 'MDT会诊接诊']
					}
			}
			polarChart.setOption(option);
			$(window).resize(function() {
				polarChart.resize();
			})
			// 门诊类型业务量占比
			var simpleRemotecApp = consulOutpatientData.simpleRemotecApp;
			var commonRemotecApp = consulOutpatientData.commonRemotecApp;
			var expertRemotecApp = consulOutpatientData.expertRemotecApp;
			var simpleRemotecRec = consulOutpatientData.simpleRemotecRec;
			var commonRemotecRec = consulOutpatientData.commonRemotecRec;
			var expertRemotecRec = consulOutpatientData.expertRemotecRec;
			var radar_chart = echarts.init(document.getElementById("outpatient-type-echart"));
			var valueArray = new Array();
			valueArray[0] = simpleRemotecApp;
			valueArray[1] = commonRemotecApp;
			valueArray[2] = expertRemotecApp;
			valueArray[3] = simpleRemotecRec;
			valueArray[4] = commonRemotecRec;
			valueArray[5] = expertRemotecRec;
			var maxValue = Math.max.apply(null, valueArray)+20;
			option2 = {
	            color: ['#6aceba'],
	            tooltip: {
	                trigger: 'axis'
	            },
	            polar: [{
	                indicator: [
	                    { text: '便民门诊挂号', max: maxValue },
	                    { text: '普通门诊挂号', max: maxValue },
	                    { text: '专家门诊挂号', max: maxValue },
	                    { text: '专家门诊接诊', max: maxValue },
	                    { text: '普通门诊接诊', max: maxValue },
	                    { text: '便民门诊接诊', max: maxValue }
	                ],
	                center: ['50%', '50%'],
	                radius: '50%'
	            }],
	            calculable: true,
	            series: [{
	                name: '预算 vs 开销（Budget vs spending）',
	                type: 'radar',
	                data: [{
	                    value: [simpleRemotecApp, commonRemotecApp, expertRemotecApp, simpleRemotecRec, commonRemotecRec, expertRemotecRec],
	                    name: '预算分配（Allocated Budget）',
	                    areaStyle: {
	                    	normal: {
	                    		color: '#aad1ee'
	                    	}
	                    },
	                    label: {
	                            normal: {
	                                show: true,
	                                formatter:function(params) {
	                                    return params.value;
	                                }
	                            }
	                        }
	                }]
	            }]
	        };
	        radar_chart.setOption(option2);
	        $(window).resize(function() {
	            radar_chart.resize();
	        })
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取接诊医院业务量占比饼状图
function getHospitalReceptionEchart () {
	var postData = {'type': 'consultationToApp'}
	$.ajax({
		url: baseurl + 'statis/appToApp',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (hospitalReceptionEchart) {
			circleCharts('hospital-reception-echart', hospitalReceptionEchart, '接诊医院')
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取远程门诊业务量折线图
function getOutpatientTrafficEchart () {
	$.ajax({
		url: baseurl + 'statis/getRemoteclinicStatisByMonth',
		type: 'post',
		data: {},
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (outpatientTrafficData) {
			var newObj = outpatientTrafficData.reverse();//月份升序排列
			var monthArray = []
			//日期去掉年存入数组
			for(var i=0;i<newObj.length;i++){
				var month = newObj[i].month.split('-')[1];
				var index = $.inArray(month,monthArray);
	   	   		if(index >=0 ){
	   	   			continue;
	   	   		}
	   	   		monthArray.push(month);
			}
			var simpleAppArray = new Array(monthArray.length);
			var commonAppArray = new Array(monthArray.length);
			var expertAppArray = new Array(monthArray.length);
			var simpleRecArray = new Array(monthArray.length);
			var commonRecArray = new Array(monthArray.length);
			var expertRecArray = new Array(monthArray.length);
			for(var i=0;i<newObj.length;i++){
				var count = newObj[i].clinicMount;
				var type = newObj[i].remoteclinicType;
				var month = newObj[i].month.split('-')[1];
				if(type == '0'){//便民申请
					orgData(monthArray,simpleAppArray,month,count);
				}else if(type == '1'){//普通申请
					orgData(monthArray,commonAppArray,month,count);
				}else if(type == '2'){//专家申请
					orgData(monthArray,expertAppArray,month,count);
				}else if(type == '3'){//便民接诊
					orgData(monthArray,simpleRecArray,month,count);
				}else if(type == '4'){//普通接诊
					orgData(monthArray,commonRecArray,month,count);
				}else if(type == '5'){//专家接诊
					orgData(monthArray,expertRecArray,month,count);
				}
			}
			formatMonth(monthArray);
			var statistics_charts2 = echarts.init(document.getElementById('outpatient-traffic'));
		    option1 = {
		        color: ['#6aceba', '#1cb394', '#B6E6DB', '#77D8D9', '#12EA8E','#12EA8E'],
		        tooltip: {
		            trigger: 'axis'
		        },
		        legend: {
		            orient: 'horizontal',
		            x: 'center',
		            y: 'bottom',
		            data: ['便民门诊挂号', '普通门诊挂号', '专家门诊挂号', '便民门诊接诊', '普通门诊接诊', '专家门诊接诊']
		        },
		        calculable: true,
		        xAxis: [{
		            type: 'category',
		            boundaryGap: false,
		            data: monthArray,
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
		                name: '便民门诊挂号',
		                type: 'line',
		                data: simpleAppArray,
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
			            }
		            },
		            {
		                name: '普通门诊挂号',
		                type: 'line',
		                data: commonAppArray,
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
			            }
		            },
		            {
		                name: '专家门诊挂号',
		                type: 'line',
		                data: expertAppArray,
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
			            }
		            },
		            {
		                name: '便民门诊接诊',
		                type: 'line',
		                data: simpleRecArray,
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
			            }
		            },
		            {
		                name: '普通门诊接诊',
		                type: 'line',
		                data: commonRecArray,
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
			            }
		            },
		            {
		                name: '专家门诊接诊',
		                type: 'line',
		                data: expertRecArray,
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
			            }
		            }
		        ]
		    };
		    statistics_charts2.setOption(option1);
		    $(window).resize(function() {
		        statistics_charts2.resize();
		    })
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取申请医院业务量占比饼状图
function getHospitalApplyOutpatientEchart () {
	var postData = {'type': 'remoteclinicAppTo'}
	$.ajax({
		url: baseurl + 'statis/appToApp',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (remoteclinicApplyData) {
			circleCharts('outpatient-hospital-apply', remoteclinicApplyData, '申请医院')
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取接诊医院业务量占比饼状图
function getHospitalReceptionOutpatientEchart () {
	var postData = {'type': 'remoteclinicToApp'}
	$.ajax({
		url: baseurl + 'statis/appToApp',
		type: 'post',
		data: postData,
		dataType: 'json',
		success: function (remoteclinicReceptionData) {
			circleCharts('outpatient-hospital-reception', remoteclinicReceptionData, '接诊医院')
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取门诊明星
function initHospBizTop(){
	$.ajax({
		url: baseurl + "statis/statisHospBizTop",
		dataType: "json",
		type: 'POST',
		cache: false,
		data: {},
		success: function(outpatientStartData) {
			for(var i=0;i<outpatientStartData.length;i++){
				var recType = outpatientStartData[i].recType;
				var title = '';
				var recDoctroName = outpatientStartData[i].recDoctorName;
				var recHospitalName = outpatientStartData[i].recHospitalName;
				var recCount = outpatientStartData[i].recCount;
				var id='';
				if(recType == '2'){//便民接诊明星
					id="simple";
				}else if(recType == '3'){//普通接诊明星
					id="common";
				}else if(recType == '4'){//专家接诊明星
					id="expert";
				}	
				organTop(id,recDoctroName,recHospitalName,recCount);
			}
		},
		error: function(err) {
			console.log(err)
		}
	});
}
function organTop(id,doctorName,hospitalName,count){
	$("#"+id+"_top_doc").html(doctorName);
	$("#"+id+"_top_hosp").html(hospitalName);
	$("#"+id+"_top_count").html("累计接诊："+count+"例");
}
// 获取统计数值
function getStatisData () {
	$.ajax({
		url: baseurl + 'statis/hospitalStatisNew',
		type: 'get',
		success: function (msg) {
			$('.register-total .department-total .total-num').html(msg.registDepCount)
			$('.register-total .room-total .total-num').html(msg.registRomCount)
			$('.register-total .doctor-total .total-num').html(msg.registDocCount)
			$('.apply-total .transfer-apply-total .total-num').html(msg.transferApp)
			$('.apply-total .transfer-apply-total .uptransfer .item-num').html(msg.upTransferApp)
			$('.apply-total .transfer-apply-total .downtransfer .item-num').html(msg.downTransferApp)
			$('.apply-total .consul-apply-total .total-num').html(msg.conApp)
			$('.apply-total .consul-apply-total .clinical-apply .item-num').html(msg.clinicalConApp)
			$('.apply-total .consul-apply-total .screenage-apply .item-num').html(msg.pacsConApp)
			$('.apply-total .outpatient-registration-total .total-num').html(msg.remotecApp)
			$('.apply-total .outpatient-registration-total .simple-outpatient .item-num').html(msg.simpleApp)
			$('.apply-total .outpatient-registration-total .common-outpatient .item-num').html(msg.commonApp)
			$('.apply-total .outpatient-registration-total .expert-outpatient .item-num').html(msg.expertApp)
			$('.apply-total .transfer-reception-total .total-num').html(msg.transferRec)
			$('.apply-total .transfer-reception-total .uptransfer .item-num').html(msg.upTransferRec)
			$('.apply-total .transfer-reception-total .downtransfer .item-num').html(msg.downTransferRec)
			$('.apply-total .consul-reception-total .total-num').html(msg.conRec)
			$('.apply-total .consul-reception-total .clinical-apply .item-num').html(msg.clinicalConRec)
			$('.apply-total .consul-reception-total .screenage-apply .item-num').html(msg.pacsConRec)
			$('.apply-total .outpatient-reception-total .total-num').html(msg.coutpatientonRec)
			$('.apply-total .outpatient-reception-total .simple-outpatient .item-num').html(msg.simpleRec)
			$('.apply-total .outpatient-reception-total .common-outpatient .item-num').html(msg.commonRec)
			$('.apply-total .outpatient-reception-total .expert-outpatient .item-num').html(msg.expertRec)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
$(function () {
	$('.hospital-join .join-day span').html(getJoinDay())
	$('.hospital-join .now-date').html(new Date().Format('yyyy-MM-dd'))
	getStatisData()
	getTransferStatisByMonth()
	getBizByDep()
	getTransferApplyTraffic()
	getTransferReceptionTraffic()
	getDiseaseAnalysis()
	getHospitalApplyProportion()
	getHospitalReceptionProportion()
	getConsulStatisByMonth()
	getConsulApplyTraffic()
	getConsulReceptionTraffic()
	getHospitalApplyEchart()
	getDepartmentApplyEchart()
	getConsulOutpatientEchart()
	getHospitalReceptionEchart()
	getOutpatientTrafficEchart()
	getHospitalApplyOutpatientEchart()
	getHospitalReceptionOutpatientEchart()
	initHospBizTop()
})