
var STONE_SIZE;
var HALF;
var BOARD_MARGIN	= [15, 15, 15, 15];

tm.main( function() {
	var app0	= tm.display.CanvasApp("#world0");
		app1	= tm.display.CanvasApp("#world1"),
		app2	= tm.display.CanvasApp("#world2"),
		app3	= tm.display.CanvasApp("#world3"),
		app4	= tm.display.CanvasApp("#world4");

	appArr = [ app0, app1, app2, app3, app4 ];

	if( 375 <= window.innerWidth )		STONE_SIZE = 31;
	else if( 347 <= window.innerWidth )	STONE_SIZE = 29;
	else								STONE_SIZE = 27;
	HALF = STONE_SIZE / 2;

	createShape();

	for(var i=0; i<appArr.length; i++) {
		(function() {
			var app			= appArr[i];
			app.number		= i;
			app.background	= boardColor;//"rgb(220, 160, 80)";

			app.data = new boardData( 7, 7 );
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



function settingBoard( boardNum, client ) {		// 盤面の初期状態を作る関数

	settBoardFunc[ boardNum ]( client );	// 各関数の呼び出し
	boardExpression( appArr[boardNum] );	// 盤面の反映
	rule_info[ boardNum ].innerHTML = "";
}



function userClickProcessing( app ) {			// ユーザーが着手した時の処理
	if( app.number == 0 ) click0();
	if( app.number == 1 ) click1();
	if( app.number == 2 ) click2();
	if( app.number == 3 ) click3();
}



function computerPut( app, z, time ) {			// computerに打たせる関数

	timer = window.setTimeout( function(a,b){putStone(a, b)}, time, app, z );
}



function computerProcessing( app ) {			// computerが着手した時の処理
	var num		= app.number;
	var data	= app.data;
	var over	= app.MainScene.OverStone;

	if( num == 2 && infoNum[num] == 8 ){
		lastPoint( app );
	}

	if( num == 2 && infoNum[num] == 9 ){
		app.MainScene.OverStone.children = [];

		if( data.board[57] == SPACE ){			// 白がコウ立てを打った時
			data.turn = BLACK;
			computerPut( app, 57, 1000 );
			createLabel( "Ｃ", 4, 6, app.MainScene.OverStone, "black" );
		}else if( data.board[39] == SPACE ){
			data.turn = WHITE;
			createLabel( "Ｃ", 4, 6, app.MainScene.OverStone, "black" );
			createLabel( "Ｄ", 3, 6, app.MainScene.OverStone, "white" );
			data.turn = WHITE;
			data.interactive = true;
		}
	}

	if( num == 3 && infoNum[num] == 3 ){
		app.data.interactive = true;
		app.data.turn = WHITE;
	}

	if( num != 2 ) lastPoint( app );
}


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



function changeInformation( boardNum ) {	// 文章と番号を変更する関数

	var id = "info" + boardNum + "-" + infoNum[ boardNum ];
	
	changeInfo( boardNum, id );

	var text = infoNum[ boardNum ] + "/" + maxInfoNum[ boardNum ];
	infoNumElm[ boardNum ].innerHTML = text;							// 番号変更
}



function changeInfo( boardNum, id ) {		// idを受け取り、文章を変更する関数

	while( info[ boardNum ].firstChild )
		info[ boardNum ].removeChild( info[ boardNum ].firstChild );	// ｐタグ削除

	var clone = document.getElementById( id ).cloneNode( true );		// クローン生成

	info[ boardNum ].appendChild( clone );								// 追加
}



function changeButton( boardNum ) {			// ボタンの状態を変更する関数
	var num		= infoNum[ boardNum ],
		max		= maxInfoNum[ boardNum ],
		$left	= $(".leftArrow").eq( boardNum ),
		$right	= $(".rightArrow").eq( boardNum );

	if( num == 1 )		$left.css("cursor", "default").html("").addClass("freeze");
	else				$left.css("cursor", "pointer").html("←").removeClass("freeze");

	if( num == max )	$right.css("cursor", "default").html("").addClass("freeze");
	else				$right.css("cursor", "pointer").html("→").removeClass("freeze");
}