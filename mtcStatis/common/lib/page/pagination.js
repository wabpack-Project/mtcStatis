define(["text"], function(text) {
	//分页模板
	var pageTmpl = '';
	
	
    //表格分页
	var _tablePage = function(tableid,pagesize,params,format){
		createTablePagination(tableid,pagesize,params,format);
	};

	//设置列格式
	function tableFormat ($table,format){		
		
		$.each(format, function(idx, obj){
			
		   $('.'+idx,$table).each(function(index,td){
			   var $td = $(td);
			   var data = $(td).parent().data("datas");
			   $td.html(obj(data));
		   });
		});
	    	    
	};
	
	//创建表格分页
	function createTablePagination(tableid,pagesize,params,format){
	
		var pageParam = {'showCount':pagesize,'currentPage':1};
		var tabParams = $("#"+tableid).data().option;
			
		if(params != undefined && params != null &&params != ''){
		  tabParams.params = params;
		  $("#"+tableid).attr("data-option",JSON.stringify(tabParams));
		}
		
		if(format !=undefined){
			$("#"+tableid).data("format",format);
		}
	
		getDataSourceList(pageParam,tabParams,function(data){
		
			//获取分页数据 start
			fillDataSource(data.dataSource,$('#'+tableid));
			//获取分页数据 end
						
			 //分页显示 start
			  if(data.pagination ==undefined){
			    	console.warn("分页信息未定义");
			    	return;
			  }

			  //每页显示行数
			  var showCount  = data.pagination.showCount;
			  //共多少行数据
			  data.pagination.totalResult = parseInt(data.pagination.totalResult);
			  var totalResult = data.pagination.totalResult;		
			  //页数
			  var pageTotal = parseInt(totalResult%showCount > 0?totalResult/showCount +1:totalResult/showCount);
			  
			  data.pagination.totalPage = pageTotal;
			 
			  if(totalResult > 0){
			  //加载模板
		      require(["text!lib/page/pageFormat.html"],function(tmpl){
		    	  

		    	  var pageid = 'pageNavigation_'+tableid;
		    	  
		           
		    	  $('#'+pageid).remove();
		    	   
		        	var $tmpl = $(tmpl);	
		        	pageTmpl = $('#tablePage',$tmpl).html();
		       		var $tpage = $($('#tablePage',$tmpl).html());
		       				       		
		       		$('nav',$tpage).prevObject.attr("id",pageid);
		       				       		       		
                    //5页为一组
		       	    if(pageTotal <= 5 ){
		       	    	
		       	    	$('#Previous',$tpage).addClass("disabled");
		       	    	$('#Next',$tpage).addClass("disabled");
		       	    	
		       	    	for(var p=1;p <= pageTotal;p++){
		       	    	  var $li = '';
		       	    	  if(p == 1){
		       	    		  $li = $('<li class="active" id="'+p+'"><a href="#">'+p+' <span class="sr-only">(current)</span></a></li>');
		       	    	  }else{
		       	    		  $li = $('<li id="'+p+'"><a href="#">'+p+'</a></li>');
		       	    	  }	
		       	    	  
		       	    	//记录当前页数组信息  
		       	    	$('#Previous',$tpage).data("minpage",1);
		       	    	$('#Next',$tpage).data("maxpage",pageTotal);
		       	    	
		       	    	//页数翻页
		       	    	pageNumberEvent(data.pagination,$li,pageid);
		       	    	  
		       	    	 $('#Next',$tpage).before($li);
		       	    	     	    	
		       	    	};
		       	    }else{
		       	    	
		       	    	$('#Previous',$tpage).addClass("disabled");
		       	    	
		       	    	//记录当前页数组信息    
		       	    	$('#Previous',$tpage).data("minpage",1);
		       	    	$('#Next',$tpage).data("maxpage",5);	
		       	    	
		       	    	//上一组翻页  
		       	    	PreviousGourpEvent(data.pagination,$('#Previous',$tpage),pageid);
		       	        //下一组翻页  
		       	    	NextGourpEvent(data.pagination,$('#Next',$tpage),pageid);
		       	    	
		       	    	for(var p=1;p <=5;p++){		       	    		
		       	    	  var $li = '';
		       	    	   if(p == 1){
		       	    		  $li = $('<li class="active" id="'+p+'"><a href="#">'+p+' <span class="sr-only">(current)</span></a></li>');
		       	    	   }else{
		       	    		  $li = $('<li id="'+p+'"><a href="#">'+p+'</a></li>');
		       	    	   } 		       	    	 
		       	    	//页数翻页
		       	    	pageNumberEvent(data.pagination,$li,pageid);
		       	    	   
		       	    	  $('#Next',$tpage).before($li);
		       	    	  
		       	    	 
		       	    	}
		       	    }
		       	    
		    		//分页定位样式
			  		//var tableHeight = $("#"+tableid)[0].clientHeight;
			  		//var tableWidth =$("#"+tableid)[0].clientWidth;

			       // $tpage.css("position","absolute");
		       	   // $tpage.css("top",tableHeight+25);
		         	//$tpage.css("right","20px");
                   //增加条数 和 页数显示
		         	$('#Next',$tpage).after('<li><span>共 '+totalResult+' 条记录 </span></li>');
		         	$('#Next',$tpage).after('<li><span>共 '+parseInt(pageTotal)+' 页 </span></li>');
		         		       		
		       		$('#'+tableid).after($tpage); 
		       				       		
		          });
			  }
		      //分页显示 end
		      
		});
			     
	};
	
   //填充数据源	
   function fillDataSource(dataSource,$table){

	   //清空表格信息
		$('tbody',$table).empty();
	   
		if(dataSource == undefined){
			  return;	
		}

		var tabcolumn = [];
		
	    $('thead tr th',$table).each(function(index,th){
	    	
	       if($(th).data().option != undefined){
	    	   tabcolumn.push($(th).data().option.column); 
	       }else{
	    	   tabcolumn.push(""); 
	       }	
	    			    			    	
	    });

	    if(tabcolumn.length >0 && dataSource.length >0){
	    	
	        for(var i=0;i < dataSource.length;i++){
	        	var rowdata = dataSource[i];		        	

	        	var $tr = $('<tr>');
	        	
	        	$tr.data("datas",rowdata);
	        	
	        	for(var c=0;c < tabcolumn.length ; c++){

	        		var $td = $('<td>');
	        		$td.addClass(tabcolumn[c]);
	        		$td.append(rowdata[tabcolumn[c]]);
	        		
	        		
	        		$tr.append($td);
	        	}

	        	$('tbody',$table).append($tr);	
	        	
	        }	
	    }else{//暂无数据

	    	var $tr = $('<tr>');
	    	var $td = $('<td colspan="'+tabcolumn.length+'" style="border:0px"><h5>暂无数据</h5></td>');
	    	 $tr.append($td);
	    	 $('tbody',$table).append($tr);
	    	 
	    } 
	    //更新列格式
	    var format = $table.data("format");
		if(format != undefined){
			
			tableFormat ($table,format);
		}
   }	
	
   //上翻页
   function PreviousGourpEvent(pagination,$li,pageid){
	   
	   //组按钮事件
	   $li.on('click',function(){		 
		   //最小页码
		   var minpage = $li.data("minpage");
		   
		   if(minpage == 1) return;
		   
		   var table = $li.parents('#'+pageid).prev(); 
		   
		   $li.parents('#'+pageid).remove();
		   
		   var $tmpl = $(pageTmpl);
		   
		   $('nav',$tmpl).prevObject.attr("id",pageid);
		   
		   $newli = $('#Previous',$tmpl);
		   $nextli = $('#Next',$tmpl);
		   
			$('#Next',$tmpl).after('<li><span>共 '+pagination.totalResult+' 条记录 </span></li>');
         	$('#Next',$tmpl).after('<li><span>共 '+parseInt(pagination.totalPage)+' 页 </span></li>');
		   
		   table.after($tmpl);
		   		  
		   //改变样式
		   if((minpage - 5) <= 1){
			   minpage = 1;
			   $newli.addClass("disabled");  
		   }else{
			   minpage = minpage - 5;
			   $newli.removeClass("disabled");
		   }
		   //填充分页数据
		   for(var m=minpage;m <= (minpage+4);m++){
			   
			   if(m == minpage){
    	    		  mli = $('<li class="active" id="'+m+'"><a href="#">'+m+' <span class="sr-only">(current)</span></a></li>');
    	    	   }else{
    	    		  mli = $('<li id="'+m+'"><a href="#">'+m+'</a></li>');
    	    	   }  

               //绑定页码事件
			   pageNumberEvent(pagination,mli,pageid);
			   
			   $nextli.before(mli);
		   }
		   
		   $newli.data("minpage",minpage);
		   $nextli.data("maxpage",minpage+4);
		   
		   
		   PreviousGourpEvent(pagination,$newli,pageid);
		   NextGourpEvent(pagination,$nextli,pageid);
		   //更新数据源
		   pagination.currentPage = minpage;

		   bindPageNumberData(pagination,table);
	   });
   }
   
   
   //下翻页
   function NextGourpEvent(pagination,$li,pageid){
      
	   //组按钮事件
	   $li.on('click',function(){	
		 
		   //最大页码
		   var maxpage = $li.data("maxpage");

		   if(maxpage == pagination.totalPage)return;
		   
		   var table = $li.parents('#'+pageid).prev(); 
		   
		   $li.parents('#'+pageid).remove();
          
		   var $paget = $(pageTmpl);
		   
		   table.after($paget);
		   
		   $('nav',$paget).prevObject.attr("id",pageid);
		   
		   $newli = $("#Next",$paget);
           $preli =  $("#Previous",$paget);
           
        	$('#Next',$paget).after('<li><span>共 '+pagination.totalResult+' 条记录 </span></li>');
         	$('#Next',$paget).after('<li><span>共 '+parseInt(pagination.totalPage)+' 页 </span></li>');
           
		   //改变样式
		   if((maxpage + 5) >= pagination.totalPage){
			   maxpage = pagination.totalPage;
			   $newli.addClass("disabled");
		   }else{
			   maxpage  = maxpage + 5;
			   $newli.removeClass("disabled");
		   }
		   
		   for(var ma=maxpage-4;ma <= maxpage;ma++){
			   
			   if(ma == maxpage-4){
 	    		  mali = $('<li class="active" id="'+ma+'"><a href="#">'+ma+' <span class="sr-only">(current)</span></a></li>');
 	    	   }else{
 	    		  mali = $('<li id="'+ma+'"><a href="#">'+ma+'</a></li>');
 	    	   }  
               //绑定页码事件
			   pageNumberEvent(pagination,mali,pageid);
			   
			   $newli.before(mali);  
		   }
		   
		   $newli.data("maxpage",maxpage);
		   $preli.data("minpage",maxpage-4);
		   
		   //重新调用数据
		   NextGourpEvent(pagination,$newli,pageid);
		   PreviousGourpEvent(pagination,$preli,pageid);
		   
		   //更新数据源
		   pagination.currentPage = maxpage-4;

		   bindPageNumberData(pagination,table);
	   });
   }
   
   //数字翻页事件   
   function pageNumberEvent(pagination,$li,pageid){
	  
	   $li.on('click',function(){
		 
		   $li.parent().find(".active").removeClass("active");  
		   $li.addClass("active");
		   var page = $li.attr("id");
		  
		   pagination.currentPage = page;
		   

		   bindPageNumberData(pagination,$li.parents("#"+pageid).prev());
	   });
	   	 
   }
   
   //绑定翻页数据
   function bindPageNumberData(pagination,$table){
	   
	   var tabParams = $table.data().option;
	   
	   getDataSourceList(pagination,tabParams,function(data){
		
		   fillDataSource(data.dataSource,$table); 
	   });
   }
		
	
   //获取远程调用json数据	
   function getDataSourceList(pagination,tableParam,callback){
	   var url = tableParam.url;
	   var params = tableParam.params;
	   
	  // console.info(url);
	 //  console.info(params);
	 //  console.info(pagination);
	   
	   params.page = pagination;
	   
	  // $.getJSON("js/lib/page/data.json",function(data){
		  
	//   callback(data);
	 //  });
 
   $.ajax({
		async: false,
		url: url,
		dataType: "json",
		type: 'POST',
		cache: false,
		contentType: 'application/json;charset=utf-8',
		data:JSON.stringify(params),
		success: function(res) {
			 callback(res);			
		}
	 })

	
   }
	
	 
	return {
		
		tablePage:_tablePage
	};
	
	
});
