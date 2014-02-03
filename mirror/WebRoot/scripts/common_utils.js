/**
 * 给Array附加数组忽略顺序所含元素是否相同的方法
 * @param a 用于比较的对象
 * @param comparator 比较两个item的function，如果为undefined，则直接使用==比较
 * @returns {Boolean}
 */
Array.prototype.equalsIgnoreOrder = function(a, comparator) {
	if (!a instanceof Array) {
		return false;
	} else if (a.length !== this.length) {
		return false;
	} else {
		if (!comparator || typeof comparator != 'function') {
			comparator = function(a, b) {return a == b;};
		}
		var test = [].concat(a); //复制数组
		for (var i = 0; i < this.length; i++) {
			for (var j = 0; j < test.length; j++) {
				if (comparator(this[i], test[j])) {
					test.splice(j, 1);
					break;
				}
			}
		}
		return test.length === 0;
	}
};

/**
 * Array的indexOf
 * @param item
 * @param comparator 比较两个item的function，如果为undefined，则直接使用==比较
 * @returns {Number}
 */
Array.prototype.indexOf = function(item, comparator) {
	if (!comparator || typeof comparator != 'function') {
		comparator = function(a, b) {return a == b;};
	}
	for (var i = 0; i < this.length; i++) {
		if (comparator(item, this[i])) {
			return i;
		}
	}
	return -1;
};

/**
 * 给Array附件contains方法
 * @param item 
 * @param comparator 比较两个item的function，如果为undefined，则直接使用==比较
 * @returns {Boolean}
 */
Array.prototype.contains = function(item, comparator) {
	return this.indexOf(item, comparator) !== -1;
};

/**
 * Array的remove
 * @param item
 * @param comparator 比较两个item的function，如果为undefined，则直接使用==比较
 * @returns {Boolean}
 */
Array.prototype.remove = function(item, comparator) {
	var index = this.indexOf(item, comparator);
	if (index !== -1) {
		this.splice(index, 1);
		return true;
	}
	return false;
};

/**
 * 给Array扩展clone方法
 * @returns {Array}
 */
Array.prototype.clone = function() {
	var newArray = [];
	for (var i = 0; i < this.length; i++) {
		newArray.push(this[i]);
	}
	return newArray;
};

/**
 * 返回数组array的全组合
 * @param array 原始的数组
 * @param count 组合包含的元素的个数，undefined为不限制。（比如，求5个元素的全组合的时候，传入count为5，则仅仅返回全部的元素一个组合）
 * @returns {Array} array中元素的全组合
 */
function allCombine(array, count) {
	var start = Math.pow(2, array.length);
	var end = Math.pow(2, array.length + 1);
	var result = [];
	for (var i = end - 1; i > start; i--) {
		var data = i.toString(2).substring(1);
		var oneArray = [];
		for (var j = 0; j < data.length; j++) {
			var include = parseInt(data.charAt(j));
			if (include == 1) { // 此位的值是否为1，为1则表示包含
				oneArray.push(array[j]);
			}
		}
		if (!count || oneArray.length == count) {
			result.push(oneArray);
		}
	}
	if (!count) {
		// 只有不限制组合成员的个数的时候才排序，否则length都一样，排序就没有意义了
		result.sort(function(o1, o2) {
			return o1.length < o2.length ? 1 : (o1.length == o2.length ? 0 : -1);
		});
	}
	return result;
}

/**
 * String.trim
 */
String.prototype.trim = function() {
	return $.trim(this);
};

window.esc = {
	/**
	 * 静态的escapeHtml方法
	 * @param param 需要被escape的参数
	 */
	html: function(param) {
		if (param) {
			var div = document.createElement("div");
			div.appendChild(document.createTextNode((param + "").trim()));
			return div.innerHTML;
		} else {
			return "";
		}
	}
};

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
 * 在新窗口中打开url，类似于点击了标记了target="_blank"的a标签
 * @param url 需要打开的url
 */
function openInNewWindow(url) {
	if (url) {
		window.open(url, "_blank");
	}
}

/**
 * 检测浏览器是否支持SVG
 * @returns {Boolean} 是否支持
 */
function supportSVG() {
	var SVG_NS = 'http://www.w3.org/2000/svg';
	return !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect;
}

/**
 * 身份证号码15位和18位的转换
 * @param oldCardNum 15位或者18位的身份证号
 * @returns 转换过后的号
 */
