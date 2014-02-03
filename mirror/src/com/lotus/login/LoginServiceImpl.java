/*
 * @(#)LoginServiceImpl.java	2014-1-9
 */
package com.lotus.login;

import com.avatar.gdk.util.StringUtils;

/**
 * 描述当前类的作用
 * @author liyan
 * @version 2014-1-9
 * @since 1.0
 * @see 
 */
public class LoginServiceImpl implements LoginService
{

	private LoginDAO dao  = LoginDAO.getInstanceDao();
	
	/* (non-Javadoc)
	 * @see com.lotus.login.LoginService#validateUser(com.lotus.login.User)
	 */
	@Override
	public boolean validateUser(User user)
	{
		boolean flag = false;
		if(null != user && StringUtils.isNotEmpty(user.getUsername()) && StringUtils.isNotEmpty(user.getPassword()))
		{
			if(dao.isUserExist(user)>=1)
			{
				flag = true;
			}
		}
		return flag;
	}
	
}
