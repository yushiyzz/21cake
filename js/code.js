var codeLength = 4;    //设定验证码的长度
			var oBtn = document.getElementById('btn');   //获取按钮
			var arr = [2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];      //验证码范围
			function createCode(){
				var code = [];    //每次点击清空数组
				for(var i = 0;i < codeLength;i++){
					//console.log(arr[i]); 
						var codeIndex = Math.floor(Math.random()*32);   //获取下标
						// console.log(codeIndex);
						code += arr[codeIndex];   //在新数组中插入随机产生的字符串
						// console.log(code[i]);
				}
				if(code.length != codeLength){   //当code的长度不符合要求时就会回头再执行createCode()
					createCode();
				}
				btn.value = code;     //更换button的value值
			    }
			