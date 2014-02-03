/*
 * @(#)CoreFilter.java	2014-1-9
 */
package com.lotus.core;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 描述当前类的作用
 * @author liyan
 * @version 2014-1-9
 * @since 1.0
 * @see 
 */
public class CoreFilter implements Filter
{
	
	 protected FilterConfig filterConfig;
	 protected ServletContext sContext;
	 protected String encoding;
	
	@Override
	public void destroy()
	{
		this.encoding = null;
	    this.filterConfig = null;
	    this.sContext = null;
		
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException
	{
		 RequestContext rc = RequestContext.init(this.sContext, (HttpServletRequest)req, (HttpServletResponse)res, this.encoding);
	    try
	    {
	      rc.getResponse().setHeader("P3P", "CP='IDC DSP COR ADM DEVi TAIi PSA PSD IVAi CONi HIS OUR IND CNT'");

	      rc.getRequest().setAttribute("theme", "default");

	      chain.doFilter(rc.getRequest(), rc.getResponse());
	    }
	    finally {
	      if (rc != null) {
	        rc.clear();
	        rc = null;
	      }
	    }
		
	}

	@Override
	public void init(FilterConfig fConfig) throws ServletException
	{
		this.filterConfig = fConfig;
	    this.sContext = fConfig.getServletContext();
	    this.encoding = fConfig.getInitParameter("encoding");
		
	}
	
}
