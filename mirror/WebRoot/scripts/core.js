;$(function() {
	$(':submit.nb-btn, :button.nb-btn, :reset.nb-btn').live('mousedown',
			function(evt) {
				var $ele = $(this);
				if ($ele.hasClass('btn-dis')) {
					return;
				}
				$ele.addClass('btn-active');
			}).live('mouseup', function(evt) {
		$(this).removeClass('btn-active');
	});

	$('div.btn-group').children().bind('mousedown', function(evt) {
		var $ele = $(this);
		if ($ele.hasClass('btn-dis')) {
			return;
		}
		$ele.addClass('btn-active');
	}).bind('mouseup', function(evt) {
		$(this).removeClass('btn-active');
	});

	// tab项
	$('div.nb-tab-panel').find('li').bind('mousedown', function(evt) {
		var $li = $(this);
		if ($li.hasClass('tab-dis')) {
			return false;
		}

		$li.siblings().removeClass('nb-tab-active');
		$li.addClass('nb-tab-active');
	});

});

/**
 * Placeholder check
 */
;(function($){
	$.fn.bindPlaceholder = function() {
		var checkInputTimer = null,
			_togPlaceholder = function(input){
				var _id = input.attr("id");
				if(input.val() != '') {
					input.siblings("label[for='"+_id+"']").hide();
					$("#"+_id+"ClearHandler").show();
				} else {
					input.siblings("label[for='"+_id+"']").show();
					$("#"+_id+"ClearHandler").hide();
				}
			};
		return this.each(function(){
			var thiz = $(this);
			thiz.bind('keydown', function(){
				if(checkInputTimer) {
					window.clearTimeout(checkInputTimer);
				}
				checkInputTimer = window.setTimeout(function(){
					_togPlaceholder(thiz);
					window.clearTimeout(checkInputTimer);
				}, 50);
			})
			.bind("propertychange input", function(){
				_togPlaceholder(thiz);
			})
			.bind('focus', function(){
				_togPlaceholder(thiz);
				thiz.siblings("label[for='"+thiz.attr('id')+"']").hide();
			})
			.bind('blur', function(){
				_togPlaceholder(thiz);
			});
			
			$("#"+thiz.attr('id')+"ClearHandler").bind('click', function() {
				thiz.val('');
				thiz.siblings("label[for='"+thiz.attr('id')+"']").show();
				thiz.focus();
				$(this).hide();
			});
			
			_togPlaceholder(thiz);
		});
	};
	
})(jQuery);

/**
 * Placeholder 自动渲染插件
 */
;(function($){
	/* 
	$("#input").placeholder({
		tip: '请输入...',
		tipColor:'#cccc',
		tipSize: '14px',
		clearEnable:true,
		clearHandler:function(){
		}
	});
	*/
	$.fn.placeholder = function(opts) {
		opts = opts || {};
		opts = $.extend({}, {
			"tip": '请输入...',
			"tipColor": false,
			"tipSize": false,
			"clearEnable": true,
			"clearHandler": function(){}
		}, opts); 
		
		var checkInputTimer = null,
		_togPlaceholder = function(placeholderDom){
			if(placeholderDom['obj'].val() != '') {
				placeholderDom['tip'].hide();
				placeholderDom['clearEnable']&&placeholderDom['clear'].show();
			} else {
				placeholderDom['tip'].show();
				placeholderDom['clearEnable']&&placeholderDom['clear'].hide();
			}
		};
		
		return this.each(function(){
			var thiz = $(this), wrap, placeholderDom = {}, eles, cls_name;
			thiz.wrap('<div class="placeholder-wrapper"></div>');
			wrap = thiz.parent();
			wrap.append('<label for="'+thiz.attr('id')+'" class="placeholder-tip"></label>');
			wrap.append('<span class="placeholder-clear" style="display:none;"></span>');
			
			eles = wrap[0].getElementsByTagName('*');
			for(var i = 0, len = eles.length; i < len; i++) {
				cls_name = eles[i].className;
				if(!cls_name || cls_name.indexOf('placeholder-') == -1) {
					continue;
				}
				placeholderDom[cls_name.split('-')[1]] = $(eles[i]);
			}
			placeholderDom['wrapper'] = wrap;
			placeholderDom['obj'] = thiz;
			placeholderDom['clearEnable'] = opts.clearEnable;
			placeholderDom['tip'].css({"font-size": thiz.css('font-size'),
										"text-indent": thiz.css('padding-left'), 
										"line-height": thiz.outerHeight(true)+"px"})
								 .text(opts.tip);
			if(opts.tipColor) {
				placeholderDom['tip'].css('color', opts.tipColor);
			}
			if(opts.tipSize) {
				placeholderDom['tip'].css('font-size', opts.tipSize);
			}
			
			thiz.bind('keydown', function(){
				if(checkInputTimer) {
					window.clearTimeout(checkInputTimer);
				}
				checkInputTimer = window.setTimeout(function(){
					_togPlaceholder(placeholderDom);
					window.clearTimeout(checkInputTimer);
				}, 45);
			})
			.bind("propertychange input", function(){
				_togPlaceholder(placeholderDom);
			})
			.bind('focus', function(){
				placeholderDom['wrapper'].addClass('placeholder-focus');
				_togPlaceholder(placeholderDom);
			})
			.bind('blur', function(){
				placeholderDom['wrapper'].removeClass('placeholder-focus');
			});
			
			placeholderDom['clearEnable'] && placeholderDom['clear'].bind('click', function() {
				thiz.val('');
				_togPlaceholder(placeholderDom);
				thiz.focus();
				if(opts.clearHandler && typeof opts.clearHandler === 'function') {
					opts.clearHandler.call(thiz);
				}
			});
			
			_togPlaceholder(placeholderDom);
		});
	};
	
})(jQuery);

