/* ******************* */
/* Constructor & Init  */
/* ******************* */
var SWFUpload;

(function($){
 
	if (SWFUpload == undefined) {
		SWFUpload = function (set) {
			this.initSWFUpload(set);
		};
	}
	
	/* *************** */
	/* Static Members  */
	/* *************** */
	SWFUpload.instances = {};
	SWFUpload.queue = {};
	SWFUpload.movieCount = 0;
	SWFUpload.version = "2.5.0 2010-01-15 Beta 2";
	SWFUpload.QUEUE_ERROR = {
		QUEUE_LIMIT_EXCEEDED            : -100,
		FILE_EXCEEDS_SIZE_LIMIT         : -110,
		ZERO_BYTE_FILE                  : -120,
		INVALID_FILETYPE                : -130
	};
	SWFUpload.UPLOAD_ERROR = {
		HTTP_ERROR                      : -200,
		MISSING_UPLOAD_URL              : -210,
		IO_ERROR                        : -220,
		SECURITY_ERROR                  : -230,
		UPLOAD_LIMIT_EXCEEDED           : -240,
		UPLOAD_FAILED                   : -250,
		SPECIFIED_FILE_ID_NOT_FOUND     : -260,
		FILE_VALIDATION_FAILED          : -270,
		FILE_CANCELLED                  : -280,
		UPLOAD_STOPPED                  : -290,
		RESIZE                          : -300
	};
	SWFUpload.FILE_STATUS = {
		QUEUED       : -1,
		IN_PROGRESS  : -2,
		ERROR        : -3,
		COMPLETE     : -4,
		CANCELLED    : -5
	};
	SWFUpload.UPLOAD_TYPE = {
		NORMAL       : -1,
		RESIZED      : -2
	};
	
	SWFUpload.BUTTON_ACTION = {
		SELECT_FILE             : -100,
		SELECT_FILES            : -110,
		START_UPLOAD            : -120,
		JAVASCRIPT              : -130,	// DEPRECATED
		NONE                    : -130
	};
	SWFUpload.CURSOR = {
		ARROW : -1,
		HAND  : -2
	};
	SWFUpload.WINDOW_MODE = {
		WINDOW       : "window",
		TRANSPARENT  : "transparent",
		OPAQUE       : "opaque"
	};
	
	SWFUpload.RESIZE_ENCODING = {
		JPEG  : -1,
		PNG   : -2
	};
	
	SWFUpload.prototype = {
	    // Private: init swfupload
	    initSWFUpload: function (userSettings) {
			try{
				this.customSettings = {};	// A container where developers can place their own settings associated with this instance.
				this.set = {};
				this.queueSettings = {};
				this.eventQueue = [];
				this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
				this.movieElement = null;
		
				// Setup global control tracking
				SWFUpload.instances[this.movieName] = this;
		
				// Load the set.  Load the Flash movie.
				this.initSettings(userSettings);
				this.loadFlash();
		
			} catch (ex) {
				delete SWFUpload.instances[this.movieName];
				throw ex;
			}
		},
		
	    /* ******************** */
		/* Instance Members  */
		/* ******************** */
		
	    // Private: initSettings ensures that all the
		// set are set, getting a default value if one was not assigned.
	    initSettings: function (userSettings) {
	    
	        this.set = userSettings;
	        
			this.queueSettings = {
			    queue_cancelled_flag: false,
			    queue_upload_count: 0,
			    user_upload_complete: this.set.upload_complete,
			    user_upload_start: this.set.upload_start
			};
			
			this.set = $.extend(this.set, {
	            // Event Handlers
	            return_upload_start: this.returnUploadStart,
	            swfupload_loaded: null,
	            
				upload_complete: SWFUpload.queue.uploadCompleteHandler,
				upload_start: SWFUpload.queue.uploadStartHandler,
				
				queue_complete: userSettings.queue_complete || null,
				
				flash_url: this.set.flash_url + "?preventswfcaching=" + new Date().getTime()
	        });
					
			delete this.ensureDefault;
		},
		
		// Private: loadFlash replaces the button_placeholder element with the flash movie.
		loadFlash: function () {
			var target, flash;
		
			// Make sure an element with the ID we are going to use doesn't already exist
			if ($("#" + this.movieName).size() > 0) {
				this.queueEvent("swfupload_load_failed", ["Element ID already in use"]);
				return;
			}
		
			// Get the element where we will be placing the flash movie
			target = $("#" + this.set.btn_ph_id);
			if (target.size() <= 0) {
				this.queueEvent("swfupload_load_failed", ["button place holder not found"]);
				return;
			}
		
			flash = $(this.getFlashHTML());
			target.replaceWith(flash);
		
		    this.movieElement = flash[0];
			// Fix IE Flash/Form bug
			if (window[this.movieName] == undefined) {
				window[this.movieName] = this.getMovieElement();
			}
		},
		
		// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
		getFlashHTML: function (flashVersion) {
			// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
			return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.set.flash_url, '" width="', this.set.btn_width, '" height="', this.set.btn_height, '" class="swfupload">',
						'<param name="wmode" value="', SWFUpload.WINDOW_MODE.OPAQUE, '" />',
						'<param name="movie" value="', this.set.flash_url, '" />',
						'<param name="quality" value="high" />',
						'<param name="allowScriptAccess" value="always" />',
						'<param name="flashvars" value="' + this.getFlashVars() + '" />',
						'</object>'].join("");
		},
		
		// Private: getFlashVars builds the parameter string that will be passed
		// to flash in the flashvars param.
		getFlashVars: function () {
			// Build a string from the post param object
			var httpSuccessString, paramString;
			
			paramString = this.buildParamString();
			
			// Build the parameter string
			return ["movieName=", encodeURIComponent(this.movieName),
					"&amp;uploadURL=", encodeURIComponent(this.set.upload_url),
					"&amp;useQueryString=", encodeURIComponent(true),
					"&amp;requeueOnError=", encodeURIComponent(false),
					"&amp;httpSuccess=", encodeURIComponent(""),
					"&amp;assumeSuccessTimeout=", encodeURIComponent(0),
					"&amp;params=", encodeURIComponent(paramString),
					"&amp;filePostName=", encodeURIComponent("Filedata"),
					"&amp;fileTypes=", encodeURIComponent(this.set.file_types),
					"&amp;fileTypesDescription=", encodeURIComponent(this.set.ftd),
					"&amp;fileSizeLimit=", encodeURIComponent(this.set.file_size_limit),
					"&amp;fileUploadLimit=", encodeURIComponent(this.set.file_upload_limit),
					"&amp;fileQueueLimit=", encodeURIComponent(0),
					"&amp;buttonImageURL=", encodeURIComponent(this.set.btn_image_url),
					"&amp;buttonWidth=", encodeURIComponent(this.set.btn_width),
					"&amp;buttonHeight=", encodeURIComponent(this.set.btn_height),
					"&amp;buttonText=", encodeURIComponent(this.set.btn_text),
					"&amp;buttonTextTopPadding=", encodeURIComponent(this.set.btn_text_top_padding),
					"&amp;buttonTextLeftPadding=", encodeURIComponent(this.set.btn_text_left_padding),
					"&amp;buttonTextStyle=", encodeURIComponent(this.set.btn_text_style),
					"&amp;buttonAction=", encodeURIComponent(SWFUpload.BUTTON_ACTION.SELECT_FILES),
					"&amp;buttonDisabled=", encodeURIComponent(false),
					"&amp;buttonCursor=", encodeURIComponent(SWFUpload.CURSOR.ARROW)
				].join("");
		},
		
		// Public: get retrieves the DOM reference to the Flash element added by SWFUpload
		// The element is cached after the first lookup
		getMovieElement: function () {
			if (this.movieElement == undefined) {
				this.movieElement = document.getElementById(this.movieName);
			}
		
			if (this.movieElement === null) {
				throw "Could not find Flash element";
			}
			
			return this.movieElement;
		},
		
		// Private: buildParamString takes the name/value pairs in the post_params setting object
		// and joins them up in to a string formatted "name=value&amp;name=value"
		buildParamString: function () {
			var name, postParams, paramStringPairs = [];
			
			postParams = this.set.post_params; 
		
			if (typeof(postParams) === "object") {
				for (name in postParams) {
					if (postParams.hasOwnProperty(name)) {
						paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
					}
				}
			}
		
			return paramStringPairs.join("&amp;");
		},
		
		// Private: callFlash handles function calls made to the Flash element.
		// Calls are made with a setTimeout for some functions to work around
		// bugs in the ExternalInterface library.
		callFlash: function (functionName, argumentArray) {
			var movieElement, returnValue, returnString;
			
			argumentArray = argumentArray || [];
			movieElement = this.getMovieElement();
		
			// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
			try {
				if (movieElement != undefined) {
					returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
					returnValue = eval(returnString);
				}
			} catch (ex) {
			}
			
			// Unescape file post param values
			if (returnValue != undefined && typeof returnValue.post === "object") {
				returnValue = this.unescapeFilePostParams(returnValue);
			}
		
			return returnValue;
		},
		
		/* *****************************
			-- Flash control methods --
			Your UI should use these
			to operate SWFUpload
		   ***************************** */
		
		// Public: startUpload starts uploading the first file in the queue unless
		// the optional parameter 'fileID' specifies the ID 
		startUpload: function (fileID) {
			this.queueSettings.queue_cancelled_flag = false;
			this.callFlash("StartUpload", [fileID]);
		},
		
		// Public: cancel upload all files in the queue
		cancelQueue: function () {
			this.queueSettings.queue_cancelled_flag = true;
			this.stopUpload();
				
			var stats = this.getStats();
			while (stats.files_queued > 0) {
				this.cancelUpload();
				stats = this.getStats();
			}
		},
		
		// Public: cancelUpload cancels any queued file.  The fileID parameter may be the file ID or index.
		// If you do not specify a fileID the current uploading file or first file in the queue is cancelled.
		// If you do not want the uploadError event to trigger you can specify false for the triggerErrorEvent parameter.
		cancelUpload: function (fileID, triggerErrorEvent) {
			if (triggerErrorEvent !== false) {
				triggerErrorEvent = true;
			}
			this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
		},
		
		// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
		// If nothing is currently uploading then nothing happens.
		stopUpload: function () {
			this.callFlash("StopUpload");
		},
		
		/* ************************
		 * Settings methods
		 *   These methods change the SWFUpload settings.
		 *   SWFUpload settings should not be changed directly on the settings object
		 *   since many of the settings need to be passed to Flash in order to take
		 *   effect.
		 * *********************** */
		
		// Public: getStats gets the file statistics object.
		getStats: function () {
			return this.callFlash("GetStats");
		},
		
		// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
		// change the statistics but you can.  Changing the statistics does not
		// affect SWFUpload accept for the successful_uploads count which is used
		// by the upload_limit setting to determine how many files the user may upload.
		setStats: function (statsObject) {
			this.callFlash("SetStats", [statsObject]);
		},
		
		/* *******************************
			Flash Event Interfaces
			These functions are used by Flash to trigger the various
			events.
			
			All these functions a Private.
			
			Because the ExternalInterface library is buggy the event calls
			are added to a queue and the queue then executed by a setTimeout.
			This ensures that events are executed in a determinate order and that
			the ExternalInterface bugs are avoided.
		******************************* */
		
		queueEvent: function (handlerName, argumentArray) {
			// Warning: Don't call this.debug inside here or you'll create an infinite loop
			var self = this;
			
			if (argumentArray == undefined) {
				argumentArray = [];
			} else if (!(argumentArray instanceof Array)) {
				argumentArray = [argumentArray];
			}
			
			if (typeof this.set[handlerName] === "function") {
				// Queue the event
				this.eventQueue.push(function () {
					this.set[handlerName].apply(this, argumentArray);
				});
				
				// Execute the next queued event
				setTimeout(function () {
					self.executeNextEvent();
				}, 0);
				
			} else if (this.set[handlerName] !== null) {
				throw "Event handler " + handlerName + " is unknown or is not a function";
			}
		},
		
		// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
		// we must queue them in order to garentee that they are executed in order.
		executeNextEvent: function () {
			// Warning: Don't call this.debug inside here or you'll create an infinite loop
		
			var  f = this.eventQueue ? this.eventQueue.shift() : null;
			if (typeof(f) === "function") {
				f.apply(this);
			}
		},
		
		// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
		// properties that contain characters that are not valid for JavaScript identifiers. To work around this
		// the Flash Component escapes the parameter names and we must unescape again before passing them along.
		unescapeFilePostParams: function (file) {
			var reg = /[$]([0-9a-f]{4})/i, unescapedPost = {}, uk, k, match;
		
			if (file != undefined) {
				for (k in file.post) {
					if (file.post.hasOwnProperty(k)) {
						uk = k;
						while ((match = reg.exec(uk)) !== null) {
							uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
						}
						unescapedPost[uk] = file.post[k];
					}
				}
		
				file.post = unescapedPost;
			}
		
			return file;
		},
		
		// Private: This event is called by Flash when it has finished loading. Don't modify this.
		// Use the swfupload_loaded event setting to execute custom code when SWFUpload has loaded.
		flashReady: function () {
			// Check that the movie element is loaded correctly with its ExternalInterface methods defined
			var movieElement = 	this.cleanUp();
		
			if (!movieElement) {
				return;
			}
		
			this.queueEvent("swfupload_loaded");
		},
		
		// Private: removes Flash added fuctions to the DOM node to prevent memory leaks in IE.
		// This function is called by Flash each time the ExternalInterface functions are created.
		cleanUp: function () {
			var key, movieElement = this.getMovieElement();
			
			// Pro-actively unhook all the Flash functions
			try {
				if (movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
					for (key in movieElement) {
						try {
							if (typeof(movieElement[key]) === "function") {
								movieElement[key] = null;
							}
						} catch (ex) {
						}
					}
				}
			} catch (ex1) {
			
			}
		
			// Fix Flashes own cleanup code so if the SWF Movie was removed from the page
			// it doesn't display errors.
			window["__flash__removeCallback"] = function (instance, name) {
				try {
					if (instance) {
						instance[name] = null;
					}
				} catch (flashEx) {
				
				}
			};
			
			return movieElement;
		},
		
		/* Called when a file is successfully added to the queue. */
		fileQueued: function (file) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("file_queued", file);
		},
		
		
		/* Handle errors that occur when an attempt to queue a file fails. */
		fileQueueError: function (file, errorCode, message) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("file_queue_error", [file, errorCode, message]);
		},
		
		/* Called after the file dialog has closed and the selected files have been queued.
			You could call startUpload here if you want the queued files to begin uploading immediately. */
		fileDialogComplete: function (numFilesSelected, numFilesQueued, numFilesInQueue) {
			this.queueEvent("file_dialog_complete", [numFilesSelected, numFilesQueued, numFilesInQueue]);
		},

		uploadStart: function (file) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("return_upload_start", file);
		},
		
		returnUploadStart: function (file) {
			var returnValue;
			if (typeof this.set.upload_start === "function") {
				file = this.unescapeFilePostParams(file);
				returnValue = this.set.upload_start.call(this, file);
			} else if (this.set.upload_start != undefined) {
				throw "upload_start must be a function";
			}
		
			// Convert undefined to true so if nothing is returned from the upload_start it is
			// interpretted as 'true'.
			if (returnValue === undefined) {
				returnValue = true;
			}
			
			returnValue = !!returnValue;
			
			this.callFlash("ReturnUploadStart", [returnValue]);
		},
		
		uploadProgress: function (file, bytesComplete, bytesTotal) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("upload_progress", [file, bytesComplete, bytesTotal]);
		},
		
		uploadError: function (file, errorCode, message) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("upload_error", [file, errorCode, message]);
		},
		
		uploadSuccess: function (file, serverData, responseReceived) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("upload_success", [file, serverData, responseReceived]);
		},
		
		uploadComplete: function (file) {
			file = this.unescapeFilePostParams(file);
			this.queueEvent("upload_complete", file);
		}
	}
	
	SWFUpload.queue = {
	    uploadStartHandler: function (file) {
			var returnValue;
			if (typeof(this.queueSettings.user_upload_start) === "function") {
				returnValue = this.queueSettings.user_upload_start.call(this, file);
			}
				
			// To prevent upload a real "FALSE" value must be returned, otherwise default to a real "TRUE" value.
			returnValue = (returnValue === false) ? false : true;
				
			this.queueSettings.queue_cancelled_flag = !returnValue;
		
			return returnValue;
		},
		uploadCompleteHandler: function (file) {
			var user_upload_complete = this.queueSettings.user_upload_complete;
			var continueUpload;
				
			if (file.filestatus === SWFUpload.FILE_STATUS.COMPLETE) {
				this.queueSettings.queue_upload_count++;
			}
		
			if (typeof(user_upload_complete) === "function") {
				continueUpload = (user_upload_complete.call(this, file) === false) ? false : true;
			} else if (file.filestatus === SWFUpload.FILE_STATUS.QUEUED) {
				// If the file was stopped and re-queued don't restart the upload
				continueUpload = false;
			} else {
				continueUpload = true;
			}
				
			if (continueUpload) {
				var stats = this.getStats();
				if (stats.files_queued > 0 && this.queueSettings.queue_cancelled_flag === false) {
					this.startUpload();
				} else if (this.queueSettings.queue_cancelled_flag === false) {
					this.queueEvent("queue_complete", [this.queueSettings.queue_upload_count]);
					this.queueSettings.queue_upload_count = 0;
				} else {
					this.queueSettings.queue_cancelled_flag = false;
					this.queueSettings.queue_upload_count = 0;
				}
			}
		}
		
	};
	
	//Public: 格式化文件大小
	SWFUpload.formatBytes = function (baseNumber) {
		var unitDivisors = [1073741824, 1048576, 1024, 1], unitLabels = ["GB", "MB", "KB", "bytes"];
		var i, unit = baseNumber, unitLabel = unitLabels[unitDivisors.length - 1];
	
		if (baseNumber === 0) {
			return "0 " + unitLabels[unitLabels.length - 1];
		}
	
		for (i = 0; i < unitDivisors.length; i++) {
			if (baseNumber >= unitDivisors[i]) {
				unit = (baseNumber / unitDivisors[i]).toFixed(2);
				unitLabel = unitLabels.length >= i ? " " + unitLabels[i] : "";
				break;
			}
		}
				
		return unit + unitLabel;
	};

})(jQuery);


