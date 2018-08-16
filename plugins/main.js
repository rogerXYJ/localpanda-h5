//读取cookie
var Cookie = {
  set : function(name, value, options){
    var date2 = new Date();
    var path = options.path ? '; path=' + (options.path) : '',
    domain = options.domain ? '; domain=' + (options.domain) : '',
    secure = options.secure ? '; secure' : '',
    expires = '; expires=' + new Date(date2.setTime(date2.getTime() + (1 * 24 * 60 * 60 * 1000))).toUTCString();

    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  },
  get : function(name){
    var cookieValue = null,
      doc = document;
    if (doc.cookie && doc.cookie != '') {
      var cookies = doc.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
    }
    return cookieValue;
  },
  del : function(name, options){
    var value = '';
    options.expires = -1;
    this.set(name, value, {expires:-1});
  }
};
window.Cookie = Cookie;

//设置cookie，记录用户id用于ABtest
if(!Cookie.get('userABtestID')){
  //生成8位数ID
  var ABID = '';
  for(var i=0;i<6;i++){
    ABID += (parseInt(Math.random()*9)+1);
  }
  Cookie.set('userABtestID',ABID,{path:'/','expires':30});
}