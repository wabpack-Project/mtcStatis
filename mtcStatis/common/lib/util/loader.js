var urlx = $('#baseurl').val().replace(":80/","/");;

require.config({
	baseUrl: urlx+"js",
    paths:{
    	   //"jquery":urlx+"js/lib/jquery-3.2.1.min",
           // "bootstrap": urlx+"js/lib/bootstrap-3.3.7/js/bootstrap.min",
  	        "ejs":urlx+"js/lib/ejs/ejs.min",
  	        "text":urlx+"js/lib/requirejs/2.1.11/text.min",
  	        "css":urlx+"js/lib/requirejs/2.1.11/require-css"
  	       // "page":$('#urlx').val()+"js/lib/page/pagination"
    }
  });
define(["ejs","text","css"], function(ejs,text,css) {
	
	/** 
	 * 加载模板到内容区域 
	 * tmplpath 模板路径
	 * jspath 脚本路径
	 * csspath css模板
	 */
  var _loadContextTemplete = function(loadparam,funback){
      	var tmplpath = loadparam.tmplpath;
      	var jspath = loadparam.jspath;
      	var csspath = loadparam.csspath;
    	var params = loadparam.params;
    	var data = null;
    	
      //	
      if(tmplpath == undefined || tmplpath ==null || tmplpath ==''){
    	 console.warn("模板路径为空");
    	 return;
      }
      
      var js =urlx+'js/'+tmplpath.substring(0,tmplpath.indexOf('.'));
   
      //加载模板	
      require(["text!"+urlx+"html/"+tmplpath],function(tmpl){
    		var $tmpl = $(tmpl);
    		var $main = $('#main',$tmpl).html();
    		
    		if(loadparam.data != undefined) data = loadparam.data;
    		
    		$('#middle_content').html(_fixDataForTemplate($main,data));
    		
    		 //判断是否有脚本路径
    	       if(jspath != undefined &&jspath !=null&& jspath != ''){
    	    	   js = jspath;
    	       }   	    
    	     
    	       //加载脚本
    	       require([js+'.js'],function(rjs){
    	    	   
    	      	 var rj = new rjs();
    	    	 rj.create($tmpl,params);
    	    	 
    	    	 if(funback != undefined && funback !=null)
    	    	 funback(rj);  
    	       });
    	       
    	       //加载CSS样式
    	       if(csspath != undefined && csspath != null && csspath !='' ){
    	    	   require(["css!"+urlx+"css/"+csspath],function(css){}); 
    	       }
      });
                  
    };
    
    /**
     * 加载模板到指定位置
     * $div 指定加载模板区域
     */
    var _loadStructTemplete = function(loadparam,funback){
    	
    	var $div = loadparam.container;
    	var tmplpath = loadparam.tmplpath;
    	var jspath = loadparam.jspath;
    	var csspath = loadparam.csspath;
    	var params = loadparam.params;
    	var data = null;

    	if($div == undefined || $div == null|| $div ==''){
    	  console.warn("未指定加载位置");
    	  return;
    	}
        //	
        if(tmplpath == undefined || tmplpath ==null || tmplpath ==''){
      	 console.warn("模板路径为空");
      	 return;
        }
        
        var js =urlx+'js/'+tmplpath.substring(0,tmplpath.indexOf('.'));
 
       
        //加载模板	
        require(["text!"+urlx+"html/"+tmplpath],function(tmpl){
      		var $tmpl = $(tmpl);
       		var $main = $('#main',$tmpl).html();
       		
    		if(loadparam.data != undefined) data = loadparam.data;
    		
        	   $div.html(_fixDataForTemplate($main,data));
      		
      		 //判断是否有脚本路径
      	       if(jspath != undefined &&jspath !=null&& jspath != ''){
      	    	   js = jspath;
      	       }
      	     
      	       //加载CSS样式
      	       if(csspath != undefined &&csspath != null && csspath !='' ){
      	    	   require(["css!"+urlx+"css/"+csspath],function(css){}); 
      	       }
   
      	       //加载脚本
       	      require([js+".js"],function(rjs){
       	    	   
       	      	 var rj = new rjs();
       	    	 rj.create($tmpl,params);
       	    	 
       	    	if(funback != undefined && funback !=null)
       	    	 funback(rj);
       	       });
        });

                    
      };
      
    /**
     * 只加载模板及样式
     */  
    var _loadOnlyTemplete = function(loadparam){
    	
    	var $div = loadparam.container;
    	var tmplpath = loadparam.tmplpath;
    	var csspath = loadparam.csspath;
    	var data = null;
    	
    	if($div == undefined || $div == null|| $div ==''){
      	  console.warn("未指定加载位置");	
      	  return;
      	}
          //	
        if(tmplpath == undefined || tmplpath ==null || tmplpath ==''){
          console.warn("模板路径为空");
          return;
        }
        
          //加载模板	
        require(["text!"+urlx+"html/"+tmplpath],function(tmpl){
        	var $tmpl = $(tmpl);	
       		var $main = $('#main',$tmpl).html();
       		
       		if(loadparam.data != undefined) data = loadparam.data;
       		
          	   $div.html(_fixDataForTemplate($main,data));
        		
        	   //加载CSS样式
        	  if(csspath != undefined &&csspath != null && csspath !='' ){
        	    require(["css!"+urlx+"css/"+csspath],function(css){}); 
        	  }
          });
    };  
      
    
	//返回填充完数据的HTML模板
	function _fixDataForTemplate(tmpl,data){
	
		return ejs.render(tmpl,data);
	}

	//弹出框
	var _loaderDialog = function(params,funback){
		
		$('#dialog-title').empty();
		$('#dialog-body').empty();
		$('#dialog-footer').empty();
	   //标题
	   $('#dialog-title').html(params.title);
	   //内容
	   var loadparam = {
			'container':$('#dialog-body'),
			'tmplpath':params.tmplpath,
			'jspath':params.jspath,
			'csspath':params.csspath,
			'params':params.params,
			'data':params.data
	   }
	   var jsobj = _loadStructTemplete(loadparam,funback);	 

	   //按钮
	   
	   if(params.button != undefined&&params.button != ''&&params.button !=null){
		   for(var i=0;i < params.button.length;i++){
			   
			  var button = params.button[i];
			  var newb = $('<button class="btn" type="button btn-default">'+button.name+'</button>');
			  //按钮样式
			  if(button.css !=undefined&&button.css !=''){
				  newb.addClass(button.css);
			  }
			  //按钮事件
			  if(button.event != undefined){
				  newb.on('click',function(){
					  button.event();
				  });
			  }
			  
			  $('#dialog-footer').append(newb);
		   }
	   };
	   
	   var $closeb = $('<button class="btn btn-default" type="button" data-dismiss="modal">关闭</button>');
	   $('#dialog-footer').append($closeb);
	   
	   //设置宽度
	  if(params.width !=undefined&& params.width != ''){
		  $('#modal-dialog').css('width',params.width); 
	  } 
	   	   
	   $("#commonDialog").modal('show');
	 
	   return jsobj;
	};
	//关闭弹窗
	var _closeDialog = function(){
		
		 $("#commonDialog").modal('hide');
	}
	
	
    /**
		toast-top-left  顶端左边
		toast-top-right    顶端右边
		toast-top-center  顶端中间
		toast-top-full-width 顶端，宽度铺满整个屏幕
		toast-botton-right  
		toast-bottom-left
		toast-bottom-center
		toast-bottom-full-width 
     */
	
	toastr.options = {  
	        closeButton: false,  //是否显示关闭按钮（提示框右上角关闭按钮）
	        debug: false,        //是否为调试；
	        progressBar: false,   //是否显示进度条（设置关闭的超时时间进度条）
	        positionClass: "toast-center-center", //消息框在页面显示的位置 
	        onclick: null,       //点击消息框自定义事件
	        showDuration: "300", //显示动作时间 
	        hideDuration: "1000", //隐藏动作时间 
	        timeOut: "2000",      //自动关闭超时时间
	        extendedTimeOut: "1000",  
	        showEasing: "swing",  
	        hideEasing: "linear",  
	        showMethod: "fadeIn",  //显示的方式，和jquery相同
	        hideMethod: "fadeOut"  //隐藏的方式，和jquery相同
	    };  
	
	//提示框
	//toastr.success('');
	//toastr.error('');
	//toastr.warning('');
	//toastr.info('');
	var _popup = function(message,messtype){
		if(messtype == 'success'){
			toastr.success(message);
		}else if(messtype == 'error'){
			toastr.error(message);
		}else if(messtype == 'warn'){
			toastr.warning(message);
		}else if(messtype == 'info'){
			toastr.info(message);
		}
	}
	
	//确认框
	function _confirm(message,fun) {
	    if ($("#myConfirm").length > 0) {
	        $("#myConfirm").remove();
	    } 
	    
	    if(message ==undefined){
	    	message = "";
	    }
	    
	    var html = "<div class='modal fade' id='myConfirm' >"
	            + "<div class='modal-backdrop in' style='opacity:0; '></div>"
	            + "<div class='modal-dialog' style='z-index:2901; margin-top:150px; width:400px; '>"
	            + "<div class='modal-content'>"
	            + "<div class='modal-header'  style='font-size:12px; '>"
	            + "<span class='glyphicon glyphicon-envelope'>&nbsp;</span>提示信息<button type='button' class='close' data-dismiss='modal'>"
	            + "<span style='font-size:20px;  ' class='glyphicon glyphicon-remove'></span><tton></div>"
	            + "<div class='modal-body text-center' id='myConfirmContent' style='font-size:14px; '>"
	            + message
	            + "</div>"
	            + "<div class='modal-footer ' style=''>"
	            + "<button class='btn btn-danger ' id='confirmOk' >确定<tton>"
	            + "<button class='btn btn-info ' data-dismiss='modal'>取消<tton>"
	            + "</div>" + "</div></div></div>";
	    //$("body").append(html);
        $('#commonDialog').after(html);
	    $("#myConfirm").modal("show");

	    $("#confirmOk").on("click", function() {
	    	$("#myConfirm").modal("hide");
	    	fun();
	    });
	    
	}
	
	//实现form表单数据封装
	 var _formTOObj =function($form){
		  
		  var formdata = $form.serializeArray(); //serialize()
		 
		  var obj ={};
		  
		  if(formdata !=undefined&&formdata.length >0){
			  for(var i=0;i < formdata.length;i++){
				 var fobj =  formdata[i];
				 obj[formdata[i].name] = formdata[i].value;
			  }
		  }
		  
		  return obj;
	   }

	
	
    return {
    	
    	loadContextTemplete:_loadContextTemplete,
    	loadStructTemplete:_loadStructTemplete,
    	loadOnlyTemplete:_loadOnlyTemplete,
    	fixDataForTemplate:_fixDataForTemplate,
    	loaderDialog:_loaderDialog,
    	closeDialog:_closeDialog,
    	popup:_popup,
    	confirm:_confirm,
    	formTOObj:_formTOObj
    	
    };
});
