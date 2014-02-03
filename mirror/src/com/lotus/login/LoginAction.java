/*
 * @(#)LoginAction.java	2014-1-9
 */
package com.lotus.login;

import com.lotus.base.BaseActionLotus;


/**
 * 描述当前类的作用
 * @author liyan
 * @version 2014-1-9
 * @since 1.0
 * @see 
 */
public class LoginAction extends BaseActionLotus
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6997345089294823942L;
	
	private static LoginService service = null;
	
	/**
	 * 用户对象
	 */
	private User user = null;

	/**
	 * 跳转到首页
	 * @return
	 */
	public String index()
	{
		return "index";
	}
	
	/**
	 * 验证用户是不是存在
	 */
	public void validateUser()
	{
		service = new LoginServiceImpl();
		responseJSON(String.valueOf(service.validateUser(user)));
	}

	/**
	 * 登录成功跳转到相应的页面
	 * @return
	 */
	public String login()
	{
		return "success";
	}

	public User getUser()
	{
		return user;
	}


	public void setUser(User user)
	{
		this.user = user;
	}
}
