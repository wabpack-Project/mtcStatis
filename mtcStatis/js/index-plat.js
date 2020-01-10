var noticePostData = {}
var waitingPostData = {}
var workPostData = {}
var hospitalPostData = {}
var noticePageNum = 1
var waitingPageNum = 1
// 获取通知提醒数据
function initNotice (htmlBox) {
	$.ajax({
		url: baseurl + 'gateway/selectNoticeTitleToMe',
		type: 'post',
		dataType: 'json',
		data: JSON.stringify(noticePostData),
		contentType: 'application/json;charset=utf-8',
		success: function (noticeTitleData) {
			var resultData = noticeTitleData.rows;
			if (resultData.length) {
				var noticeHTML = '';
				for(var i=0;i<resultData.length;i++){
					var no = i+1;
					var noticeTitle = resultData[i].noticeTitle;
					var noticer = resultData[i].creator;
					var createTime = resultData[i].createTime;
					var id = resultData[i].id;
					noticeHTML += "<tr><td>"+no+"</td><td>"+noticeTitle+"</td><td>"+noticer+"</td><td>"+createTime+"</td><td><a href='/mtcStatis/pages/notice/viewNotice.html?id="+id+"&ind=0' class='look'>查看</a></td></tr>";
				}
				$(htmlBox).html(noticeHTML)
				if ($(htmlBox).parents().is('.listBox')) {
					getNoticePage(noticeTitleData)
				}				
			} else {
				$(htmlBox).html('')
				$(html).parents('table').siblings('.noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取待办事项数据
function initWaiting () {
	$.ajax({
		url: baseurl + 'plat/getWaiting',
		type: 'post',
		dataType: 'json',
		data: JSON.stringify(waitingPostData),
		contentType: 'application/json;charset=utf-8',
		success: function (waitingData) {
			if (waitingData.length) {
				var waitingHTML = '';
				for(var i=0;i<waitingData.length;i++){
					var no = i+1;
					var desc = waitingData[i].desc;
					var count = waitingData[i].count;
					var path = waitingData[i].path;
					waitingHTML += "<tr><td>"+no+"</td><td>"+desc+count+"例</td><td><a href='"
					switch (path) {
						case 'transfer/upreview':
							waitingHTML += '/mtcStatis/pages/transfer/updowntransferApply.html?ind=11'
							break;
						case 'clinicIndagation/performanceStatistics':
							waitingHTML += '/mtcStatis/pages/outpatient/outpatientExamine.html'
							break;
						case 'consultation/applyReviewer':
							waitingHTML += '/mtcStatis/pages/consultation/applyCheck.html'
							break;
						case 'diagnosticReport/reportReviewer':
							waitingHTML += '/mtcStatis/pages/consultation/reportCheck.html'
							break;
						case 'consultationTriage/triage':
							waitingHTML += '/mtcStatis/pages/consultation/triage.html'
							break;
					}
					waitingHTML += "' class='look'>查看</a></td></tr>";
				}
				$("#waiting_tbody").html(waitingHTML);			
			} else {
				$("#waiting_tbody").html('')
				$('#waiting_tbody').parents('table').siblings('.noData').show()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取工作统计数据
function getWorkStatistical (type,year,yearType) {
	workPostData= {}
	$.ajax({
		url: baseurl + 'plat/getWorkStatistical',
		type: 'post',
		dataType: 'json',
		data: JSON.stringify(workPostData),
		contentType: 'application/json;charset=utf-8',
		success: function (workStatisticalData) {
			var workStatisHTML = '';
			for(var i=0;i<workStatisticalData.length;i++){
				var index = i%5;
				if(index == 0 ){
					workStatisHTML += "<tr>";
				}
				var count = workStatisticalData[i].totalValue;
				var totalStatisdesc = workStatisticalData[i].totalStatisDesc;
				var icon = workStatisticalData[i].icon;
				workStatisHTML += '<td id=' + workStatisticalData[i].type + '><div class="table-title"><i class=' + icon + '></i><span>累计' + totalStatisdesc + '<b>' + count + '</b> 例</span></div><table class="table table-hover table-bordered"><thead><tr><th><a onclick="getWorkStatisYear(\''+workStatisticalData[i].type+'\',\''+workStatisticalData[i].year+'\',\'before\')">上一年</a></th><th id="statisThisYear">'+workStatisticalData[i].year+'</th>' +
					'<th><a '
					if (parseInt(workStatisticalData[i].year) == new Date().getFullYear()) {
						workStatisHTML += 'href="javascript:;">本年度'
					} else {
						workStatisHTML += ' onclick="getWorkStatisYear(\''+workStatisticalData[i].type+'\',\''+workStatisticalData[i].year+'\',\'after\')">下一年'
					}
					workStatisHTML += '</a></th></tr><tr><th>编号</th><th>月份</th><th>数量（例）</th></tr></thead><tbody id="content1">'
				for(var j=0;j<workStatisticalData[i].dateStatistical.length;j++) {
					workStatisHTML += '<tr>' +
					'<td>'+workStatisticalData[i].dateStatistical[j].no+'</td>' +
					'<td>'+workStatisticalData[i].dateStatistical[j].month+'</td>' +
					'<td>'+workStatisticalData[i].dateStatistical[j].count+'</td>' +
					'</tr>';
				}
				workStatisHTML += '</tbody></table></td>'
				if(index == 4 ){
					workStatisHTML += "</tr>"
				}
			}
			$("#table_box").html(workStatisHTML)
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取某年工作统计数据
function getWorkStatisYear(type,year,yearType){
	if(yearType == 'before'){
		year = parseInt(year) - 1;
	}else if(yearType == 'after'){
		year = parseInt(year) + 1
	}else{
		return;
	}
	var data = {type:type,year:year};
	$.ajax({
		url: baseurl + "plat/getYearWorkStatistical",
		dataType: "json",
		type: 'POST',
		async: false,
		cache: false,
		data: data,
		success: function(workStatisticalData) {
			var workStatisHTML = '';
			var typeID = "";
			for(var i=0;i<workStatisticalData.length;i++){
				if(!workStatisticalData[i].dateStatistical || workStatisticalData[i].dateStatistical == null || workStatisticalData[i].dateStatistical.length == 0){
					continue;
				}
				typeID = workStatisticalData[i].type;
				var count = workStatisticalData[i].totalValue;
				var totalStatisdesc = workStatisticalData[i].totalStatisDesc;
				var icon = workStatisticalData[i].icon;
				workStatisHTML += '<div class="table-title"><i class=' + icon + '></i><span>累计' + totalStatisdesc + '<b>' + count + '</b> 例</span></div><table class="table table-hover table-bordered" style="display: table;"><thead><tr><th><a onclick="getWorkStatisYear(\''+workStatisticalData[i].type+'\',\''+workStatisticalData[i].year+'\',\'before\')">上一年</a></th><th id="statisThisYear">'+workStatisticalData[i].year+'</th>' +
					'<th><a '
					if (parseInt(workStatisticalData[i].year) == new Date().getFullYear()) {
						workStatisHTML += 'href="javascript:;">本年度'
					} else {
						workStatisHTML += ' onclick="getWorkStatisYear(\''+workStatisticalData[i].type+'\',\''+workStatisticalData[i].year+'\',\'after\')">下一年'
					}
					workStatisHTML += '</a></th></tr><tr><th>编号</th><th>月份</th><th>数量（例）</th></tr></thead><tbody id="content1">'
				for(var j=0;j<workStatisticalData[i].dateStatistical.length;j++) {
					workStatisHTML += '<tr>' +
					'<td>'+workStatisticalData[i].dateStatistical[j].no+'</td>' +
					'<td>'+workStatisticalData[i].dateStatistical[j].month+'</td>' +
					'<td>'+workStatisticalData[i].dateStatistical[j].count+'</td>' +
					'</tr>';
				}
				workStatisHTML += '</tbody></table>'
			}
			$("#"+typeID).html(workStatisHTML)
		},
		error: function(err) {
			console.log(err);
		}
	});
}

// 获取系统属性数据
function initRoleTable () {
	$.ajax({
		url: baseurl + 'plat/getRoleTable',
		type: 'post',
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: function (roleData) {
			$("#role_td").html(roleData.RoleName.join(" "))
			$("#right_td").html(roleData.RightName.join(" "))
			$("#menu_td").html(roleData.MenuName.join(" "))
			$("#group_td").html(roleData.MtcName.join(" "))
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取系统权限数据
function initRMtcTable () {
	$.ajax({
		url: baseurl + 'plat/getRMtcTable',
		type: 'post', 
		dataType: 'json', 
		contentType: 'application/json;charset=utf-8',
		success: function (rmtcData) {
			var platTree = []
			for(var i in rmtcData){
				var mtcid = rmtcData[i];
				$("#work_statis_tbody2").append("<div id='"+mtcid+"'></div>");
				var mtchead = [{ "id" : "0p", "parent" : "#", "text" :i,"state": {"opened" : true } }];
				var div = $('#'+mtcid);
				div.jstree(
					{'plugins':["state"],
						'core': {
							'state':{"opened":true},
							'check_callback' : true,
							'data': function (obj,callback) {
								$.ajax({
									url: baseurl + 'mtc/mtcHospital',
									type: 'post',
									data: {'mtcid':mtcid},
									dataType: 'json',
									async: false,
									// contentType: 'application/json;charset=utf-8',
									success: function (rmtcDATA) {
										var array = mtchead.concat(rmtcDATA);
										callback.call(this,array);
										platTree.push(div)
									},
									error: function (err) {
										console.log(err)
									}
								})
							}
				} });
				div.on("loaded.jstree", function (event, data) {
					var did = data.instance.element[0].id;
					// 展开所有节点
					for (var item in platTree){
						var tid = platTree[item][0].id;
						if(did == tid) {
							platTree[item].jstree('open_all');
						}
					}
				});
				div.on("ready.jstree", function (event, data) {
					var tmp = data;
					$(".jstree-anchor").each(function (i, v) {
						var title = v.title;
						var id = v.id;
						if (title == ghDoctor.eHospital.hospitalName) {
							data.instance.select_node(id);
						}
					});
				});
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取医院联系方式数据
function initHospitals () {
	hospitalPostData = {'hospitalid': ghDoctor.eHospital.id}
	$.ajax({
		url: baseurl + 'mtc/mtcHospitals',
		type: 'post',
		dataType: 'json',
		data: hospitalPostData,
		success: function (mtcHospitalsData) {
			var hospitalHTML = '';
			for(var i=0;i<mtcHospitalsData.length;i++){
				var index = i%5;
				if(index == 0 ){
					hospitalHTML += "<div class='hospital_info clearfix'>";
				}
				
				var hospitalName = mtcHospitalsData[i].hospitalName;
				var contacter = mtcHospitalsData[i].contacts;
				if(contacter == null){
					contacter = "";
				}
				var contactphone = mtcHospitalsData[i].phoneNumber;
				hospitalHTML += " <div class='every_hospital padding_20 border_box'>"+"<p class='border-left-green' title="+ hospitalName +">"+hospitalName+"</p><div class='hospital-content clearfix'><img src='./images/101.png' class='fl'><div class='fl'><p class='contact'>联系人：<span title="+ contacter +">"+contacter+"</span></p><p class='telephone'>联系电话：<span title=" + contactphone + ">"+contactphone+"</span></p></div></div></div>";
				if(index == 4 ){
					hospitalHTML += "</div>";
				}
			}
			$("#hospitalInfo").html(hospitalHTML)			
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取待办事项分页数据
function getWaitingPage (data) {
	$('.todoBox .page').paging({
		pageNo: waitingPageNum,
		totalPage: Math.ceil(data.length/Page.showCount),
		totalSize: data.length,
		callback: function(num) {
			waitingPageNum = num
			Page.currentPage = num
			waitingPostData.page = Page
			getWaitingMore()
		}
	})
	$('.todoBox .page').parent().show()
}
// 获取待办事项更多数据
function getWaitingMore () {
	$.ajax({
		url: baseurl + 'plat/getWaiting',
		type: 'post',
		dataType: 'json',
		data: JSON.stringify(waitingPostData),
		contentType: 'application/json;charset=utf-8',
		success: function (waitingData) {
			if (waitingData.length) {
				var waitingHTML = '';
				for(var i=0;i<waitingData.length;i++){
					var no = i+1;
					var desc = waitingData[i].desc;
					var count = waitingData[i].count;
					var path = waitingData[i].path;
					waitingHTML += "<tr><td>"+no+"</td><td>"+desc+count+"例</td><td><a href='javascript:;' class='look'>查看</a></td></tr>";
				}
				$(".listBox.todoBox table tbody").html(waitingHTML)
				// $('.todoBox .list-pagination .page-total').text(Math.ceil(waitingData.length/Page.showCount)).siblings('.item-total').text(waitingData.length)
				getWaitingPage(waitingData)				
			} else {
				$(".listBox.todoBox table tbody").html('')
				$('.todoBox .noData').show().siblings('.list-pagination').hide()
			}
		},
		error: function (err) {
			console.log(err)
		}
	})
}
// 获取通知提醒分页数据
function getNoticePage (data) {
	$('.noticeBox .page').paging({
		pageNo: noticePageNum,
		totalPage: Math.ceil(data.total/Page.showCount),
		totalSize: data.total,
		callback: function(num) {
			noticePageNum = num
			Page.currentPage = num
			noticePostData.page = Page
			initNotice('.noticeBox tbody')
		}
	})
	$('.noticeBox .page').parent().show()
}
$(function () {
	Page.showCount = 10;
	Page.currentPage = 1;
	//通知信息
	var GhNotice={};
	noticePostData.page = Page;
	noticePostData.ghNotice = GhNotice
	initNotice('#notice_tbody')
	Page.showCount = 10;
	Page.currentPage = 1;
	waitingPostData.page = Page
	initWaiting()
	getWorkStatistical()
	initRoleTable()
	initRMtcTable()
	initHospitals()
	$("#totalDate").html(new Date().Format("yyyy-MM-dd"))
	$('body').on('click', '.todo_box .more', function () {
		// 待办事项查看更多
		$('.mask,.listBox.todoBox').show()
		waitingPageNum = 1
		Page.showCount = 10;
		Page.currentPage = 1;
		waitingPostData.page = Page
		getWaitingMore()
	}).on('click', '.notice_box .more,.right-nav .message', function () {
		// 通知提醒查看更多
		$('.mask,.listBox.noticeBox').show()
		noticePageNum = 1
		Page.showCount = 10;
		Page.currentPage = 1;
		noticePostData.page = Page
		initNotice('.noticeBox tbody')
	}).on('click', '.work_statistics_first a', function () {
		// 查看更多工作统计
		if ($(this).hasClass('slidedown')) {
			$('.work_statistics_second>table table,.work_statistics_second>table>tbody>tr:last-child').show()
			$(this).text('收起')
		} else {
			$('.work_statistics_second>table table,.work_statistics_second>table>tbody>tr:last-child').hide()
			$(this).text('更多')
		}
		$(this).toggleClass('slidedown')
	}).on('click', '.index_plat_hospital .hospital_more', function () {
		// 下拉医院联系方式
		if ($(this).hasClass('slidedown')) {
			$('#hospitalInfo .hospital_info:not(:first-child)').show()
		} else {
			$('#hospitalInfo .hospital_info:not(:first-child)').hide()
		}
		$(this).toggleClass('slidedown')
	})
})