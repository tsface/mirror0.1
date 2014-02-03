/*
 * @(#)WeiXinService.java 2014-1-13
 */
package com.lotus.weixin.service;

import java.util.Date;
import java.util.Map;

import com.avatar.gdk.util.StringUtils;
import com.lotus.weixin.message.resp.TextMessage;
import com.lotus.weixin.message.utils.MessageUtil;

/**
 * 描述当前类的作用
 * @author Administrator
 * @version 2014-1-13
 * @since 1.0
 * @see
 */
public class WeiXinService
{
	public String processRequest(Map<String, String> requestMap)
	{
		String respMessage = null; 
		try {  
            // 默认返回的文本消息内容  
            String respContent = "请求处理异常，请稍候尝试！";  
  
            // 发送方帐号（open_id）  
            String fromUserName = requestMap.get("FromUserName");  
            // 公众帐号  
            String toUserName = requestMap.get("ToUserName");  
            // 消息类型  
            String msgType = requestMap.get("MsgType");  
  
            // 回复文本消息  
            TextMessage textMessage = new TextMessage();  
            textMessage.setToUserName(fromUserName);  
            textMessage.setFromUserName(toUserName);  
            textMessage.setCreateTime(new Date().getTime());  
            textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
            textMessage.setFuncFlag(0);  
            
            // 文本消息  
            if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT)) {
            	return buildTextMsgXml(requestMap);
            }  
            // 图片消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_IMAGE)) {  
                respContent = "/:p-(您发送的是图片消息！暂时处理不了哎！";  
            }  
            // 地理位置消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LOCATION)) {  
                respContent = "/:p-(您发送的是地理位置消息！暂时处理不了哎！";  
            }  
            // 链接消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LINK)) {  
                respContent = "/:p-(您发送的是链接消息！暂时处理不了哎！";  
            }  
            // 音频消息  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_VOICE)) {  
                respContent = "/:p-(您发送的是音频消息！暂时处理不了哎！";  
            }  
            // 事件推送  
            else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_EVENT)) {  
                // 事件类型  
                String eventType = requestMap.get("Event");  
                // 订阅  
                if (eventType.equals(MessageUtil.EVENT_TYPE_SUBSCRIBE)) {  
                    respContent = "谢谢您的关注！";  
                }  
                // 取消订阅  
                else if (eventType.equals(MessageUtil.EVENT_TYPE_UNSUBSCRIBE)) {  
                    // TODO 取消订阅后用户再收不到公众号发送的消息，因此不需要回复消息  
                }  
                // 自定义菜单点击事件  
                else if (eventType.equals(MessageUtil.EVENT_TYPE_CLICK)) {  
                    // TODO 自定义菜单权没有开放，暂不处理该类消息  
                }  
            }  
  
            textMessage.setContent(respContent);  
            respMessage = MessageUtil.textMessageToXml(textMessage);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return respMessage;  
    }
	
	/** 
	 * xiaoqrobot的主菜单 
	 *  
	 * @return 
	 */  
	public static String getMainMenu() {  
	    StringBuffer buffer = new StringBuffer();  
	    buffer.append("您好，请回复数字选择服务：").append("\n\n");  
	    buffer.append("1 IP地址查询").append("\n");  
	    buffer.append("2   再没有了").append("\n");  
	    buffer.append("回复“?”显示此帮助菜单");  
	    return buffer.toString();  
	}
	
	public String buildTextMsgXml(Map<String, String> requestMap)
	{
		// 发送方帐号（open_id）  
        String fromUserName = requestMap.get("FromUserName");  
        // 公众帐号  
        String toUserName = requestMap.get("ToUserName");  
        // 消息类型  
        String reqContent = requestMap.get("Content");
		// 回复文本消息  
        TextMessage textMessage = new TextMessage();  
        textMessage.setToUserName(fromUserName);  
        textMessage.setFromUserName(toUserName);  
        textMessage.setCreateTime(new Date().getTime());  
        textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);  
        textMessage.setFuncFlag(0);
		if(StringUtils.isNotEmpty(reqContent) )
		{
			if("?".equals(reqContent))
			{
				textMessage.setContent(getMainMenu());
			}else if("1".equals(reqContent))
			{
				// 获取网页源代码  
		        //String html = httpRequest("http://ip.taobao.com/service/getIpInfo.php?ip=127.0.0.1");
				textMessage.setContent("格式：IP:+IP地址"+"\n\n例如：IP:127.0.0.1");
		        
			}else if("李玲".equals(reqContent))
			{
				textMessage.setContent("我的女朋友/::$");
			}else
			{
				textMessage.setContent(getMainMenu());
			}
		}else
		{
			textMessage.setContent(getMainMenu());
		}
		return MessageUtil.textMessageToXml(textMessage);
	}
}
