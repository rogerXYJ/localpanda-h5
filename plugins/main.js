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


window.hasClass = function(obj,name){
  var classArr = obj.className.split(' ');
  for(var i=0;i<classArr.length;i++){
    var thisData = classArr[i];
    if(thisData==name){
      return true;
    }
  }
  return false;
},
//获取父级元素
window.getParents = function(target,className){
  //获取所有父元素
  var parent = target;
  var allParent = [];
  while (parent.tagName != 'BODY') { 
    allParent.push(parent);
    parent = parent.parentNode;
  }
  //遍历所有父元素
  for(var i=0;i<allParent.length;i++){
    if(hasClass(allParent[i],className)){
      return allParent[i];
    }
  };
  return false;
};


import Vue from 'vue';

Vue.prototype.currencyData = [
  {"code":"USD","symbol":"$","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false" ><path d="m0 0h32v24h-32z" fill="#fff"></path><path d="m0-.25h32v1.85h-32zm-.09 3.85h32v1.85h-32v-1.85zm.13 3.94h32v1.85h-32v-1.85zm-.03 3.62h32v1.85h-32zm0 3.44h32v1.85h-32zm0 3.9h32v1.85h-32zm0 4h32v1.85h-32z" fill="#de2110"></path><path d="m0 0h18v13h-18z" fill="#0334ab"></path><path d="m1.31.61.17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm-13.79 1.29.17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm-13.79 1.29.17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm-13.79 1.29.17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm-13.79 1.29.17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm-13.79 1.29.17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm-13.79 1.29.17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.32h.54zm-13.79 1.29.17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm3.06 0 .17.51h.54l-.44.32.17.51-.44-.32-.44.32.17-.51-.44-.31h.54zm-13.79 1.29.17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51zm3.06 0 .17.51h.54l-.44.31.17.51-.44-.32-.44.32.17-.51-.44-.32h.54l.17-.51z" fill="#fff"></path></svg>'},
  {"code":"CNY","symbol":"¥","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false"><path d="m0 0h32v24h-32z" fill="#de2910"></path><path d="m6 7.5-2.1 1.4.8-2.45-2.1-1.55h2.6l.8-2.5.8 2.5h2.6l-2.1 1.55.8 2.45zm5.79-4.59-.92.19.64-.75-.48-.85.88.37.65-.77-.11 1 .88.37-.94.25-.1.98zm2.86 2.38-.46.82-.15-.98-.96-.2.86-.42-.16-.99.69.74.86-.42-.43.87.68.72zm-.24 3.67-.75.57.26-.95-.79-.57.96-.03.26-.97.33.95.96-.03-.75.62.33.93-.79-.51zm-2.63 2.37-.91.23.61-.77-.51-.83.89.34.62-.79-.07 1 .89.34-.93.28-.06.99z" fill="#ffde00"></path></svg>'},
  {"code":"EUR","symbol":"€","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false"><path d="m0 0h32v24h-32z" fill="#039"></path><path d="m16 5.56-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm3.56.98-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm2.6 2.59-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm.96 3.55-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm-.97 3.57-.77.54.29-.94-.77-.6h.96l.29-.96.3.96h.96l-.77.6.29.94-.77-.54zm-2.59 2.61-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm-3.56.93-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm-3.56-.95-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm-2.6-2.62-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm-.95-3.53-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm.95-3.56-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94zm2.61-2.63-.77.54.29-.94-.77-.6h.96l.29-.96.29.96h.96l-.77.6.29.94z" fill="#fc0"></path></svg>'},
  {"code":"GBP","symbol":"£","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false"><path d="m .02 0h32v24h-32z" fill="#006"></path><path d="m-7.98 0v2.67l42.57 21.24h5.36v-2.67l-42.58-21.24h-5.36zm37.31 7.97 10.62-5.3v-2.67h-5.36l-14.61 7.29v-7.29h-7.99v7.97h-19.97v7.97h10.62l-10.62 5.3v2.67h5.36l14.61-7.29v7.29h7.99v-7.97h19.97v-7.97z" fill="#fff"></path><path d="m-7.98 9.57v4.78h47.93v-4.78zm21.57 14.43h4.79v-24h-4.79zm-21.57-.09 15.98-7.97h3.57l-15.98 7.98h-3.57zm0-23.92 15.97 7.98h-3.57l-12.4-6.19v-1.78zm28.38 7.97 15.98-7.96h3.57l-15.98 7.97h-3.57zm19.55 15.94-15.98-7.96h3.57l12.4 6.19v1.78z" fill="#c00"></path></svg>'},
  {"code":"JPY","symbol":"¥","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false" ><path fill="#FFF" d="M0 0h32v24H0z"></path><circle fill="#C00" cx="16" cy="12" r="7"></circle></svg>'},
  {"code":"CAD","symbol":"$","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false" ><path d="m0 0h32v24h-32z" fill="#c00"></path><path d="m8 0h16v24h-16z" fill="#fff"></path><path d="m10.62 12.06-.62.22 2.88 2.58c.22.66-.08.86-.26 1.21l3.13-.41-.08 3.21.65-.02-.14-3.19 3.13.38c-.19-.42-.37-.64-.19-1.31l2.88-2.44-.5-.19c-.41-.32.18-1.56.27-2.34 0 0-1.68.59-1.79.28l-.43-.84-1.53 1.72c-.17.04-.24-.03-.28-.17l.71-3.58-1.12.64c-.09.04-.19.01-.25-.11l-1.08-2.2-1.11 2.29c-.09.08-.17.09-.24.04l-1.07-.61.64 3.56c-.05.14-.17.18-.32.1l-1.45-1.7c-.19.31-.32.82-.57.94-.25.11-1.1-.22-1.67-.34.19.71.8 1.9.42 2.29z" fill="#c00"></path></svg>'},
  {"code":"AUD","symbol":"$","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false"><path d="m0 0h32v24h-32z" fill="#00247d"></path><path d="m0 0h1.93l15.35 11.1v1.4h-1.93l-15.35-11.1zm13.46 4.17h3.83v4.17h-7.2v4.17h-2.88v-3.81l-5.27 3.81h-1.93v-1.4l3.83-2.77h-3.83v-4.17h7.2v-4.17h2.88v3.81l5.27-3.81h1.93v1.4z" fill="#fff"></path><path d="m0 5v2.5h17.28v-2.5zm7.78-5v12.5h1.73v-12.5zm-7.78 12.5 5.76-4.17h1.29l-5.76 4.17zm0-12.5 5.76 4.17h-1.29l-4.47-3.24zm10.24 4.17 5.76-4.17h1.29l-5.76 4.17zm7.05 8.33-5.76-4.17h1.29l4.47 3.24z" fill="#c00"></path><path d="m14.99 19.63-2.18.19.3 2.17-1.51-1.59-1.51 1.59.3-2.17-2.18-.19 1.88-1.12-1.21-1.83 2.05.78.67-2.09.67 2.09 2.05-.78-1.21 1.83zm9.34 2-.53-.79.89.34.29-.91.29.91.89-.34-.53.79.82.49-.95.08.13.94-.66-.69-.66.69.13-.94-.95-.08zm0-14.1-.53-.79.89.34.29-.91.29.91.89-.34-.53.79.82.49-.95.08.13.94-.66-.69-.66.69.13-.94-.95-.08zm-5.29 5.73-.53-.79.89.34.29-.91.29.91.89-.34-.53.79.82.49-.95.08.13.94-.66-.69-.66.69.13-.94-.95-.08zm9.99-1.41-.53-.79.89.34.29-.91.29.91.89-.34-.53.79.82.49-.95.08.13.94-.66-.69-.66.69.13-.94-.95-.08.82-.49zm-1.93 4.16-.52.32.14-.59-.47-.39.61-.05.23-.56.23.56.61.05-.47.39.14.59z" fill="#fff"></path></svg>'},
  {"code":"NZD","symbol":"$","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false"><path d="m0 0h32v24h-32z" fill="#00247d"></path><path d="m0 .01h.5l18.5 9.07v3.13l-19-9.33zm17.41 3.64h1.59v4.65h-7.14v4.7h-4.74v-4.3l-7.12 3.48v-3.11l1.57-.77h-1.57v-4.65h7.12v-3.65h4.74v3.25l6.62-3.25.52-.01v2.87z" fill="#fff"></path><path d="m0 7.37h19v-2.79h-19zm8.07 5.63h2.85v-13h-2.85zm-8.07-2.37 4.75-2.33h2.12l-6.87 3.37zm0-9.3 4.75 2.32h-2.12l-2.63-1.29zm12.11 2.32 6.89-3.38v1.04l-4.77 2.34zm6.89 6.99-4.77-2.34h2.12l2.65 1.3v1.03z" fill="#c00"></path><path d="m21.2 11.15-.93.65.35-1.13-.93-.72h1.15l.35-1.15.35 1.15h1.15l-.93.72.35 1.13-.93-.65zm4.59-4.66-.93.65.35-1.13-.93-.72h1.15l.35-1.15.35 1.15h1.15l-.93.72.35 1.13zm.01 12.02-.93.65.35-1.13-.93-.72h1.15l.35-1.15.35 1.15h1.15l-.93.72.35 1.13z" fill="#fff"></path><path d="m21.2 10.94-.62.43.24-.75-.62-.48h.77l.24-.77.24.77h.76l-.62.48.24.75-.62-.43zm4.6-4.66-.62.43.24-.75-.62-.48h.77l.24-.77.24.77h.77l-.62.48.24.75-.62-.43zm.01 12.02-.62.43.24-.75-.62-.48h.77l.24-.77.24.77h.77l-.62.48.24.75z" fill="#c00"></path></svg>'},
  {"code":"HKD","symbol":"$","svg":'<svg viewBox="0 0 32 24" role="presentation" aria-hidden="true" focusable="false"><path d="m32 24h-32v-24h32z" fill="#c00"></path><path d="m15.01 12.74c-.7.41-1.83.77-3.17.11-1.05-.69-1.66-1.49-1.77-2.59.01-.5.11-.98.23-1.46.07.16.16.31.28.41.23.19.51.2.8.15a2.33 2.33 0 0 1 1.09.03 1.61 1.61 0 0 1 1.2 1.09c.12.35.08.7.23 1.05.13.27.29.47.63.64.14.05.25.08.36.1-.89.16-2.17-.34-2.49-1.01l-.45.22c.42.88 1.93 1.49 3.05 1.28zm1.36.38c.15.8.12 1.98-.95 3.03-1 .77-1.95 1.08-3.02.81-.46-.18-.88-.43-1.3-.7.18-.02.34-.05.48-.13.26-.15.36-.41.41-.71.05-.36.16-.67.39-1.02a1.61 1.61 0 0 1 1.42-.77c.37 0 .68.16 1.06.13.3-.03.54-.12.81-.38.09-.11.16-.21.21-.3-.15.9-1.05 1.94-1.77 2.01l.05.5c.97-.1 2.04-1.33 2.22-2.46zm.73-1.23c.81.08 1.93.45 2.64 1.76.45 1.18.48 2.18-.08 3.14-.3.4-.66.73-1.03 1.05.03-.18.05-.34.01-.5-.07-.29-.29-.46-.56-.59a2.34 2.34 0 0 1 -.87-.66 1.62 1.62 0 0 1 -.34-1.58c.11-.35.34-.62.42-.99a1.25 1.25 0 0 0 -.14-.88 2.5 2.5 0 0 0 -.23-.29c.82.39 1.56 1.55 1.43 2.27l.49.09c.17-.96-.7-2.34-1.73-2.82zm-.88-1.09c.33-.74 1.03-1.69 2.51-1.94 1.26-.06 2.22.23 2.94 1.07.28.41.48.85.67 1.32-.16-.09-.3-.16-.47-.17-.3-.02-.53.13-.74.35a2.34 2.34 0 0 1 -.9.62 1.61 1.61 0 0 1 -1.6-.18c-.3-.21-.47-.52-.8-.71a1.24 1.24 0 0 0 -.88-.15c-.14.04-.25.08-.35.13.63-.65 1.96-.99 2.6-.64l.24-.44c-.85-.47-2.44-.08-3.22.75zm-1.3.57c-.61-.53-1.31-1.48-1.12-2.97.32-1.22.87-2.05 1.88-2.51.47-.15.96-.21 1.45-.25-.13.12-.24.25-.29.4-.11.28-.03.54.12.81.18.31.29.63.33 1.04a1.62 1.62 0 0 1 -.64 1.49c-.29.23-.64.3-.92.56-.22.21-.35.43-.4.8a2.62 2.62 0 0 0 .02.37c-.44-.8-.37-2.17.16-2.68l-.35-.36c-.7.68-.79 2.31-.23 3.3zm.95-3.56.2-.22-.29.07-.14-.24-.03.28-.29.07.27.11-.04.28.2-.22.27.11zm4.03 2.86.27.13-.15-.26.19-.21-.28.05-.15-.26-.03.29-.28.05.27.13-.03.29zm-1.5 4.68-.04.29.2-.22.26.11-.14-.25.2-.22-.28.07-.14-.25-.04.29-.28.07zm-4.97-.01-.29.05.27.13-.04.28.2-.2.27.13-.14-.25.2-.2-.29.05-.14-.25-.04.28zm-1.49-4.64-.14-.26-.03.3-.28.06.26.12-.03.3.19-.22.26.13-.14-.26.19-.22z" fill="#fff"></path></svg>'}
];



//获取币种
// (function(){
//   var xhr = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
//   xhr.open('GET', 'https://api.localpanda.com/api/public/currency/all/USD', true);
//   xhr.send();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { // readyState == 4说明请求已完成
//       var data = JSON.parse(xhr.responseText);
//       if(typeof window.currencyCallbackHeader == 'function'){
//         window.currencyCallbackHeader(data);
//       }
//       if(typeof window.currencyCallbackFooter == 'function'){
//         window.currencyCallbackFooter(data);
//       }
//     }
//   }
// })();


