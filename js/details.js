$("#bannerImgList li").eq(0).mouseover(function(){
	$("#otherImg").attr("src","img/39ea1db9ed0c9177b3c49b83974e7a59.jpg");
	$("#bannerImgList li").eq(0).addClass("active").siblings().removeClass("active");
})
$("#bannerImgList li").eq(1).mouseover(function(){
	$("#otherImg").attr("src","img/914a19f8348ef5d4aa634b07f1556580.jpg");
	$("#bannerImgList li").eq(1).addClass("active").siblings().removeClass("active");
})
$("#bannerImgList li").eq(2).mouseover(function(){
	$("#otherImg").attr("src","img/cc42300a6f0c877b705f81b16380396d.jpg");
	$("#bannerImgList li").eq(2).addClass("active").siblings().removeClass("active");
})


$(".details-Specifications-size dd ul li").eq(0).click(function(){
	$(".spacers li").eq(0).addClass("blocks").siblings().removeClass("blocks");
	$(".details-Specifications-size dd ul li").eq(0).addClass("active").siblings().removeClass("active");
});
$(".details-Specifications-size dd ul li").eq(1).click(function(){
	$(".spacers li").eq(1).addClass("blocks").siblings().removeClass("blocks");
	$(".details-Specifications-size dd ul li").eq(1).addClass("active").siblings().removeClass("active");
});
$(".details-Specifications-size dd ul li").eq(2).click(function(){
	$(".spacers li").eq(2).addClass("blocks").siblings().removeClass("blocks");
	$(".details-Specifications-size dd ul li").eq(2).addClass("active").siblings().removeClass("active");
});
$(".details-Specifications-size dd ul li").eq(3).click(function(){
	$(".spacers li").eq(3).addClass("blocks").siblings().removeClass("blocks");
	$(".details-Specifications-size dd ul li").eq(3).addClass("active").siblings().removeClass("active");
})
