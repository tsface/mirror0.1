/**
 * 关系图
 * version: 1.0beta
 * author: yswang
 * 2013/4/27 update
 */
;(function(window, document, d3, undefined){
	var colors = ["#696969", "#006ac1", "#691bb8", "#f4b300", "#008287", 
				"#78ba00", "#1b58b8", "#2673ec", "#004d60", "#ae113d", 
				"#199900", "#569ce3", "#632f00", "#004a00", "#00d8cc", 
				"#2e1700", "#00aaaa", "#00c13f", "#b01e00", "#15992a",
				"#91d100", "#4e0038", "#e56c19", "#e1b700", "#c1004f", 
				"#ff2e12", "#d39d09", "#7200ac", "#b81b1b", "#ff76bc", 
				"#ff1d77", "#e064b7", "#00a4a4", "#aa40ff", "#ff7d23", 
				"#b81b6c"];
					
	function xNetWork(eleId, options) {
		this.container = document.getElementById(eleId);
		this.options = xNetWork.extend(true, {}, xNetWork.options, options || {});
		
		this.width = parseInt(this.options.width || this.container.clientWidth, 10);
		this.height = parseInt(this.options.height || this.container.clientHeight, 10);
		
		this.init();
	}
	
	xNetWork.prototype.init = function() {
		var self = this;
		//this.color = d3.scale.category10();
		//this.markerColors = {};
		//this.markerColors[__color(colors[0]).substring(1)] = __color(colors[0]);
		
		this.force = d3.layout.force()
						.gravity(self.options.gravity)
						.linkDistance(self.options.linkDistance)
						.linkStrength(self.options.linkStrength)
						.charge(self.options.charge)
						.friction(self.options.friction)
						.size([this.width, this.height]);
		
		this.nodes = [];
		this.links = [];
		this.currentNode = null;
		this.enableHover = true;
		
		var zoom = d3.behavior.zoom()
					.translate([0,0])
					.scale(1)
					.scaleExtent(self.options.zoom.zoomScale)
					.on("zoom", function(){clearSelection(); redraw.call(self);});	
		
		var svg = d3.select(this.container)
						.append("svg:svg")
							.attr("width", this.width)
							.attr("height", this.height);
		
		var _g = svg.append("svg:g");
			_g.append('svg:rect')
				.call(zoom).on("dblclick.zoom", function(){return false;})
				.attr('id', 'zoomCanvas')
				.attr('width', this.width)
				.attr('height', this.height)
				.attr('fill', "#ffffff")
				.attr('class', "xnw-bg");	
		
		this.graph = _g.append("svg:g").attr("transform", "translate(0,0)" + " scale(1)");

		this.defs = this.graph.append("svg:defs");

		//xNetWork.isFunction(self.options.markers) && self.options.markers.call(self, self.defs);
	};
	
	xNetWork.prototype.setDataXMLURL = function(url) {
		var self = this;
		d3.xml(url, "application/xml", function(_xml){
			self.setDataXML(_xml);
		});
	};
	
	xNetWork.prototype.setDataXML = function(xml) {
		var self = this,
			nl = _parseXML(xml), 
			i = 0, s, t, _link;
			
		self.clear(true);
		self.nodes = nl.nodes;
		
		// 处理nl.links中的from, to转换为 source, target
		for(i = nl.links.length - 1; i >= 0; i--) {
			_link = nl.links[i];
			s = _nodeIndexOf(self.nodes, _link.from);
			t = _nodeIndexOf(self.nodes, _link.to);
			
			if( s != -1 && t != -1 ) {
				_link['source'] = s;
				_link['target'] = t;
				self.links.push(_link);
				
				// 统计定义的连线颜色
				/*if(_link.color) {
					self.markerColors[__color(_link.color).substring(1)] = __color(_link.color);
				}*/
			}
		}
		
		self.buildCurved();	
	};
	
	xNetWork.prototype.addDataXMLURL = function(url) {
		var self = this;
		d3.xml(url, "application/xml", function(_xml){
			self.addDataXML(_xml);
		});
	};
	
	xNetWork.prototype.addDataXML = function(xml) {
		var self = this;

		var nl = _parseXML(xml), 
			newNodes = [], 
			newLinks = [],
			bilinks = [],
			i = 0;
		
		for(i = nl.nodes.length - 1; i >= 0; i--) {
			if(_nodeIndexOf(self.nodes, nl.nodes[i].id) == -1) {
				//newNodes.push(nl.nodes[i]);
				self.nodes.push(nl.nodes[i]);
			}
		}
		
		// 处理nl.links中的from,to转换为 source, target
		for(i = nl.links.length - 1; i >= 0; i--) {
			_link = nl.links[i];
			s = _nodeIndexOf(self.nodes, _link.from);
			t = _nodeIndexOf(self.nodes, _link.to);

			if( s != -1 && t != -1 && _linkIndexOf(self.links, s, t) == -1) {
				_link['source'] = s;
				_link['target'] = t;
				self.links.push(_link);
				
				// 统计定义的连线颜色
				/*if(_link.color) {
					self.markerColors[__color(_link.color).substring(1)] = __color(_link.color);
				}*/
			}
		}
		
		if(this.force) {
			this.force.stop();
		}
		
		/*
		newLinks.forEach(function(link) {
			var s = self.nodes[link.source],
				t = self.nodes[link.target],
				i = {}; // intermediate node
			
			newLinks.push({source: s, target: i}, {source: i, target: t});
			bilinks.push([s, i, t , link ]);
		});
		
		self.graph.selectAll("path.link").data(bilinks)
					.enter().insert("path") 
						  .attr("class", function(d){ return "link link_"+ d[3].from +" link_" + d[3].to; })
						  .attr("fill", "none")
						  .style("stroke-width", function(d){ return d[3].weight ? d[3].weight : 1; })
						  .style("stroke", function(d) { 
								return "#aaa";
						  });
		
		self.force.resume();*/
		
		self.clear();
		self.buildCurved();
	
	};
	
	// 解析XML数据文件为JSON格式
	function _parseXML(_xml) {
		if(!_xml) {return {"nodes":[], "links":[]};}
		
		var _nodes = [], _links = [];
		
		var xmlRoot = _xml.documentElement,
			nodes = xmlRoot.getElementsByTagName('node'),
			links = xmlRoot.getElementsByTagName('link'),
			i = 0, j = 0, len = 0, aNode, aLink, attrs, s, t;
			
		for(i = 0, len = nodes.length; i < len; i++) {
			aNode = nodes[i];
			attrs = aNode.attributes;
			if(attrs.length > 0) {
				var p = {group:1};
				for(j = attrs.length - 1; j >= 0; j--) {
					if(attrs[j] == null) { continue; }
					p[attrs[j].nodeName] = attrs[j].nodeValue;
					if('id' == attrs[j].nodeName){
						p['id'] = attrs[j].nodeValue.replace(/[#@:+>~$=*^!\.\[\]\s+]/g, '_');
					}
				}
				
				_nodes.push(p);
			}
		}
		
		for(i = 0, len = links.length; i < len; i++) {
			aLink = links[i];
			attrs = aLink.attributes;
			s = aLink.getAttribute("from");
			t = aLink.getAttribute("to");
			
			if(s !== null && t !== null) {
				var p = {};
				for(j = attrs.length - 1; j >= 0; j--) {
					if(attrs[j] == null) { continue; }
					p[attrs[j].nodeName] = attrs[j].nodeValue;
					if('from' == attrs[j].nodeName || 'to' == attrs[j].nodeName){
						p[attrs[j].nodeName] = attrs[j].nodeValue.replace(/[#@:+>~$=*^!\.\[\]\s+]/g, '_');
					}
				}
				
				_links.push(p);
			}
		}
	
		return {"nodes":_nodes, "links": _links};
	};
	
	xNetWork.prototype.clear = function(clearAll) {
		this.graph.selectAll("g.node").remove(); 
		this.graph.selectAll("g.edge").remove();
		this.defs.selectAll("marker").remove();
		
		if(clearAll) {
			this.nodes = [];
			this.links = []; 
		}
		this.force.nodes([]);
		this.force.links([]);
	};
	
	// 节点连接线是平滑的曲线
	xNetWork.prototype.buildCurved = function() {
		var self = this,
			nodes = this.nodes.slice(),
			links = [],
			bilinks = [];
		
		if(this.force) {
			this.force.stop();
		}
		
		// 创建箭头
		/*for(var c in self.markerColors) {
			createMarker(self.defs, self.markerColors[c]);
		}*/
		
		this.links.forEach(function(link) {
			var s = nodes[link.source],
				t = nodes[link.target],
				i = {}; // intermediate node
				
			nodes.push(i);
			links.push({source: s, target: i}, {source: i, target: t});
			bilinks.push([s, i, t , link ]);
		});

		this.force.nodes(nodes).links(links).start();
		
		var node_drag = d3.behavior.drag()
						.on("dragstart", dragstart)
						.on("drag", dragmove)
						.on("dragend", dragend);
		
		// node -- 当前拖曳的节点
		// index -- 当前拖曳的节点下标(第几个节点)
		function dragstart(node, index) {
			clearSelection();
			
			self.force.stop();
			self.enableHover = false;
			
			// 自定义事件
			if(xNetWork.isFunction(self.options.events.nodeDragStart)) {
				self.options.events.nodeDragStart.call(self, node, d3.event.sourceEvent);
			}
			
		}
		function dragmove(node, index) {
			node.px += d3.event.dx;
			node.py += d3.event.dy;
			node.x += d3.event.dx;
			node.y += d3.event.dy;
			//tick();
			tickNode(node);
			
			// 自定义事件
			if(xNetWork.isFunction(self.options.events.nodeDrag)) {
				self.options.events.nodeDrag.call(self, node, d3.event.sourceEvent);
			}
		}
		function dragend(node, index) {
			node.fixed = true;
			//self.force.resume();
			self.enableHover = true;
			
			// 自定义事件
			if(xNetWork.isFunction(self.options.events.nodeDragEnd)) {
				self.options.events.nodeDragEnd.call(self, node, d3.event.sourceEvent);
			}
		}
		
		// 创建边线
		var edge = this.graph.selectAll("g.edge")
					.data(bilinks).enter()
					.append("g")
					.attr("id", function(d){ return "edge_"+ d[3].from +"_" + d[3].to; })
					.attr("class", "edge");
					
		//edge.append("title").text(function(d){ return d[0].label + (d[3].orient && d[3].orient == '2' ? " ⇄ " : " → ") + d[2].label; });
		
		var link = edge.append("path")
					  .attr("class", function(d){ return "link link_"+ d[3].from +" link_" + d[3].to; })
					  .style("fill", "none")
					  .attr("stroke-width", function(d){ return d[3].weight ? d[3].weight : 1; })
					  .attr("stroke", function(d) { 
							return __color(d[3].color);
					  })
					  // firefox下 marker-start 显示正常，但是chrome下不正常
					  /*.attr("marker-start", function(d){ 
							if(d[3].orient && d[3].orient == '2') {
								return "url(#" + (d[3].marker ? d[3].marker : "_sMarker_" + __color(d[3].color).substring(1)) + ")";
							}
							return "";
					  })
					  .attr("marker-end", function(d){ 
							if(d[3].marker || d[3].orient) {
								return "url(#"+ (d[3].marker ? d[3].marker : "_eMarker_" + __color(d[3].color).substring(1)) + ")"; 
							}
							return "";
					  })*/;
					  
		// 使用polygon创建箭头替代defs marker
		edge.selectAll("polygon.marker")
			.data(function(d){ return !d[3].orient ? [] : ( d[3].orient == '1' ? [d] : [d, d] ); })
			.enter().append("polygon")
				.attr("class", function(d, i){ return "marker " + ( i === 0 ? "end-marker" : "start-marker" ) + " marker_" + d[3].from + " marker_" + d[3].to; })
				.attr("points", function(d, i){ var _arrW = d[3].weight ? parseInt(d[3].weight)+2 : 3; return i == 0 ? "0,0 -10,"+ _arrW +" -9,0, -10,-"+_arrW : "0,0 10,-"+ _arrW +" 9,0 10,"+ _arrW; })
				.attr("fill", function(d){ return __color(d[3].color); });

		
		var linkLabel = edge.append("g")
								.attr("class", function(d){ return "link-label LL_"+ d[3].from +" LL_" + d[3].to; })
								.attr("visibility", self.options.link.showLabel ? "visibile" : "hidden");
			
		var _lltext = linkLabel.append("text")
					.style("text-anchor", "middle")
					.attr("class", "link-label-text")
					.style("fill", function(d,i){ return d[3].color ? d[3].color : ""; });
					//.append("tspan").text(function(d){ return d[3].label; });
		
		// 支持文字多行
		_lltext.selectAll("tspan")
				.data(function(d){ return d[3].label ? d[3].label.split('[br/]') : []; })
				.enter().append("tspan")
					.attr("x", 0)
					.attr("dy", function(d, i){ return i == 0 ? 0 : (14 + i); })
					.text(function(d, i){ return d; });
		
		linkLabel.on("mousedown", function(){
			d3.event.preventDefault();
			d3.event.stopPropagation();
			return false;
		});
		
		linkLabel.on("click", function(d){
			xNetWork.isFunction(self.options.events.linkClick)
				&& self.options.events.linkClick.call(self, xNetWork.extend({}, d[0]), xNetWork.extend({}, d[2]), xNetWork.extend({}, d[3]));
				
			//d3.event.preventDefault();
			//d3.event.stopPropagation();	
		});
		
		// 创建节点
		var node = this.graph.selectAll("g.node")
								.data(self.nodes)
								.enter().append("g")
									.attr("id", function(d){ return "node_"+ d.id; })
									.attr("class", "node")
									.call(node_drag); //.call(self.force.drag);
		
		var nw = parseInt(self.options.node.width, 10), 
			nh = parseInt(self.options.node.height, 10);
		
		function _nw(d) {
			return (d.width ? parseInt(d.width, 10) : nw);
		}
		function _nh(d) {
			return (d.height ? parseInt(d.height, 10) : nh);
		}
		
		// 自定义创建节点
		if(xNetWork.isFunction(self.options.node.nodeFormat)) {
			self.options.node.nodeFormat.call(self, node, self.options.node);
		} 
		// 默认节点
		else {
			/*node.attr("w", _nw)
				.attr("h", _nh);
			*/	
			node.append("image")
				  .attr("xlink:href", function(d){return d.icon;})
				  .attr("id", function(d){ return "nodeIcon_"+ d.id;})
				  .attr("class", "node-icon")
				  .attr("x", function(d){ return _nw(d)/2 * -1; })
				  .attr("y", function(d){ return _nh(d)/2 * -1; })
				  .attr("width", _nw)
				  .attr("height", _nh);
			
			var ntext = node.append("text")
					.attr("id", function(d){ return "nodeLabel_"+ d.id; })
					.attr("x", 0)
					.attr("y", function(d){ return _nh(d)/2 + 14; })
					.attr("class","node-label")
					.style("text-anchor", "middle")
					.style("fill", function(d,i) { return d.color ? d.color : ""; })
					.attr("visibility", self.options.node.showLabel ? "visibile" : "hidden");
					/*.text(function(d) {
						return d.label;
					 });*/
					 
			// 支持文字多行
			ntext.selectAll("tspan")
					.data(function(d){ return d.label ? d.label.split('[br/]') : []; })
					.enter().append("tspan")
						.attr("x", 0)
						.attr("dy", function(d, i){ return i == 0 ? 0 : (14 + i); })
						.text(function(d, i){ return d; });
		}
		
		node.on("mouseover", function(d){
			if(!self.enableHover) {
				return;
			}
			
			// 自定义事件
			if(xNetWork.isFunction(self.options.events.nodeHover)) {
				self.options.events.nodeHover.call(self, d, d3.event);
				return;
			}
			
			if(hoverTimer != null) {
				window.clearTimeout(hoverTimer);
				hoverTimer = null;
			}
	
			hoverTimer = window.setTimeout(function(){
				self.highLight(d);
			}, 150);
		})
		.on("mouseout", function(d){
			if(!self.enableHover) {
				return;
			}
			
			// 自定义事件
			if(xNetWork.isFunction(self.options.events.nodeHover)) {
				self.options.events.nodeHover.call(self, null);
				return;
			}
			
			if(hoverTimer != null) {
				window.clearTimeout(hoverTimer);
				hoverTimer = null;
			}
			
			self.unHighLight();
		})
		.on("click", function(_node){
			var _event = d3.event;
			
			if(clickTimer) {
				window.clearTimeout(clickTimer);
				clickTimer = null;
			}
			clickTimer = window.setTimeout(function(){
				if(xNetWork.isFunction(self.options.events.nodeClick)) {
					_node.fixed = true;
					
					self.options.events.nodeClick.call(self, _node, _event);
				}
			// ================================
			// edit by clu on 2013-6-8 11:41:56
			// 加大关系图中单双击判断时间间隔
			// ================================
			}, 400);
			
			d3.event.preventDefault();
			d3.event.stopPropagation();
			
			return false;
		})
		.on("dblclick", function(_node){
			var _event = d3.event;
			
			if(clickTimer) {
				window.clearTimeout(clickTimer);
				clickTimer = null;
			}
			
			if(xNetWork.isFunction(self.options.events.nodeDblClick)) {
				self.options.events.nodeDblClick.call(self, _node, _event);
			}
			
			d3.event.preventDefault();
			d3.event.stopPropagation();
			
			return false;
		});

		function tickNode(aNode) {
			self.graph.selectAll("path.link_"+ aNode.id)
						.attr("d", function(d) {
							//if(d[3].orient && d[3].orient == '2') {
							if(true) {
								// 对于直线，这里直接计算开始点d[0]和终点d[2]连线的交点
								var nxy = null;
								if(self.options.node.nodeStyle == 'circle') {
									nxy = calcLineCutCircleCoor({"cx": d[0].x, "cy": d[0].y, "r": _nw(d[0])/2}, 
																{"cx": d[2].x, "cy": d[2].y, "r": _nw(d[2])/2});
								} else {
									var scw = d[3].orient && d[3].orient == '2' ? 10 : 0,
										ecw = d[3].orient ? 10 : 0;
									nxy = calcLineCutRectCoor({"x": d[0].x, "y": d[0].y, "w": _nw(d[0]) + scw, "h": _nh(d[0]) + scw}, 
																{"x": d[2].x, "y": d[2].y, "w": _nw(d[2]) + ecw, "h": _nh(d[2]) + ecw})
								}
																
								return "M" + nxy.x1 + "," + nxy.y1 + "L" + nxy.x2 + "," + nxy.y2;
							} 
							// 平滑的曲线
							else {
								// 对于曲线，这里计算控制点d[1]和终点d[2]连线的交点在布局上要好于真正的开始点d[0]和终点d[2]连线的交点
								var nxy = null;
								if(self.options.node.nodeStyle == 'circle') {
									nxy = calcLineCutCircleCoor({"cx": d[1].x, "cy": d[1].y, "r": _nw(d[0])/2}, 
																	{"cx": d[2].x, "cy": d[2].y, "r": _nw(d[2])/2});
								} else {
									nxy = calcLineCutRectCoor({"x": d[1].x, "y": d[1].y, "w": _nw(d[0]), "h": _nh(d[0])}, 
																{"x": d[2].x, "y": d[2].y, "w": _nw(d[2]), "h": _nh(d[2])});
								}
										
								return "M" + d[0].x + "," + d[0].y + "S"
											+ d[1].x + "," + d[1].y + " "
											+ nxy.x2 + "," + nxy.y2;
							}	
						});
						
			// 旋转箭头
			self.graph.selectAll("polygon.marker_"+ aNode.id).attr("transform", function(d, i){
				var nxy = null;
				if(self.options.node.nodeStyle == 'circle') {
					nxy = calcLineCutCircleCoor({"cx": d[0].x, "cy": d[0].y, "r": _nw(d[0])/2}, 
												{"cx": d[2].x, "cy": d[2].y, "r": _nw(d[2])/2});
				} else {
					nxy = calcLineCutRectCoor({"x": d[0].x, "y": d[0].y, "w": _nw(d[0]), "h": _nh(d[0])}, 
													{"x": d[2].x, "y": d[2].y, "w": _nw(d[2]), "h": _nh(d[2])})
				}
				
				var deg = 180 / Math.PI * Math.atan2(nxy.y2 - nxy.y1, nxy.x2 - nxy.x1); //旋转弧度 
				
				if(this.getAttribute("class").indexOf("end-marker")!= -1){
					return "translate(" + (nxy.x2) + ", " + (nxy.y2) + ") rotate("+ deg +")";
				} else if(this.getAttribute("class").indexOf("start-marker")!= -1) {
					return "translate(" + (nxy.x1) + ", " + (nxy.y1) + ") rotate("+ deg +")";
				} else {
					return "translate(-100,-100)";
				}
			});
			
			self.graph.selectAll("g.LL_"+ aNode.id)
						.attr("transform", function(d) {
							//if(d[3].orient && d[3].orient == '2') {
							if(true) {
							   // 直线类型下的 line label 坐标计算
								var dx = (d[2].x - d[0].x),
									dy = (d[2].y - d[0].y),
									dr = Math.sqrt(dx * dx + dy * dy),
									offset = (1 - (1 / dr)) / 2,
									x = (d[0].x + dx * offset),
									y = (d[0].y + dy * offset);
									
								return "translate(" + x + ", " + y + ")";
							} else {
								// 曲线类型下的line label 坐标计算
								var x = (d[0].x + d[1].x + d[2].x) / 3,
									y = (d[0].y + d[1].y + d[2].y) / 3;
									
								return "translate(" + x + ", " + y + ")";
							}
						});
			
			self.graph.select("#node_"+ aNode.id)
						.attr("transform", function(d) {
							return "translate(" + d.x + "," + d.y + ")";
						});
		}
		
		function tick() {
			link.attr("d", function(d) {
				// 双向箭头，由于在chrome下曲线双向箭头存在bug，所以这里采用直线
				//if(d[3].orient && d[3].orient == '2') {
				if(true) {
					// 对于直线，这里直接计算开始点d[0]和终点d[2]连线的交点
					var nxy = null;
					if(self.options.node.nodeStyle == 'circle') {
						nxy = calcLineCutCircleCoor({"cx": d[0].x, "cy": d[0].y, "r": _nw(d[0])/2}, 
													{"cx": d[2].x, "cy": d[2].y, "r": _nw(d[2])/2});
					} else {
						var scw = d[3].orient && d[3].orient == '2' ? 10 : 0,
							ecw = d[3].orient ? 10 : 0;
						nxy = calcLineCutRectCoor({"x": d[0].x, "y": d[0].y, "w": _nw(d[0]) + scw, "h": _nh(d[0]) + scw}, 
													{"x": d[2].x, "y": d[2].y, "w": _nw(d[2]) + ecw, "h": _nh(d[2]) + ecw})
					}
													
					return "M" + nxy.x1 + "," + nxy.y1 + "L" + nxy.x2 + "," + nxy.y2;
				} 
				// 平滑的曲线
				else {
					// 对于曲线，这里计算控制点d[1]和终点d[2]连线的交点在布局上要好于真正的开始点d[0]和终点d[2]连线的交点
					var nxy = null;
					if(self.options.node.nodeStyle == 'circle') {
						nxy = calcLineCutCircleCoor({"cx": d[1].x, "cy": d[1].y, "r": _nw(d[0])/2}, 
														{"cx": d[2].x, "cy": d[2].y, "r": _nw(d[2])/2});
					} else {
						nxy = calcLineCutRectCoor({"x": d[1].x, "y": d[1].y, "w": _nw(d[0]), "h": _nh(d[0])}, 
													{"x": d[2].x, "y": d[2].y, "w": _nw(d[2]), "h": _nh(d[2])});
					}
			
					return "M" + d[0].x + "," + d[0].y + "S"
								+ d[1].x + "," + d[1].y + " "
								+ nxy.x2 + "," + nxy.y2;
				}	
			});
			
			// 旋转箭头
			edge.selectAll("polygon.marker").attr("transform", function(d, i){
				var nxy = null;
				if(self.options.node.nodeStyle == 'circle') {
					nxy = calcLineCutCircleCoor({"cx": d[0].x, "cy": d[0].y, "r": _nw(d[0])/2}, 
												{"cx": d[2].x, "cy": d[2].y, "r": _nw(d[2])/2});
				} else {
					nxy = calcLineCutRectCoor({"x": d[0].x, "y": d[0].y, "w": _nw(d[0]), "h": _nh(d[0])}, 
													{"x": d[2].x, "y": d[2].y, "w": _nw(d[2]), "h": _nh(d[2])})
				}
				
				var deg = 180 / Math.PI * Math.atan2(nxy.y2 - nxy.y1, nxy.x2 - nxy.x1); //旋转弧度 
				
				/*if(i==0){ // end-marker
					return "translate(" + (nxy.x2) + ", " + (nxy.y2) + ") rotate("+ deg +")" ;
				} else { // start-marker
					return "translate(" + (nxy.x1) + ", " + (nxy.y1) + ") rotate("+ deg +")" ;
				}*/
				
				if(this.getAttribute("class").indexOf("end-marker")!= -1){
					return "translate(" + (nxy.x2) + ", " + (nxy.y2) + ") rotate("+ deg +")";
				} else if(this.getAttribute("class").indexOf("start-marker")!= -1) {
					return "translate(" + (nxy.x1) + ", " + (nxy.y1) + ") rotate("+ deg +")";
				} else {
					return "translate(-100,-100)";
				}
				
			});
			
			linkLabel.attr("transform", function(d) {
				//if(d[3].orient && d[3].orient == '2') {
				if(true) {
				   // 直线类型下的 line label 坐标计算
				    var dx = (d[2].x - d[0].x),
						dy = (d[2].y - d[0].y),
						dr = Math.sqrt(dx * dx + dy * dy),
						offset = (1 - (1 / dr)) / 2,
						//deg = 180 / Math.PI * Math.atan2(dy, dx),
						x = (d[0].x + dx * offset),
						y = (d[0].y + dy * offset);
						
					return "translate(" + x + ", " + y + ")"; 
					//return "translate(" + x + ", " + y + ") rotate(" + deg + ")";
				} else {
					// 曲线类型下的line label 坐标计算
					var x = (d[0].x + d[1].x + d[2].x) / 3,
						y = (d[0].y + d[1].y + d[2].y) / 3;
						//dx = (d[2].x - d[0].x),
						//dy = (d[2].y - d[0].y),
						//deg = 180 / Math.PI * Math.atan2(dy, dx);
						
					return "translate(" + x + ", " + y + ")";
					// 角度旋转太耗浏览器性能，让线条文字和线条平行
					//return "translate(" + x + ", " + y + ") rotate(" + deg + ")";
				}
			});
		
			node.attr("transform",function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
			
			//self.force.stop();	
		}
		
		this.force.on("tick", tick);
		this.force.on("end", function(){ });
	};
	
	xNetWork.prototype.highLight = function(node) {
		currNode = node;
		var _id = currNode.id;
		this.graph.selectAll("path.link").attr("stroke-opacity", 0.1).attr("fill-opacity", 0.1);
		//this.graph.selectAll(".link-marker").attr("stroke-opacity", 0.1).attr("fill-opacity", 0.1);
		this.graph.selectAll("polygon.marker").attr("fill-opacity", 0.1);
		this.options.link.showLabel && this.graph.selectAll("g.link-label").attr("visibility", "hidden");
		this.graph.selectAll("text.node-label").attr("fill-opacity", 0.1).attr("stroke-opacity", 0.1);
		this.graph.selectAll("image.node-icon").style("opacity", 0.1);
		
		this.graph.selectAll("path." + "link_" + _id).attr("stroke-opacity", 1).style("fill-opacity", 1);
		this.graph.selectAll("polygon.marker_"+ _id).attr("fill-opacity", 1);
		this.options.link.showLabel && this.graph.selectAll("g." + "LL_" + _id).attr("visibility", "visible");
		this.graph.selectAll("#nodeLabel_"+ _id).attr("fill-opacity", 1).attr("stroke-opacity", 1);
		this.graph.selectAll("#nodeIcon_"+ _id).style("opacity", 1);
		
		for(var i = this.links.length - 1; i >= 0; i--) {
			var __id;
			if( this.links[i].from == _id ) {
				__id = this.links[i].to;
			} else if( this.links[i].to == _id ) {
				__id = this.links[i].from;
			}
			
			if(!__id) continue;
			
			this.graph.selectAll("#nodeLabel_"+ __id).attr("fill-opacity", 1).attr("stroke-opacity", 1);
			this.graph.selectAll("#nodeIcon_"+ __id).style("opacity", 1);
		}
	};
	
	xNetWork.prototype.unHighLight = function() {
		if(currNode == null) return;
		
		this.graph.selectAll("path.link").attr("stroke-opacity", 1).attr("fill-opacity", 1);
		//this.graph.selectAll(".link-marker").attr("stroke-opacity", 1).attr("fill-opacity", 1);
		this.graph.selectAll("polygon.marker").attr("fill-opacity", 1);
		this.options.link.showLabel && this.graph.selectAll("g.link-label").attr("visibility", "visible");
		this.graph.selectAll("text.node-label").attr("fill-opacity", 1).attr("stroke-opacity", 1);
		this.graph.selectAll("image.node-icon").style("opacity", 1);
		currNode = null;
	};
	
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, "");
	};
	
	function createMarker(defs, color) {
		defs.append("marker")
				.attr("id", "_eMarker_"+ color.substring(1))
				.attr("class", "link-marker")
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 8).attr("refY", 0)
				.attr("markerWidth", 10).attr("markerHeight", 10)
				.attr("orient", "auto")
			.append("path")
				.attr("d", "M 0,-4 L 10,0 L 0,4 L 1,0 Z").style("fill", color).attr("stroke-width", 0);
							
		defs.append("marker")
			.attr("id", "_sMarker_"+ color.substring(1))
			.attr("class", "link-marker")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 2).attr("refY", 0)
			.attr("markerWidth", 10).attr("markerHeight", 10)
			.attr("orient", "auto")
		.append("path")
			.attr("d", "M0,0 L10,-4 L9,0 L10,4 Z").style("fill", color).attr("stroke-width", 0);
	}
	
	function __color(color) {
		if(color && /^#[a-fA-F0-9]{3,6}/.test(color.trim())) {
			return color.trim().toLowerCase();
		} else {
			return colors[0].trim().toLowerCase();
		}
	}
	
	function _nodeIndexOf(nodes, nodeid) {
		for(var i = nodes.length - 1; i >= 0; i--) {
			if(nodes[i].id == nodeid) {
				return i;
			}
		}
		return -1;
	};
	
	function _linkIndexOf(links, s, t) {
		for(var i = links.length - 1; i >= 0; i--) {
			if(links[i].source == s && links[i].target == t) {
				return i;
			}
		}
		return -1;
	};
	
	function redraw() {
		if(!this.options.zoom.enable) {
			return false;
		}
		//store the last event data
		var trans = d3.event.translate,
			scale = d3.event.scale;  
		//transform the vis
	   this.graph.attr("transform","translate(" + trans + ")" + " scale(" + scale + ")"); 
	}
	
	// 计算2个圆形中心连线与2个圆形的交点
	function calcLineCutCircleCoor(sNode, eNode) {
		// sNode = {"cx":"", "cy":"", r:""}
		var dx = eNode.cx - sNode.cx, 
			dy = eNode.cy - sNode.cy,
			dd = Math.sqrt(dx*dx + dy*dy),
			sX, sY, eX, eY;
		
		// 如果2个圆形紧邻，则连线的端点在圆形中心; 否则, 连线端点在圆的边界上
		if(dd <= sNode.r + eNode.r) {
			return {"x1": sNode.cx, "y1": sNode.cy, "x2": eNode.cx, "y2": eNode.cy};
		}
			
		sX = sNode.cx + (dx / dd) * sNode.r;
		sY = sNode.cy + (dy / dd) * sNode.r;
		eX = eNode.cx - (dx / dd) * eNode.r;
		eY = eNode.cy - (dy / dd) * eNode.r
		
		return {"x1": sX, "y1": sY, "x2": eX, "y2": eY};
	}

	// 计算2个矩形中心连线与2个矩形的交点
	function calcLineCutRectCoor(sNode, eNode) {
		var x1 = sNode.x, y1 = sNode.y, 
			x2 = eNode.x, y2 = eNode.y,
			saw = sNode.w * 0.5, sah = sNode.h * 0.5, 
			eaw = eNode.w * 0.5, eah = eNode.h * 0.5, 
			nodeRadius = 1,
			tx = x2 - x1, ty = y2 - y1,
			dd = Math.sqrt(tx*tx + ty*ty),

			spx = Math.abs(saw/tx), spy = Math.abs(sah/ty),	
			epx = Math.abs(eaw/tx), epy = Math.abs(eah/ty),
			
			startX, startY, endX, endY;	
			
		//如果两点紧邻, 连线的端点在节点中心; 否则, 连线端点在矩形的边界上
		if (Math.abs(tx) <= (saw + eaw) && Math.abs(ty) <= (sah + eah)) {
			/*startX = x1;
			startY = y1;
			endX = x2;
			endY = y2;*/
			return {"x1": x1, "y1": y1, "x2": x2, "y2": y2};
		}
		
		startX = x1 + nodeRadius * tx / dd;
		startY = y1 + nodeRadius * ty / dd;
		endX = x2 - nodeRadius * tx / dd;
		endY = y2 - nodeRadius * ty / dd;

		if (spx <= spy) {
			startX = x1 + tx * spx;
			startY = y1 + ty * spx;
		} else {
			startX = x1 + tx * spy;
			startY = y1 + ty * spy;
		}
		
		if (epx <= epy) {
			endX = x2 - tx * epx;
			endY = y2 - ty * epx;
		} else {
			endX = x2 - tx * epy;
			endY = y2 - ty * epy;
		}
		
		return {"x1": startX, "y1": startY, "x2": endX, "y2": endY};
	}	
	
	
	
	!window.xNetWork && (window.xNetWork = xNetWork);
	
	var currNode = null, hoverTimer = null, houtTimer = null, clickTimer = null;
	
	// Default Options
	xNetWork.options = {
		width: null,
		height: null,
		layout: 'force',
		gravity: 0.15,
		linkDistance: 100,
		linkStrength: 1,
		charge: -600,
		friction: 0.5,
		fisheye: false,
		node: {
			width: 50,
			height: 50,
			showLabel: true,
			nodeStye: "rect", // rect, circle
			nodeFormat: false // function(node, nodeOptions){}
		},
		link: {
			edgeStyle: 'default', // default, curve
			showLabel: false,
			marker: 'default' // false, arrow, function(){}
		},
		zoom: {
			enable:true,
			zoomScale: [0.2, 6]
		},
		events: {
			"nodeClick": false,
			"nodeDblclick": false,
			"nodeHover": false, // function(node) {}
			"nodeDragStart": false,
			"nodeDrag": false,
			"nodeDragEnd": false,
			"linkClick": false
		}
	};
	
	
// ---------------------------------------------------------------------------------------------------------------------
	function clearSelection(){if(document.selection){document.selection.empty();}else{document.getSelection().removeAllRanges();}}
	xNetWork.isArray=function(a){return a&&(Object.prototype.toString.call(a)==="[object Array]")};
	xNetWork.isFunction=function(a){return a&&typeof a==="function"};
	xNetWork.isPlainObject=function(d){if(!d||typeof d!=="object"||d.nodeType||d==d.window){return false}var a=Object.prototype.hasOwnProperty;try{if(d.constructor&&!a.call(d,"constructor")&&!a.call(d.constructor.prototype,"isPrototypeOf")){return false}}catch(c){return false}var b;for(b in d){}return b===undefined||a.call(d,b)};
	xNetWork.extend=function(){var k,c,a,b,g,h,f=arguments[0]||{},e=1,d=arguments.length,j=false;if(typeof f==="boolean"){j=f;f=arguments[1]||{};e=2}if(typeof f!=="object"&&typeof f!=="function"){f={}}if(d===e){f=this;--e}for(;e<d;e++){if((k=arguments[e])!=null){for(c in k){a=f[c];b=k[c];if(f===b){continue}if(j&&b&&(xNetWork.isPlainObject(b)||(g=xNetWork.isArray(b)))){if(g){g=false;h=a&&xNetWork.isArray(a)?a:[]}else{h=a&&xNetWork.isPlainObject(a)?a:{}}f[c]=xNetWork.extend(j,h,b)}else{if(b!==undefined){f[c]=b}}}}}return f};
	
})(window, document, d3);