;(function($) {
	$.fn.dsTable = function(opts) {
		var opts = $({width: '100%', height: '500px', sortName: '', sortOrder: 'asc', sortCallback: function(sortName, sortOrder){}}).extend(opts);
		
		var optHeight = opts.height;
		var optWidth = opts.width || '100%';
		var resizeCallback = undefined;
		if (optHeight) {
			if (typeof optHeight === 'function') {
				resizeCallback = optHeight;
			}
		}
		
		var _this = this;
		var resizeFuncion = function() {
			_this.each(function() {
				var $this = $(this);
				var contentDiv = $this.find(".dstcontent-div");
				if (resizeCallback) {
					var height = resizeCallback.call(this);
					contentDiv.height(height);
				}
			});
		};
		
		resizeFuncion();
		
		$(window).resize(resizeFuncion);
		
		return this.each(function() {
			var $this = $(this);
			var wrapper = $this.parent(".dstable-wrapper");
			if (wrapper.length == 0) {
				$this.wrap('<div class="dstable-wrapper"></div>');
				wrapper = $this.parent(".dstable-wrapper");
			}
			
			if (!$this.hasClass("dstable")) {
				$this.addClass("dstable");
			}
			
			wrapper.width(optWidth);
			
			var headerTable = $this.find(".dstheader-table");
			
			// 需要添加排序的字段和样式
			var sortableColumns = headerTable.find("th[data-sortName]");
			if (sortableColumns.length > 0) {
				sortableColumns.each(function(i, item) {
					var $item = $(item);
					if ($item.find("span.sortable").length == 0) {
						$item.append('<span class="sortable"></span>');
					}
					$item.click(function() {
						opts.sortName = $item.attr('data-sortName');
						if (opts.sortOrder == "asc") {
							$item.find("span.sortable").removeClass("sort-asc");
							opts.sortOrder = "desc";
						} else {
							$item.find("span.sortable").removeClass("sort-desc");
							opts.sortOrder = "asc";
						}
						// 调回调方法
						$item.find("span.sortable").addClass("sort-" + opts.sortOrder);
						opts.sortCallback(opts.sortName, opts.sortOrder);
					});
				});
				
				// 还原排序状态图标
				headerTable.find("th[data-sortName='" + opts.sortName + "'] > span.sortable").addClass("sort-" + opts.sortOrder);
			}
			
			var minus = headerTable.position().left;
			var contentDiv = $this.find(".dstcontent-div");
			var contentTable = $this.find(".dstcontent-table");
			contentDiv.scroll(function() {
				var offset = contentTable.position().left;
				headerTable.css({"margin-left": offset - minus});
			});
			
			if (resizeCallback == undefined) {
				contentDiv.height(optHeight);
			}
			
			//获取当前宽度,由于设置为100%，所以在这个地方要获取像素
			var wrapperWidth = parseInt(wrapper.width());
			//获取所有的列
			var headerTableColArr = headerTable.find("col");
			var contentTableColArr = contentTable.find("col");
			var colCount = headerTableColArr.length;
			if (colCount > 0)
			{
				//计算所有列的总和
				var sumpx = 0;
				for (var m=0;m<colCount;m++)
				{
					var $headertableColItem = $(headerTableColArr[m]);
					sumpx = sumpx + parseInt($headertableColItem.css('width'));
				}
				//如果列总宽度小于页面宽度，则重新计算每列宽度,按照原有比例来计算
				if (wrapperWidth > sumpx)
				{
					for (var n=0;n<colCount;n++)
					{
						var $headertableColItem = $(headerTableColArr[n]);
						var $contentTableColItem = $(contentTableColArr[n]);
						$headertableColItem.css('width',(parseInt($headertableColItem.css('width')) / sumpx) * wrapperWidth + 'px');
						$contentTableColItem.css('width',(parseInt($contentTableColItem.css('width')) / sumpx) * wrapperWidth + 'px');
						headerTable.width(wrapperWidth + 'px');
						contentTable.width(wrapperWidth + 'px');
					}
				}
			}
		});
	};
})(jQuery);

