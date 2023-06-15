


// クリックイベントの種類（タッチイベントが可能ならtouchstartになる）
kindOfEvent	= ( window.ontouchend === undefined )?	"click":	"touchend";


// ローカルストレージが使える
if(('localStorage' in window) && (window.localStorage !== null)) {

	fontSize = localStorage.getItem("localFontSize") - 0;
	if (!fontSize) fontSize = 16;

	allow_sound = localStorage.getItem("allow_sound");
	if (allow_sound == null)			allow_sound = true;
	else if (allow_sound === "false")	allow_sound = false;
	else if (allow_sound === "true")	allow_sound = true;

// 使えない。。。
} else {
	fontSize = 16;
	allow_sound = true;
}

/*
var topBtn			= $('#goToTop');    
var nowPosition		= 0;
var diffPosition	= 0;

$(window).scroll(function() {			// ページスクロール時
	var top			= $(window).scrollTop() *0.5;
	diffPosition	= nowPosition - top;
	nowPosition		= top;

    if ( 0 < diffPosition && window.innerHeight < top )
		topBtn.stop(true, true).show();		// 上方向かつ１.5ページ分より下ならshow
	else
        topBtn.stop(true, true).hide();		// 下方向ならhide
});

topBtn.fastClick(function () {  	  	// スクロールしてトップへ移動
    $('body,html').animate({ scrollTop: 0 }, 300);
});
*/


$(function(){
	$('a[href^=#]').fastClick(function(){
		var speed		= 500;
		var href		= $(this).attr("href");
		var target		= $(href == "#" || href == "" ? 'html' : href);
		var position	= target.offset().top;
		$("html, body").animate({scrollTop:position}, speed, "swing");

		return false;
	}).click(function(){
		return false;
	})
});


$("body").fastClick(function(e){
	// ダブルタップイベント阻止
	if ($(e.target).is("CANVAS, .reset, .button, i, .fontSizeButton"))
		e.preventDefault();

	// ページクリック時に移動ボタンを消す
	//topBtn.hide();
});



device = (function(){				// 端末の種類
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
})();

$font_size_buttons = $("#font-size > #buttons > div");

$font_size_buttons[0].addEventListener(kindOfEvent, function(){});
$font_size_buttons[1].addEventListener(kindOfEvent, function(){});
$font_size_buttons[2].addEventListener(kindOfEvent, function(){});

$font_size_buttons.eq(0).fastClick(function(e){ e.preventDefault(); changeFontSize(-1); });
$font_size_buttons.eq(1).fastClick(function(e){ e.preventDefault(); changeFontSize(10); });
$font_size_buttons.eq(2).fastClick(function(e){ e.preventDefault(); changeFontSize(+1); });

changeFontSize( 0 );

function changeFontSize(add) {				// 文字サイズボタンを押した時の処理
	if (fontSize == 14 && add == -1) return;
	if (fontSize == 18 && add == +1) return;

	if (add == -1 ){
		if (fontSize == 15)	fontSize = 14;
		else				fontSize = 15;
	} else if (add == 10) {
		fontSize = 16;
	} else if (add == 1) {
		if (fontSize == 17)	fontSize = 18;
		else				fontSize = 17;
	}

	for (var i = 0; i < 3; i++) {
		var match	= ( (i == 0 && fontSize < 16) ||
						(i == 1 && fontSize == 16) ||
						(i == 2 && fontSize > 16) );
		var limit	= ( (i == 0 && fontSize == 14) ||
						(i == 1 && fontSize == 16) ||
						(i == 2 && fontSize == 18) );

		$font_size_buttons.eq(i).css({
			color		: (match? "white"	: "skyblue"),
			background	: (match? "skyblue"	: "white"),
			cursor		: (limit? "default"	: "pointer")
		});
	}

	$("html").css("font-size", fontSize + "px");
	localStorage.setItem( "localFontSize", this.fontSize );

	// line-heightが1.5で４行を想定した高さ（fontSize * 1.5 * 4 + 20）
	$(".information").css("height", (fontSize * 6 + 20) + "px");
}
