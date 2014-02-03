/*
 * @(#)RequestContext.java	2014-1-9
 */
package com.lotus.core;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 描述当前类的作用
 * 
 * @author liyan
 * @version 2014-1-9
 * @since 1.0
 * @see
 */
public final class RequestContext
{
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private static final ThreadLocal<RequestContext> LOCAL_CONTEXT = new ThreadLocal();
	@SuppressWarnings("unused")
	private static final String ENCODEING = "UTF-8";
	private ServletContext servletContext = null;
	private HttpSession session = null;
	private HttpServletRequest request = null;
	private HttpServletResponse response = null;
	private static final String webRootPath = _getWebRootPath();

	public static RequestContext init(ServletContext sContext,
			HttpServletRequest req, HttpServletResponse res)
	{
		return init(sContext, req, res, "UTF-8");
	}

	public static RequestContext init(ServletContext sContext,
			HttpServletRequest req, HttpServletResponse res, String _encoding)
	{
		RequestContext rc = new RequestContext();
		rc.servletContext = sContext;
		rc.request = autoWrapRequest(req, (_encoding == null) ? "UTF-8"
				: _encoding);
		rc.response = res;
		rc.response.setCharacterEncoding((_encoding == null) ? "UTF-8"
				: _encoding);
		rc.session = req.getSession(false);

		LOCAL_CONTEXT.set(rc);
		return rc;
	}

	public static RequestContext get()
	{
		return ((RequestContext) LOCAL_CONTEXT.get());
	}

	private static final String _getWebRootPath()
	{
		String root = RequestContext.class.getResource("/").getFile();
		try
		{
			root = new File(root).getParentFile().getParentFile().getCanonicalPath();
			root = root + File.separator;
		} catch (IOException e)
		{
			throw new RuntimeException(e);
		}

		return root;
	}

	public ServletContext getServletContext()
	{
		return this.servletContext;
	}

	public HttpSession getSession()
	{
		return this.session;
	}

	public HttpServletRequest getRequest()
	{
		return this.request;
	}

	public HttpServletResponse getResponse()
	{
		return this.response;
	}

	public static String getWebRootPath()
	{
		return webRootPath;
	}

	public String getContextPath()
	{
		return this.request.getContextPath();
	}

	public String getBasePath()
	{
		return this.request.getScheme() + "://" + this.request.getServerName()
				+ ":" + this.request.getServerPort()
				+ this.request.getContextPath();
	}

	public String getServletPath()
	{
		return this.request.getServletPath();
	}

	public String getRequestURI()
	{
		return this.request.getRequestURI();
	}

	public String getQueryString()
	{
		return this.request.getQueryString();
	}

	public String getParameter(String param)
	{
		return this.request.getParameter(param);
	}

	public String[] getParameterValues(String param)
	{
		return this.request.getParameterValues(param);
	}

	public Map<String, String[]> getParameterMap()
	{
		return this.request.getParameterMap();
	}

	public Enumeration<String> getParameterNames()
	{
		return this.request.getParameterNames();
	}

	public void redirect(String uri) throws IOException
	{
		this.response.sendRedirect(uri);
	}

	public void forward(String uri) throws ServletException, IOException
	{
		RequestDispatcher rd = this.servletContext.getRequestDispatcher(uri);
		rd.forward(this.request, this.response);
	}

	public void include(String uri) throws ServletException, IOException
	{
		RequestDispatcher rd = this.servletContext.getRequestDispatcher(uri);
		rd.include(this.request, this.response);
	}

	public Cookie getCookie(String cookieName)
	{
		Cookie[] cookies = this.request.getCookies();
		if ((cookies == null) || (cookies.length == 0))
		{
			return null;
		}

		for (Cookie cookie : cookies)
		{
			if (cookie.getName().equals(cookieName))
				return cookie;

		}

		return null;
	}

	public String getCookieValue(String cookieName)
	{
		Cookie _cookie = getCookie(cookieName);
		if (_cookie == null)
		{
			return null;
		}

		return _cookie.getValue();
	}

	public void addCookie(String name, String value, int maxAge)
	{
		addCookie(name, value, null, "/", maxAge);
	}

	public void addCookie(String name, String value, String domain,
			String path, int maxAge)
	{
		Cookie cookie = new Cookie(name, value);
		if (domain != null)
			cookie.setDomain(domain);

		cookie.setMaxAge(maxAge);
		cookie.setPath(path);

		this.response.addCookie(cookie);
	}

	public void deleteCookie(String name)
	{
		addCookie(name, null, "", "/", 0);
	}

	public void deleteCookie(String name, String domain, String path)
	{
		addCookie(name, null, domain, path, 0);
	}

	public Locale getLocale()
	{
		return this.request.getLocale();
	}

