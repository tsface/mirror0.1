/*
 * @(#)MapAction.java 2014-1-18
 */
package com.lotus.map;

import com.lotus.base.BaseAction;

/**
 * 描述当前类的作用
 * @author Administrator
 * @version 2014-1-18
 * @since 1.0
 * @see
 */
public class MapAction extends BaseAction
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1271285947126506470L;
	
	
	private static MapService service = new MapService();

	/**
	 * 跳转到地图首页
	 * @return
	 */
	public String index()
	{
		request.setAttribute("reqIp", request.getRemoteAddr());
		//获取当前请求的IP
		return "map.index";
	}
	
	/**
	 * 获取当前IP的信息
	 */
	public void locationIp()
	{
		responseJSON(service.getLonlatByIP(request.getParameter("locationIP")));
	}
	
	
}
