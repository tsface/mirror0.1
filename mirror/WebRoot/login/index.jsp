<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
    String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=emulateIE7" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>登录页面</title>
        <link rel="stylesheet" type="text/css" href="<%=path%>/css/main.css" />
        <link rel="stylesheet" type="text/css" href="<%=path%>/scripts/fui/fui.css" />
        <link rel="stylesheet" type="text/css" href="<%=path%>/themes/default/theme.css" />
        
        
        <script type="text/javascript" src="<%=path%>/scripts/jquery.js"></script>
        <script type="text/javascript" src="<%=path%>/scripts/fui/fui.js"></script>
        <script type="text/javascript" src="<%=path%>/scripts/core.js"></script>
        <style type="text/css">
            .selected-dims-con dd a{width:165px;}
            .selected-dims-con dd{white-space:normal;}
            .tips_item{
            	padding-left: 20px; 
            	color:red;
            }
        </style>
	    <script type="text/javascript">
            /*登录方法*/
		    function login()
		    {
		    	var _usrName = $.trim($("#user").val());
            	var _pwd = $.trim($("#password").val());
            	if(_usrName && _pwd)
            	{
            		$.ajax
                    ({
                        type:'post',
                        url:"<%=path %>/login/Login!validate.action",
                        data:{"usr.username":_usrName,"usr.password":_pwd},
                        success:function(result)
                        {
                        	if(!result)
                        	{
                        		Msg.show("用户名或者密码错误！", {type:"error", timeout:2000});
                        	}else
                        	{
                        		$("#loginForm").submit();
                        		return ;
                        	}
                        },
                        error:function()
                        {
                            Msg.show("登录失败，请联系系统管理员！", {type:"error", timeout:2000});
                            return;
                        }
                    });
            	}else
            	{
            		Msg.show("用户名和密码不能为空！", {type:"error", timeout:2000});
            		return false;
            		
            	}
		    	
		    }
	    </script>
  </head>
  
  <body style="overflow:hidden;">
    <div id="logoDiv" class="header">
        <div class="logo-box"  style="float:left; width:200px; margin-top:5px; margin-left:10px;">
            <a href="#">
            <!-- 
            <img src="<%=path %>/datawl/personlock/images/personlocklogotop.png"/>
             -->
            </a>
        </div>
    </div>
    <form action="<%=path %>/login/Login!login.action" name="loginForm" id="loginForm" method="post" target="listIframe">
        <div id="conditionDiv" style="padding-top:20px;margin-left: 40%;margin-top:10%;">
            <div class="filter-item">
                <div class="item-label">
                	<input type="text" id="user" name="user.username" class="nb-text" style="width: 180px;">
                	<font class="tips_item">*用户名<font>
                </div>
                 <div class="item-label" style="margin-top: 10px;">
                 	<input type="password" id="password" name="user.password" class="nb-text" style="width: 180px;">
                 	<font class="tips_item">*密码<font>
                 </div>
                <div class="item-content" style="margin-left: 70px;margin-top: 10px;">
                    <button type="submit" id="seach" class="nb-btn nb-submit" onclick="login();return false;">登录</button>
                </div>
            </div>
        </div>
    </form>
    <iframe id="listIframe" name="listIframe" style="display: none;">
  </body>
</html>