/*
 * @(#)MusicMessage.java 2014-1-13
 */
package com.lotus.weixin.message.resp;

import com.lotus.weixin.message.obj.Music;

/**
 * 描述当前类的作用
 * 
 * @author Administrator
 * @version 2014-1-13
 * @since 1.0
 * @see
 */
public class MusicMessage extends BaseMessageResp
{
	// 音乐
	private Music Music;

	public Music getMusic()
	{
		return Music;
	}

	public void setMusic(Music music)
	{
		Music = music;
	}
}