/**
 * Tip Message
 * Example: Msg.show('text', {type:'success|warning|error|loading|info', timeout:[ms], modal:true|false});
 * Msg.show('Hello world!');
 * Msg.show('Hello world!', {type:'info'});
 * Msg.show('Hello world!', {timeout:1000});
 */
var Msg = (function() {
	String.format = function(str) {
		var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
		return String(str).replace(re, function($1, $2) {
			return args[$2];
		});
	};

	var _temp = '<div class="popup-hint" style="z-index:30000;"><i class="" rel="type"></i><em class="sl"><b></b></em><span rel="con"></span><em class="sr"><b></b></em></div>', 
		_dom = null, _timer = null, _maskDom = null,
		_cache = {
			Type : {
				"success" : "hint-icon hint-succ-m",
				"warning" : "hint-icon hint-warn-m",
				"error" : "hint-icon hint-err-m",
				"loading" : "hint-loader",
				"info" : "hint-icon hint-info-m"
			}
		},
      _maskLayer = '<div class="popup-hint-mask" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:29992; display:none;"></div>',
	_center = function(box, setting) {
		var mainBox = null, cut = 0, t = 0, l = 0;
		if (setting) {
			if (setting.Main) {
				mainBox = setting.Main;
				t = mainBox.offset().top;
				l = mainBox.offset().left;
			} else {
				mainBox = $(window);
			}
			if (setting.Cut != undefined) {
				cut = setting.Cut;
			}
		} else {
			mainBox = $(window);
		}
		var cssT = (mainBox.height() - box.height()) / 3 + cut + t, 
			cssL = (mainBox.width() - box.width())/ 2 + cut + l, 
			st;
		
		if (cssT < 0) {
			cssT = 0;
		}
		if (cssL < 0) {
			cssL = 0;
		}
		st = mainBox.scrollTop();
		if (st) {
			cssT += st;
		}
		box.css({
			top : cssT,
			left : cssL
		});
	},

	_create = function(text, type) {
		if (!_dom) {
			_maskDom = $(_maskLayer);
			_dom = $(String.format(_temp, text));
			$(document.body).append(_maskDom).append(_dom);
		}
		_dom.find("[rel='con']").html(text);
		var icon = _dom.find("[rel='type']");
		for ( var k in _cache.Type) {
			icon.removeClass(_cache.Type[k]);
		}
		icon.addClass(_cache.Type[type]);
	},

	_hide = function() {
		if (_timer) {
			window.clearTimeout(_timer);
		}
		if (_dom) {
			_dom.hide();
			_maskDom.hide();
		}
	};

	return {
		// obj = {type:'', window:, timeout:''}
		show : function(text, obj) {
			obj = obj || {};
			if (!obj.type) {
				obj.type = "info";
			}

			_create(text, obj.type);
			_center(_dom, {
				Main : obj.target ? $(obj.target) : false
			});
			
			if(obj.modal) {
				_maskDom.show();
			}
			_dom.show();

			if (_timer) {
				window.clearTimeout(_timer);
			}
			if (obj.timeout) {
				_timer = window.setTimeout(_hide, obj.timeout);
			}
		},

		hide : function() {
			_hide();
		}
	};
})();

