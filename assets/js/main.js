var lpValidate = (function(){

	function lpValidate(options){
		this.options = options || {};
		this.init();
	}
	var _proto = lpValidate.prototype;
	_proto.init = function(){
		
	}

	_proto.validate = function(value,type){
		if(type=='enName'){
			return /^[a-zA-Z\s]+$/.test(value);
		}else if(type=='cnName'){
			return /^[\u4e00-\u9fa5]+$/.test(value);
		}else if(type=='email'){
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
		}else if(type=='phone'){
			return /^((\d{2,8}-\d{4,13})|(\d{4,13})|(\d{1,5}\+\d{4,13}))$/.test(value);
		}
	}

	return lpValidate;
})();

export {
	lpValidate
}