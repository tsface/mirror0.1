;(function($) {
  jQuery.fn.scrollFixed = function(height, dir, startFun, endFun) {
    height = height || 0;
    height = height == "top" ? 0 : height;
	
    return this.each(function() {
      if (height == "bottom") {
        height = document.documentElement.clientHeight - this.scrollHeight;
      } else if (height < 0) {
        height = document.documentElement.clientHeight - this.scrollHeight + height;
      }
      
      var that = $(this), oldHeight = false, started = false, p, r, 
      	l = that.offset().left, 
      	_r = $(window).width() - l - that.outerWidth(true),
      	ol, ot, or;
      dir = dir == "bottom" ? dir : "top"; //默认滚动方向向下
      if (window.XMLHttpRequest) { //非ie6用fixed
        function getHeight() { //>=0表示上面的滚动高度大于等于目标高度
          return (document.documentElement.scrollTop || document.body.scrollTop) + height - that.offset().top;
        }
        
        $(window).scroll(function() {
          if (oldHeight === false) {
            if ((getHeight() >= 0 && dir == "top") || (getHeight() <= 0 && dir == "bottom")) { 
			  if(started === false) {
				  started = true;
				  that.attr("original-position", that.css('position'));
				  ol = that.css('left');
				  ot = that.css('top');
				  or = that.css('right');
				  
				  if(startFun !== undefined && typeof startFun === 'function') {
					startFun.call(that, that);
				  } 
			  }
			  
              oldHeight = that.offset().top - height;
              that.css({
                position: "fixed",
                top: height,
                left: l,
                right: _r
              });
            }
          } else {
            if (dir == "top" && (document.documentElement.scrollTop || document.body.scrollTop) < oldHeight) {
              that.css({
                position: that.attr("original-position"),
                top: ot,
                left: ol,
                right: or
              });
              
              oldHeight = false;
			  started = false;
			  if(endFun !== undefined && typeof endFun === 'function') {
				endFun.call(that, that);
			  }
            } else if (dir == "bottom" && (document.documentElement.scrollTop || document.body.scrollTop) > oldHeight) {
              that.css({
                position: that.attr("original-position"),
                top: ot,
                left: ol
              });
              oldHeight = false;
			  started = false;
			  if(endFun !== undefined && typeof endFun === 'function') {
				endFun.call(that, that);
			  }
            }
          }
        });
      } else { //for ie6
        $(window).scroll(function() {
          if (oldHeight === false) { //恢复前只执行一次，减少reflow
            if ((getHeight() >= 0 && dir == "top") || (getHeight() <= 0 && dir == "bottom")) {
              oldHeight = that.offset().top - height;
              r = document.createElement("span");
              p = that[0].parentNode;
              p.replaceChild(r, that[0]);
              document.body.appendChild(that[0]);
              that[0].style.position = "absolute";
            }
          } else if ((dir == "top" && (document.documentElement.scrollTop || document.body.scrollTop) < oldHeight) || (dir == "bottom" && (document.documentElement.scrollTop || document.body.scrollTop) > oldHeight)) { //结束
            that[0].style.position = "static";
            p.replaceChild(that[0], r);
            r = null;
            oldHeight = false;
          } else { //滚动
            that.css({
              left: l,
              top: height + document.documentElement.scrollTop
            })
          }
        });
      }
    });
  };
})(jQuery);