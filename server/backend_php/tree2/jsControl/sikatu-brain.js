
var STONE_SIZE;
var HALF;
var BOARD_MARGIN	= [15, 15, 15, 15];


tm.main( function() {
	var app0 = tm.display.CanvasApp("#world0");
	var app1 = tm.display.CanvasApp("#world1");
	var app2 = tm.display.CanvasApp("#world2");
	var app3 = tm.display.CanvasApp("#world3");
	var app4 = tm.display.CanvasApp("#world4");
/*	var app5 = tm.display.CanvasApp("#world5");
	var app6 = tm.display.CanvasApp("#world6");
	var app7 = tm.display.CanvasApp("#world7");
	var app8 = tm.display.CanvasApp("#world8");
*/
	appArr = [app0, app1, app2, app3, app4 ];

	if( 347 < window.innerWidth )	STONE_SIZE = 29;
	else							STONE_SIZE	= 27;
	HALF		= STONE_SIZE / 2;

	createShape();

	app0.data = new boardData( 9, 7 );
	app1.data = new boardData( 7, 7 );
	app2.data = new boardData( 8, 7 );
	app3.data = new boardData( 10, 7 );
	app4.data = new boardData( 7, 7 );
/*	initBoard( app5, 9, 7 );
	initBoard( app6, 8, 8 );
	initBoard( app7, 9, 7 );
	initBoard( app8, 9, 7 );
*/
	for(var i=0; i<appArr.length; i++) {
		(function(){
			var app			= appArr[i];
			app.number		= i;
			app.background	= boardColor;//"rgb(220, 160, 80)";

			app.resize( app.data.WIDTH, app.data.HEIGHT );

			var loading = tm.game.LoadingScene({
				assets	: ASSETS,
				width	: app.data.WIDTH,
				height	: app.data.HEIGHT
			});

			loading.onload = function() {
				app.MainScene = MainScene( app );
				app.replaceScene( app.MainScene );
			};

			app.replaceScene( loading );
			app.run();
		})();
	}
});


var timer = null;

function changeInfoNum( boardNum, add ) {		// ←→ボタンを押した時の処理

	if( timer != null ){
		clearTimeout( timer );
		timer = null;
	}

	infoNum[ boardNum ] += add;		// 番号を加算／減算

	changeInformation( boardNum );	// 文章を変更
	changeButton( boardNum );		// ボタンの状態を変更
	settingBoard( boardNum, add );	// 盤面の状態を変更
}



function settingBoard( boardNum, add ) {		// 盤面をセッティングする関数
	var app = appArr[ boardNum ];

	if( boardNum == 0 )	app.data.board = [4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,2,3,3,3,3,3,2,0,4,4,0,2,3,0,3,0,3,2,0,4,4,0,2,3,3,3,3,3,2,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4];
	if( boardNum == 1 ){
		app.data.board = [4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,2,2,2,0,0,4,4,0,2,3,3,3,2,0,4,4,0,2,3,0,3,2,0,4,4,0,2,3,3,3,2,0,4,4,0,0,2,2,2,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4];
		app.data.interactive = true;
	}
	if( boardNum == 2 )	setting2( add );
	if( boardNum == 3 )	app.data.board = [4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,0,0,2,2,2,2,2,2,0,0,4,4,0,2,3,3,3,3,3,3,2,0,4,4,0,2,3,0,3,0,0,3,2,0,4,4,0,2,3,3,3,3,3,3,2,0,4,4,0,0,2,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4];
	if( boardNum == 4 )	setting4( add );
	if( boardNum == 5 ) setting5( add );
	if( boardNum == 6 ) setting6( add );
	if( boardNum == 7 ) setting7( add );
	if( boardNum == 8 ) setting8( add );

	rule_info[ boardNum ].innerHTML = "";
	boardExpression( app );
}



function userClickProcessing( argumentApp ) {		// ユーザーの着手時の処理
	app		= argumentApp;
	bNum	= app.number;
	iNum	= infoNum[ bNum ];
	data	= app.data;
	b		= data.board;

	if( bNum == 1 )	if( b[30] == SPACE ) data.interactive = false;
	if( bNum == 2 )	clicked2();
	if( bNum == 4 )	clicked4();
	if( bNum == 5 ) clicked5();
}



function computerProcessing( app ) {		// computerの着手時の処理
	var bNum = app.number, board = app.data.board;

	if( bNum == 2 ){
		if( infoNum[2] == 3 ) return;
		app.data.interactive = true;
		app.data.turn = BLACK;
	}else if( bNum == 4 ){

		if( board[68] == SPACE ){
			if( board[50] == SPACE ){
				if( board[51] == SPACE )	computerPut( appArr[4], 51, 1000 );
				else						computerPut( appArr[4], 50, 1000 );
			}else{
				computerPut( appArr[4], 68, 1000 );
			}
		}else{
			app.data.interactive = true;
			app.data.turn = BLACK;
		}
	}else if( bNum == 5 && iNum == 6){
		app.data.interactive = true;
		app.data.turn = BLACK;
	}
}



function changeInformation( boardNum ) {	// 文章と番号を変更する関数

	var id = "info" + boardNum + "-" + infoNum[ boardNum ];
	
	changeInfo( boardNum, id );

	var text		= infoNum[ boardNum ] + "/" + maxInfoNum[ boardNum ];
	var infoNumElm	= document.getElementById("infoNum" + boardNum);

	infoNumElm.innerHTML = text;				// 番号変更
}



function changeInfo( boardNum, id ) {		// idを受け取り、文章を変更する関数
	var info = document.getElementById("information" + boardNum);

	while( info.firstChild ) info.removeChild( info.firstChild );	// ｐタグ削除

	var clone = document.getElementById( id ).cloneNode( true );	// クローン生成
	info.appendChild( clone );										// 追加
}



function changeButton( boardNum ) {			// ボタンの状態を変更する関数
	var num		= infoNum[ boardNum ],
		max		= maxInfoNum[ boardNum ],
		$left	= $("#leftArrow" + boardNum),		// 間が飛んでいるのでidで指定
		$right	= $("#rightArrow" + boardNum);

	if( num == 1 )		$left.css("cursor", "default").html("").addClass("freeze");
	else				$left.css("cursor", "pointer").html("←").removeClass("freeze");

	if( num == max )	$right.css("cursor", "default").html("").addClass("freeze");
	else				$right.css("cursor", "pointer").html("→").removeClass("freeze");
}