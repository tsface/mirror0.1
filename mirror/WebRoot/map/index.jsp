<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<link rel="shortcut icon" type="image/png" HREF="<%=path %>/imagesimg/favicons/favicon.png"/>
<link rel="icon" type="image/png" HREF="<%=path %>/imagesimg/favicons/favicon.png"/>
<link rel="apple-touch-icon" HREF="<%=path %>/images/img/favicons/apple.png" />
<!-- Main Stylesheet --> 
<link rel="stylesheet" href="<%=path %>/themes/css/style.css" type="text/css" />
<!-- Colour Schemes
Default colour scheme is blue. Uncomment prefered stylesheet to use it.
<link rel="stylesheet" href="css/brown.css" type="text/css" media="screen" />  
<link rel="stylesheet" href="css/gray.css" type="text/css" media="screen" />  
<link rel="stylesheet" href="css/green.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/pink.css" type="text/css" media="screen" />  
<link rel="stylesheet" href="css/red.css" type="text/css" media="screen" />
-->
<!-- Your Custom Stylesheet --> 
<link rel="stylesheet" href="<%=path %>/themes/css/custom.css" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/main.css" />
<!--swfobject - needed only if you require <video> tag support for older browsers -->
<script type="text/javascript" src="<%=path %>/scripts/js/swfobject.js"></script>
<!-- jQuery with plugins -->
<script type="text/javascript" src="<%=path %>/scripts/js/jquery-1.4.2.min.js"></script>
<!-- Could be loaded remotely from Google CDN : <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script> -->
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.ui.core.min.js"></script>
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.ui.widget.min.js"></script>
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.ui.tabs.min.js"></script>
<!-- jQuery tooltips -->
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.tipTip.min.js"></script>
<!-- Superfish navigation -->
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.superfish.min.js"></script>
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.supersubs.min.js"></script>
<!-- jQuery form validation -->
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.validate_pack.js"></script>
<!-- jQuery popup box -->
<script type="text/javascript" src="<%=path %>/scripts/js/jquery.nyroModal.pack.js"></script>
<!-- jQuery graph plugins -->
<!--[if IE]><script type="text/javascript" src="js/flot/excanvas.min.js"></script><![endif]-->
<script type="text/javascript" src="<%=path %>/scripts/js/flot/jquery.flot.min.js"></script>
<!-- Admin template javascript load -->
<script type="text/javascript" src="<%=path %>/scripts/js/administry.js"></script>
<script type="text/javascript" src="<%=path%>/scripts/core.js"></script>
<!-- Internet Explorer Fixes --> 
<!--[if IE]>
<link rel="stylesheet" type="text/css" media="all" href="css/ie.css"/>
<script src="js/html5.js"></script>
<![endif]-->
<!--Upgrade MSIE5.5-7 to be compatible with MSIE8: http://ie7-js.googlecode.com/svn/version/2.1(beta3)/IE8.js -->
<!--[if lt IE 8]>
<script src="js/IE8.js"></script>
<![endif]-->
<script type="text/javascript">
$(document).ready(function(){
	
	/* setup navigation, content boxes, etc... */
	Administry.setup();
	
	/* progress bar animations - setting initial values */
	Administry.progress("#progress1", 1, 5);
	Administry.progress("#progress2", 2, 5);
	Administry.progress("#progress3", 2, 5);

	/* flot graphs */
	var sales = [{
		label: 'Total Paid',
		data: [[1, 0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,900],[8,0],[9,0],[10,0],[11,0],[12,0]]
	},{
		label: 'Total Due',
		data: [[1, 0],[2,0],[3,0],[4,0],[5,0],[6,422.10],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0]]
	}
	];
    <%--
	var plot = $.plot($("#placeholder"), sales, {
		bars: { show: true, lineWidth: 1 },
		legend: { position: "nw" },
		xaxis: { ticks: [[1, "Jan"], [2, "Feb"], [3, "Mar"], [4, "Apr"], [5, "May"], [6, "Jun"], [7, "Jul"], [8, "Aug"], [9, "Sep"], [10, "Oct"], [11, "Nov"], [12, "Dec"]] },
		yaxis: { min: 0, max: 1000 },
		grid: { color: "#666" },
		colors: ["#0a0", "#f00"]			
    });
	--%>
	var _mapHeight = $(window).height()-($("#pagetitle").height()+$("#top").height()+$("#bottom").height());
	$("#container").css("height",_mapHeight);
});
</script>
</head>
<!--  
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=zyucjQSz4GoGy1280cHs2VY5></script>
-->
<style type="text/css">
	#container {width: 100%;margin-left:20%;overflow: hidden;margin:0;}
