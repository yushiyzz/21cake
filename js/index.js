//轮播图
 	var index = 0;
	var timer = null;
	var page = $("#uu li");
	var list = $("#box li");
	timer = setInterval(autoPlay,2500);
	function autoPlay(){
		index++; 
		if(index == page.length){
			index = 0;
		}
		list.eq(index).fadeIn(1000).siblings().fadeOut(1000);
		page.eq(index).addClass("current").siblings().removeClass("current");
	}
	
	page.mouseenter(function(){
		clearInterval(timer);
		index = $(this).index() - 1;
		autoPlay();
	})
	
	page.mouseleave(function(){
		timer = setInterval(autoPlay,2500);
	})
 	//APP图片
 	var list1=$(".list1");
 	var listimg=$(".listimg");
 	list1.mouseover(function(){
 		listimg.css("display","block")
 	})
 	list1.mouseout(function(){
 		listimg.css("display","none")
 	})
 	//城市切换
 	var listcity=$(".listcity");
 	var listspan=$(".listcity span");
 	var list2=$(".list2");
 	var lista=$(".list2 a")
 	list2.mouseover(function(){
 		listcity.css("display","block");
 	});
 	list2.mouseout(function(){
 		listcity.css("display","none");
 	})
 	listspan.eq(0).click(function(){
 		lista.html(listspan.eq(0).html())
 	})
 	listspan.eq(1).click(function(){
 		lista.html(listspan.eq(1).html())
 	})
 	listspan.eq(2).click(function(){
 		lista.html(listspan.eq(2).html())
 	})
 	listspan.eq(3).click(function(){
 		lista.html(listspan.eq(3).html())
 	})
 	listspan.eq(4).click(function(){
 		lista.html(listspan.eq(4).html())
 	})
 	listspan.eq(5).click(function(){
 		lista.html(listspan.eq(5).html())
 	})
 	listspan.eq(6).click(function(){
 		lista.html(listspan.eq(6).html())
 	})
 	listspan.eq(7).click(function(){
 		lista.html(listspan.eq(7).html())
 	})
 	//消息
 	var xiao=$(".xiao");
 	var xiaoxi=$(".xiaoxi");
 	xiao.mouseover(function(){
 		xiaoxi.css("display","block");
 	})
 	xiao.mouseout(function(){
 		xiaoxi.css("display","none");
 	})


