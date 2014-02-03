// 实现ChinaMap中的redraw方法
ChinaMap.prototype.redraw = function(state_data){
	// 获取地图基础数据
	var mapData = this.getMapData();
	// 重置地图填充色为初始配置颜色
	for( var i = 0, len = mapData.length; i < len; ++i ){
		mapData[i]["Rpath"].animate({"fill":this.defProps.fillcolor}, 400);
		mapData[i].title = "";
		mapData[i].count = "0";
	}
	
	if( !state_data ){
		return;
	}
	
	// 计算数量中最大值，用于计算颜色值
	var maxC = 0;
 	for( var k in state_data ){
 		var c = parseInt(state_data[k]["count"]);
 		if( c > maxC ){
 			maxC = c;
 		}
 	}
 	
 	if( maxC == 0 ){
 		return;
 	}
	
	// 根据返回的数据填充地图
	for( var i = 0, len = mapData.length; i < len; ++i ){
		var code = mapData[i]["code"];
		if( state_data[code] ){
			// 计算颜色值
			var c = parseInt(state_data[code].count);
			var cl = Math.round((1-c/maxC)*200);
			
			var _color = (c == 0 ? this.defProps.fillcolor : "RGB(255,"+cl+","+cl+")");
			
			mapData[i]["Rpath"].animate({"fill":_color}, 400);
			mapData[i].title = state_data[code].title;
			mapData[i].count = c;
		}
	}
};