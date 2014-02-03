$.fn.xTip = function (options, value) {
	var defaults = {
		type : "normalTip", // 提示的类型
		tipClose : true, // 是否显示xx关闭图标
		position : "static",
		location : null,
		autoOpen : false,//是否自动打开
		animate : {
			showTime : 1000,
			fadeOutTime : 1000
		}
	};
	var opts = $.extend(defaults, options);
	var styleTip;
	return this.each(function () {
		//关闭事件
		if (options == "close") {
			$(this).parents(".tip-main").hide();
		} else if (options == "open") {
			$(this).parents(".tip-main").show();
		} else if (options == "location") {
			locationNormalTip($(this).parents(".tip-main"), value[0], value[1]);
		}else {
			switch (opts.type) {
			case "normalTip": {
					styleTip = "tip-styleA";
					createTip($(this), opts);
					break;
				}
			default: {
					styleTip = "normalTip";
					return;
				}
			}
		}
	});
	
	//初始化提示
	function createTip(tipObj, opts) {
		var tipThis = tipObj;
		tipThis.wrap("<div class='tip-main'></div>");//最外层的DIV，及显示内容
		var tipObj = tipThis.parents(".tip-main");//找到最外层的div
		tipThis.addClass("tipBd");
	/*	var html = "<div class='tipShadowX'></div>"
		 + "<div class='tipShadowY'></div>"*/
		var html =  "<a class='tipClose'></a>"
		 + "<div class='tipArrow'></div>";
		
		
		tipObj.prepend(html);
		tipObj.addClass(styleTip);//设置整个提示的样式风格
		
		if (opts.location == null) {
			tipObj.hide();
		} else {
			locationNormalTip(tipObj, opts.location[0], opts.location[1]);
		}

		// 是否显示关闭图标
		if (opts.tipClose == false) {
			tipObj.find(".tipClose").remove();
		} else if (opts.tipClose == true) {
			tipObj.find(".tipClose").click(function () {
				tipObj.hide();
			});
		} else {
			tipObj.find(".tipClose").click(function () {
				opts.tipClose();
				tipObj.hide();
			});
		}
		 
		//是否默认自动打开
		if (opts.autoOpen == true) {
			tipObj.show();
		} else {
			tipObj.hide();
		}
	}
	
	/*
	 * 设置提示框位置
	 */
	function locationNormalTip(tipObj, x, y) {
		var visible = tipObj.css("display");
		tipObj.show();
		tipObj.find(".tipArrow").removeClass().addClass("tipArrow");
		
		//初始化提示的宽度
		//tipObj.css("width", tipObj.find(".tipBd").outerWidth());
		tipObj.css("width", "auto");
		// 初始化提示，和箭头的位置
		
		tipObj.css({
			"left" : 0,
			"top" : 0
		});
		
		tipObj.css({
			"left" : (x - 10)<0?x:x-10,
			"top" : y - tipObj.outerHeight()-10
		});
		tipObj.find(".tipArrow").css({
			"left" : 10
		}).addClass("down");
		
		// 如果定位偏左，那么小提示在右侧显示 
		if ($(window).width() - x < tipObj.outerWidth()) {
			tipObj.css("left", x - tipObj.outerWidth() + 30);
			tipObj.find(".tipArrow").css("left", tipObj.outerWidth() - 30);
		}
		
		// 如果定位偏上，那么小提示在下方显示
		//13为箭头的高度
		if (y < tipObj.outerHeight()+ 13 ) {
			tipObj.css("top", y + 30);
			
			/* 控制小箭头的显示方向以及位置 */
			if (tipObj.find(".tipHd").size() > 0) {
				tipObj.find(".tipArrow").removeClass("down").addClass("up");
			} else {
				tipObj.find(".tipArrow").removeClass("down").addClass("up2");
			}
		}
		
		//设定边框阴影长和宽
		tipObj.find(".tipShadowX").css({
			"width" : tipObj.width()
		});
		tipObj.find(".tipShadowY").css({
			"height" : tipObj.height() + 4
		});
		
		if (visible == "none") {
			tipObj.hide();
		}
	}
	 
	
};