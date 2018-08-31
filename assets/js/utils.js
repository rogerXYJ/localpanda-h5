//import $ from "zepto";

//var Utils = (function(window){
/**
 *@Function: 获取url参数
 *@param url : url 中参数名
 */
var GetQueryString = function(url) {
	var reg = new RegExp("(^|&)" + url + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return(r[2]);
	return null;
}
var titleCase = function(str) {
	return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}
var GetDateStr = function(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期 
	var d = dd.getDate();
	return y + "-" + m + "-" + d;
}
var loadScript = function(url, callback) {
	var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    var loaded;
    script.src = src;
    if(typeof callback === 'function'){
        script.onload = script.onreadystatechange = function(){
            if(!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))){
                script.onload = script.onreadystatechange = null;
                loaded = true;
                callback();
            }
        }
    }
    head.appendChild(script);
}
var addmulMonth = function(dtstr, n) {
	var s = dtstr.split("-");
	var yy = parseInt(s[0]);
	var mm = parseInt(s[1]) - 1;
	var dd = parseInt(s[2]);
	var dt = new Date(yy, mm, dd);
	dt.setMonth(dt.getMonth() + n);
	var month = parseInt(dt.getMonth()) + 1;
	return dt.getFullYear() + "-" + (month<10?'0'+month:month) + "-" + dd;
}
/**
 *@Function: 获取url?后面的参数
 */
function GetRequest() {
	const url = location.search; //获取url中"?"符后的字串   
	const theRequest = new Object();
	if(url.indexOf("?") != -1) {
		let str = url.substr(1);
		const strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function getUrlParams() {
	const url = location.href;
	return url.substr(url.lastIndexOf("/") + 1)

}

function cutXiaoNum(num, len) {
	var numStr = num.toString();
	if(len == null || len == undefined) {
		len = numStr.length;
	}
	var index = numStr.indexOf('.');
	if(index == -1) {
		index = numStr.length;
		numStr += ".0000000000000";
	} else {
		numStr += "0000000000000";
	}
	var newNum = numStr.substring(0, index + len + 1);
	return newNum;
}
/*
 * 删除数组里面的null
 *
 */
function delNullArr(array) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] == "" || typeof(array[i]) == "undefined") {
			array.splice(i, 1);
			i = i - 1;

		}

	}
	return array;
}
/*
 * 正则验证
 */
var formatDate = function(millinSeconds){
	var date = new Date(millinSeconds.replace(/\-/g,'/'));
	var monthArr = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var year = date.getFullYear(); //年
	var month = monthArr[date.getMonth()]; //月
	var ddate = date.getDate(); //日
	return month + " "+ ddate ;
}
var regExp = (function() {
	return {
		isMobil: function(s) {

			//var patten = /^((\d{2,3}\-))?(1[34578]\d{9})$/;
			var patten = /^[0-9\+\-\(\)]*$/

			// var patten = /^(\+?0?86\-?)?1[345789]\d{9}$/;
			if(!patten.test(s))
				return false;
			return true;
		},
		isDigit: function(s) {
			var patten = /^[0-9]{1,20}$/;
			if(!patten.test(s))
				return false;
			return true;
		},
		isEmail: function(s) {
			//var patten = /^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$/;
			var patten = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			if(!patten.test(s))
				return false;
			return true;
		},
		isName: function(s) {
			var patten = /^[\u4e00-\u9fa5]{2,5}$/; //2-5个姓名验证汉字
			if(!patten.test(s))
				return false;
			return true;
		},
		isPass: function(s) {
			var patten = /^[a-zA-Z\d]{6,16}$/; //密码验证

			if(!patten.test(s))
				return false;
			return true;
		},
		isCardNub: function(s) {
			var patten = /^[0-9a-zA-Z-]*$/g;
			if(!patten.test(s))
				return false;
			return true;

		},
		isPostId: function(s) {
			var patten = /^\d{6}$/;
			if(!patten.test(s))
				return false;
			return true;
		},
		isNub: function(s) {
			var patten = /\d+/g;
			if(!patten.test(s))
				return false
			return true
		},
		isCode: function(s) {
			var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
			if(!patrn.test(s)) { // 如果包含特殊字符返回false
				return false;
			}
			return true;
		}
	}
})();

var J2S = function(obj) {
	if(typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length) {
		return JSON.stringify(obj);
	} else {
		throw new Error("参数必须是json对象!");
	}

}
//string-->json
var S2J = function(strs) {
	if(typeof(strs) === "string") {
		return JSON.parse(strs);
	} else {
		throw new Error("参数必须是String类型!");

	}
}
/**
 * @Function判断手机设备
 * @return "IOS","ANDROID"
 */
var Device = function() {
	var ua = navigator.userAgent;
	var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
		isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
		isAndroid = ua.match(/(Android)\s+([\d.]+)/),
		isMobile = isIphone || isAndroid;

	if(isIphone || ipad) {
		return "IOS";
	} else {
		return "ANDROID";
	}
}
/**
 * @Function 判断是否是微信浏览器
 */
