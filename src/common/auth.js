function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
  }
  
  if (window.location.pathname !== "/" && !window.location.hash) {
  	if(!getCookie("token")) {
    	window.location.replace('/');
    } else {
        console.log(getCookie("token"))
    }
  } else if(window.location.pathname !== "projects") {
  	
  }