//上传文件进度项
//file 要上传的文件
//targetID 显示的目标区域
var FileProgress = function (file, targetID) {
	if(!file){
	    return;
	}
	
 this.id = file.id;
 // 生成文件上传li
	if ($('#'+targetID + '>#'+ this.id).size() == 0) {
		$('#'+targetID).append("<li id='"+this.id+"'>"
		                         + "<div class='file-div'>"
				                     + "<span class='file-info' title='"+file.name+"'>"+file.name+ " (" + SWFUpload.formatBytes(file.size) + ")"+"</span>"
				                     + "<span class='file-status'></span>"
				                     + "<span class='file-v'>" 
						                 + "<span class='file-probar' style='display:none;'>" 
						                      + "<div style='width:0%;'><span>0%</span></div>"
						                 + "</span>"
						                 + "<a href='javascript:void(0);'>删除</a>"
						             + "</span>"
				                 + "</div>"
		                     + "</li>");
	} //end if
	
 this.li = $("#"+this.id);  //文件列表
 
 this.fd = this.li.children("div:first-child"); //文件div
 this.fs = this.fd.children("span:nth-child(2)"); //上传状态
 
 var fv = this.fd.children(".file-v");
 this.fp = fv.children("span"); //上传进度条
 this.fps = this.fp.children("div");
 this.fpt = this.fps.children("span"); //上传进度信息
 this.c = fv.children("a"); //取消标签
}

