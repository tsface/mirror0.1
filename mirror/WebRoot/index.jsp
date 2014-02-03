<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<link rel="stylesheet" type="text/css" href="<%=path%>/scripts/fui/fui.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/main.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/default/theme.css" />
<style type="text/css">
	.tip-content p {
		color: rgb(85, 85, 85); font-size: 18px;
	}
	body, html,#container {width: 100%;height: 100%;overflow: hidden;margin:0;}
</style>
<script type="text/javascript" src="<%=path%>/scripts/jquery.js"></script>
<script type="text/javascript" src="<%=path%>/scripts/fui/fui.js"></script>
<!--  
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=zyucjQSz4GoGy1280cHs2VY5></script>
-->
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.4"></script>
<title>WELCOME</title>
</head>
<body>
<%--
	<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td align="center" valign="middle">
				<div style="margin-top: 10%;">
					
					<img src="<%=path%>/error/images/no_power.png" />
				
				</div>
			</td>
		</tr>
	</table>
		--%>
	<div id="container"></div>
</body>
</html>
<script type="text/javascript">
	var _map = new BMap.Map("container");
	var point = new BMap.Point(116.404, 39.915);
	_map.centerAndZoom(point, 15);
	_map.enableScrollWheelZoom();  
</script>