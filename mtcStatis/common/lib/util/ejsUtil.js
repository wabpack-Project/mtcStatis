define(["ejs/ejs.min"], function(ejs) {

	//读取HTML模板
	function _readHtmlTemplate(path,callbackFun){

	   	 $.ajax({        
	   		 url: path,         
	   		 dataType: 'html',        
	   		 success: function(data) {    
	   			
	   			callbackFun($(data));       
	   		  }     
	   	 }); 

	}
	
	//通过模板获取HTML
	function _getHtmlFromTemplate(tmpl,data){
		
		return ejs.render(tmpl,data);
	}
	
	//初始加载模块,初始化布局
	function _initModule(templatePath,initData,loadEvent){
		
		_readHtmlTemplate(templatePath,function(template){
			var module =$('#initmodule',template).html();

			if(module.length > 0){
				var option = $.parseJSON(''+module);
                if(option != undefined){
                	
                	$.each(option,function(key,objs){

                    	var htmlobj = _getHtmlFromTemplate($("#"+key,template).html(),{data:initData});
                    	$(objs).append(htmlobj);
            		});
                	
                	if(loadEvent != undefined&&loadEvent !=null)loadEvent();
                }
			}
		});
	}

	
	return {
		readHtmlTemplate :_readHtmlTemplate,
		getHtmlFromTemplate:_getHtmlFromTemplate,
		initModule:_initModule
	};
	
});
