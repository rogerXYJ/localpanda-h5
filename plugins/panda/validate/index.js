
///*********** 校验组件 *********** */
var Validate = (function(){
	//默认参数
	var defaultOpt = {
		inputClassName:'validate',
		errorClassName:'error',
		stopFocus: false
	};
	function Validate(options){
		//合并自定义参数
		for(var key in options){
			defaultOpt[key] = options[key];
		}
		this.options = defaultOpt || {};

		//检测是否手机端
		this.isMobile = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
		//初始化事件
		this.init();

		var self = this;
		document.onclick = function(e){
			if((new RegExp(self.options.inputClassName)).test(e.target.className)){
				self.init();
			}
		}
	}
	//原型对象
	var _proto = Validate.prototype;

	_proto.init = function(){
		var self = this;
		//获取所有input
		var options = this.options;
		var inputClass = options.inputClassName;
		var allInput = document.querySelectorAll('.'+inputClass);
		this.allInput = allInput;

		//绑定所有blur事件
		for(var i=0;i<allInput.length;i++){
			var thisInput = allInput[i];
			
			thisInput.onblur = function(){
				var parentNode = this.parentNode;
				var vType = this.getAttribute('vType');
				var isTrue = self.check(this.value,this);
				if(vType=='data'){
					isTrue = self.check(this.getAttribute('data'),this)
				}
				
				//失去焦点后如果正确则移除错误class
				if(isTrue){
					this.className = this.className.replace(options.errorClassName,'');
					if(parentNode.querySelector('.vTip')){
						parentNode.removeChild(parentNode.querySelector('.vTip'));
					}
					
				}else{
					if(!(new RegExp(options.errorClassName,'g')).test(this.className) &&  vType!='data'){
						this.className = this.className + ' ' + options.errorClassName;
						
					}
					if(!parentNode.querySelectorAll('.vTip').length){
						var thisTip = document.createElement('div');
						thisTip.className = 'vTip';
						thisTip.innerHTML = this.getAttribute('vTip')?this.getAttribute('vTip'):this.getAttribute('placeholder');
						parentNode.appendChild(thisTip)
					}
					
				}
			}
		}
	}

	//校验单个
	_proto.check = function(value,input){
		var type = input.getAttribute('vType');
		if(type=='enName'){
			return /^[a-zA-Z\s]+$/.test(value);
		}else if(type=='cnName'){
			return /^[\u4e00-\u9fa5]+$/.test(value);
		}else if(type=='email'){
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
		}else if(type=='phone'){
			return /^((\d{2,8}-\d{4,13})|(\d{4,13})|(\d{1,5}\+\d{4,13}))$/.test(value);
		}else if(type=='text'){
			return value.length>0;
		}else if(type == 'data'){
			return value!='' && value!='{}' && value!='[]';
		}else if(type == 'number'){  //数字类型校验
			var isNum = /(^-?[0-9]\d*$)/.test(value);
			if(!isNum){return false;};
			var min = parseInt(input.getAttribute('min')),
				max = parseInt(input.getAttribute('max')),
				minTrue = min.toString() != 'NaN',
				maxTrue = max.toString() != 'NaN';
			if(minTrue && maxTrue){
				return value>=min && value<=max;
			}else if(maxTrue){
				return value <= max;
			}else if(minTrue){
				return value >= min;
			};
			return true;
		}else if(type=="time"){
			if(value){
				return /^\d{1,2}:\d{2}$/.test(value)	
			}
		}
		
	}

	//整体校验
	_proto.validate = function(value,type){
		//自动初始化
		this.init();
		//获取所有input
		var options = this.options;
		var inputClass = options.inputClassName;
		var allInput = document.querySelectorAll('.'+inputClass);
		var focus = true;
		var isOk = true;
		
		//循环所有校验对象
		for(var i=0;i<allInput.length;i++){
			var thisInput = allInput[i];
			var parentNode = thisInput.parentNode;
			var vType = thisInput.getAttribute('vType');
			//只校验显示的元素
			if(thisInput.offsetParent){
				var thisClass = thisInput.className;
				var isTrue = this.check(thisInput.value,thisInput);
				if(vType=='data'){
					isTrue = this.check(thisInput.getAttribute('data'),thisInput)
				}

				//不正确
				if(!isTrue){
					//记录错误数量
					isOk = false;
					//添加错误class
					if(!(new RegExp(options.errorClassName,'g')).test(thisClass) && vType!='data'){
						thisInput.className = thisClass + ' ' + options.errorClassName;
					}
					//PC端获取焦点，移动端不做
					if(focus && !this.isMobile && vType!='data' && !options.stopFocus){
						thisInput.focus();
						focus = false;
					}else if(focus){

						thisInput.scrollIntoViewIfNeeded();
						//document.getElementsByTagName('html')[0].scrollTop = document.body.scrollTop = thisInput.offsetTop - 30;
						focus = false;
					}

					if(!parentNode.querySelectorAll('.vTip').length){
						var thisTip = document.createElement('div');
						thisTip.className = 'vTip';
						thisTip.innerHTML = thisInput.getAttribute('vTip')?thisInput.getAttribute('vTip'):thisInput.getAttribute('placeholder');
						parentNode.appendChild(thisTip);
					}
					


				}else{//正确移除class
					thisInput.className = thisClass.replace(options.errorClassName,'');
					if(parentNode.querySelector('.vTip')){
						parentNode.removeChild(parentNode.querySelector('.vTip'));
					}
					
				}
			}
			
			
		}
		return isOk;
	}
	return Validate;
})();

export default Validate;