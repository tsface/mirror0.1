var LocalStorage = window.localStorage;
if (!LocalStorage) {
	LocalStorage = {
		userData : null,
		name : location.hostname,
		init : function() {
			if (!LocalStorage.userData) {
				try {
					LocalStorage.userData = document.createElement('INPUT');
					LocalStorage.userData.type = "hidden";
					LocalStorage.userData.style.display = "none";
					LocalStorage.userData.addBehavior("#default#userData");
					document.body.appendChild(LocalStorage.userData);
					var expires = new Date();
					expires.setDate(expires.getDate() + 365);
					LocalStorage.userData.expires = expires.toUTCString();
				} catch (e) {
					return false;
				}
			}
			return true;
		},
		setItem : function(key, value) {
			if (LocalStorage.init()) {
				LocalStorage.userData.load(LocalStorage.name);
				LocalStorage.userData.setAttribute(key, value);
				LocalStorage.userData.save(LocalStorage.name);
			}
		},
		getItem : function(key) {
			if (LocalStorage.init()) {
				LocalStorage.userData.load(LocalStorage.name);
				return LocalStorage.userData.getAttribute(key);
			}
		},
		remove : function(key) {
			if (LocalStorage.init()) {
				LocalStorage.userData.load(LocalStorage.name);
				LocalStorage.userData.removeAttribute(key);
				LocalStorage.userData.save(LocalStorage.name);
			}

		}
	};
};

// 判断是否是空的url，用于在将tab项记录cookie时进行url判断，如果url为空则不记录cookie
var isBlankURL = new RegExp("^(\\s*|about:blank|"+context_path+"\/?\\s*)$");
function $id(id){ return document.getElementById(id); }
// 防止在IE下使用console.log()时报错，添加error, warn, info, debug方法的防止出错
window.console = window.console || {log: function(){}, error: function(){}, warn: function(){}, info: function(){}, debug: function(){}};

var headerTabNav, headerTabMenu, 
	// 从cookie获取保存上一次用户打开的tab项
	opened_tabs = getOpenedTabsFromCookie();

// 初始化主页面的顶部导航条容器
function initHeaderTabNav() {
	var initTabitems = [{ id:"U0000999", label:"工作台", title:"工作台", onclick:function(){
		createTabPage("dashboard", "/dashboard.jsp"); 
	}}];
	
	if(opened_tabs && opened_tabs.length > 0){
		for(var i = 0, len = opened_tabs.length; i < len; i++){
			var _itms = eval("("+opened_tabs[i]+")");
			initTabitems.push({id:_itms.id, label:_itms.label, title:_itms.label, 
				// edit by clu on 2013-10-30 9:14:23 修复tab标签页的双击刷新按钮tab页被关闭的bug
				toolbar: '<a href="javascript:;" onclick="refreshTab(\''+_itms.id+'\',\''+_itms.url+'\');return false;" ondblclick="refreshTab(\''+_itms.id+'\',\''+_itms.url+'\'); stopPropagation(event); return false;" class="reload">&nbsp;</a>', 
				closable: true, 
				onclick: (function(_itms){
					return function(){ 
						createTabPage(_itms.id, _itms.url); 
					}; 
				})(_itms) // 方法声明就调用，怪不得找不到在哪里创建的页面
			});
		}
	}
	
	headerTabNav = $("#header_itab_nav").iTab({
		id: "tab20136856",
		tabPosition: 'h',
		width: $("#header_itab_nav").width() - 2,
		maxChars: 20, //截取字符的长度(1个汉字=2个字符)
		scrollable: true,
		mouseWheel: true,
		theme: "header-itab",
		tabClose: function(){
			var pageObj = $id("tabPage_"+this.id);
			if( pageObj ){
				pageObj.innerHTML = "";
				pageObj.parentNode.removeChild(pageObj);
				(document.all)&&CollectGarbage();
				// 删除cookie中记录的数据
				delTabInCookie(this.id);
			}
			pageObj = null;
		},
		tabContextMenu: function(event) {
			headerTabMenu.show(this, event);
		},
		items: initTabitems
	});
	
	//头部tab导航栏右键菜单
	headerTabMenu = new iMenu.ContextMenu({items:[
		{id:"mc100", label:"关闭当前项", disabled:true, onclick:function(){headerTabNav.closeTab(this.id);}},
		{id:"mc101", label:"关闭其他项", onclick:function(){headerTabNav.closeOther(this.id);}},
//		{id:"mc102", label:"关闭所有", onclick:function(){headerTabNav.closeAll();$.cookie("NB_Opened_Tabs", null); opened_tabs=[];}}
		{id:"mc102", label:"关闭所有", onclick:function(){headerTabNav.closeAll();LocalStorage.removeItem("NB_Opened_Tabs_" + currentLoginUserId); opened_tabs=[];}}
	], width:130, rule:function(){
		var tab = this;
		if( tab.closable ){
			iMenu.enableMenu("mc100");
			iMenu.enableMenu("mc100");
			iMenu.enableMenu("mc102");
		}else{
			iMenu.disableMenu("mc100");
			iMenu.disableMenu("mc102");
		}
	}, onShow:function(){tabMenuMask.show();}, 
		onHide:function(){tabMenuMask.hide();}});
	
	var tabMenuMask = $('<div style="position:fixed;z-index:100;left:0;top:0;right:0;bottom:0;display:none;width:100%;height:100%;background-color:#fff;opacity:0; filter: alpha(opacity=0);"></div>');
	tabMenuMask.appendTo('body');
}

