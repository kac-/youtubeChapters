
window.YTC = new Object();

YTC.addLoadEvent = function(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

YTC.getUrlVars = function(url){
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

YTC.timeToSeconds = function(timeStr){
	var t = 0;
	var pat = /(\d+)([hms])/g;
	var mat = null;
	while((mat=pat.exec(timeStr))!=null){
			var v = parseInt(mat[1]);
			v *= mat[2]=="s"?1:mat[2]=="m"?60:3600;
			t+=v;
	}
	return t;
}

YTC.go = function(){
	var idx;
	
	var frmap = [];
	
	var frames = document.getElementsByTagName("iframe");
	for(var frame in frames){
		frame = frames[frame];
		if(!frame.src)
			continue;
		if(frame.src.indexOf("//www.youtube.com/embed/")<0)
			continue;
		var src = frame.src;
		//console.log(src);
		src = src.substring(src.indexOf("/embed/")+7);
		if((idx=src.indexOf("?"))>0)
			src = src.substring(0, idx);
		if((idx=src.indexOf("#"))>0)
			src = src.substring(0, idx);
		frmap[src] = frame;
	}
	//console.log(frmap);
	var anchs = document.getElementsByTagName("a");
	for(var a in anchs){
			a = anchs[a];
			if(!a.href)
				continue;
			idx = a.href.indexOf("//www.youtube.com/watch");
			if(idx<0)
				continue;
			var vars = YTC.getUrlVars(a.href);
			if(!vars.v || !vars.t)
				continue;
			var fr = frmap[vars.v];
			if(!fr)
				continue;
			
			var t = YTC.timeToSeconds(vars.t);
			a.onclick =(function(videoFrame, video, time) {
				return function() {
					videoFrame.src = "http://www.youtube.com/embed/"+video+"?start="+time+"&autoplay=1"
					//console.log(videoFrame.src);
					return false;
				};
			})(fr, vars.v, t);
	}	
}
YTC.addLoadEvent(YTC.go);