var isWeiXin = function() {
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
/**
 * @Function 隐藏手机号 比如 15021231608 ==> 150****1608
 */
var telStar = function(tel) {

	var reg = /(\d{3})\d{4}(\d{4})/;

	var phonenumber = tel.replace(reg, "$1****$2");

	return phonenumber;
}
/**
 * @Function 存cookie or localStorage
 * @用法 1. 存cookie storageInfo("cookie").set("name","andy"......);
 *      2. 存localStorage storageInfo("localStorage").set("name","nady")
 */
var storageInfo = function(type) {

	var supportStorage = (type === "localStorage") ? true : false;

	return {
		set: function(name, value, expires, path, domain) {
			if(supportStorage) {
				window.localStorage.setItem(name, value);
			} else {

				if(typeof expires == "undefined") {
					expires = new Date(new Date().getTime() + (10000000 * 60 * 60 * 24 * 30)).toGMTString();
				}
				document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires : "") + ((path) ? ";path=" + path : ";path=/") + ((domain) ? ";domain=" + domain : "");
			}
		},
		get: function(name) {
			if(supportStorage) {
				return window.localStorage.getItem(name);
			} else {
				var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
				if(arr != null) {
					return unescape(arr[2]);
				}
				return null;
			}
		},
		clear: function(name, path, domain) {
			if(supportStorage) {
				window.localStorage.removeItem(name);
			} else {
				if(this.get(name)) {
					document.cookie = name + "=" + ((path) ? "; path=" + path : "; path=/") + ((domain) ? "; domain=" + domain : "") + ";expires=Fri, 02-Jan-1970 00:00:00 GMT";
				}
			}
		}
	}
};
/**
 *某个值是否存在
 */
var isSet = function(entity) {
	return typeof entiry !== "undefined" && entiry !== null;
}
/*
 *判断对象是否为空
 */
var isEmpty = function(obj) {
	for(var name in obj) {
		return false;
	}
	return true;
};
/**
 * 科学计数，如：1000000 => 1,000,000
 * */
var toThousands = function(num) {
	var num = (num || 0).toString(),
		result = '';
	while(num.length > 3) {
		result = ',' + num.slice(-3) + result;
		num = num.slice(0, num.length - 3);
	}
	if(num) {
		result = num + result;
	}
	return result;
}
/**
 * 从一个给定的数组arr中,随机返回num个不重复项
 * //测试
 *var ArrList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33];
 *alert(getArrayItems(ArrList,6));
 * */
var getArrayItems = function(arr, num) {
	//新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
	var temp_array = new Array();
	for(var index in arr) {
		temp_array.push(arr[index]);
	}
	//取出的数值项,保存在此数组
	var return_array = new Array();
	for(var i = 0; i < num; i++) {
		//判断如果数组还有可以取出的元素,以防下标越界
		if(temp_array.length > 0) {
			//在数组中产生一个随机索引
			var arrIndex = Math.floor(Math.random() * temp_array.length);
			//将此随机索引的对应的数组元素值复制出来
			return_array[i] = temp_array[arrIndex];
			//然后删掉此索引的数组元素,这时候temp_array变为新的数组
			temp_array.splice(arrIndex, 1);
		} else {
			//数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
			break;
		}
	}
	return return_array;
}

var formatMoney = function fmoney(s, n) {
	n = n > 0 && n <= 20 ? n : 2;

	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1],
		t = "";
	for(var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}
function getNowFormatDate(date) {
       
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
		}
		

//获取货币单位和货币符号，第二个参数为true就获取的货币单位
var getPriceMark = function(cur,str){
	var currencyAll = [
		{'sign':'$','str':'USD'},
		{'sign':'¥','str':'CNY'},
		{'sign':'￡','str':'GBP'},
		{'sign':'€','str':'EUR'},
		{'sign':'A$','str':'AUD'},
		{'sign':'CA$','str':'CAD'}
	];
	var thisCur = {};
	for(var i=0;i<currencyAll.length;i++){
		if(cur==currencyAll[i].str){
			thisCur = currencyAll[i];
		}
	}
	return str ? thisCur.str : thisCur.sign;
}


//return {
//  GetQueryString,
//  regExp,
//  J2S,
//  S2J,
//  Device,
//  telStar,
//  isWeiXin,
//  storageInfo,
//  isSet,
//  isEmpty,
//  getChannel
//}

//})(window);

//======导出模块=======
//AMD/CMD
//==exports.Util = Util;
//==module.exports = {
//  Util: Util
//}
//es6 模块
//export default Utils
export {
	formatDate,
	getNowFormatDate,
	loadScript,
	cutXiaoNum,
	delNullArr,
	getUrlParams,
	titleCase,
	addmulMonth,
	GetDateStr,
	GetQueryString,
	GetRequest,
	regExp,
	J2S,
	S2J,
	Device,
	telStar,
	isWeiXin,
	storageInfo,
	isSet,
	isEmpty,
	toThousands,
	getArrayItems,
	formatMoney,
	getPriceMark
}