FileProgress.prototype = {
 //设置等待上传
 setQueue: function(){
	   this.fd.attr("class","file-div file-upload-queue");
	   this.fs.text("(等待上传...)");
	},
	//设置开始上传
	setStartUpload: function(){
	    this.fd.attr("class","file-div file-upload-start");
	    this.fs.hide();
	    this.fp.show();
	},
	//设置进度信息
	setProgress: function (percentage) {
		this.fps.width(percentage);
		this.fpt.html(percentage);
	},
	//处理文件上传完成
	setComplete: function (upload, serverData, paramName, callback, swfUploadInstance) {
	    //上传成功class
	    this.fd.attr("class","file-div file-upload-success");
	    
	    //添加表单域
	    if(serverData){
	        this.li.append("<input type='hidden' name='"+paramName+"' value='"+serverData+"' />"); 
	    }
		
		this.fs.hide();
		this.fp.hide();
		
	    //添加删除动作
	    var fileid = this.id;
	    var cancel = this.c;
	    var status = this.fs;
		this.c.click(function(){
		    status.text("(删除中...)");
		    cancel.hide();
		    status.show(); 
		    var _data = eval('('+serverData+')');
		    upload.delFile(fileid, _data, callback, swfUploadInstance);
		    return false;
		});
	},
	//上传错误
	setError: function (msg) {
	    //上传错误class
	    this.fd.attr("class","file-div file-upload-error");
	    
	    this.fs.html("<font style='color:red;'>("+msg+")</font>");
	    this.fp.hide();
	    this.fs.show();
	    
	    var li = this.li;
	    this.c.click(function(){
		    li.remove();
		    return false;
		});
	},
	//上传被取消
	setCancelled: function () {
	    $('#'+this.id).remove();
	},
	// 显示或隐藏取消标签
	toggleCancel: function (show, instance) {
	    show ?  this.c.show() : this.c.hide();
	    
		if (instance) {
		    var fileid = this.id;
			this.c.click(function () {
				instance.cancelUpload(fileid);
				return false;
			});
		}
	}
};