</style>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.4"></script>
<title>-TSFACE-</title>
</head>
<body>
	<!-- Header -->
	<header id="top">
		<div class="wrapper">
			<!-- Title/Logo - can use text instead of image -->
			<div id="title"><img SRC="<%=path %>/images/img/logo.png" alt="Administry" /><!--<span>Administry</span> demo--></div>
			<!-- Top navigation -->
			<!--  
			<div id="topnav">
				<a href="#"><img class="avatar" SRC=""<%=path %>/images/img/user_32.png" alt="" /></a>
				Logged in as <b>Admin</b>
				<span>|</span> <a href="#">Settings</a>
				<span>|</span> <a href="#">Logout</a><br />
				<small>You have <a href="#" class="high"><b>1</b> new message!</a></small>
			</div>
			-->
			<!-- End of Top navigation -->
			<!-- Main navigation -->
			<nav id="menu">
				<ul class="sf-menu">
					<li class="current"><a href="#">地图查询</a></li>
					<li><a href="#">微博</a></li>
					<!-- 
					<li>
						<a HREF="styles.html">Styles</a>
						<ul>
							<li>
								<a HREF="styles.html">Basic Styles</a>
							</li>
							<li>
								<a href="#">Sample Pages...</a>
								<ul>
									<li><a HREF="samples-files.html">Files</a></li>
									<li><a HREF="samples-products.html">Products</a></li>
								</ul>
							</li>
						</ul>
					</li>
					<li><a HREF="tables.html">Tables</a></li>
					<li><a HREF="forms.html">Forms</a></li>	
					<li><a HREF="graphs.html">Graphs</a></li>	
					 -->
				</ul>
			</nav>
			<!-- End of Main navigation -->
			<!-- Aside links -->
			<!--  
			<aside><b>English</b> &middot; <a href="#">Spanish</a> &middot; <a href="#">German</a></aside>
			-->
			<!-- End of Aside links -->
		</div>
	</header>
	<!-- End of Header -->
	<!-- Page title -->
	<div id="pagetitle">
		<div class="wrapper">
			<h1>地图查询</h1>
			<!-- Quick search box -->
			<input type="button" id="searchMap" class="btn" style="width:initial;margin-left: 5px;padding-left: 10px;padding-right: 10px;" value="查询">
			<input class="" type="text" id="keyword" name="keyword" />
		</div>
	</div>
	<!-- End of Page title -->
	
	<!-- Page content -->
	<div id="page">
		<!-- Wrapper -->
		<div id="container">
		</div>
		<!-- End of Wrapper -->
	</div>
	<!-- End of Page content -->
	
	<!-- Page footer -->
	<footer id="bottom">
		<div class="wrapper">
			<nav>
				<a href="#">BETA 0.1</a> &middot;
				<a href="http://developer.baidu.com/map/">百度地图API</a> &middot;
				<a href="http://open.weibo.com/">微博开放平台</a> &middot;
				<a href="#">关于作者</a> &middot;
			</nav>
			<p>Copyright &copy; 2014 <b><a HREF="#" title="tsface.sinaapp.com">tsface.sinaapp.com</a></b> | 模板来源 <a HREF="#">Internet</a></p>
		</div>
	</footer>
	<!-- End of Page footer -->
	
	<!-- Animated footer -->
	<footer id="animated">
		<ul>
			<li><a href="#">Dashboard</a></li>
			<li><a href="#">Content</a></li>
			<li><a href="#">Reports</a></li>
			<li><a href="#">Users</a></li>
			<li><a href="#">Media</a></li>
			<li><a href="#">Events</a></li>
			<li><a href="#">Newsletter</a></li>
			<li><a href="#">Settings</a></li>
		</ul>
	</footer>
	<!-- End of Animated footer -->
	
	<!-- Scroll to top link -->
	<a href="#" id="totop">^ scroll to top</a>
</body>
</html>


<script type="text/javascript">
	var _map = new BMap.Map("container");
	ajax4Location(_map);
	
	
	/*根据当前访问的ip定位地图的中心*/
	function ajax4Location(map)
	{
		$.ajax({
			data:{"locationIP":"${reqIp}"},
			//data:{"locationIP":"58.240.127.3"},
			type:"POST",
			url:"<%=path%>/map/BDMP!locationIp.action",
			success:function(data){
				var _point = new BMap.Point(116.404, 39.915);
				if(data && data.status==0)
				{
					_point = new BMap.Point(data.content.point.x, data.content.point.y);
				}
				map.centerAndZoom(_point, 10);
				map.enableScrollWheelZoom();
			}
		});
	}
	
	$("#searchMap").live('click',function(){
		var keyword = $.trim($("#keyword").val());
		if(!keyword)
		{
			Msg.show("关键词不能为空！", {type:"error", timeout:2000});
			return ;
		}
		var local = new BMap.LocalSearch(_map, {
		  renderOptions:{map:_map}
		});
		local.searchInBounds(keyword, _map.getBounds());
		
		_map.addEventListener("dragend",function(){
		    //_map.clearOverlays();
		    local.searchInBounds(keyword, _map.getBounds());
		});
	});
</script>