<%@ page language="java" import="java.util.*,java.io.*,sun.misc.BASE64Decoder" pageEncoding="UTF-8"%><%!
public static boolean generateBase64Image(String imgData, File destFile) {
	if(imgData == null || imgData.trim().length() == 0) {
		return false;
	}
	// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+...
	if(imgData.startsWith("data:image/png;base64,")) {
		imgData = imgData.substring(imgData.indexOf(',')+1);
	}
	
	BASE64Decoder decoder = new BASE64Decoder();
	OutputStream out = null;
	try {
		byte[] bs = decoder.decodeBuffer(imgData);
		for(int i = 0; i < bs.length; i++) {
			if(bs[i] < 0) {
				bs[i] += 256;
			}
		}
		
		out = new FileOutputStream(destFile);
		out.write(bs);
		out.flush();
		
		return true;
	}catch(IOException e) {
		return false;
	}finally {
		try {
			if(out != null) {
				out.close();
			}
		}catch(IOException e) {
		}
	}
}
%><% 
	String largeData = request.getParameter("large"); // 大图片数据 180x180
	String normalData = request.getParameter("normal"); // 中图片数据 50x50
	String smallData = request.getParameter("small"); // 小图片数据 30x30
	
	boolean res = generateBase64Image(normalData, new File("I:\\a.png"));
	res &= generateBase64Image(largeData, new File("I:\\b.png"));
	res &= generateBase64Image(smallData, new File("I:\\c.png"));
	
	response.setContentType("application/json;charset=utf-8");
	out.println("{\"state\":"+(res?1:0)+"}");
%>