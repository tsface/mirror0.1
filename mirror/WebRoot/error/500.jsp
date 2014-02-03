<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>500</title>
    <!--
    <link rel="stylesheet" type="text/css" href="" />
    -->
  </head>
  <body>
	<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td align="center" valign="middle">
			   <div >
	            	<img src="<%=path%>/error/images/404_icon.png"/>
	            	<div>
	            		<p style="color:rgb(85,85,85);font-size:18px;">哎呀...系统发生了点问题</p>
	            		<p style="color:#888;margin-top:10px;">HTTP Error 500 - 正在修复中</p>
	            	</div>
				</div>
			</td>
		</tr>
	</table>
  </body>
</html>