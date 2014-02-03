
    <%-- gdk-fileupload组件 --%>
	<link href="<%=path%>/scripts/swfupload/swfupload.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=path%>/scripts/swfupload/swfupload.js"></script>
	
    // 文件上传 
    var fileupload = new FileUpload({
      targetId: 'upload_target', // 选择文件按钮所在区域 (必须)
      itemTarget:'upload_items', // 上传文件列表所在区域 (可选)
	  autoUpload: true,          // 是否自动上传  (可选，默认true)
	  savePath: 'uploadfiles/demand', // 文件保存路径  (可选)
	  rule: 'com.services.file.TestFileRules', // 文件上传规则  (可选，为空则采用默认规则)
	  maxFileNum: 1,             // 最大上传文件数  (可选， 默认0不限制)
	  image: "<%=path%>/scripts/swfupload/images/file-upload2.png",  // 选择文件按钮背景图片  (可选)
	  imageHeight: 88,           // 背景图片高度  (可选)
	  imageWidth: 61,            // 背景图片宽度  (可选)
	  btnTextLeftPadding: 0,     // 按钮文字距左边的距离  (可选)
	  btnTextTopPadding: 4       // 按钮文字距顶部的距离  (可选)
	  label: "选择文件",          // 选择文件按钮文字  (可选)
	  textStyle: "color: #FFFFFF; font-weight: bold; vertical-align: middle;", // 按钮文字样式  (可选)
	  rename: true,              // 上传文件是否重命名  (可选，默认true)
	  paramName: 'uploadFiles',  // 后台参数  (可选，默认uploadFile)
	  maxFileSize: 20 * 1024 * 1024,  // 最大允许上传文件大小  (可选，默认20M)
	  fileTypes: '*.xls;*.xlsx;'         // 允许上传文件类型  (可选，默认不限制)
    });
  
    // 设置回调函数
    fileupload.setCallback({
      onFileQueueError : function(file, errorCode, message){
           if(errorCode == SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED){
               alert("只能上传一个文件！");
           }
      }
    });
    
    // 开始上传
	fileupload.startUpload();
	
    // 取消上传文件
    fileupload.cancelUpload();
    
    // 删除已经上传的文件
	fileupload.deleteFile();
    
  
    // 文件选择错误类别
    SWFUpload.QUEUE_ERROR = {
		QUEUE_LIMIT_EXCEEDED            : -100,
		FILE_EXCEEDS_SIZE_LIMIT         : -110,
		ZERO_BYTE_FILE                  : -120,
		INVALID_FILETYPE                : -130
	};
	// 文件上传错误类别
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
		  