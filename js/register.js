	
	//手机号码验证
	var pone=$("#telephone").val();
	var myreg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$/;

    if(!myreg.test(pone)){
       $(".err-text span").html("请输入正确的手机号码")
    }else{
     	$("#telephone +").css("display","inline");
     	$(".err-text span").html("");
    }
  	//密码验证
  	var  