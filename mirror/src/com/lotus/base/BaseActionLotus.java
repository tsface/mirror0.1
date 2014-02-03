/*
 * @(#)BaseActionLotus.java 2014-1-11
 */
package com.lotus.base;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.util.ServletContextAware;

import com.opensymphony.xwork2.ActionSupport;


/**
 * 描述当前类的作用
 * @author Administrator
 * @version 2014-1-11
 * @since 1.0
 * @see
 */
public class BaseActionLotus extends ActionSupport implements ServletContextAware,ServletRequestAware, ServletResponseAware
{
	protected transient ServletContext servletContext;
	protected transient HttpServletRequest request;
	protected transient HttpServletResponse response;
	@Override
	public void setServletResponse(HttpServletResponse resp)
	{
		this.response = resp;
		noResponseCache();
	}
	
	@Override
	public void setServletRequest(HttpServletRequest req)
	{
		this.request = req;
	
	}
	
	@Override
	public void setServletContext(ServletContext sc)
	{
		this.servletContext = sc;
	
	}
	
	public void responseHTML(String html)
	{
		doResponse(html, new String[]{ "text/html;charset=utf-8" });
	}
	
	public void responseXML(String xml)
	{
		doResponse(xml, new String[]{ "text/xml;charset=utf-8" });
	}
	
	public void doResponseJavaScript(String func)
	{
		doResponse("<script type=\"text/javascript\">" + func + "</script>",new String[0]);
	}
	
	public void responseText(String text)
	{
		doResponse(text, new String[]{ "text/plain; chartset=utf-8" });
	}
	
	public void responseJSON(String jsonStr)
	{
		doResponse(jsonStr, new String[]{ "application/json;charset=utf-8" });
	}
	
	public void doResponse(Object content, String[] contentType)
	{
		noResponseCache();
		this.response.setContentType("text/html;charset=utf-8");
		if ((null != contentType) && (contentType.length > 0))
		{
			this.response.setContentType(contentType[0]);
		}
	
		PrintWriter writer = null;
		try
		{
			writer = this.response.getWriter();
			writer.print(content);
		} catch (IOException e)
		{
			e.printStackTrace();
		} finally
		{
			if (null != writer)
			{
				writer.flush();
				writer.close();
				writer = null;
			}
		}
	}
	
	private void noResponseCache()
	{
		this.response.setHeader("Pragma", "No-cache");
		this.response.setHeader("Cache-Control", "no-cache");
		this.response.setDateHeader("Expires", 0L);
	}
}