	public String getIP()
	  {
	    String ip = this.request.getHeader("X-Forwarded-For");
	    if ((ip != null) && (ip.trim().length() > 0))
	    {
	      String[] ips = ip.split(",");
	      if ((ips != null) && (ips.length > 0))
	      {
	        for (String tmpip : ips)
	        {
	          if (tmpip != null) { if (tmpip.trim().length() == 0)
	            {
	              break ;
	            }

	            tmpip = tmpip.trim();
	            if (isIPAddr(tmpip))
	            {
	              return tmpip;
	            }
	          }
	        }
	      }
	    }
	    ip = this.request.getHeader("x-real-ip");
	    if (isIPAddr(ip))
	    {
	      return ip;
	    }

	    ip = this.request.getRemoteAddr();
	    return ip;
	  }

	public void responseHTML(String html)
	{
		doResponse(html, "text/html;charset=utf-8");
	}

	public void responseXML(String xml)
	{
		doResponse(xml, "text/xml;charset=utf-8");
	}

	public void responseJSON(String jsonStr)
	{
		doResponse(jsonStr, "application/json;charset=utf-8");
	}

	private void doResponse(String content, String contentType)
	{
		this.response.setHeader("Pragma", "No-cache");
		this.response.setHeader("Cache-Control", "no-cache");
		this.response.setDateHeader("Expires", 0L);
		this.response.setContentType(contentType);

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

	public static boolean isMultipartRequest(HttpServletRequest req)
	{
		String type = null;
		String type1 = req.getHeader("Content-Type");
		String type2 = req.getContentType();

		if ((type1 == null) && (type2 != null))
		{
			type = type2;
		} else if ((type2 == null) && (type1 != null))
		{
			type = type1;
		} else if ((type1 != null) && (type2 != null))
		{
			type = (type1.length() > type2.length()) ? type1 : type2;
		}

		return (("POST".equals(req.getMethod().toUpperCase()))
				&& (type != null) && (type.toLowerCase()
				.startsWith("multipart/form-data")));
	}

	private static boolean isIPAddr(String addr)
	{
		if ((addr == null) || (addr.trim().length() == 0))
		{
			return false;
		}

		String[] ips = addr.split("\\.");
		if (ips.length != 4)
			return false;

		try
		{
			int ipa = Integer.parseInt(ips[0]);
			int ipb = Integer.parseInt(ips[1]);
			int ipc = Integer.parseInt(ips[2]);
			int ipd = Integer.parseInt(ips[3]);

			return ((ipa >= 0) && (ipa <= 255) && (ipb >= 0) && (ipb <= 255)
					&& (ipc >= 0) && (ipc <= 255) && (ipd >= 0) && (ipd <= 255));
		} catch (Exception e)
		{
		}
		return false;
	}

	public void clear()
	{
		this.servletContext = null;
		this.request = null;
		this.response = null;
		this.session = null;

		LOCAL_CONTEXT.set(null);
		LOCAL_CONTEXT.remove();
	}

	private static HttpServletRequest autoWrapRequest(HttpServletRequest req,
			String _encoding)
	{
		if (req instanceof RequestProxyWrapper)
		{
			return req;
		}

		HttpServletRequest auto_wrap_req = req;

		if ("GET".equals(req.getMethod().toUpperCase()))
			auto_wrap_req = new RequestProxyWrapper(req, _encoding);

		try
		{
			auto_wrap_req.setCharacterEncoding(_encoding);
		} catch (UnsupportedEncodingException e)
		{
		}

		return auto_wrap_req;
	}

	private static class RequestProxyWrapper extends HttpServletRequestWrapper
	{
		private String charsetEncoding = "UTF-8";

		public RequestProxyWrapper(HttpServletRequest request)
		{
			super(request);
		}

		public RequestProxyWrapper(HttpServletRequest request,
				String _charsetEncoding)
		{
			super(request);
			this.charsetEncoding = _charsetEncoding;
		}

		public String getParameter(String name)
		{
			String value = super.getParameter(name);
			return decodeParamValue(value);
		}

		public Map<String, String[]> getParameterMap()
		{
			Map<?,?> params = super.getParameterMap();
			Map<String,String[]> new_params = new HashMap<String,String[]>();
			for (Map.Entry<?,?> entry : params.entrySet())
			{
				String key = (String) entry.getKey();
				String[] oValues = (String[]) entry.getValue();
				if (oValues != null)
				{
					String[] new_values = new String[oValues.length];
					int i = 0;
					for (int len = oValues.length; i < len; ++i)
						new_values[i] = decodeParamValue(oValues[i]);

					new_params.put(key, new_values);
				}
			}
			return new_params;
		}

		public String[] getParameterValues(String name)
		{
			String[] values = super.getParameterValues(name);
			if ((values == null) || (values.length == 0))
			{
				return values;
			}

			int i = 0;
			for (int len = values.length; i < len; ++i)
			{
				values[i] = decodeParamValue(values[i]);
			}

			return values;
		}

		private String decodeParamValue(String value)
		{
			if ((value == null) || (value.trim().length() == 0))
				return value;

			try
			{
				return new String(value.getBytes("ISO-8859-1"),
						this.charsetEncoding);
			} catch (Exception e)
			{
			}
			return value;
		}
	}
}
