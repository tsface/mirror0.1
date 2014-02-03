/*
 * @(#)NewsMessage.java 2014-1-13
 */
package com.lotus.weixin.message.resp;

import java.util.List;

import com.lotus.weixin.message.obj.Article;

/**
 * 描述当前类的作用
 * @author Administrator
 * @version 2014-1-13
 * @since 1.0
 * @see
 */
public class NewsMessage extends BaseMessageResp
{
	 // 图文消息个数，限制为10条以内  
    private int ArticleCount;  
    // 多条图文消息信息，默认第一个item为大图  
    private List<Article> Articles;  
  
    public int getArticleCount() {  
        return ArticleCount;  
    }  
  
    public void setArticleCount(int articleCount) {  
        ArticleCount = articleCount;  
    }  
  
    public List<Article> getArticles() {  
        return Articles;  
    }  
  
    public void setArticles(List<Article> articles) {  
        Articles = articles;  
    }
}
