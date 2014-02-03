
$(document).ready(function(){
	
// 去除虚线框（会影响效率）
$("a,input:checkbox,input:radio,button").live('focus',function(){$(this).blur();});

// 为按钮加入点击样式
$("button,.ue-button-ico,button.ue-button").live("mousedown",function(){$(this).addClass("active");});
$("button,.ue-button-ico,button.ue-button").live("mouseup",function(){$(this).removeClass("active");});
$("button,.ue-button-ico,button.ue-button").live("mouseout",function(){$(this).removeClass("active");});

/*修改状态位*/
$(".ue-state-default").live("mouseover",function(){$(this).addClass("ue-state-hover");});
$(".ue-state-default").live("mouseout",function(){$(this).removeClass("ue-state-hover");$(this).removeClass("ue-state-active");});
$(".ue-state-default").live("mousedown",function(){$(this).addClass("ue-state-active");});
$(".ue-state-default").live("mouseup",function(){$(this).removeClass("ue-state-active");});

});