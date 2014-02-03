<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="path" value="${pageContext.request.contextPath}"></c:set>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="<%=path%>/scripts/fui/fui.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/main.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/default/theme.css" />
<style type="text/css">
.tip-content p {
	color: rgb(85, 85, 85); font-size: 18px;
}
</style>
<script type="text/javascript" src="<%=path%>/scripts/jquery.js"></script>
<script type="text/javascript" src="<%=path%>/scripts/fui/fui.js"></script>
<title>您的环境需要升级</title>
</head>
<body>
	<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td align="center" valign="middle">
				<div>
					<img src="<%=path%>/error/images/404_icon.png" />
					<div class="tip-content">
						<c:choose>
							<c:when test="${not param.noSupportedIPAndMacPlugin}">
								<c:if test="${param.needUpdateIE or param.needUpdateIEFlash or param.needInstallIPAndMacPlugin}">
									<div style="font-size: 16px;" class="inline">您当前使用的是IE<i id="ieVersion">7.0</i>浏览器，无法正常使用某些业务功能，推荐下载并使用<a title="点击下载谷歌浏览器" style="font-weight: bold;" href="$!ContextPath/scripts/Chrome_24.0.1312.57_installer.zip">谷歌浏览器(Chrome)</a>访问系统。</div>
									<a href="javascript:;" onclick="$('#updateIE').show(); $.cookie('insistUseIE', 'true', {expires: 365, path: '${path}'});">仍然使用IE</a>
								</c:if>
								<div id="updateIE" style="display: none; border: 2px dashed #FF981D; padding: 10px; background-color: #FFC;" class="inline">
									<c:if test="${param.needUpdateIE}">
										<p>
											您当前的浏览器版本太低，IE版本最低需要7.0，请<a href="<%=path%>/scripts/IE8-WindowsXP-x86-CHS.zip">下载</a>并安装高级版本后再试
										</p>
									</c:if>
									<c:if test="${param.needUpdateIEFlash}">
										<p>
											您当前的FLASH版本太低，会导致部分功能不可用，请<a href="<%=path%>/scripts/AdobeFlashPlayerActiveX11.5.502.110.zip">下载</a>并安装高级版本后再试
										</p>
									</c:if>
									<c:if test="${param.needInstallIPAndMacPlugin}">
										<p>
											您尚未安装基于IP+MAC校验的登录插件，会导致无法正常登录系统，请先<a href="<%=path%>/scripts/saferun.exe">下载</a>并安装(Win7系统需要使用管理员权限运行)后再访问
										</p>
									</c:if>
								</div>
								<c:if test="${param.needUpdateWebkitFlash}">
									<p>
										您当前的FLASH版本太低，会导致部分功能不可用，请<a href="<%=path%>/scripts/AdobeFlashPlayer11.8.800.115pi.rar">下载</a>并安装高级版本后再试
									</p>
								</c:if>
								<c:if test="${param.needUpdateChrome}">
									<p>
										您当前的谷歌浏览器版本太低，会导致部分功能不可用，请<a href="<%=path%>/scripts/Chrome_24.0.1312.57_installer.zip">下载</a>并安装高级版本后再试
									</p>
								</c:if>
							</c:when>
							<c:otherwise>
								<p>由于系统启用了基于IP+MAC的登录校验，而您的浏览器不支持此种插件的安装，请使用IE访问。</p>
							</c:otherwise>
						</c:choose>
					</div>
				</div>
			</td>
		</tr>
	</table>
</body>
</html>