function convertIDCardNumber(oldCardNum) {
	var strTemp = "";
	if (oldCardNum.length == 15) {
		var strJiaoYan = ["1", "0", "X", "9", "8", "7", "6", "5","4", "3", "2"];
		var intQuan = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
		var intTemp = 0;
		var i;
		strTemp = oldCardNum.substring(0, 6) + "19"
				+ oldCardNum.substring(6);
		for (i = 0; i < strTemp.length; i++) {
			intTemp = intTemp + parseInt(strTemp.substring(i, i + 1)) * intQuan[i];
		}
		intTemp = intTemp % 11;
		return strTemp + strJiaoYan[intTemp];
	} else if (oldCardNum.length == 18) {
		strTemp = oldCardNum.substring(0, 6) + oldCardNum.substring(8, 17);
		return strTemp;
	} else {
		return oldCardNum;
	}
}

/**
 * 校验身份证是否合法
 * @param idcard 用于校验的身份证
 * @returns 身份证是否合法，合法返回true，否则返回错误信息
 */
function checkIDCardNumber(idcard){ 	 
	var Errors=new Array(
		true, 
		"身份证号码位数不对!", 
		"身份证号码出生日期超出范围或含有非法字符!", 
		"身份证号码校验错误!", 
		"身份证地区非法!" 
	); 
	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};  
	var idcard,Y,JYM; 
	var S,M; 
	var idcard_array = new Array(); 
	idcard_array = idcard.split(""); 
	//地区检验 
	if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4]; 
	//身份号码位数及格式检验 
	switch(idcard.length){ 
		case 15: 
			if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){ 
				ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性 
			} else { 
				ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性 
			} 
			if (ereg.test(idcard)) {
				return Errors[0];
			} else { 
				return Errors[2]; 
			} 
			break; 
		case 18: 
		//18位身份号码检测 
		//出生日期的合法性检查  
		//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9])) 
		//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8])) 
			if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){ 
				ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式 
			} else { 
				ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式 
			} 
			if (ereg.test(idcard)) {//测试出生日期的合法性 
			//计算校验位 
				S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 
				+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 
				+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 
				+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 
				+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 
				+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 
				+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 
				+ parseInt(idcard_array[7]) * 1  
				+ parseInt(idcard_array[8]) * 6   
				+ parseInt(idcard_array[9]) * 3 ; 
				Y = S % 11; 
				M = "F"; 
				JYM = "10X98765432"; 
				M = JYM.substr(Y,1);//判断校验位 
				if(M == idcard_array[17]) return Errors[0]; //检测ID的校验位 
				else return Errors[3];   
			} else {
				return Errors[2];
			}
			break; 
		default: 
			return Errors[1]; 
			break; 
	} 
}


/**
 * IP转long(反过来转换还是不行，用ajax吧)
 * @param ipStr
 * @param isMark 结果为有符号，还是无符号， true：有符号，false，无符号
 * @return long型的IP
 */
function convertIPToLong(ipStr, isMark) {
	var addr;
	var b;
	var tmpFlag1;
	var tmpFlag2;
	if ($.trim(ipStr) == '') {
		return 0;
	}
	addr = 0;
	b = "";
	tmpFlag1 = 0;
	tmpFlag2 = ipStr.indexOf(".");
	b = ipStr.substring(tmpFlag1, tmpFlag2);
	addr = parseInt(b, 10); //(new Long(b)).longValue();
	tmpFlag1 = tmpFlag2 + 1;
	tmpFlag2 = ipStr.indexOf(".", tmpFlag1);
	addr <<= 8;
	b = ipStr.substring(tmpFlag1, tmpFlag2);
	addr += parseInt(b, 10); //(new Long(b)).longValue();
	tmpFlag1 = tmpFlag2 + 1;
	tmpFlag2 = ipStr.indexOf(".", tmpFlag1);
	addr <<= 8;
	b = ipStr.substring(tmpFlag1, tmpFlag2);
	addr += parseInt(b, 10);//(new Long(b)).longValue();
	addr <<= 8;
	addr += parseInt(ipStr.substring(tmpFlag2 + 1, ipStr.length), 10);//(new Long(ipStr.substring(tmpFlag2 + 1, ipStr.length()))).longValue();
	if (isMark) {
		if (addr > 2147483647)
			addr -= 4294967296; //Long.parseLong("4294967296");
	}

	return addr;
}

/**
 * 将long型的时间转换为yyyy-MM-dd hh:mm:ss格式
 * @param time long格式的日期
 * @param callback 回调方法，方法的第一个实参为错误对象，第二个实参为结果数据
 */
function convertTimeToString(time, callback) {
	callback = callback || function() {};
	var d = new Date(time * 1000);
	callback.call(this, null, d.getFullYear() + "-" + addZeroFront(d.getMonth() + 1, 2) + "-" + addZeroFront(d.getDate(), 2)
			+ " " + addZeroFront(d.getHours(), 2) + ":" + addZeroFront(d.getMinutes(), 2) + ":" + addZeroFront(d.getSeconds()), 2);
	function addZeroFront(source, destLength) {
		var less = destLength - (source + "").length;
		if (less > 0) {
			var s = Math.pow(2, less).toString(2).substring(1);
			var result = s + source;
			return result;
		}
		return source;
	}
}