// 加载系统菜单
function loadSysMenu() {
	$.ajax({
		type : "GET",
		url : context_path + "/system/System!menu.action",
		success : function(menuHtml) {
			$("#menuBox").html(menuHtml);
		}
	});
}

// 强制重新加载已经打开的Tab页
var _ForceReload = false,
	_NewURL = false; // 临时记录每次open的url，如果和已经打开的URL不一致，则加载新的URL

function _openTab(_id, _label, _url, _cookie, showtb, _extURL){
	_ForceReload = true;
	// 将url中含有的'单引号转义为 %27，避免造成使用单引号传参的截断错误
	_url = _url.replace(/'/gi, '%27');
	_NewURL = _extURL ? _extURL : _url;
	_id = _id.replace(/[!|#|.]/gi, "_");
	
	headerTabNav.addTab({ id:_id, label:_label, title:_label,
		// add by clu on 2013-10-30 9:31:59 修复tab标签页的双击刷新按钮tab页被关闭的bug
		toolbar: (false == showtb ? '': '<a href="javascript:;" onclick="refreshTab(\''+_id+'\',\''+_url+'\');return false;" ondblclick="refreshTab(\''+_id+'\',\''+_url+'\'); stopPropagation(event); return false;" class="reload">&ensp;</a>'), 
		closable: true, 
		onclick: function(){ createTabPage(_id, _url);} 
	});
	
	if(_cookie){
		addTabToCookie(_id, _label, _extURL ? _extURL : _url);
	}
}

var _zIndex = 1, current_tabPage = null;
/**
 * 创建新打开的页面
 * @param _id 页面id
 * @param _url 页面要打开的URL
 */
function createTabPage( _id, _url ){
	_zIndex++;
	// 隐藏当前激活的tab页面
	if( current_tabPage != null && $id("tabPage_"+ current_tabPage) ){
		$("#tabPage_"+ current_tabPage).css("visibility", "hidden");
	}
	
	// 打开新的tab页面
	var _pageSeg = $id("tabPage_"+_id);
	if(!_pageSeg){
		_pageSeg = document.createElement("div");
		_pageSeg.id = "tabPage_"+ _id;
		_pageSeg.className = "page-segment";
		_pageSeg.style.zIndex = _zIndex;
		
		$("#frameBody").append(_pageSeg);
		_pageSeg.innerHTML = '<iframe src="about:blank" id="tabPageFrame'+ _id +'" change="false"  name="TabPageFrame_'+ _id +'" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>';
		_pageSeg = null;
		
		if( !isBlankURL.test(_url) ){
			$("#tabPageFrame"+_id).attr("src", parseURL(_url));
		}
	}else{
		_pageSeg.style.visibility = "visible";
		_pageSeg.style.zIndex = _zIndex;
		
		if(_ForceReload && _NewURL && _NewURL != _url && !isBlankURL.test(_NewURL)){
			$("#tabPageFrame"+_id).attr("src", parseURL(_NewURL));
		}
		
		//begin  切换任务时调用 add by zjsheng on 2013-09-17 10:20:39
		if( !isBlankURL.test(_url) && $("#tabPageFrame"+_id).attr("change") == "true" ){
			if ($(window.frames["tabPageFrame"+ _id]).contents().find("#caseFrame").length == 1 || $(window.frames["tabPageFrame"+ _id].document).contents().find("#caseFrame").length == 1){
				Dialog.confirm("是否切换到新任务?",function(){
					$("#tabPageFrame"+_id).attr("change","false");
					$("#tabPageFrame"+_id).attr("src", parseURL(_url));
				});
			}else{
				$("#tabPageFrame"+_id).attr("change","false");
			}
		}
		//end
		
	}
	
	current_tabPage = _id;
	_ForceReload = false;
	_NewURL = false;
}

/**
 * 生成要打开的URL(补全URL)
 * @param url 原始URL
 * @returns 补全后的URL
 */
function parseURL(url){
	if(url.indexOf("http://") == 0){
		return url;
	}
	if( url.indexOf(context_path) == 0 ){
		return url;
	}
	return context_path + url;
}
// 重新载入tab iframe地址
function refreshTab(id, url){
	var _url = url, fwin = null, func = null; 
	try {
		fwin = $id("tabPageFrame"+ id).contentWindow;
		_url = fwin.location.href;
		if (typeof _url == 'undefined') {
			throw {msg: 'Chrome下跨域时不抛异常，手动抛出'};
		}
		func = fwin["refreshPage"];
	} catch (e) {
		_url = url;
	}
	
	if(func && typeof func === 'function') {
		func.call(this);
		return;
	}
	
	if(!isBlankURL.test(_url)){
	  $("#tabPageFrame"+ id).attr("src", parseURL(_url));
	}
}

function getOpenedTabsFromCookie() {
	// 存储已经打开的tab项，在下一次登录后，自动打开这些tab项
	var opened_tabs = [],
		openedTabs = LocalStorage.getItem('NB_Opened_Tabs_' + currentLoginUserId); //$.cookie("NB_Opened_Tabs");
	
	if(openedTabs){
		openedTabs = eval("("+ unescape(openedTabs)+")");
		if(openedTabs.length > 0){
			for(var i = 0, len = openedTabs.length; i < len; ++i){
				var _itms = openedTabs[i];
				if( !isBlankURL.test(_itms.url) ){
					opened_tabs.push("{\"id\":\""+_itms.id+"\", \"label\":\""+_itms.label+"\", \"url\":\""+_itms.url+"\"}");
				}
			}
		}
		openedTabs = null;
	}
	
	return opened_tabs;
}

// 使用cookie记录用户打开的tab项
function addTabToCookie(_id, _label, _url){
	if( !isBlankURL.test(_url) ){
		// 查询是否已经存在，不存在则添加
		for( var i = opened_tabs.length - 1; i >= 0; --i ){
			var _tab = eval('('+ opened_tabs[i]+')');
			if( _tab.id == _id ){
				return;
			}
		} 
		
		opened_tabs.push("{\"id\":\""+_id+"\", \"label\":\""+_label+"\", \"url\":\""+_url+"\"}");
		//$.cookie("NB_Opened_Tabs", escape("[" + opened_tabs.join(",") + "]"), {expires:100, path: context_path});
		LocalStorage.setItem("NB_Opened_Tabs_" + currentLoginUserId, escape("[" + opened_tabs.join(",") + "]"));
	}
}

// 当关闭一个tab项，同时从cookie中删除
function delTabInCookie(_id){
	for( var i = 0, len = opened_tabs.length; i < len; ++i ){
		var tab = eval('('+opened_tabs[i]+')');
		if( _id == tab.id ){
			opened_tabs.splice(i, 1);
			break;
		}
	}
	//$.cookie("NB_Opened_Tabs", escape("[" + opened_tabs.join(",") + "]"), {expires:100, path: context_path});
	LocalStorage.setItem("NB_Opened_Tabs_" + currentLoginUserId, escape("[" + opened_tabs.join(",") + "]"));
}

// 对外开放的方法
/**
 * 在系统tab页中打开url
 * @param id tab页唯一的id
 * @param label tab页的标题
 * @param url 要打开的url
 * @param fromSysMenu 是否是从系统菜单中打开，如果是，需要记录相关的日志
 */
var openTab = openSysMenu = function (id, label, url, fromSysMenu){
	// edit by clu on 2013-11-7 15:03:52 添加对url是否为空的判断。由于现在支持了三级菜单，因此二级菜单的url可能为空，所以对于打开菜单方法需要加入对url是否为空的验证。
	if (typeof url == 'string' && url.length > 0) {
		// 从系统菜单打开
		if (fromSysMenu === true) {
			$.ajax({
				type: 'POST',
				data: {resourceName: id, label: label},
				url: context_path + "/system/System!writeUseMenuLogs.action"
			});
			// add by clu on 2013-11-27 14:42:54 如果是从系统菜单打开的，并且是外链，则需要加上ticket后缀
			var oldURL = url;
			url = getTicket(url);
			// add by clu on 2013-11-29 16:58:15 临时添加的用于单点E网搜而需要使用的警员号
			if (url != oldURL) {
				// 是单点的网站，要加policeNo
				if (currentUserPoliceNo) {
					url += "&policeid=" + currentUserPoliceNo;
				} else {
					Msg.show('请联系管理员设置您的警员号后再使用此功能', {type: "error", timeout: 2000});
					return;
				}
			}
		}
		_ForceReload = true;
		_openTab(id + (+new Date()), label, url, true, true);
		hideSysMenu();
	} else {
		console.log('The url to open is empty!!!');
	}
};

/**
 * 检测url是否为外链，如果是外链，则添加单点的ticket
 * @param url 需要检测的url
 * @returns 添加完单点ticket的url
 */
function getTicket(url) {
	// 如果是http://开头的URL，需要异步获取ticket，并作为参数附加到URL中
	if (url && url.indexOf("http://") == 0) {
		$.ajax({
			url: context_path + '/SSOAuth!getSSOAuthTicket.action',
			dataType: "text",
			type: "post",
			async: false, //同步
			success: function(ticket) {
				var index = url.indexOf("?");
				if (index >= 0) {
					var paramString = url.substring(index);
					if (paramString != null && paramString.indexOf("=") != -1) {
						// 有参数
						url += "&ticket=" + ticket;
					} else {
						// 默认没有参数，加上
						if (paramString.charAt(paramString.length - 1) == "?") {
							url += "ticket=" + ticket;
						} else {
							url += "?ticket=" + ticket;
						}
					}
				} else {
					// 默认没有参数，加上
					url += "?ticket=" + ticket;
				}
			},
			error: function() {
				console.log("Get ticket failed");
			}
		});
	}
	return url;
}

function showSysMenu() {
	$("#menuContainer").show();
}
function hideSysMenu() {
	$("#menuContainer").hide();
	// add by clu on 2013-10-18 10:26:19 系统菜单消失的时候，三级菜单也要消失
	if (hideFakeMenu) { hideFakeMenu();}
}
function toggleSysMenu() {
	$("#menuContainer").toggle();
	// add by clu on 2013-10-18 10:28:15 系统菜单消失的时候，三级菜单也要消失
	if (!$("#menuContainer").is(':visible') && hideFakeMenu) { hideFakeMenu(); }
}

/**
 * 初始化菜单，加载menu.vm的时候会调用
 */
function initMenu() {
	$(".menu-with-level3").mouseenter(function() {
		hideFakeMenu(); // 移动到别的有三级菜单的二级菜单，先隐藏之前的，由于移动太快造成两个二级菜单同时被选中的bug
		
		// 构建模拟的三级菜单，并显示
		var menuWithLevel3 = $(this);
		var realMenu = menuWithLevel3.find(".menu-level3-box");
		var fakeMenu = $("#fakeMenu");
		
		var fixedPosition = realMenu.offset(); // 默认就是实际菜单的坐标的位置
		var winHeight = $(window).height();
		var winWidth = $(window).width();
		var needHeight = realMenu.offset().top + realMenu.height();
		var needWidth = realMenu.offset().left + realMenu.width();
		if (needHeight > winHeight) {
			fixedPosition.top = winHeight - realMenu.height() - 5;
		}
		if (needWidth > winWidth) {
			fixedPosition.left = menuWithLevel3.offset().left - realMenu.width() - 2;
		}
		fakeMenu.html(realMenu.clone().html()).css(fixedPosition).width(realMenu.width()).height(realMenu.height()).show();
		
		// 给三级菜单所属的一级，二级加上hover样式，用于显示三级菜单所属的一级、二级菜单
		var menuItem = menuWithLevel3.parents(".menu-item");
		menuItem.addClass('menu-item-hover');
		menuWithLevel3.addClass("menu-with-level3-hover");
	});
	
	// 三级菜单的消失不由mouseleave触发，由其他的事件触发：比如移动到了别的二级菜单项，或者点击了空白的地方，系统菜单隐藏的时候也要
	// main.js中系统菜单隐藏的时候，也要调用
	// 移动到其他没有三级菜单的菜单项
	$(".menu-without-level3").mouseenter(function() {
		hideFakeMenu();
	});
	$(document).click(function() {
		hideFakeMenu();
	});
}

/**
 * 隐藏三级菜单，同时取消用于标记三级菜单隶属于的一级、二级菜单的hover样式
 */
function hideFakeMenu() {
	// 去除所有的附加的一级、二级hover样式
	$(".menu-item-hover").removeClass("menu-item-hover");
	$(".menu-with-level3-hover").removeClass("menu-with-level3-hover");
	$("#fakeMenu").hide();
}

function openUserProfile(){
	Dialog.open({ 
		title:"个人中心", 
		url: context_path+ "/auth/user/User!toPersonalCenter.action", 
		width:700, 
		height:540
	});
}

function openMsgCenter() {
	// $("#msgBadge").html('0');
	openTab("msg-center", "消息中心", context_path + "/message/message!getList.action?condition.pageState=unread");
}

// 定时消息轮询
function message(){
	$.ajax({
		type: "POST",
		url: context_path + "/message/message!getOneMessage.action",
		data: "time="+ new Date().getTime(),
		success: function(msg){
			if(!msg || msg == ""){
				return;
			} else {
				var obj = $.parseJSON(msg);
				$("#msgBadge").html(obj.count);
				/*$("#title").text(obj.message.msgtitle);
				$("#sendtime").text(obj.message.sendtime);
				$("#").text(obj.message.msgcontent);*/
			}
		}
	});
}

function logout(){
	Dialog.confirm("<h3>确定退出登录吗？</h3>选择退出后将清除自动登录记忆！", function(){
		window.location.href = context_path + "/SSO!logout.action" ;
	}, null, {title:"系统退出", yesLabel:"退出", noLabel:"取消"});
}

function closeHeaderTab(tabid) {
    headerTabNav.closeTab(tabid);
}

var resizeTimer = null;
function resizeLayout() {
	$("#frameBody").css("height", ($(window).height() - $("#header").outerHeight()));
	$("#menuContainer").css("height",  $(window).height());
}

/**
 * add by zjsheng 弹出打开选择任务的窗口
 */
function openCase(){
	Dialog.open({
		title : "选择任务",
		url : context_path + "/taskcenter/TaskCenterAction!getTaskList.action",
		width : 720,
		height : 410,
		closeEvent : function() {
			// 重写X关闭按钮事件
			Dialog.warning("请选择任务!");
		},
		onClosed: function() {
			// 弹窗被关闭时的事件句柄
			// Dialog.alert("XXXX");
		}
	});
}

/**
 * add by zjsheng 代理
 */
function init(){
     if(headerTabMenu == undefined){
	     // 初始化头部的Tab组件
	     initHeaderTabNav();
     }else{
        //切换任务调用
        // headerTabNav.closeAll();
        $("#frameBody iframe").each(function(){
            $(this).attr("change","true");
        });
        //刷新当前页面
        refreshTab(current_tabPage,$("#tabPageFrame"+current_tabPage).attr("src"));
        $("#tabPageFrame"+current_tabPage).attr("change","false");
     }   
    
}


$(function(){
	
	// 初始化页面布局
	resizeLayout();
	
	// add by zjsheng 检测是否需要弹出任务驱动的对话框
	$.post(context_path + "/taskcenter/TaskCenterAction!getTaskCenterFlag.action", {
		params : null
	}, function(data) {
		if (data == "1") {
			openCase(); // 需要选择默认任务时使用
		} else {
			init(); // 不需要选择默认任务时使用
		}
	});
	
	// 加载系统菜单
	loadSysMenu();
	
	// 消息轮询，1分钟一次
	message(); // 立即执行一次
	setInterval(message, ajaxUnreadMessageTimeout*1000);
	
	// 当页面发生resize时，实时调整页面布局
	$(window).resize(function(){
		if(resizeTimer){
			window.clearTimeout(resizeTimer);
		}
		resizeTimer = window.setTimeout(function(){
			resizeLayout();
			// add by clu on 2013-11-27 14:28:39 可能出出现未初始化的错误
			if (headerTabNav) {
				headerTabNav.resizePanel( $("#header_itab_nav").width() - 2 );
			}
		}, 100);
	});
});

