define([], function() {

	var now = new Date();                    //当前日期
	var nowDayOfWeek = now.getDay()-1;         //今天本周的第几天
	var nowDay = now.getDate();              //当前日
	var nowMonth = now.getMonth();           //当前月
	var nowYear = now.getFullYear();             //当前年 
	
	
	//格式化日期：yyyy-MM-dd
    function _formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth()+1;
        var myweekday = date.getDate();

        if(mymonth < 10){
            mymonth = "0" + mymonth;
        }
        if(myweekday < 10){
            myweekday = "0" + myweekday;
        }
        return (myyear+"-"+mymonth + "-" + myweekday);
    };
    
    //获得某月的天数
    function _getMonthDays(myMonth){
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
        return   days;
    }
    
    
    function _dateSelect(selvalue){
    	
          var selDate = {
        	beginTime:_formatDate(now),
            endTime:_formatDate(now)
          };
    	
		   if(selvalue == 2){//昨天日期
			   var yesterday = _formatDate(new Date(nowYear, nowMonth, nowDay - 1));
			   selDate.beginTime = yesterday;
			   selDate.endTime = yesterday;
		   }else if(selvalue == 3){//本周开始结束日期
			   var getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
			   
			   var getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));				    
				   selDate.beginTime = _formatDate(getWeekStartDate);
				   selDate.endTime = _formatDate(getWeekEndDate);
		   }else if(selvalue == 4){
			   //获得本月的开始日期
			    var getMonthStartDate = new Date(nowYear, nowMonth, 1);
			    //获得本月的结束日期
			    var getMonthEndDate = new Date(nowYear, nowMonth, _getMonthDays(nowMonth));
				   selDate.beginTime = _formatDate(getMonthStartDate);
				   selDate.endTime = _formatDate(getMonthEndDate);
		   }
		  return selDate;
	   }
	//输入框自动高度 start
	var textareaObserve;
	
	if (window.attachEvent) {
	    textareaObserve = function (element, event, handler) {
	        element.attachEvent('on'+event, handler);
	    };
	}
	else {
	    textareaObserve = function (element, event, handler) {
	        element.addEventListener(event, handler, false);
	    };
	}
	
	
   
	function _textareaAutoHeight (textClass) {
	  var tid = window.setTimeout(runTextresize(textClass),500);
	                
        function runTextresize(textClass){
        	return function(){
        		textresize (textClass);
        	}
        }
        //调整文本高度
        function adjustText(text){
        	 if(text.scrollHeight > 300){
			        text.style.height = '300px';
			        text.style.overflow = 'auto';
			      
	            }else{
			        text.style.height = 'auto';
			        text.style.overflow = 'hidden';
			        text.style.height = text.scrollHeight+'px';
			      
	            }
         }
        
        function textresize () {	
    		
    			$("."+textClass).each(function(){

    						var text = $(this)[0];
    		   
                   
    		           adjustText(text);      
    		                
    		           function delayedResize () {
    				    	//tid = window.setTimeout(textresize, 0);
    		        	   var ctext = $(this)[0];
    		        	   adjustText(ctext); 
    				    }

    				    textareaObserve(text, 'change',  delayedResize);
    				    textareaObserve(text, 'copy',     delayedResize);
    				    textareaObserve(text, 'cut',     delayedResize);
    				    textareaObserve(text, 'paste',   delayedResize);
    				    textareaObserve(text, 'drop',    delayedResize);
    				    textareaObserve(text, 'keydown', delayedResize);
    				    textareaObserve(text, 'resize', delayedResize); 
    				    textareaObserve(text, 'mouseover', delayedResize);
    			        
    			    });   
            }  
 
	

  }
	

	//输入框自动高度 end
	
	//分 秒 倒计时 start
	function _countDown(begin,end,showObj){
		var mon = begin;
		var sed = end;
		var smon = '00';
		var ssed = '00';
		
	  var turns =setInterval(function () {
		
		  if(mon > 0 || sed >0){
			  
			  if(sed > 0){
					sed--;
				}else if(sed == 0){
					sed = 59;
					if(mon > 0){
					   mon--;	
					}						
				}	

		  }else{
			  clearInterval(turns);
		  }	
		  
		  smon = mon;
		  ssed = sed;
		  if(mon < 10) smon = '0'+mon;
		  if(sed < 10) ssed = '0'+sed;
		  
		 
		  showObj.html(smon+':'+ssed);


	  },1000);
	};
	//分 秒 倒计时 end
	
	return {
		formatDate:_formatDate,	
		getMonthDays:_getMonthDays,
		dateSelect:_dateSelect,
		textareaAutoHeight:_textareaAutoHeight,
		countDown:_countDown
//		,
//		validLeft:f_valiAlwaysLeft
	};
});
