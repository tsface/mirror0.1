/*
 * @(#)LoginDAO.java	2014-1-9
 */
package com.lotus.login;

import com.avatar.db.DBFactory;
import com.avatar.db.jdbc.JdbcHandler;
import com.lotus.base.BaseDAO;
import com.lotus.common.Global;

/**
 * 描述当前类的作用
 * @author liyan
 * @version 2014-1-9
 * @since 1.0
 * @see 
 */
public class LoginDAO extends BaseDAO
{
	private JdbcHandler jdbcHandler = DBFactory.create(Global.DATABASE_WEIXIN);
	
	/**
	 * 访问数据库的实例是单例，构造方法私有化
	 */
	private LoginDAO()
	{
	}
	
	/**
	 * 静态内部类保证线程安全
	 * @author liyan
	 * @version 2014-1-9
	 * @since 1.0
	 * @see LoginDAO
	 */
	private static class SingletonHolder
	{
		static final LoginDAO dao = new LoginDAO();
	}
	
	/**
	 * 获取数据库操作实例
	 * @return
	 */
	public static final LoginDAO getInstanceDao()
	{
		return SingletonHolder.dao;
	}
	
	/**
	 * 检查用户是不是存在
	 * @param user
	 * @return 存在返回 > 0
	 */
	public int isUserExist(User user)
	{
		String sql = "SELECT COUNT(*) FROM tb_user WHERE username = '"+user.getUsername()+"' AND pwd = '"+user.getPassword()+"'";
		
		return jdbcHandler.queryForInteger(sql);
	}
}