function toUTF8(a) {
	var b, c, d = b = "";
	for (c = 0; c < a.length; c++) {
		b = a.charCodeAt(c);
		if (b & 65408) {
			b = b & 61440 ? "%" + (b >> 12 | 224).toString(16) + "%"
					+ (b >> 6 & 63 | 128).toString(16) + "%"
					+ (b & 63 | 128).toString(16) : "%"
					+ (b >> 6 | 192).toString(16) + "%"
					+ (b & 63 | 128).toString(16);
			d += b;
		} else {
			d += a.charAt(c);
		}
	}
	return d;
}

function toJSON(str, defaultObj) {
	  if(!str || $.trim(str) == '') {
		  return defaultObj;
	  }
	  return eval('('+str+')');
}

// 防止在IE下使用console.log()时报错，添加error, warn, info, debug方法的防止出错
window.console = window.console || {log: function(){}, error: function(){}, warn: function(){}, info: function(){}, debug: function(){}};
/**
 * IE下直接使用stopPropagation会报错
 * @param event 事件参数
 */
function stopPropagation(event) {
	if (event.stopPropagation) {
		// normal browser
		event.stopPropagation();
	} else if (window.event) {
		// this code is for IE, IE lack of fucking!!!
		window.event.cancelBubble = true;
	}
}
/**
 * 给String附加的text方法，用于对html代码进行转义
 * @author clu
 */
String.prototype.escapeHtml = function() {
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(this.trim()));
	return div.innerHTML;
};

/**
 * 页面所有标识 target="headerTab"的超链接，都自动在主页面的头部tab栏打开
 * @param id tab的id
 * @param title tab的标题
 * @param url 要打开的tab的url
 * @return 是否打开成功，打开失败时(例如，页面没有在tab页中打开)，需要业务系统自行打开
 * edit by clu on 2013-12-5 10:13:36 添加方法是否调用成功的反馈
 */
function openInHeaderTab(id, title, url) {
	if (top.openTab && typeof top.openTab == 'function') {
		top.openTab(id, title, url);
		return true;
	}
	return false;
}
$(document).bind("click", function(evt){
	var ele = evt.srcElement || evt.target;
	if(!ele || !top.openTab) return true;
	if(ele.tagName != 'A') {
		ele = ele.parentNode;
	}
	if(ele && ele.tagName == 'A' && 'headerTab' == ele.getAttribute('target')) {
		var url = ele.getAttribute('href'), title = ele.getAttribute('title');
		if(url.indexOf('javascript:') == -1) {
			title = title || url;
			openInHeaderTab('A'+ (new Date().getTime()), title, url);
			if(evt.stopPropagation) {
				evt.preventDefault();
				evt.stopPropagation();
			}else {
				evt.cancelBubble = true;
				evt.returnValue = false;
			}
			return false;
		}
	}
});

/**
 * 打开虚拟邮箱
 * @param contentPath 上下文路径
 * @param account 邮箱帐号
 * @param atype 帐号类型
 * @return
 */
function openVirtualEmail(contentPath, account, atype){
	if( $.trim(contentPath).length >0 && $.trim(account).length >0 && $.trim(atype).length >0 ){
		var url = contentPath+"/virtual/email!index.action?account="+account+"&atype="+atype;
		window.open(url);
	}
}

/**
 * 打开虚拟IM
* @param contentPath 上下文路径
 * @param account IM帐号
 * @param atype 帐号类型
 * @return
 */
function openVirtualIM(contentPath, account, atype){
	if($.trim(contentPath).length >0 && $.trim(account).length >0 &&$.trim(atype).length >0){
		var url = contentPath+"/virtual/IM!index.action?account="+account+"&protocal="+atype;
		window.open(url);
	}
}