/**
 * 将时间转换成long
 * @param time 2013-12-20 20:30:17格式的日期
 * @param callback 回调方法，方法的第一个实参为错误对象，第二个实参为结果数据
 */
function convertTimeToLong(time, callback) {
	callback = callback || function() {};
	var pattern = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{2}):(\d{2}):(\d{2})$/;
	if (pattern.test(time)) {
		var g = time.match(pattern);
		var date = new Date();
		date.setFullYear(g[1]);
		date.setMonth(parseInt(g[2], 10) - 1);
		date.setDate(g[3]);
		date.setHours(g[4]);
		date.setMinutes(g[5]);
		date.setSeconds(g[6]);
		callback.call(this, null, Math.floor(date.getTime() / 1000));
	} else {
		callback.call(this, '时间的格式不对，一定要是yyyy-MM-dd hh:mm:ss格式！');
	}
}

/**
 * 初始化排序支持
 * @param tableHeader 表头部分
 * @param dataForm 存储排序信息的form，会在此form中查找name="pager.sortname"和name="pager.sortorder"的input还原排序和存储排序数据
 * @param callback 回调方法
 */
function initTableSortHeader(tableHeader, dataForm, callback) {
	var sortNameField = $(dataForm).find(":input[name='pager.sortname']");
	var sortOrderField =  $(dataForm).find(":input[name='pager.sortorder']");
	var sortName = sortNameField.val();
	var sortOrder = sortOrderField.val();
	$(tableHeader).find("th[data-sortName='" + sortName + "'] > span.sortable").addClass("sort-" + sortOrder);

	$(tableHeader).find("th[data-sortName]").click(function() {
		sortName = $(this).attr("data-sortName");
		sortNameField.val(sortName);
		if (sortOrder == "asc") {
			sortOrder = "desc";
		} else {
			sortOrder = "asc";
		}
		sortOrderField.val(sortOrder);
		if (typeof callback === 'function') {
			callback.call(this);
		}
	});
}

/**
 * 请求服务器的数据
 * @param url 请求的url，要带上上下文路径
 * @param async 是(true)否(false, undefined)同步
 * @param data 表单的参数
 * @param success 成功的回调方法定义 {200: function(rsp) {}, 500: function(rsp){}}
 * @param error 请求失败的回调方法定义
 */
function requestServer(url, async, data, success, error) {
	success = $.extend({
		200: function(rsp) {
		}, 
		500: function(rsp) {
			Msg.show(rsp['rspMsg'], {type:'error', timeout: 2000});
		}
	}, success);
	error = error || function() {Msg.show("获取数据出错！", {type:'error', timeout: 2000});};
	$.ajax({
		url: url,
		dataType: "json",
		async: async && true,
		data: data,
		type: "post",
		success: function(rsp) {
			if (rsp) {
				// 返回代码
				var rspCode = rsp['rspCode'];
				// 返回的消息
				var rspMsg = rsp['rspMsg'];
				var result = rsp['result'];
				if (rspCode && rspMsg) {
					switch(rspCode) {
						case 200:
							success[200].call(this, rsp);
							break;
						case 500:
							success[500].call(this, rsp);
							break;
						default:
							(success[rspCode] || function() {Msg.show("服务器返回数据异常[error: 0]", {type:'error', timeout: 2000}); console.error('rspCode[%s]的回调方法没有定义！', rspCode);}).call(this, rsp);
							break;
					}
				} else {
					Msg.show("服务器返回数据异常[error: 1]", {type:'error', timeout: 2000});
					console.error('没有同时返回rspCode和rspMsg', rspCode, rspMsg);
				}
			} else {
				Msg.show("服务器返回数据异常[error: 2]", {type:'error', timeout: 2000});
				console.error('返回的rspMsg为空！', rspMsg);
			}
		},
		error: function() {
			error.call(this);
		}
	});
}

//dom的回车键事件
;(function($){
	$.fn.actionPerformed = function(callback) {
		callback = callback || function() {};
		var _this = this; // 得到事件触发对象
		return this.keyup(function(event) {
			// 回车键
			if (event && event.keyCode == 13) {
				callback.call(_this);
			}
		});
	};
})(jQuery);

/**
 * 添加dom元素的onActionPerformed属性的支持，请在document.ready后调用
 */
function initOnActionPerformed() {
	$("*[onActionPerformed]").each(function(i, item) {
		$(item).actionPerformed(function(event) {
			eval(this.attr('onActionPerformed'));
		});
	});
}