/*
* 文件上传组件
*/
var FileUpload;

// 获得组件目录
var file_upload_jss = document.getElementsByTagName("script");
var file_upload_js_src = file_upload_jss[file_upload_jss.length -1].src;
var file_upload_b_path = file_upload_js_src.substring(0, file_upload_js_src.lastIndexOf("/") + 1);


(function($){
 if(FileUpload == undefined){
	    FileUpload = function(p){
	        //初始化文件上传
		    p.id = "GDK_FU_" + FileUpload.movieCount++;
			$("#" + p.targetId).append("<div id='" + p.id + "' class='upload-warpper'></div>");

         if(FileUpload.basePath == null){
             //获得路径
			    var path = FileUpload.getContextPath();
			    FileUpload.basePath = file_upload_b_path;
			    
			    var url = path + "/servlet/UploadFileServlet?method=";
			    FileUpload.URL.UPLOAD = url + "upload";
			    FileUpload.URL.DELETE = url + "delete";
         }
         
			
			var upload = this.initFileUpload(p);
			FileUpload.instance[p.id] = upload;

	        return  upload;
		}; // end FileUpload
 }
 
	FileUpload.movieCount = 0;
	FileUpload.instance = {};
	FileUpload.basePath = null;
	FileUpload.URL = {
	    UPLOAD: null,
	    DELETE: null
	};
	
	//初始化文件上传组件
	FileUpload.prototype.initFileUpload = function (p) {
     p = $.extend(p, {
            //参数
            proTarget : "fsPro_"+p.id,
            ph_id: "ph_"+p.id,
            
            //获得文件进度项
            getPro : function(file){
                return new FileProgress(file, p.proTarget);
            },
            
            //禁用|启用 (上传/取消)按钮
            toggleOpe : function(dis, self){
                
                var op_start = $("#" + p.startUploadId);
                var op_cancel = $("#" + p.cancelUploadId);
                if(dis){
                    op_start.attr("disabled", true);
                    op_cancel.attr("disabled", true);
                }else{
                    op_start.removeAttr("disabled");
                    op_cancel.removeAttr("disabled");
                }
               
            },
            
            //回调函数
            onFileQueued : function(file, isExisted){
                if(isExisted){
                    alert("文件[ "+file.name+" ]已经存在!");
                }
            },
            onFileQueueError : function(file, errorCode, message){
                switch (errorCode) {
                    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                        alert("最多可上传[ "+ p.maxFileNum +" ]个文件！");
                        break;
                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        alert("最大可上传[ "+ SWFUpload.formatBytes(p.maxFileSize ? p.maxFileSize : (40 * 1024 * 1024)) +" ]的文件！");
                        break;
                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                        alert("无法上传空文件[ "+ file.name +" ]！");
                        break;
                    case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                        alert("不合法的文件类型!");
                        break;
                    default:
                        alert("文件上传错误!");
                        break;
                }
            },
            onFileDialogComplete : function(numFilesSelected, numFilesQueued){},
            onUploadStart : function(file){},
            onUploadProgress : function(file, bytesLoaded, bytesTotal){},
            onUploadSuccess : function(file, serverData){},
            onUploadError : function(file, errorCode, message){},
            onUploadComplete : function(file){},
            onQueueComplete : function(numFilesUploaded){},
            onDelete : function(res, resultData){}
     });
     
     //支持反向文件过滤(即不允许文件类型)
     p.image = p.image ? p.image : FileUpload.basePath + "/images/file-upload.png";
     p.imageHeight = p.imageHeight ? p.imageHeight : 104;
     p.imageWidth = p.imageWidth ? p.imageWidth : 76;
     p.btnTextLeftPadding = p.btnTextLeftPadding ? p.btnTextLeftPadding : 0;
     p.btnTextTopPadding = p.btnTextTopPadding ? p.btnTextTopPadding : 3;
     p.paramName = p.paramName ? p.paramName : "uploadFile";
		p.autoUpload = !(p.autoUpload == false);
     p.ft = p.fileTypes ? p.fileTypes : "*.*";
     p.ftd = p.file_types_description ? p.file_types_description : "所有文件";  
     if(!!(p.ft.match("!.*"))){
         p.ftl = p.ft.substring(1);
         p.ftlr = p.ftl.replace(/;/g, "|").replace(/\./g, "\\.").replace(/\*/g,".*");
         p.ftd = p.ftd +"[!" + p.ftl + "]";
         p.ft = "*.*";
     }
     
     var g = {
		    swfu : null,
		    init : function(){
		        //相同文件数
		        var invalidFileNum = 0;
		        
		        //文件上传参数设置
		        var set = {
				    upload_url : FileUpload.URL.UPLOAD,
				    flash_url : FileUpload.basePath+ "/swfupload_fp9.swf",
					file_size_limit : SWFUpload.formatBytes(p.maxFileSize ? p.maxFileSize : (40 * 1024 * 1024)),
					ftd : p.ftd,
					file_types : p.ft,
					file_upload_limit : p.maxFileNum ? p.maxFileNum : 0,
							
					post_params : {
					   "savePath" : (p.savePath ? p.savePath : ""), //保存路径
					   "rename" : !(p.rename == false),    //是否重命名
					   "rule" : (p.rule ? p.rule : "") // 上传规则
					},
							
					// 上传按钮
					btn_image_url: p.image, // FileUpload.basePath + "/images/file-upload.png",
					btn_width: p.imageWidth,
					btn_height: p.imageHeight/4,
					btn_ph_id: p.ph_id,
					btn_text: "<span class='swfupload-theFont'>" + (p.label ? p.label : "选择文件") + "</span>",
					btn_text_style: ".swfupload-theFont {font-size: 12px; text-align: center; color: #FFFFFF; font-weight: solid;" + (p.textStyle ? p.textStyle : "") + "}",
					btn_text_left_padding: p.btnTextLeftPadding,
					btn_text_top_padding: p.btnTextTopPadding,
							
					//加载SWFUpload失败
					swfupload_load_failed : function () {
						alert("加载SWFUpload失败!" );
					},
					//文件进入等待上传队列
					file_queued : function (file) {
					    this.cancelFileQueue = function(){
					        //取消上传
						    swfu.cancelUpload(file.id, false);
						        
				            //将上传队列数量减1
					        var stats = swfu.getStats();  //状态对象
					        stats.files_queued--;
					        swfu.setStats(stats);
					        
					        invalidFileNum++;
					    }
					    
					    //处理文件类型不匹配(以!开头，设置不允许的文件类型)
					    if(p.ftlr && file.name.match("" + p.ftlr)){
					        this.cancelFileQueue();
					        p.onFileQueueError(file, SWFUpload.QUEUE_ERROR.INVALID_FILETYPE, "不支持[" + p.ftl + "]文件类型");
					        return false;
					    }
					    
					    //处理一次不允许上传相同文件名文件
					    var isNotExist = this.set.post_params.rename || ($("#"+p.proTarget + " [title = "+file.name+"]").size() <= 0);
					    if(isNotExist){
					        var progress = p.getPro(file);
					        progress.setQueue();  //处理等待上传
					        progress.toggleCancel(true, this); //显示取消按钮
					    }
					    p.onFileQueued(file, !isNotExist);//执行回调函数
					},
					//文件进入等待上传队列失败
					file_queue_error : function (file, errorCode, message) {
					    p.onFileQueueError(file, errorCode, message);
					    return false;
					},
					//选择文件对话框关闭
					file_dialog_complete : function (selectedNum, queuedNum) {
						//执行回调函数
					    p.onFileDialogComplete(selectedNum, queuedNum - invalidFileNum);
					    invalidFileNum = 0; //置0
					    
						if (selectedNum > 0) {
						    if(p.autoUpload){
						        this.startUpload();
						    }else if(!(this.getStats().files_queued === 0)){
							    p.toggleOpe(false, this);
						    }
						}
					},
					//开始上传
					upload_start : function (file) {
					    p.getPro(file).setStartUpload();
						
					    p.onUploadStart(file);//执行回调函数
					},
					//文件上传进度
					upload_progress : function (file, bytesLoaded, bytesTotal) {
						var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
						p.getPro(file).setProgress(percent + "%");
						
					    p.onUploadProgress(file, bytesLoaded, bytesTotal);//执行回调函数
					},
					//文件上传失败
					upload_error : function (file, errorCode, message) {
					
						switch (errorCode) {
							case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
							case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
							    p.getPro(file).setCancelled();
								break;
							default:
								if(file){
								    p.getPro(file).setError("上传失败!");
								}
								break;
						}
						
						if (!p.autoUpload && this.getStats().files_queued === 0) {
							p.toggleOpe(true);
						}
					    p.onUploadError(file, errorCode, message); //执行回调函数
					},
					//文件上传成功
					upload_success : function (file, serverData) {
					    p.getPro(file).setComplete(FileUpload.instance[p.id], serverData, p.paramName, p, this);
						
					    p.onUploadSuccess(file, serverData); //执行回调函数
					},
					//文件上传完成
					upload_complete : function (file) { 
					    
					    if (!p.autoUpload && this.getStats().files_queued === 0) {
							p.toggleOpe(true);
						}
						
						p.onUploadComplete(file); //执行回调函数
					},
					//上传队列完成上传
					queue_complete : function (numFilesUploaded) {
					    //执行回调函数
						p.onQueueComplete(numFilesUploaded);
					}
				};
				
				//创建文件上传的HTML
				var swfupload = $("#" + p.id);
	    	    
			    var btnDiv = $("<div style='height: "+p.imageHeight/4+"px;'></div>"); 
			    btnDiv.append("<span id='" + p.ph_id + "'></span>");
				swfupload.append(btnDiv);
			    
				var ul = $("<ul id='fsPro_" + p.id + "' class='file-ul'></ul>");
				if(p.itemTarget){
				    $("#"+p.itemTarget).append(ul);
				}else{
				    swfupload.append(ul);
				}
				
			    //生成上传组件
				swfu = new SWFUpload(set);
			},
			
			// 开始上传
			startUpload: function(){
			    swfu.startUpload();
			},
			
			// 取消上传
			cancelUpload: function(){
			    swfu.cancelQueue();
			},
			
			// 删除已经上传的文件
			deleteFile: function(){
	            $("#fsPro_" + p.id).find("a").click();
			},
			
			//设置回调函数
			setCallback : function (callback) {
			    if(callback && callback != null){
			        p = $.extend(p, callback);
			    }
			},
			
			//删除文件
			delFile: function (fileid, saveData, callback, swfUploadInstance){
		    	$.ajax({
			        type : 'POST',
					url : FileUpload.URL.DELETE,
					data : 'filepath='+saveData.filepath,
					success : function(res){
					   var stats = swfUploadInstance.getStats();
					   if(stats){
					       stats.successful_uploads--;
					       swfUploadInstance.setStats(stats);
					   }
					   $('#'+fileid).remove();
					   
					   callback.onDelete(res == "true", saveData);
					}
				});
			} //end delFile
			
     }; // end g
     
     g.init();
     return g;
     
 }// end initFileUpload
	
})(jQuery);

//获得系统根目录
FileUpload.getContextPath = function(){
 var fullPath = window.document.location.host,
 	strPath = window.document.location.pathname,
 	pos = fullPath.indexOf(strPath),
 	prePath = fullPath.substring(0, pos),
 	postPath = strPath.substring(0, strPath.substr(1).indexOf("/") + 1);

	return prePath + postPath;
}