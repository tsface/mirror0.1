/*
 * @(#)WeiXinAction.java 2014-1-13
 */
package com.lotus.weixin.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.lotus.base.BaseAction;
import com.lotus.weixin.message.utils.MessageUtil;
import com.lotus.weixin.message.utils.SignUtil;

/**
 * 描述当前类的作用
 * 
 * @author Administrator
 * @version 2014-1-13
 * @since 1.0
 * @see
 */
public class WeiXinAction extends BaseAction
{
	WeiXinService service = null;
	/**
	 * 
	 */
	private static final long serialVersionUID = 6692354466902399230L;

	/**
	 * 分发控制方法
	 */
	public void proxyService()
	{
		String method = ServletActionContext.getRequest().getMethod();
		System.out.println("-----当前请求的方法名称-------->"+method);
		if(method.equals("POST"))
		{
			try
			{
				corePostService();
			} catch (Exception e)
			{
				System.out.println("调用post的时候出错了...");
				e.printStackTrace();
			}

		}else{
			System.out.println("GET请求");
			try
			{
				echoValidate2WeiXin();
			} catch (IOException e)
			{
				System.out.println("调用get的时候出错了...");
				e.printStackTrace();
			}
		}
	}
	
	
	/**
	 * 相应POST请求
	 * @throws Exception
	 */
	public void corePostService() throws Exception
	{
		// 将请求、响应的编码均设置为UTF-8（防止中文乱码）
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		// xml请求解析
		Map<String, String> requestMap = MessageUtil.parseXml(request);
		// 调用核心业务类接收消息、处理消息
		service = new WeiXinService();
		String respMessage = service.processRequest(requestMap);

		// 响应消息
		PrintWriter out = response.getWriter();
		out.print(respMessage);
		out.close();
	}

	/**
	 * 相应微信的GET请求
	 * @throws IOException
	 */
	public void echoValidate2WeiXin() throws IOException
	{
		// 微信加密签名
		String signature = request.getParameter("signature");
		// 时间戳
		String timestamp = request.getParameter("timestamp");
		// 随机数
		String nonce = request.getParameter("nonce");
		// 随机字符串
		String echostr = request.getParameter("echostr");

		PrintWriter out = response.getWriter();
		// 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败
		if (SignUtil.checkSignature(signature, timestamp, nonce))
		{
			out.print(echostr);
		}
		out.close();
		out = null;
	}
}
