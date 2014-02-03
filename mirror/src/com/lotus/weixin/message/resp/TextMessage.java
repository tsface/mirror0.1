/*
 * @(#)TextMessage.java 2014-1-13
 */
package com.lotus.weixin.message.resp;

/**
 * 描述当前类的作用
 * 
 * @author Administrator
 * @version 2014-1-13
 * @since 1.0
 * @see
 */
public class TextMessage extends BaseMessageResp
{
	// 回复的消息内容
	private String Content;

	public String getContent()
	{
		return Content;
	}

	public void setContent(String content)
	{
		Content = content;
	}
}
