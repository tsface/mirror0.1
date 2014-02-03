var Desk = function(maxFenceIconNum){
	/*===== add by tchen =====*/
	//小工具每次切换的距离
	var toolWrapDis = 70;
	//小工具最大页数
	var maxToolIndex;
	$(document).ready(function(){
		$(".shortcutTray").height($(window).height() - 120);
		//$(".frames").height($(window).height() - 20);
		$(".toolChoose").css("top",$(".menuBar").height()+$(".menuBar").position().top-$(".toolChoose").height()-73+'px');
		//$(".frames .contentBd").height($(window).height() - 55);
		//$(".frames iframe").width($(window).width() - 55);
		$(".iframeWrap iframe").height($(window).height() - 77);
		if($("#container").height()<$(window).height()){
			$("#container").height($(window).height());
		}
		
		$(".window:eq(1)").offset({
			top : 0,
			left : $(window).width()
		}).css("visibility","visible");
		
		$(window).resize(function(){
			$(".shortcutTray").height($(window).height() - 120);
			$(".frames").height($(window).height() - 20);
			$(".frames .contentBd").height($(window).height() - 55);
			//$(".frames iframe").width($(window).width() - 55);
			$(".iframeWrap iframe").height($(window).height() - 77);
			if($("#container").height()<$(window).height()){
				$("#container").height($(window).height());
			}
			/**
			  * add by ynshen
			  */
			eachNum = parseInt($(".shortcutTray").height() / eachHeight,10);
			_adjustPosition();
		});
		//搜索框js
		$(".menuGroup li").click(function(e) {
			$(this).parents(".menuGroup").find(".ue-state-active").removeClass("ue-state-active");
			$(this).addClass("ue-state-active");
		});
		$(".zoom").live("mousedown",function(){
			$(this).addClass("active");
		});
		$(".zoom").live("mouseup",function(){
			$(this).removeClass("active");
		});
		$(".normalState").click(function(){
			$(".normalState").hide();
			$(".expandState").show();
		});
		$(".smallState").click(function(){
			$(".smallState").hide();
			$(".expandState").show();
		});
		$(".expandState .ico.leftArrow").click(function(){
			$(".expandState").hide();
			if($(".frames").hasClass("outsideWindow")){
				$(".normalState").show();
			}else{
				$(".smallState").show();
			}
		});
		//主菜单的展开收起js
		$(".toggleBar").click(function(){
			$(".menuBar").toggleClass("miniMenu");
			$(".shortcutTray").toggleClass("miniShortcut");
			$(this).find(".switchIco").toggleClass("left").toggleClass("right");
			$(".frames").toggleClass("miniFrame");
			$(".toolChoose").toggleClass("miniToolChoose");
			$(".historyCut").toggleClass("miniHistoryCut");
			/**
			  * 切换小工具
			  * add by ynshen
			  */				
			//控制样式
			$(".toolArea>.pageRight").removeClass("disable");
			$(".toolArea>.pageLeft").addClass("disable");
			
			//清空contentBd
			$(".toolArea .midPart .contentBd").remove();
			currentToolIndex = 0;
			if($(".menuBar").hasClass("miniMenu")){
				$(".normalState,.expandState").hide();
				$(".smallState").show();
				/**
				  * 切换小工具
				  * add by ynshen
				  */
				//设置每页的距离
				toolWrapDis = 70;
				//拼接contentBd
				/*$(".toolArea .midPart").append(_createToolMiniWrap(_toolArr));*/
			}else{
				$(".smallState,.expandState").hide();
				$(".normalState").show();
				
				/**
				  * 切换小工具
				  * add by ynshen
				  */
				toolWrapDis = 150;
				/*$(".toolArea .midPart").append(_createToolWrap(_toolArr));*/
			}
			
		});
		//桌面图标的激活样式
		$(".desk-icon,.fence-icon").live("click",function(){
			$(".desk-icon,.fence-icon").removeClass("ue-state-active");
			$(this).addClass("ue-state-active");
		});
		//菜单的点击事件
		$(".menuItem").click(function(){
			$(".menuItem").removeClass("ue-state-active");
			$(this).addClass("ue-state-active");
		});
		//弹出层头部操作按钮
		$(".toolArea .addIcon").click(function(){
			$(".toolChoose").show();
			$(".historyCut").hide();
			$(".historyLayout").hide();
		});
		$(".toolChoose .closeWindow").click(function(){
			$(".toolChoose").hide();
		});
		$(".title_icon").live("mousedown",function(){
			$(this).addClass("active");
		});
		$(".title_icon").live("mouseup",function(){
			$(this).removeClass("active");
		});
		$(".toolChoose .itemPanel").click(function(){
			$(this).find(".ico").toggle();
		});
		//桌面菜单和栅栏的双击事件
		$(".desk-icon,.fence-icon").live("dblclick",function(){
			$(".normalState,.expandState").hide();
			$(".menuBar").addClass("miniMenu");
			$(".shortcutTray").addClass("miniShortcut");
			$(".switchIco").removeClass("left").addClass("right");
			$(".toolChoose").addClass("miniToolChoose");
			$(".historyCut").addClass("miniHistoryCut").hide();
			$(".smallState").show();
			if($(this).children().children(".text").text()=="数据规约")
			{
				window.open(_getObjByModuleId($(this).attr("moduleId")).src);
			}else{
				$(".logo_bottom").before(_createWindow(_getObjByModuleId($(this).attr("moduleId")).src,$(this).children().children(".text").text(),$(this).attr("moduleId"),frameId++));
			}
			$(".frames").height($(window).height() - 20);
			$(".frames .contentBd").height($(window).height() - 55);
		});
		var mytime;
		$(".desk-icon,.fence-icon").hover(function(){
			$(".titleTip").find(".tipCenter").text($(this).find(".text").text());
			if($(this).hasClass("fence-icon")){
				$(".titleTip").css({"top":$(this).offset().top+80,"left":$(this).offset().left-$(".titleTip").width()+40});
			}else{
				$(".titleTip").css({"top":$(this).offset().top+80,"left":$(this).offset().left+50});
			}
			mytime=setTimeout(function(){$(".titleTip").show();},1000);
		},function(){$(".titleTip").hide(); clearTimeout(mytime);});
		//内页的js
		$(".frames .contentHd .closeWindow").click(function(){
			$(".frames").addClass("outsideWindow");
			$(".smallState,.expandState").hide();
			$(".normalState").show();
		});
		
		//历史页面的操作
		$(".historyEye").click(function(){
			//$(".toolChoose").hide();
			$(".historyCut").show();
			if($(".frames:visible").size() > 0){
				$(".historyLayout").show();	
			};
		});
		$(".pages .leftPage").click(function(){
			if($(".shortCutWrap .shortcut").first().css("left")!="-622px"){
				$(".shortcut").each(function() {
					$(this).animate({left:$(this).position().left + 622 + "px"});
				});
				$(".pages .rightPage").show();
			}else{
				$(".pages .leftPage").hide();
				$(".shortcut").each(function() {
					$(this).animate({left:$(this).position().left + 622 + "px"});
				});
			}
		});
		$(".pages .rightPage").click(function(){
			if($(".shortCutWrap .shortcut").last().css("left")!="622px"){
				$(".shortcut").each(function() {
					$(this).animate({left:$(this).position().left - 622 + "px"});
				});
				$(".pages .leftPage").show();
			}else{
				$(".pages .rightPage").hide();
				$(".shortcut").each(function() {
					$(this).animate({left:$(this).position().left - 622 + "px"});
				});
			}
		});
		$(".historyCut .closeWindow").click(function(){
			$(".historyCut").hide();
			$(".historyLayout").hide();
		});
	});
	// 禁用右键菜单
	document.oncontextmenu = function(){return false;};

	/*===== add by ynshen =====*/
	// 图标的高度
	var eachHeight = 116;
	// 图标的宽度
	var eachWidth = 116;
	
	var eachShortCutWidth = 185;
	var eachShortCutHeight = 120;
	var frameId = 0;
	var zindex = 10;
	// 最大序列号
	var maxSequence = -1;
	// 最大栏序列号
	var maxFenceSequence = 0;
	// 每一列的图标个数
	var eachNum;
	// 滑屏-当前屏index
	var currentIndex = 1;
	// 解决IE中，拖动停止时也会触发Drag中的stop事件
	var dropFlag = true;
	// 桌面序列数组
	var _iconArr;
	// 指向实例对象
	var obj;
	// 点击起始的index
	var startIndex;
	// 临时保存的序列号
	var tempSequence;
	// 图标可否栏中
	var deskFenceFlag = false;
	// 被拖动的图标
	var $dragDesk;
	// 栏ID号
	var fenceId;
	// 记录源 栏
	var $originalFence;
	// 图标是否可以拖拽的默认值
	var moveFlag = false;
	
	//var _toolArr;
	// 工具滑屏当前屏index;
	//var currentToolIndex = 0;
	//小工具最多屏数
	//var maxToolScreen = 3;
	
	$(document).ready(function(){
		
		/**
		 * 绑定桌面图标删除事件
		 */
		$(".desk-icon .iconClosetype1").live("click",function(){
			// 方式：1、重新调整各图标的序列号；2、删掉当前图标；3、最大序列减【1】；4、摆放图标
			_removeIcon($(this).parents(".desk-icon"));
			$(obj).trigger("onShortcutDelete",[$(this).parents(".desk-icon").attr("moduleId")]);
		});
		
		/**
		 * 绑定栏中图标 删除事件
		 */
		$(".fence-icon .iconClosetype1").live("click",function(){
			// 方式：1、重新调整各图标的序列号；2、删掉当前图标；3、栏中的图标最大序列减【1】。
			_adjustFenceIconSequence($(this).parents(".fence-icon"),true);
			var moduleId = $(this).parents(".fence-icon").attr("moduleId");
			$(obj).trigger("onFenceIconDelete",[moduleId]);
		});
		
		/**
		 * 绑定栏 删除事件
		 */
		$(".fence .deleteIcon").live("click",function(){
			// 先删除栏下所有的图标
			$(this).parents(".fence").remove();
			// 重新调整栏序号数组
			fenceSequenceArr = _ArrDeleteEle(fenceSequenceArr,$(this).parents(".fence").attr("fenceSequence"));
			// 重新定位
			_adjustFencePosition();
			$(obj).trigger("onFenceDelete",[$(this).parents(".fence").attr("fenceId")]);
		});
		
		/**
		 * 绑定栏 添加事件
		 */
		$(".fence .addIcon").live("click",addFence);
		
		/**
		 * 绑定栏 添加事件 （ 点击左侧导航栏中的分组图标 ）调用相同的addFence方法
		 */
		$(".menuItem .midPart").live("click",function(){
			if($(this).children(".fence").length > 0){
				addFence.call();
			}
		});
		
		/**
		 * 绑定 页面最小化 点击事件
		 */
		$(".midPart>.min").live("click",function(){
			var $currentFrame = $(this).parent().parent().parent(".frames");
			// 调用scale事件  先缩小到左侧导航栏的右边（眼睛处）
			$currentFrame.animate({
				// 设置缩放倍数
				width : "5%",
				height : "5%",
				// 设置焦点位置 眼睛右侧
				top : $(".menuBar").offset().top + $(".menuBar").height() - 70
			},500,
			function(){ // 缩放动画完成后执行的函数
				// 被缩小页面 标题栏高度减小
				$currentFrame.find(".contentBd").height($currentFrame.height() - 32);
				// 动画：滑动此frames至眼睛位置
				$currentFrame.animate({
					left: '50px'
				}, 200,
				function(){ // 滑动动画完成后执行的函数，眨眼
					$currentFrame.hide();
					_flashEye();
					_setshortcut($currentFrame);
					//$(".shortCutWrap .shortcut").eq(0).append(_createShortcut($currentFrame.attr("moduleId"),$currentFrame.children(".contentHd").children(".midPart").children(".title").text(),$currentFrame.attr("frameId")));
				});
			});
		});
		
		/**
		 * 左侧导航栏 绑定滑屏操作
		 */
		$(".switchPanel>div").bind("click", _switchScreen);
		
		/**
		 * 绑定小工具滑屏操作
		 */
		//$(".toolArea>.page").bind("click",_switchTool);
		
		/**
		 * 綁定桌面图标 鼠标按下事件
		 */
		$(".desk-icon").live("mousedown",function(event){
			// 解除默认操作
			event.preventDefault();
			// 设置图标可放入栏中
			deskFenceFlag = true;
			// 桌面图标的对象
			$dragDesk = $(this);
			// 记录拖拽的其实序列号值
			startIndex = parseInt($dragDesk.attr("sequence"),10);
			// 添加“drag”类，使拖拽的图标在页面的最顶层
			$dragDesk.addClass("drag");
			
			// 绑定第1个window 鼠标移动事件
			$(".window:eq(0)").bind("mousemove",function(event){
				event.preventDefault();
				moveFlag = true;
				// 将图标拖拽标志位 置为真
				if (moveFlag) {
					$dragDesk.offset({
						// 移动的时候会点在图标的中心位置
						left : event.clientX - eachWidth / 2,
						top : event.clientY - eachHeight / 2
					});
				};
				// 若图标移动到左侧的导航栏，或者上移到搜索栏,或者下移超过右下角图标的位置，则自动跳到对应的位置，以免发生越界冲突
				if($dragDesk.offset().left < $('.toggleBar').offset().left - 10 || $dragDesk.offset().top < $('.logoWrap').offset().top + 45 || $dragDesk.offset().top > $('.logo_bottom').offset().top - 10){
					$dragDesk.trigger("mouseup",[_getIconArr(false)]);
				}
				// 设置临时的图标序列号
				tempSequence = parseInt((event.clientX - eachWidth)/ eachWidth,10) * eachNum + parseInt((event.clientY - eachHeight / 2) / eachHeight,10);
				// 判断tempSequence是否超过列最大序列，如果是则将其设置为最大序列号
				tempSequence = tempSequence > maxSequence ? maxSequence : tempSequence;
			});
		});
		
		/**
		  * fence内图标释放事件
		  */
		$(".fence>.contentBd").live("mouseup",function(event){
			if(moveFlag){
				var $fence = $(this).parent(".fence");
				//$(".fence").unbind("mouseup");
				$(".window:eq(0)").unbind("mousemove");
				moveFlag = false;
				if(_fenceContain($fence,event.clientX,event.clientY)){
					var src = $dragDesk.children(".desk-icon-bd").children("img").attr("src");
					var moduleId = $dragDesk.attr("moduleId");
					//判断目标fence是否能容纳
					if($(this).children(".fence-icon").length < maxFenceIconNum){
						var tempMaxSequence = parseInt($fence.attr("maxSequence"),10) + 1;
						$(this).append(_createFenceIcon(tempMaxSequence,src,$dragDesk.children(".desk-icon-bd").children(".text").text(),moduleId));
						$fence.attr("maxSequence",tempMaxSequence);
						
						var targetFenceId = $fence.attr("fenceId");
						var targetFenceSequence = $fence.attr("fenceSequence");
						var targetFenceLabel = $fence.children(".contentHd").children("input").val();
						//移除拖拽的图标
						_adjustPosition();
						// 设置图标可放入栏中
						if(!deskFenceFlag){
							$dragDesk.remove();
						}else{
							_removeIcon($dragDesk);
						}
						$fence.children(".contentBd").children("i").hide();
						$(obj).trigger("onDragToFence",[moduleId,targetFenceId,targetFenceLabel,targetFenceSequence]);
					}else{ // 设置图标可放入栏中
						if(deskFenceFlag){
							//调整布局
							_adjustPosition();
						}else{
							$dragDesk.remove();
							var tempMaxSequence = parseInt($originalFence.attr("maxSequence"),10) + 1;	
							$originalFence.attr("maxSequence",tempMaxSequence);		
							$originalFence.children(".contentBd").append(_createFenceIcon(tempMaxSequence,src,$dragDesk.children(".desk-icon-bd").children(".text").text(),moduleId));
						}
					}
					_adjustFencePosition();
				}
			}
		});
		
		/**
		  * 桌面图标释放事件
		  */
		$(".desk-icon").live("mouseup",function(event){
			//console.log($(event.target).parent(".desk-icon-bd").parent(".desk-icon"));
			//console.log($dragDesk);
			$(".window:eq(0)").unbind("mousemove");
			//移除drag标签
			$dragDesk.removeClass("drag");
			if(moveFlag){
				//解除拖拽绑定
				moveFlag = false;
				// 设置图标可放入栏中
				if(deskFenceFlag){
					//调整sequence
					_adjustIconSequence(startIndex,tempSequence);
					//设置拖拽的图标为tempSequence
					$dragDesk.attr("sequence",tempSequence);
				}else{
					$dragDesk.attr("sequence",++maxSequence);
					var moduleId = $dragDesk.attr("moduleId");
					
					$(obj).trigger("onDropFromFence",[moduleId,fenceId]);
				}
				//调整设置新sequence后的位置
				_adjustPosition();

				$(obj).trigger("onChangeShortcutSequence",[_getIconArr(false)]);
				_adjustFencePosition();
			}
		});
		$(".frames").find(".goBack").live("click",function(){
			var childWindow = $(this).parent(".midPart").parent(".contentHd").parent(".frames").children(".contentBd").children(".midPart").children(".iframeClass")[0].contentWindow;
			//console.log(childWindow.history);
			//console.log(window.history);
			childWindow.history.back();
			//return false;
		});
		$(".frames").find(".refresh").live("click",function(){
			var iframeClass = $(this).parent(".midPart").parent(".contentHd").parent(".frames").children(".contentBd").children(".midPart").children(".iframeClass");
			var tempSrc = iframeClass.attr("src");
			iframeClass.attr("src", tempSrc);
			//childWindow = iframeClass[0].contentWindow
			//childWindow.location.reload();
		});
		
		/**
		  * fence图标点下事件
		  */
		$(".fence-icon").live("mousedown",function(event){
			//记录源Fence
			$originalFence = $(this).parents(".fence");
			//event.preventDefault();
			var $fenceIcon = $(this);
			var src = $fenceIcon.find("img").attr("src");
			var label = $fenceIcon.find(".text").text();
			var moduleId = $fenceIcon.attr("moduleId");
			//记录fenceId
			fenceId = $originalFence.attr("fenceId");
			
			//构造拖拽的图标块
			$dragDesk = _createDeskIcon(-1,src,label,moduleId);
			$dragDesk.hide();
			var countFlag = true;
			//绑定图标拖拽事件
			$(".window:eq(0)>.shortcutTray>.addItem").before($dragDesk);
			// 设置图标可放入栏中
			deskFenceFlag = false;
			
			$(".window:eq(0)").bind("mousemove",function(event){
				//event.preventDefault();
				moveFlag = true;
				//调整剩余的sequence
				_adjustFenceIconSequence($fenceIcon,countFlag);
				countFlag = false;
				$dragDesk.show();
				$desk = $dragDesk;
				//设置构造的图标块跟随鼠标
				$dragDesk.offset({
					left : event.clientX - eachWidth / 2,
					top : event.clientY - eachHeight / 2
				});
				return false;
			});
			return false;
		});
		/**
		  * 确保单击事件触发
		  */
		$(".fence-icon").live("mouseup",function(event){
			$(".window").unbind("mousemove");
		});
		/**
		  * 窗口关闭
		  */
		$(".midPart .closeWindow").live("click",function(){
			var $targetShortCut = getShortCutByFrameId($(this).parent('.midPart').parent('.contentHd').parent('.frames').attr("frameId"));
			if($targetShortCut){
				$targetShortCut.remove();
			}
			$(this).parent('.midPart').parent('.contentHd').parent('.frames').remove();
		});
		/**
		  * 右击菜单出现与关闭事件
		  */
		$(".shortcutTray").bind("mousedown",function(event){
			if(event.which == 1){
				$(".rightMenu").hide();
			}else if(event.which == 3){
				//超过宽度的标志
				var xFlag = event.clientX > ($(".shortcutTray").offset().left + $(".shortcutTray").width() - $(".rightMenu").width());
				//超过高度的标志
				var yFlag = event.clientY > ($(".shortcutTray").offset().top + $(".shortcutTray").height() - $(".rightMenu").height());
				if(xFlag && !yFlag){//超过高度
					$(".rightMenu").show().offset({
						left : event.clientX - $(".rightMenu").width(),
						top : event.clientY
					});
				}else if(!xFlag && yFlag){//超过宽度
					$(".rightMenu").show().offset({
						left : event.clientX,
						top : event.clientY - $(".rightMenu").height()
					});
				}else if(xFlag && yFlag){//既超过高度又超过宽度
					$(".rightMenu").show().offset({
						left : event.clientX - $(".rightMenu").width(),
						top : event.clientY - $(".rightMenu").height()
					});
				}else{
					$(".rightMenu").show().offset({
						left : event.clientX,
						top : event.clientY
					});
				}
			}
		});
		/**
		  * 当输入框获取焦点时触发
		  */
		/*$(".fence").children(".contentHd").children("input").focus(function(){
			var $fence = $(this);
			$(window).keydown(function(event){
				if(event.keyCode == 13){
					$fence.blur();					
				}
			});
		});*/
		$(".fence>.contentHd>input").live("focus",function(){
			$(this).addClass("focus");
		});
		/**
		  * 当输入框失去焦点时触发
		  */
		$(".fence>.contentHd>input").live("blur",function(){
			$(this).removeClass("focus");
			var $fence = $(this).parent(".contentHd").parent(".fence");
			var fenceId = $fence.attr("fenceId");
			
			$(obj).trigger("onEditFenceLabel",[fenceId,$(this).val()]);
		});
		/**
		  * 历史界面中的窗口还原操作
		  */
		$(".shortCutWrap li").live("click",function(){
			$(".historyCut").hide();
			$(".historyLayout").hide();
			
			var $targetFrame = getFramesByFrameId($(this).attr("frameId"));
			$targetFrame.height($(window).height() - 20).show();
			$targetFrame.css("width","").css("top","").css("left","").css("z-index",++zindex);
			$(".frames .contentBd").height($(window).height() - 55);
			//var $targetShortCut = getShortCutByFrameId($(this).attr("frameId"));
			//$targetShortCut.remove();
		});
	});
	/**
	 * 添加 栏 
	 * 方式：首先在栏序号数组中添加新序号
	 */
	function addFence(){
		var newFenceSequence;
		if(fenceSequenceArr.length > 0){
			newFenceSequence = parseInt(fenceSequenceArr[fenceSequenceArr.length - 1],10) + 1;
		}else{
			newFenceSequence = 0;
		}
		fenceSequenceArr.push(newFenceSequence);
		$(".window:eq(0)>.fenceGroup").append(_createFence(0xFF * Math.random(),newFenceSequence));
		_adjustFencePosition();
	}
	/**
	  * 判断指定点是否在某一个fence中
	  * @Param $fence_ 指定的fence
	  * @Param 指定点的x坐标
	  * @Param 指定点的y坐标
	  * @Return 如果存在返回true，否则false
	  */
	function _fenceContain($fence_,xpos_,ypos_){
		if((ypos_ > $fence_.offset().top) && (ypos_ < ($fence_.offset().top + $fence_.height())) && (xpos_ > $fence_.offset().left) && (xpos_ < ($fence_.offset().left + $fence_.width()))){
			return true;
		}else{
			return false;
		}
	}
	//··保存参数中的页面到眼睛处
	function _setshortcut($currentFrame_){
		var shortcutFlag = true;
		//··若其中已经包含了页面
		if($(".shortCutWrap>.shortcut").eq(0).children("li").length > 0){
			for(var i = 0;i < $(".shortCutWrap .shortcut").eq(0).children("li").length;i++){
				//··判断是否有相同的对象在其中
				if($(".shortCutWrap .shortcut").eq(0).children("li").eq(i).attr("frameId") == $currentFrame_.attr("frameId")){
					shortcutFlag = false;
				}
			}
		}
		if(shortcutFlag){
			$(".shortCutWrap .shortcut").eq(0).append(_createShortcut($currentFrame_.attr("moduleId"),$currentFrame_.children(".contentHd").children(".midPart").children(".title").text(),$currentFrame_.attr("frameId")));
			var $tempLi = $(".shortCutWrap .shortcut li");
			var tempLength = $(".shortCutWrap .shortcut li").length;
			var WIDTH_8 = 133;
			var HEIGHT_9 = 89;
			//··设置当数量大于7，和大于9的情况下，这些li的宽度和高度
			if(tempLength >=7 && tempLength < 9){
				$tempLi.width(WIDTH_8);
			}else if(tempLength >= 9){
				$tempLi.height(HEIGHT_9);
				$tempLi.width(WIDTH_8);
			}
		}
	}
	/**
	  * 眨眼方法
	  */
	function _flashEye(){
		//切换闭眼类
		$(".historyEye").addClass("closeEye");
		setTimeout(function(){//延迟150毫秒恢复张眼状态
			$(".historyEye").removeClass("closeEye");
		},150);
	}
	/**
	  * 移除一个图标（包括删除和进入fences两种情况）
	  * @Param $el 目标删除的桌面图标
	  */
	function _removeIcon($el){
		//调整sequence
		_adjustIconSequence(parseInt($el.attr("sequence"),10),maxSequence);
		//移除此桌面上的图标
		$el.remove();
		//最大序列减1
		maxSequence -= 1;
		//调整设置新sequence后的位置
		_adjustPosition();
	}
	/**
	  * 调整图标的位置（主要是根据桌面图标的序列号属性进行重新排序）
	  */
	function _adjustPosition(){
		if($(".desk-icon").length > 0){//有图标时
			$(".desk-icon").each(function(i){//循环所有的桌面图标
				//console.log("sequence:" + $(this).attr("sequence"))
				//console.log("i:" + i)
				//计算得到图标的top和left值
				var topIndex = parseInt($(this).attr("sequence") % eachNum,10);
				var leftIndex = parseInt($(this).attr("sequence") / eachNum,10);
				$(this).offset({//设置图标的top和left值（加上初始状态的左上角坐标）
					top : $(this).parent().offset().top + topIndex * eachHeight,
					left : $(this).parent().offset().left + leftIndex * eachWidth
				});
				//··如果此sequence为最大sequence（最后一个图标）
				if($(this).attr("sequence") == maxSequence){
					var addTopIndex;
					var addLeftIndex;
					//··若此图标已在列的末尾，则添加按钮的坐标left要加【1】
					if(topIndex + 1 >= eachNum){
						addTopIndex = 0;
						addLeftIndex = leftIndex + 1;
					}
					//··正常情况下是获取最后一个图标的列值left，高度值加【1】
					else{
						addTopIndex = topIndex + 1;
						addLeftIndex = leftIndex;
					}
					//设置添加按钮坐标
					$(".addItem").offset({
						top : $(this).parent().offset().top + addTopIndex * eachHeight + 16,
						left : $(this).parent().offset().left + addLeftIndex * eachWidth + 26
					});
				}
			});
		}else{//不存在图标时
			$(".addItem").offset({
				top : $(".shortcutTray").offset().top + 16,
				left : $(".shortcutTray").offset().left + 26
			});
		}
	}
	//··定位栏的位置
	function _adjustFencePosition(){
		//··高度
		var prevHeight = 0;
		//··列（自右向左）
		var row = 0;
		//··循环栏
		$(".window:eq(0)>.fenceGroup>.fence").each(function(i){
			var $targetFence = _getFenceBySequenceId(fenceSequenceArr[i]);
			//··判断是否超出高度
			if((prevHeight + $targetFence.height())> ($(window).height() - 120)){
				prevHeight = 0;
				row++;
				
			}
				$targetFence.css({
				right : (10 + row * 241),
				top : prevHeight
			});
			prevHeight += $targetFence.height() + 10;
		});
	}
	/**
	  * 调整图标的sequence（并未开始移动）
	  * @Param startIndex 被拖拽图标的Index
	  * @Param endIndex 目标图标的Index
	  */
	function _adjustIconSequence(startIndex,endIndex){
		//··被拖拽图标的序列号 > 目标图标的序列号（图标向前面移动）
		if(startIndex > endIndex){
			for(var i = startIndex - 1;i >= endIndex;i--){//循环此范围内所有的图标
				//··使目标图标后面的每一个图标（除去被拖拽图标）的序列号都加1
				//var tempSeq = parseInt(_getIconBySeq(i).attr("sequence"),10) + 1;
				_getIconBySeq(i).attr("sequence",i + 1);
			}
		}
		//··被拖拽图标的序列号 < 目标图标的序列号（图标向后面移动）
		else if(startIndex < endIndex){
			for(var i = startIndex;i <= endIndex;i++){//循环此范围内所有的图标
				//··使被拖拽图标后面的每一个图标（包括目标图标）的序列号都减1
				//var tempSeq = parseInt(_getIconBySeq(i).attr("sequence"),10) - 1;
				_getIconBySeq(i).attr("sequence",i - 1);
			}
		}else{
			return;
		}
	}
	/**
	  * Fence中的图标被拖拽走后，重新调整Fence中各个图标的sequence
	  * @Param $fenceIcon Fence中，被拖拽走的图标对象
	  * @Param countFlag_ 一般为true
	  */
	function _adjustFenceIconSequence($fenceIcon,countFlag_){
		if(countFlag_){
			//··栏的临时最大序列
			var tempMaxSequence = $fenceIcon.parents(".fence").attr("maxSequence");
			//··调整栏中被拖拽图标之后的图标的序列号
			for(var i = parseInt($fenceIcon.attr("sequence"),10) + 1;i <= tempMaxSequence;i++){
				//··根据序列号找到相应的图标对象
				var $tempFence = _getFenceIconBySeq(i,$fenceIcon.parents(".fence"));
				$tempFence.attr("sequence",$tempFence.attr("sequence") - 1);
			}
			//··栏的临时最大序列减【1】
			tempMaxSequence -= 1;
			$fenceIcon.parents(".fence").attr("maxSequence",tempMaxSequence);
			//··获取栏中图标的上一级
			var $sourceContent = $fenceIcon.parent(".contentBd");
			//移除fence中的图标
			$fenceIcon.remove();
			//··当栏中没有图标时，添加提示样式
			if(tempMaxSequence == 0){
				$sourceContent.children("i").show();
			}
		}
	}
	/**
	  * 划屏绑定方法
	  */
	function _switchScreen() {
		$(".switchPanel>div").removeClass("ue-state-active");
		$(this).addClass("ue-state-active");
		//解绑绑定事件
		$(".switchPanel>div").unbind("click", _switchScreen);
		//获取目标index值
		var targetIndex = $(this).index();
		
		if (targetIndex > currentIndex) {//点击当前屏的右侧屏
			for (var i = currentIndex; i <= targetIndex; i++) {//循环此范围内所有屏幕
				var source = i - currentIndex;
				var target = targetIndex - i;
				$(".window").eq(i).show();
				//设置其起始位置
				var tempTop = $(".window").eq(i).offset().top;
				$(".window").eq(i).offset({
					top : tempTop,
					left : target * $(window).width()
				});
				//滑动至目标位置
				$(".window").eq(i).animate({
					left : source * $(window).width()
				}, 500);
			}
			setTimeout(function(){$(".switchPanel>div").bind("click", _switchScreen);},500);
			//设置当前index
			currentIndex = targetIndex;
		} else if (targetIndex < currentIndex) {//点击当前屏的左侧屏
			//··循环两个屏，屏全部显示，只是left值为0或不为0
			for (var i = currentIndex; i >= targetIndex; i--) {//循环此范围内所有屏幕
				var source = i - currentIndex;
				var target = i - targetIndex;
				$(".window").eq(i).show();
				//设置其起始位置
				var tempTop = $(".window").eq(i).offset().top;
				$(".window").eq(i).offset({
					top : tempTop,
					left : target * $(window).width()
				});
				//滑动至目标位置
				$(".window").eq(i).animate({
					left : - source * $(window).width()
				}, 500);
			}
			setTimeout(function(){$(".switchPanel>div").bind("click", _switchScreen);},500);
			//设置当前index
			currentIndex = targetIndex;
		} else {
			$(".switchPanel>div").bind("click", _switchScreen);
		}
	}
	/**
	  * 小工具划屏方法
	  */
	function _switchTool(event){
		if(!$(this).hasClass("disable")){
			if($(event.target).index() == 0){
				currentToolIndex--;
			}else if($(event.target).index() == 1){
				currentToolIndex++;
			}
			//解绑绑定事件
			$(".toolArea>.page").unbind("click", _switchTool);
			$(".toolArea .midPart .contentBd div").each(function(i){
				var originLeft = $(this).offset().left;
				$(this).animate({
					left : toolWrapDis * (i - currentToolIndex)
				}, 500);
			});
			setTimeout(function(){$(".toolArea>.page").bind("click", _switchTool);},500);
			if(currentToolIndex == 0){
				$(".toolArea>.pageLeft").addClass("disable");
			}else{
				$(".toolArea>.pageLeft").removeClass("disable");
			}
			if(currentToolIndex == maxToolIndex){
				$(".toolArea>.pageRight").addClass("disable");
			}else{
				$(".toolArea>.pageRight").removeClass("disable");
			}
		}
	}
	/**
	  * 生成Fence图标
	  * @Param sequence_ 序列值
	  * @Param imgSrc_ 图标路径
	  * @Param label_ 标签值
	  * @Param moduleId_ 模块Id
	  * @Return 拼接好的Fence图标对象
	  */
	function _createFenceIcon(sequence_,imgSrc_,label_,moduleId_){
		var fenceIcon = '<a class="fence-icon" sequence="' + sequence_ + '" moduleid="' + moduleId_ + '">'+
			'<span class="ue-state-default">'+
				'<span class="icon iconClosetype1"></span>'+
			'</span>'+
			'<div class="fence-icon-hd"></div>'+
			'<div class="fence-icon-bd">'+
				'<img src="' + imgSrc_ + '" width="48" height="48">'+
				'<div class="text">' + label_ + '</div>'+
			'</div>'+
			'<div class="fence-icon-ft"></div>'+
		'</a>';
		return $(fenceIcon);
	}
	/**
	  * 生成桌面图标
	  * @Param sequence_ 序列值
	  * @Param imgSrc_ 图标路径
	  * @Param label_ 标签值
	  * @Param moduleId_ 模块Id
	  * @Return 拼接好的桌面图标对象
	  */
	function _createDeskIcon(sequence_,imgSrc_,label_,moduleId_){
		var deskIcon = '<div class="desk-icon" sequence="' + sequence_ + '" moduleid="' + moduleId_ + '" style="top: 0px; left: 0px; ">'+
			'<span class="ue-state-default">'+
				'<span class="icon iconClosetype1"></span>'+
			'</span>'+
			'<div class="desk-icon-hd"></div>'+
			'<div class="desk-icon-bd">'+
				'<img src="' + imgSrc_ + '" width="64" height="64">'+
				'<div class="text">' + label_ + '</div>'+
			'</div>'+
			'<div class="desk-icon-ft"></div>'+
		'</div>';
		return $(deskIcon);
	}
	/**
	  * 生成窗体
	  * @Return 拼接好的窗体对象
	  */
	function _createWindow(iframeSrc_,title_,moduleId_,frameId_){
		var frames = '<div class="frames miniFrame" moduleId="' + moduleId_ + '" frameId="' + frameId_ + '" style="z-index:' + (++zindex) + '">'+
			'<div class="contentHd">'+
				'<div class="leftCorner"></div>'+
				'<div class="midPart">'+
					/*'<a class="title_icon goBack" href="javascript:;"></a>'+*/
					'<a class="title_icon refresh" href="javascript:;"></a>'+
					'<div class="title">' + title_ + '</div>'+
					'<a class="title_icon min" href="javascript:;"></a>'+
					'<a class="title_icon closeWindow" href="javascript:;"></a>'+
				'</div>'+
				'<div class="rightCorner"></div>'+
			'</div>'+
			'<div class="contentBd">'+
				'<div class="leftCorner"></div>'+
				'<div class="midPart">'+
					'<iframe class="iframeClass" frameborder="0" width="100%" height="100%" src="' + iframeSrc_ + '"></iframe>'+
					'<div class="iframeWrap">'+
					'</div>'+
				'</div>'+
				'<div class="rightCorner"></div>'+
			'</div>'+
			'<div class="contentFt">'+
				'<div class="leftCorner"></div>'+
				'<div class="midPart"></div>'+
				'<div class="rightCorner"></div>'+
			'</div>'+
		'</div>';
		return $(frames);
	}
	/**
	  * 创建fence
	  */
	function _createFence(fenceId_,fenceSequence_){
		var fence = '<div class="fence ue-clear" maxSequence="0" fenceId=' + fenceId_ + ' fenceSequence=' + fenceSequence_ + '>'+
			'<div class="contentHd">'+
				'<input type="text" value="新栅栏">'+
				'<span class="opGroup">'+
					'<a href="javascript:;" class="icon iconPlus addIcon"></a>'+
					'<a href="javascript:;" class="icon iconClosetype2 deleteIcon"></a>'+
				'</span>'+
			'</div>'+
			'<div class="contentBd">'+       
				'<i>请添加相关内容</i>'+
			'</div>'+
			'<div class="contentFt"></div>'+
		'</div>';
		return $(fence);
	}
	/**
	  * 生成小工具列表
	  * @Param toolArray_ 小工具数组
	  */
	/*function _createToolWrap(toolArray_){
		var toolWrapNum = parseInt(toolArray_.length / 6,10);
		var $contentBd = $('<div class="contentBd"></div>');
		for(var i = 0;i < toolWrapNum;i++){
			var $toolWrap = $('<div class="toolWrap" style="left:' + i * 150 + 'px;"></div>');
			for(var j = 0;j < 6;j++){
				var $item = $('<a class="item ue-state-default">'+
					'<span class="toolIcon ' + toolArray_[i * 6 + j].icon + '"></span>'+
					'<span class="textHide">' + toolArray_[i * 6 + j].label + '</span>'+
				'</a>');
				$toolWrap.append($item);
			}
			$contentBd.append($toolWrap);
		}
		if(toolArray_.length - toolWrapNum * 6 > 0){
			var $toolWrap = $('<div class="toolWrap" style="left:' + toolWrapNum * 150 + 'px;"></div>');
			for(var j = 0;j < toolArray_.length - toolWrapNum * 6;j++){
				var $item = $('<a class="item ue-state-default">'+
					'<span class="toolIcon ' + toolArray_[toolWrapNum * 6 + j].icon + '"></span>'+
					'<span class="textHide">' + toolArray_[toolWrapNum * 6 + j].label + '</span>'+
				'</a>');
				$toolWrap.append($item);
			}
			$contentBd.append($toolWrap);
		}
		maxToolIndex = toolWrapNum;
		return $contentBd;
	}*/
	/**
	  * 生成mini小工具列表
	  * @Param toolArray_ 小工具数组
	  */
	/*function _createToolMiniWrap(toolArray_){
		var toolMiniWrapNum = parseInt(toolArray_.length / 3,10);
		var $contentBd = $('<div class="contentBd"></div>');
		for(var i = 0;i < toolMiniWrapNum;i++){
			var $toolMiniWrap = $('<div class="toolMiniWrap" style="left:' + i * 70 + 'px;"></div>');
			for(var j = 0;j < 3;j++){
				var $item = $('<a class="item ue-state-default">'+
					'<span class="toolIcon ' + toolArray_[i * 3 + j].icon + '"></span>'+
					'<span class="textHide">' + toolArray_[i * 3 + j].label + '</span>'+
				'</a>');
				$toolMiniWrap.append($item);
			}
			$contentBd.append($toolMiniWrap);
		}
		if(toolArray_.length - toolMiniWrapNum * 3 > 0){
			var $toolMiniWrap = $('<div class="toolMiniWrap" style="left:' + toolMiniWrapNum * 70 + 'px;"></div>');
			for(var j = 0;j < toolArray_.length - toolMiniWrapNum * 3;j++){
				var $item = $('<a class="item ue-state-default">'+
					'<span class="toolIcon ' + toolArray_[toolMiniWrapNum * 3 + j].icon + '"></span>'+
					'<span class="textHide">' + toolArray_[toolMiniWrapNum * 3 + j].label + '</span>'+
				'</a>');
				$toolMiniWrap.append($item);
			}
			$contentBd.append($toolMiniWrap);
		}	
		maxToolIndex = toolMiniWrapNum;
		return $contentBd;
	}*/
	function _createShortcut(moduleId_,frameTitle_,frameId_){
		var shortcut = '<li moduleid=' + moduleId_ + ' frameId="' + frameId_ + '">'+
			'<div class="imgWrap">'+
				'<img src="../img/history/img.gif">'+
			'</div>'+
			'<div class="title">'+
				'<span class="ico global"></span>'+
				'<span class="text">' + frameTitle_ + '</span>'+
			'</div>'+
		'</li>';
		return shortcut;
	}
	/**
	  * 根据sequence获取dom节点
	  * @Param seq_ 需要的sequence值
	  * @Return 该seq对应的dom节点
	  */
	function _getIconBySeq(seq_){
		var tempDom;
		//循环所有的ui-draggable
		$(".shortcutTray .desk-icon").each(function(){
			if(parseInt($(this).attr("sequence"),10) == seq_){//当dom的sequence值等于目标seq时
				//指向该dom并返回
				tempDom = $(this);
				return;
			}
		});
		return tempDom;
	}
	/**
	  * 根据sequence获取指定Fence中的Fence图标对象
	  * @Param seq_ 需要的sequence值
	  * @Param $fence_ 目标Fence
	  * @Return 指定的Fence图标
	  */
	function _getFenceIconBySeq(seq_,$fence_){
		var target;
		$fence_.find(".fence-icon").each(function(){
			if(parseInt($(this).attr("sequence"),10) == seq_){
				target = $(this);
			}
		});
		return target;
	}
	/**
	  * 返回当前状态下的图标序列
	  */
	function _getIconArr(flag){
		var iconArr = new Array();
		//循环生成桌面图标数组
		$(".window:eq(0)>.shortcutTray>.desk-icon:visible").each(function(i){
			var $desk = _getIconBySeq(i);
			var icon = '{"label" :"' + 
				$desk.find(".text").text() + 
				'","icon" : "' + 
				$desk.find("img").attr("src") + 
				'","moduleId" : "' + 
				$desk.attr("moduleId") + 
				'","fenceId" : 0' + 
				',"fenceSecquence" : 0}';
			iconArr.push(icon);
		});
		if(flag){
			//循环生成Fence图标数组
			$(".window:eq(0)>.fenceGroup").each(function(){
				var fenceGroup = $(this).index();
				$(this).find(".fence:visible").each(function(){
					var fence = $(this);
					var fenceSecquence = $(this).index() + 1 + fenceGroup * 2;
					$(this).find(".fence-icon:visible").each(function(){
						var icon = '{"label" :"' + 
							$(this).find(".text").text() + 
							'","icon" : "' + 
							$(this).find("img").attr("src") + 
							'","moduleId" : "' + 
							$(this).attr("moduleId") + 
							'","fenceId" : "' + 
							$(fence).attr("fenceId") + 
							'","fenceLabel" : "' + 
							$(fence).children(".contentHd").children("input").val() + 
							'","fenceSecquence" : ' +
							fenceSecquence + '}';
						iconArr.push(icon);
					});
				});
			});
		}
		return iconArr;
	}
	function getFramesByFrameId(frameId_){
		var targetFrame;
		$(".frames").each(function(){
			if($(this).attr("frameId") == frameId_){
				targetFrame = $(this);
			}
		});
		return targetFrame;
	}
	function getShortCutByFrameId(frameId_){
		var targetShortCut;
		 $(".shortCutWrap .shortcut li").each(function(){
			if($(this).attr("frameId") == frameId_){
				targetShortCut = $(this);
			}
		 });
		 return targetShortCut;
	}
	/**
	  * 根据moduleId获取obj
	  */
	function _getObjByModuleId(moduleId_){
		var targetObj;
		for(var i = 0;i < _iconArr.length;i++){
			if(_iconArr[i].moduleId == moduleId_){
				targetObj = _iconArr[i];
			}
		}
		return targetObj;
	}
	function _getFenceByFenceId(fenceId_){
		var $targetFence;
		$(".window:eq(0)>.fenceGroup>.fence").each(function(){
			if($(this).attr("fenceId") == fenceId_){
				$targetFence = $(this);
			}
		});
		return $targetFence;
	}
	//··根据栏的序列号（栏数组）获取栏对象
	function _getFenceBySequenceId(sequenceId_){
		var $targetFence;
		$(".window:eq(0)>.fenceGroup>.fence").each(function(){
			if($(this).attr("fenceSequence") == sequenceId_){
				$targetFence = $(this);
			}
		});
		
		return $targetFence;
	}
	var fenceSequenceArr = new Array;
	/**
	  * 初始化桌面
	  */
	function _initDesk(iconArr_){
		//计算得到每一列的个数
		eachNum = parseInt($(".shortcutTray").height() / eachHeight,10);
		//暂存桌面序列
		_iconArr = iconArr_;
		//生成桌面图标
		for(var i = 0;i < iconArr_.length;i++){
			//初始化桌面图标
			if(iconArr_[i].fenceId == 0){
				//最大序列赋值
				$(".window").eq(0).find(".shortcutTray .addItem").before(_createDeskIcon(++maxSequence,iconArr_[i].icon,iconArr_[i].label,iconArr_[i].moduleId));
			}else{//初始化Fence与Fence图标
				if(!_getFenceByFenceId(iconArr_[i].fenceId)){//如果不存在此fence
					$(".window:eq(0)>.fenceGroup").append(_createFence(iconArr_[i].fenceId,++maxFenceSequence));
				}
				var $fence = _getFenceByFenceId(iconArr_[i].fenceId);
				$fence.attr("fenceSequence",iconArr_[i].fenceSequence);
				//设置Fence的maxSequence
				var tempMaxSequence = parseInt($fence.attr("maxSequence"),10) + 1;
				$fence.attr("maxSequence",tempMaxSequence).attr("fenceId",iconArr_[i].fenceId).show();
				$fence.children(".contentHd").children("input").val(iconArr_[i].fenceLabel);
				//构建fence的图标内容
				$fence.children(".contentBd").append(_createFenceIcon(tempMaxSequence,iconArr_[i].icon,iconArr_[i].label,iconArr_[i].moduleId));
				$fence.children(".contentBd").children("i").hide();
				if(!_ArrContainEle(fenceSequenceArr,iconArr_[i].fenceSequence)){
					fenceSequenceArr.push(iconArr_[i].fenceSequence);
				}
				fenceSequenceArr.sort();
			};
		};
		_adjustPosition();
		_adjustFencePosition();
		$(obj).trigger("onDeskLoad");
	}
	/*function _initTool(toolArr_){
		$(".toolArea .midPart").append(_createToolMiniWrap(toolArr_));
	}*/
	function _ArrContainEle(targetArr,element){
		for(var i = 0;i < targetArr.length;i++){
			if(targetArr[i] == element){
				return true;
			}
		}
		return false;
	}
	//··根据栏序号返回栏对象（从栏数组中）   若此方法只使用一次，可归结到调用函数中
		function _ArrDeleteEle(targetArr,element){
		var tempArr = new Array();
		for(var i = 0;i < targetArr.length;i++){
			if(targetArr[i] != element){
				tempArr.push(targetArr[i]);
			}
		}
		return tempArr;
	}
	/**
	  * 对外接口
	  */
	return {
		initDesk : function(iconArr_){
			//设置好指向示例的对象
			obj = this;
			_initDesk(iconArr_);
		},
		/*initTool : function(toolArr_){
			_toolArr = toolArr_
			_initTool(toolArr_);
		},*/
		getIconArr : function(){
			return _getIconArr();
		},
		openWindow : function(iframeSrc_,title_,moduleId_){
			$(".normalState,.expandState").hide();
			$(".menuBar").addClass("miniMenu");
			$(".shortcutTray").addClass("miniShortcut");
			$(".switchIco").removeClass("left").addClass("right");
			$(".toolChoose").addClass("miniToolChoose");
			$(".historyCut").addClass("miniHistoryCut").hide();
			$(".smallState").show();
			
			$(".logo_bottom").before(_createWindow(iframeSrc_,title_,moduleId_,frameId++));
			$(".frames").height($(window).height() - 20);
			$(".frames .contentBd").height($(window).height() - 55);
		},
		addDeskIcons : function(deskIconArr){
			for(var i = 0;i < deskIconArr.length;i++){
				_iconArr.push(deskIconArr[i]);
				$(".window").eq(0).find(".shortcutTray .addItem").before(_createDeskIcon(++maxSequence,deskIconArr[i].icon,deskIconArr[i].label,deskIconArr[i].moduleId));
			}
			_adjustPosition();
		},
		addDeskIcon : function(deskIcon){
			_iconArr.push(deskIcon);
			$(".window").eq(0).find(".shortcutTray .addItem").before(_createDeskIcon(++maxSequence,deskIcon.icon,deskIcon.label,deskIcon.moduleId));
			_adjustPosition();
		}
	};
};
