/*
 * @(#)Page.java	2014-1-9
 */
package com.lotus.base;

import com.avatar.gdk.util.PagerUtils;

/**
 * 描述当前类的作用
 * 
 * @author liyan
 * @version 2014-1-9
 * @since 1.0
 * @see
 */
public class Page extends PagerUtils
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7103548705543306044L;
	private String token;
	private String searchid;

	public Page()
	{
	}

	public Page(int pageno, int pagesize)
	{
		setPageNo(pageno);
		setPageSize(pagesize);
	}

	public String getToken()
	{
		return this.token;
	}

	public void setToken(String token)
	{
		this.token = token;
	}

	public String getSearchid()
	{
		return this.searchid;
	}

	public void setSearchid(String searchid)
	{
		this.searchid = searchid;
	}

	public void setTotalRows(int totalRows)
	{
		super.setTotalRows(totalRows);

		int realPageCount = (getTotalRows() % getPageSize() == 0) ? getTotalRows()
				/ getPageSize()
				: getTotalRows() / getPageSize() + 1;
		if (getPageNo() > realPageCount)
		{
			setPageNo(1);
		}

	}
}
