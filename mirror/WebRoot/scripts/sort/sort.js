(function($){
	
	// 数据表格排序
	var _sortDesc = "";
	$.fn.sort = function(sortFormName){
		
		if(!$(this).hasClass("nb-grid")) $(this).addClass("nb-grid");
		
		switch($("input[name='sortorder']").val()){
			case 'asc':
				_sortDesc = "降序↓";
			break;
			
			case 'desc':
			default:
				_sortDesc = "升序↑";
			break;
		}
		
		$(this).find("tr:first th[sortname]").each(function(i){
			
			var _sortnameAttr = $(this).attr("sortname");
			$(this).html("<div id=\"sort_"+_sortnameAttr+"\" title=\"点击按“"+$(this).text()+"”"+_sortDesc+"排序\">"+$(this).html()+"</div>");
			
			$("div#sort_"+_sortnameAttr).bind("click",function(e){
				var _sortorder = $("input[name='sortorder']").val();
				$("input[name='sortname']").val(_sortnameAttr);
				$("input[name='sortorder']").val((_sortorder == "" ||_sortorder == "desc")?"asc":"desc");
					  
				document.forms[sortFormName].submit();
			});	
		});
		
		var _currSortname = $("input[name='sortname']").val();
		if(_currSortname && $.trim(_currSortname) != ""){
			$("div#sort_"+_currSortname).removeClass().addClass($("input[name='sortorder']").val());
			$(this).find("tr:first th[sortname]").removeClass("currentSort");
			$(this).find("tr:first th[sortname='"+_currSortname+"']").addClass("currentSort");
		}
		
	}
	
})($);

