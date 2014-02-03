(function($){	
$.fn.autoTap = function(options){
	options = options || {};
	options = $.extend($.fn.autoTap.conf, options);
	
	var id = $(this).attr("id");
	
	var autoTapPageData = [];
	
	//初始化加载autoTap区域
	initTapPanel(options,id);
	
	var $autoPanel = $("#auto_panel_"+id),
	$autoMain  = $("#auto_main_"+id);
	
	this.each(function(){
    	var $this = $(this);
    	
    	$autoPanel.bind('mousedown', function(evt){
    		evt.stopPropagation();
    	});
    	
    	$(document).bind('mousedown', function(){
    		$autoPanel.hide();
    	});
    	
    	$this.focus(function(){
    		if($autoPanel.css("display") == "none"){
    			$autoPanel.show();
    			//填充下拉框数据
    			loadlotTapData(id,$autoMain, 1, options);
    		}	
		}).bind('mousedown', function(evt){
    		evt.stopPropagation();
    	});
		
    	$("#auto_main_"+id+" li").live("hover",function(){
    		var _this = $(this);
    		_this.siblings().each(function(){
				$(this).removeClass("hover");
			});
    		_this.addClass("hover"); 
    	});
    	
    	var queryTimer = null;
    	$this.bind('keyup',function(event){
    		var $inputObj = $("#"+id),
			index = $autoMain.find(".hover").index();
    		
    		if(event.keyCode != '13' && event.keyCode != '38' && event.keyCode != '40'){
    	   		if(queryTimer){
        			window.clearTimeout(queryTimer);
        		}
        		queryTimer = window.setTimeout(function(){
        			var oldVla = $inputObj.attr("oldVal"),
        				nowVla = $inputObj.val();
        			if($.trim(nowVla) != $.trim(oldVla)){
        				loadlotTapData(id,$autoMain, 1, options);
        			}
        		}, 100);
    			
    		}else if(event.keyCode == '40'){
    			var count = $autoMain.find("li").size();	
    			$autoMain.find("li").removeClass("hover");
    			if(count > 0){
    				index++;
					var $selLi = $autoMain.find("li").eq(index);
					$selLi.addClass("hover");
					$inputObj.val($selLi.find("span").text());
					options.callBack(autoTapPageData[index]);
    			}	
    		}else if(event.keyCode == '38'){
    			var count = $autoMain.find("li").size();	
    			$autoMain.find("li").removeClass("hover");
    			if(count > 0){
					if(index == -1){
    					index = count;
    				}
					index--;
					var $selLi = $autoMain.find("li").eq(index);
					$selLi.addClass("hover");
					$inputObj.val($selLi.find("span").text());
					options.callBack(autoTapPageData[index]);
    			}		
    		}else if(event.keyCode == '13'){
    			var $selLi = $autoMain.find("li").eq(index);
    			$inputObj.val($selLi.find("span").text());
    			options.callBack(autoTapPageData[index]);
    			$autoPanel.hide();
    		}
    	});	
    	
    	$("#auto_main_"+id+" li").live("click",function(){
    		var $this = $(this),$inputObj = $("#"+id),
    			_index = $autoMain.find(".hover").index(),
    			$selLi = $autoMain.find("li").eq(_index);
    		$inputObj.val($selLi.find("span").text());
    		//$inputObj.focus();
    		options.callBack(autoTapPageData[_index]);
    		$autoPanel.hide();
    	});
    	
    	//上一页
    	$("#auto_main_"+id+" .prev").live("click",function(){
    		var $this = $(this),
    		pageno = $this.attr("data-pageno");
    		if(pageno > 0){
    			loadlotTapData(id,$autoMain, pageno, options);	
    		}
    	});
    	
    	//下一页
    	$("#auto_main_"+id+" .next").live("click",function(){
    		var $this = $(this),
    		pageno = $this.attr("data-pageno"),
    		pagetotal = $this.attr("data-pagetotal");
    		if(pageno <= pagetotal){
    			loadlotTapData(id,$autoMain, pageno, options);	
    		}
    	});
    	
	});

	/**
	 * 获取联动下拉菜单数据
	 */
	function loadlotTapData(id, mainObj, pageno ,options){
		
		var $inputObj = $("input[id='"+id+"']"); val = $inputObj.val(), html= '';
		var _data = {};
		_data[options["pageNoAlias"]] = pageno;
		_data[options["pageSizeAlias"]] = options.pagesize;
		_data[options["keyWordAlias"]] = $.trim(val);
		autoTapPageData = [];
		
		$inputObj.attr("oldVal",val);
		$.ajax({
			type: "post",
			url: options.url,
			dataType: "json",
			data:_data,
			success: function(result){
				mainObj.html("").html(packageHtml(pageno,result,options));
				autoTapPageData = result.data;
				$inputObj.focus();
			}
		});
	}
	
	return this;		
};	




$.fn.autoTap.conf = {
		pagesize:10,            	//分页大小
		url:'',						//初始化数据的URL地址
		pageSizeAlias:'pagesize', 	//传递参数名称
		keyWordAlias:'keyword',		//返回参数名称
		pageNoAlias:'pageno',		//返回参数名称
		pageTotalAlias:'total', 	//返回参数名称
		rowFormat:function(){}, 	//每列的模板
		callBack:function(){}   	//点击事件回调函数
};		

function initTapPanel(options,id){
	var width = $("#"+id).outerWidth(true),
		_height = $("#"+id).outerHeight(true),
		height = options.pagesize * 26 + 31,
		html = '';
	 html = '<div class="auto-tap" style="width:'+width+'px;height:'+height+'px;top:'+_height+'px; left:0px;" id="auto_panel_'+id+'">';
	 html+= '<div class="auto-tap-panel" id="auto_main_'+id+'">';
	 html+= '</div>';
	 html+= '</div>';
	$("#"+id).after(html);
}



function packageHtml(pageno,result,options){
	var html = '';
	
	if(result.data.length > 0){
		html += '<div>';
		html +='<ul>';
		for(var i=0; i<result.data.length; i++){
			var _data = result.data[i];
			html +="<li>";
			html +=options.rowFormat(_data);
			html +="</li>";
		}
		html +='</ul>';
		html +='</div>';
		
		var totalRows = result[options["pageTotalAlias"]],
		    pageTotal = rePagetotal(options.pagesize,totalRows),
		    prevpageno = parseInt(pageno)-1,
		    nextpageno = parseInt(pageno)+1;
		
		
		html +='<div class="auto-tap-pager">';
		html +="	<span class='inline-a' >总共:"+totalRows+"条 "+pageno+"/"+pageTotal+"</span>";
		html +="	<span class='inline-a' style='margin-left: 10px;'>";
		html +="		<span class='inline-a prev' data-pageno='"+prevpageno+"' title='上一页' ></span>";
		html +="		<span class='inline-a next' data-pageno='"+nextpageno+"' data-pagetotal='"+pageTotal+"' title='下一页'></span>";
		html +="	</span>";
		html +='</div>'
	}else{
		html += '<div class="auto-tap-nodata" style="margin-top: 20px;margin-bottom: 20px;">无相关数据</div>';
	}
	
	 return html;
}

function rePagetotal(pagesize,totalRows){
	return (totalRows % pagesize) == 0 ?(totalRows / pagesize) :(Math.floor(totalRows / pagesize))+1;
}

})(jQuery);