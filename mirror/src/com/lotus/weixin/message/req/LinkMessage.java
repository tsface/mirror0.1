/*
 * @(#)LinkMessage.java 2014-1-13
 */
package com.lotus.weixin.message.req;

/**
 * 描述当前类的作用
 * 
 * @author Administrator
 * @version 2014-1-13
 * @since 1.0
 * @see
 */
public class LinkMessage extends BaseMessage
{
	// 消息标题
	private String Title;
	// 消息描述
	private String Description;
	// 消息链接
	private String Url;

	public String getTitle()
	{
		return Title;
	}

	public void setTitle(String title)
	{
		Title = title;
	}

	public String getDescription()
	{
		return Description;
	}

	public void setDescription(String description)
	{
		Description = description;
	}

	public String getUrl()
	{
		return Url;
	}

	public void setUrl(String url)
	{
		Url = url;
	}
}
