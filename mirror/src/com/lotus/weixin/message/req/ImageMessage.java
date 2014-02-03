/*
 * @(#)ImageMessage.java 2014-1-13
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
public class ImageMessage extends BaseMessage
{
	// 图片链接
	private String PicUrl;

	public String getPicUrl()
	{
		return PicUrl;
	}

	public void setPicUrl(String picUrl)
	{
		PicUrl = picUrl;
	}
}
