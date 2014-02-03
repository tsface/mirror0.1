/*
 * @(#)VoiceMessage.java 2014-1-13
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
public class VoiceMessage extends BaseMessage
{
	// 媒体ID
	private String MediaId;
	// 语音格式
	private String Format;

	public String getMediaId()
	{
		return MediaId;
	}

	public void setMediaId(String mediaId)
	{
		MediaId = mediaId;
	}

	public String getFormat()
	{
		return Format;
	}

	public void setFormat(String format)
	{
		Format = format;
	}
}
