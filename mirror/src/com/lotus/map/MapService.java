/*
 * @(#)MapService.java 2014-1-18
 */
package com.lotus.map;

import net.sf.json.JSONObject;

import com.avatar.gdk.util.StringUtils;
import com.lotus.utils.HttpConnUtil;

/**
 * 描述当前类的作用
 * @author liyan
 * @version 2014-1-18
 * @since 1.0
 */
public class MapService
{
	/**
	 * 定位一个IP的位置
	 * @param ip
	 * @return
	 */
	public String getLonlatByIP(String ip)
	{
		String locationInfo ="";
		if(StringUtils.isNotEmpty(ip))
		{
			String reqUrl = HttpConnUtil.getBaiDuCfg("ip");
			
			if(StringUtils.isNotEmpty(reqUrl))
			{
				StringBuffer reqObj = new StringBuffer(reqUrl);
				reqObj.append("?ak=");
				reqObj.append(HttpConnUtil.getBaiDuCfg("accessKey"));
				reqObj.append("&coor=bd09ll");
				reqObj.append("&ip=");
				reqObj.append(ip);
				locationInfo = HttpConnUtil.httpRequest(reqObj.toString());
			}
		}
		
		return locationInfo;
	}
}
