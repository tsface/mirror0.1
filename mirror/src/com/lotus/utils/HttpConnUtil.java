/*
 * @(#)HttpConnUtil.java 2014-1-18
 */
package com.lotus.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;

import com.avatar.gdk.util.StringUtils;
import com.avatar.gdk.util.XMLUtils;
import com.lotus.common.Global;

/**
 * 描述当前类的作用
 * @author liyan
 * @version 2014-1-18
 * @since 1.0
 * @see
 */
public class HttpConnUtil extends XMLUtils
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7508620546307892182L;
	
	private static final String OPEN_CFG =Global.SYSTEM_PATH+"config/openApi-cfg.xml";

	/** 
     * 发起http get请求获取网页源代码 
     *  
     * @param requestUrl 
     * @return 
     */  
	public static String httpRequest(String requestUrl) {  
        StringBuffer buffer = null;  
        try {  
            // 建立连接  
            URL url = new URL(requestUrl);  
            HttpURLConnection httpUrlConn = (HttpURLConnection) url.openConnection();  
            httpUrlConn.setDoInput(true);  
            httpUrlConn.setRequestMethod("GET");  
  
            // 获取输入流  
            InputStream inputStream = httpUrlConn.getInputStream();  
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");  
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);  
  
            // 读取返回结果  
            buffer = new StringBuffer();  
            String str = null;  
            while ((str = bufferedReader.readLine()) != null) {  
                buffer.append(str);  
            }  
  
            // 释放资源  
            bufferedReader.close();  
            inputStreamReader.close();  
            inputStream.close();  
            httpUrlConn.disconnect();  
        } catch (Exception e) {
        	System.out.println("出错了，你知道吗!!!");
            e.printStackTrace();  
        }  
        return buffer.toString();  
    }
    
    /**
     * 根据服务名称获取服务的url
     * @param name
     * @return
     */
    public static final String getBaiDuCfg(String name)
    {
    	String value = "";
    	Document doc = null;
		try
		{
			doc = XMLUtils.getDocumentFromFilepath(OPEN_CFG);
		} catch (IOException e)
		{
			System.out.println("获取文件"+OPEN_CFG+"出错");
			e.printStackTrace();
		}
    	List<Map<String, String>> nodeInfoList = XMLUtils.getNodeInfoList(doc,"api/baidu/service");
    	for(int i=0,length=(nodeInfoList!=null?nodeInfoList.size():0);i<length;i++)
    	{
    		Map<String, String> map = nodeInfoList.get(i);
    		String nodeName = map.get("name");
    		if(StringUtils.isNotEmpty(nodeName) && name.equals(nodeName))
    		{
    			value = map.get("value");
    			break;
    		}
    	}
    	return value;
    }
}
