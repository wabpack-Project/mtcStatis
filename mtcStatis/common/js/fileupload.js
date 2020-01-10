var uploadFileArray = new Array();

/***
 * 选择文件时添加到array中
 * @param file
 */
function addUploadFile(file){
	var isExist = false;
	for(var i=0;i<uploadFileArray.length;i++){
		if(file.index == uploadFileArray[i].index){
			isExist = true;
			break;
		}
	}
	if(!isExist){
		var fileMap = {};
		fileMap.index = file.index;
		fileMap.fileId = "";
		fileMap.description = "";
		fileMap.reportId = "";
		fileMap.isUpload = false;
		fileMap.fileName = file.name;
		uploadFileArray.push(fileMap);
	}
}

/***
 * 删除文件时，删除Array中元素，并通知服务器删除文件。
 * @param file
 */
function deleteFile(file){
	for(var i = 0;i <uploadFileArray.length;i++){
		if(file.index == uploadFileArray[i].index){
			uploadFileArray.splice(i,1);
/////////////////////////////删除已上传文件////////////////////////////			
			return ;
		}
	}
}

/***
 * 文件上传成功后，返回存储服务器的存储ID
 * @param fileId
 */
function notifyUpload(file,fileId){
	for(var i = 0;i<uploadFileArray.length;i++){
		if(file.index == uploadFileArray[i].index){
			uploadFileArray[i].isUpload = true;
			uploadFileArray[i].fileId = fileId;
			break;
		}
	}
	
}

/***
 * 获取全部上传文件列表。
 */

function getUploadFile(){
	for(var i=0;i<uploadFileArray.length;i++){
		uploadFileArray[i].description = $("#fileDescription_"+uploadFileArray[i].index).val();
	}
}
/***
 * 判断文件是否全部上传
 */
function isAllUpload(){
	for(var i=0;i<uploadFileArray.length;i++){
		if(uploadFileArray[i].isUpload == false){
			return false;
		}
	}
	return true;
}

$(function(){
				// 初始化插件
				$("#zyupload").zyUpload({
					width            :   "100%",                 // 宽度
					height           :   "auto",                 // 宽度
					itemWidth        :   "140px",                 // 文件项的宽度
					itemHeight       :   "115px",                 // 文件项的高度
					url              :   baseurl+ "/fileupload",  // 上传文件的路径
					fileType         :   ["jpg","jpeg","bmp","gif","tif","ppt","pptx","png","txt","pdf","doc","docx","xls","xlsx","rar","zip","7z"],// 上传文件的类型
					fileSize         :   524288000,                // 上传文件的大小
					multiple         :   true,                    // 是否可以多个文件上传,
					dragDrop         :   true,                    // 是否可以拖动上传文件
					tailor           :   true,                    // 是否可以裁剪图片
					del              :   true,                    // 是否可以删除文件
					finishDel        :   false,  				  // 是否在上传文件完成后删除预览
					/* 外部获得的回调接口 */
					onSelect: function(selectFiles, allFiles){    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
						console.info("当前选择了以下文件：");
						for(var i=0;i<selectFiles.length;i++){
							// 因为涉及到继续添加，所以下一次添加需要在总个数的基础上添加
							addUploadFile(selectFiles[i]);
						}
						console.info(selectFiles);
					},
					onDelete: function(file, files){              // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
						deleteFile(file);
						console.info("当前删除了此文件：");
						console.info(file.name);
					},
					onSuccess: function(file, response){          // 文件上传成功的回调方法
						console.info("此文件上传成功：");
						console.info(file.name);
						console.info("此文件上传到服务器地址：");
						console.info(response);
						var obj = JSON.parse(response);
						if(obj.status == 200){
							notifyUpload(file,obj.result);
						}
						$("#uploadInf").append("<p>上传成功，文件地址是：" + response + "</p>");
					},
					onFailure: function(file, response){          // 文件上传失败的回调方法
						console.info("此文件上传失败：");
						console.info(file.name);
					},
					onComplete: function(response){           	  // 上传完成的回调方法
						console.info("文件上传完成");
						console.info(response);
					}
				});
				
				
				
			});




