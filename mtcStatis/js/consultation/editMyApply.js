var dicomPostData = {}
var returnPostData = {}
var screenagePageNum = 1
var returnvisitPageNum = 1
var GhConsultationInfo = {}
// 获取影像资料数据
function getDicomData (data) {
	// $.ajax({
	// 	url: baseurl + 'dicom/queryDicomInfo',
	// 	type: 'post',
	// 	data: JSON.stringify(data),
	// 	dataType: 'json',
	// 	contentType: 'application/json;charset=utf-8',
	// 	success: function(dicomData){
			var result = dicomData.rows
			if (result.length) {
				var dicomHTML = '';
				for(var i=0;i<result.length;i++){
					dicomHTML += "<tr><td><input class='default' data-id='" + result[i].id + "' type='checkbox'></input></td><td class='screenage-id'>"+result[i].patientId+"</td><td class='patient-name'>" + result[i].patientName + "</td><td class='equipment-type'>" + result[i].modility + "</td><td class='exam-time'>" + result[i].examTime + "</td><td class='screenage-count'>"  + result[i].imageCount + "</td></tr>";
				}
				$(".listBox.selectScreenage table tbody").html(dicomHTML)
				getDicomPage(dicomData)
			} else {
				$(".listBox.selectScreenage table tbody").html('')
				$('.listBox.selectScreenage .noData').show().siblings('.list-pagination').hide()
			}
	// 	},
	// 	error: function (err) {
	// 		console.log(err)
	// 	}
	// })
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
// 获取复诊记录数据
function getReturnRecord () {
	// $.ajax({
	// 	url: baseurl + 'consultation/selectApplyFinishedListPage',
	// 	type: 'post',
	// 	data: JSON.stringify(returnPostData),
	// 	dataType: 'json',
	// 	contentType: 'application/json;charset=utf-8',
	// 	success: function (returnvisitData) {
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
	// 	},
	// 	error: function (err) {
	// 		console.log(err)
	// 	}
	// })
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
$(function () {
	$('body').on('click', '.returnvisit input', function () {
		// 选择是否复诊切换‘选择复诊信息’按钮显隐性
		if ($(this).val() == 'yes') {
			$(this).parents('.returnvisit').find('.selectRecord').show()
		} else {
			$(this).parents('.returnvisit').find('.selectRecord').hide()
		}
	}).on('click', '.returnvisit .selectRecord', function () {
		// 选择复诊记录
		$('.mask,.selectReturnvisit').show()
		returnPostData = {}
		returnvisitPageNum = 1
		Page.showCount = 5;
		Page.currentPage = 1;
		returnPostData.page = Page
		GhConsultationInfo.consultationType = consulType
		returnPostData.ghConsultationInfo = GhConsultationInfo
		getReturnRecord()
	}).on('click', '.select-box a', function () {
		// 点击选择文件
		$(this).parents('.select-box').find('input[type="file"]').click()
	}).on('click', '.screenage-information .add-screenage', function () {
		// 点击影像资料添加
		$('.mask,.selectScreenage').show()
		var data = dicomData.rows
		if (data.length) {
			var dicomHTML = '';
			var length
			length = data.length > 10?10:data.length
			for(var i=0;i<length;i++){
				dicomHTML += "<tr><td><input class='default' data-id='" + data[i].id + "' type='checkbox'></input></td><td class='screenage-id'>"+data[i].patientId+"</td><td class='patient-name'>" + data[i].patientName + "</td><td class='equipment-type'>" + data[i].modility + "</td><td class='exam-time'>" + data[i].examTime + "</td><td class='screenage-count'>"  + data[i].imageCount + "</td></tr>";
			}
			$(".listBox.selectScreenage table tbody").html(dicomHTML)
			page1('.selectScreenage .page', data)
		} else {
			$('.listBox.selectScreenage .noData').show().siblings('.list-pagination').hide()
		}
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
	})
})