<%@page import="java.util.LinkedHashMap"%>
<%@page import="java.util.Enumeration"%>
<%@page import="antlr.collections.Enumerator"%>
<%@page import="com.avatar.gdk.util.DateUtils"%>
<%@page import="com.nebula.auth.user.UserBean"%>
<%@page import="org.apache.commons.logging.LogFactory"%>
<%@page import="org.apache.commons.logging.Log"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.nebula.Global"%>
<%@page import="java.util.Map"%>
<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
%>
<%!
	private Class<?> clazz = null;
	private Log log;
	{
		clazz = this.getClass();
		log = LogFactory.getLog(clazz);
	}
	public static String getRemoteAddr(HttpServletRequest req) {
		String ip = req.getHeader("X-Forwarded-For");
		if (null == ip) {
			ip = req.getHeader("x-real-ip");
		}
		if (null == ip) {
			ip = req.getRemoteAddr();
		}
		return (null != ip ? ip : "");
	}
%>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>404</title>
  </head>
  <body>
<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
	<tr>
		<td align="center" valign="middle">
		   <div >
            	<img src="<%=path %>/error/images/404_icon.png"/>
				<div>
            		<p style="color:rgb(85,85,85);font-size:18px;">哎呀...您访问的页面不存在 </p>
            		<p style="color:#888;margin-top:10px;">HTTP Error 404 - 您可能访问了错误的页面，或该页面已删除或移动</p>
				</div>
			</div>
			<%
				Object errCode = request.getAttribute("javax.servlet.error.status_code");
				Object errType = request.getAttribute("javax.servlet.error.exception_type");
	
				Object user = session.getAttribute(Global.LOGIN_USER);
	
				Map<String, Object> errorData = new LinkedHashMap<String, Object>(7);
				errorData.put("错误代码", null != errCode ? errCode : "404");
				errorData.put("错误类型", null != errType ? errType : "未知");
				errorData.put("访问的用户", getRemoteAddr(request) + (null != user ? "[" + ((UserBean) user).getRealname() + "]" : ""));
				errorData.put("访问时间", DateUtils.getCurrentTime());
	
				Object _url = request.getAttribute("javax.servlet.forward.request_uri");
				Object _param = request.getAttribute("javax.servlet.forward.query_string");
	
				errorData.put("访问的url", basePath + (null != _url ? _url.toString() : "") + (null != _param ? "?" + _param : ""));
				errorData.put("UserAgent", request.getHeader("user-agent"));
	
				log.error("404, 你懂的！");
				for (Map.Entry<String, Object> entry : errorData.entrySet()) {
					log.error(entry.getKey() + ":\t" + entry.getValue());
				}
			%>
		</td>
	</tr>
</table>
  </body>
</html>