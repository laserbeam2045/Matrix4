

var ASSETS = {
	"goke"			: "img/goke.jpg",
	"stone_sound_1"	: "sound/stone1.mp3",
	"capture1"   : "sound/capture1-1.mp3",
  "capture2"   : "sound/capture1-2.mp3",
  "capture3"   : "sound/capture3-1.mp3",
  "captureMany": "sound/capture9-1.mp3",
};
//var boardColor		= "rgb(255, 206, 137)";	// "スマホ rgb(255, 220, 146)";	// PC"rgb(255, 206, 137)";	// ２"rgb(249, 204, 139)";	// １"rgb(255, 206, 137)";	// "rgb(246, 197, 102)";	// "rgb(253, 210, 97)";	// "rgb(240, 184, 108)";
var boardColor		= "url(./img/bbb.png)";
var canvasElements	= document.getElementsByTagName("canvas");


function createShape(){				// canvas製の碁石画像
	var sc = tm.graphics.Canvas();
	sc.resize( STONE_SIZE * 4, STONE_SIZE);

	var half = HALF;
	sc.translate( STONE_SIZE * 2, 0 );

	var center = HALF / 2;
	var radialGradient = tm.graphics.RadialGradient( center, center, 0, center, center, STONE_SIZE / 2.5 );

	var color_arr = [];
	var num = 90, add = -8;

	for(var i=0; i<10; i++) {
		var rgb = "rgb(" + num + "," + num + "," + num + ")";
		color_arr[i] = { offset: i/10, color: rgb };
		num += add;
	}
	radialGradient.addColorStopList( color_arr );
	sc.setGradient( radialGradient );

	sc.fillCircle( half, half, HALF - 0.2 );	// 黒石

	sc.translate( STONE_SIZE, 0 );
	sc.fillStyle = "gray";
	sc.fillCircle( half, half, HALF );

	var radialGradient = tm.graphics.RadialGradient( HALF, HALF, HALF-3, HALF, HALF, HALF );

	num = 255; add = -5;

	for(var i=0; i<10; i++) {
		var rgb = "rgb(" + num + "," + num + "," + num + ")";
		color_arr[i] = { offset: i/10, color: rgb };
		num += add;
	}

	radialGradient.addColorStopList( color_arr );
	sc.setGradient( radialGradient );
	sc.fillCircle( half, half, HALF - 0.8 );

	sc.fillStyle = "white";
	sc.fillCircle( half, half, 5 );

	// -0.2 -0.2 -0.3から変更
	stoneShape = sc;

/* 不要になった
	var lc		= tm.graphics.Canvas();
	var lcSize	= STONE_SIZE * 3;
	var lcHalf	= lcSize / 2;

	lc.resize( lcSize, lcSize );

	// if( !(STONE_SIZE % 2) )	lc.translate( 0.5, 0.5 );

	lc.strokeStyle = "black";
	lc.strokeRect( half, half, STONE_SIZE * 2, STONE_SIZE * 2 );
	lc.drawLine( lcHalf, half, lcHalf, lcSize - half );
	lc.drawLine( half, lcHalf, lcSize - half, lcHalf );

	lineShape = lc;
*/
};



tm.define("MainScene", {			// メインのシーン
	superClass: "tm.app.Scene",

	init: function( app ) {
		this.superInit();

		this.stone_sound_1 = tm.asset.AssetManager.get("stone_sound_1");
		this.stone_sound_1.setVolume(1.0).setLoop(false).setPosition(0,0,1);

		this.capture_sound_1 = tm.asset.AssetManager.get("capture1");
		this.capture_sound_1.setVolume(1.0).setLoop(false).setPosition(0,0,1);

		this.capture_sound_2 = tm.asset.AssetManager.get("capture2");
		this.capture_sound_2.setVolume(1.0).setLoop(false).setPosition(0,0,1);

		this.capture_sound_3 = tm.asset.AssetManager.get("capture3");
		this.capture_sound_3.setVolume(1.0).setLoop(false).setPosition(0,0,1);

		this.capture_sound_many = tm.asset.AssetManager.get("captureMany");
		this.capture_sound_many.setVolume(1.0).setLoop(false).setPosition(0,0,1);

		this.app = app;
		createBoard( this, app.data.X, app.data.Y );

		app.rule_info = function(label, color){
			$rule_info = $(app.element.parentNode).find(".rule-info");

			$rule_info.html(label).finish();

			if (label != "")
				$rule_info.css({color:color, left:"85px", opacity:1})
					.animate({left: 0}, 200).delay(1500).animate({opacity: 0.01}, 1000);
		};
	}
});



tm.define("SpriteGroup", {				// 碁石のスプライトをまとめるグループ
	superClass: "tm.display.CanvasElement",

	init: function( app ) {
		this.superInit();

		this.width	= STONE_SIZE * app.data.X;
		this.height	= STONE_SIZE * app.data.Y;
	}
});



tm.define("stoneCircle", {			// 円形の図形をparentの（X,Y）に追加するクラス
	superClass: "tm.display.Shape",

	init: function( color, X, Y, parent ) {
		this.superInit({
			width		: 40,
			height		: 40,
		});

		this.canvas.strokeStyle	= color;
		this.canvas.fillStyle	= color;

		var cx = this.canvas.centerX;
		var cy = this.canvas.centerY;

		if( this.canvas.globalCompositeOperation ){
			this.canvas.globalCompositeOperation = "source-out";
			this.canvas.fillCircle( cx, cy, HALF - 1 );
			this.canvas.fillCircle( cx, cy, HALF + 0.5 );
		}else{
			this.canvas.strokeCircle( cx, cy, HALF );
			console.log("stroke描画");
		}

		var bx = STONE_SIZE * (X - 1) + HALF;
		var by = STONE_SIZE * (Y - 1) + HALF;

		this.setPosition( bx, by ).addChildTo( parent );

		return this;
	}
});



function lastPoint( app ) {			// 最後に打った地点にマーキングする関数
	var data = app.data;
	var color = (data.lastColor == BLACK)? "red": "blue";
	var X = data.lastZ % data.MX;
	var Y = (data.lastZ / data.MX).floor();
	var over = app.MainScene.OverStone;

	for(var i=0; i<over.children.length; i++){
		if( !over.children[i].fontStyle ) over.children.splice( i, 1 );
	}

//	over.children = [];
	stoneCircle( color, X, Y, over );
}



//-----------------//
// 碁盤の線を作るクラス //
//----------------//
tm.define("createLine", {
	superClass: "tm.display.Shape",

	init: function( app ) {
		this.superInit({
			width		: STONE_SIZE * app.data.X,
			height		: STONE_SIZE * app.data.Y,
			lower_end	: HALF + STONE_SIZE * (app.data.Y - 1),
			right_end	: HALF + STONE_SIZE * (app.data.X - 1),
			app			: app
		});

		this.drawLine();

		return this;
	},

	// 線を描画するメソッド
	drawLine: function() {
		this.canvas.strokeStyle	= "black";

		for(var X = 0; X < this.app.data.X; X++) {
			var x_pos = HALF + STONE_SIZE * X;
			this.canvas.drawLine( x_pos, HALF, x_pos, this.lower_end );
		}

		for(var Y = 0; Y < this.app.data.Y; Y++) {
			var y_pos = HALF + STONE_SIZE * Y;
			this.canvas.drawLine( HALF, y_pos, this.right_end, y_pos );
		}
	},

	// 線を部分的に消すメソッド
	clear: function(x, y) {
		var start_x = STONE_SIZE * (x - 1) + (STONE_SIZE / 10);
		var start_y = STONE_SIZE * (y - 1) + (STONE_SIZE / 10);
		this.canvas.clear(start_x, start_y, STONE_SIZE * 0.8, STONE_SIZE * 0.8);
	}
});



function createBoard( scene, X, Y ) {		// 盤面の画像を作成する関数

	var app = scene.app, data = app.data, TOP = BOARD_MARGIN[0], LEFT = BOARD_MARGIN[3];

	scene.Line			= createLine( app ).setOrigin(0, 0).setInteractive(true).setBoundingType("rect")
											.setPosition( LEFT, TOP ).addChildTo( scene );
	scene.UnderStone	= SpriteGroup( app ).setPosition( LEFT, TOP ).addChildTo( scene );
	scene.Stones		= SpriteGroup( app ).setPosition( LEFT, TOP ).addChildTo( scene );
	scene.OverStone		= SpriteGroup( app ).setPosition( LEFT, TOP ).addChildTo( scene );

	scene.Stones.Zarr = [];		// 番兵込みのZindexでアクセスするための配列

	var stoneClick = function( Z ) {		// 碁石のクリック時の処理（onpointingend
		if( !app.data.interactive )	return;

		var val = putStone( app, Z, true );

		if( val == -1 )			app.rule_info("コウです", "red");
		else if( val == -2 )	app.rule_info("着手禁止点", "red");
		else					app.rule_info("");
	}

	for(var x=0; x<X; x++)
	for(var y=0; y<Y; y++) {
		var stone = tm.display.Sprite( stoneShape, STONE_SIZE, STONE_SIZE ).addChildTo( scene.Stones );

		stone.Z = fusion( app.data, x + 1, y + 1 );

		scene.Stones.Zarr[ stone.Z ] = stone.setPosition( STONE_SIZE * x, STONE_SIZE * y )
											.setFrameIndex( 0 ).setOrigin(0, 0)
											.setInteractive( true ).setBoundingType("rect");

		stone.onclick = function(){ stoneClick( this.Z ); };

		if( device == "other" ) stone.onmouseover = function(e) {	// 碁石にカーソルが乗った時の処理
			scene.Line.ghostStone.setPosition( this.x, this.y )		// 半透明石の位置を変更
		};
	}

	if( device == "other" ) {	// もしデバイスがＰＣなら
		// 半透明の碁石を作成する
		scene.Line.ghostStone = tm.display.Sprite( stoneShape, STONE_SIZE, STONE_SIZE )
										.setOrigin( 0, 0 ).setPosition( -100, -100 )
										.setAlpha( 0.4 ).addChildTo( scene.Line );

		// カーソルが線から出たら盤外に移動させる
		scene.Line.onmouseout = function() {
			scene.Line.ghostStone.setPosition( -100, -100 );
		};

		// canvasElementにも設定。必ず発火。
		// stoneのmouseoverが遅れることがあるので少し待つ。
		canvasElements[ app.number ].onmouseout = function(){
			scene.Line.ghostStone.tweener.clear().wait(1).to({x: -100, y:-100}, 1);
		};
	}
}



function boardExpression( app ) {		// board配列に基づいて、碁石の画像を変更する関数
	var board		= app.data.board,
		universe	= app.data.universe,
		stones		= app.MainScene.Stones.Zarr;

	for(var i=0, len=universe.length; i<len; i++) {
		var z = universe[i];
		stones[z].frameIndex = board[z];
	}

	changeCursor( app );
}



function changeCursor( app ) {					// カーソルと手番情報を変更する関数
	var elem = document.getElementById("world" + app.number);
	var turn = turn_info[ app.number ];

	if( app.data.interactive ){
		elem.style.cursor		= "pointer";
		turn.style.display		= "block";
		turn.innerHTML			= ( app.data.turn == BLACK )? "黒番": "白番";
		if( device == "other" ) app.MainScene.Line.ghostStone.setFrameIndex( app.data.turn );
	}else{
		elem.style.cursor		= "default";
		turn.style.display		= "none";
		if( device == "other" ) app.MainScene.Line.ghostStone.setFrameIndex( 0 );
	}
}



function createLabel( str, X, Y, group, color ) {		// ラベルを作る関数
	var label = tm.app.Label( str );
	var posX = STONE_SIZE * (X - 1);
	var posY = STONE_SIZE * (Y - 1);

	if( color ) label.fillStyle = color;
	return label.setFontSize(18).setFontWeight(900).setPosition(posX + HALF, posY + HALF).addChildTo(group);
}



tm.define("circle", {			// 目印の点
	superClass: "tm.display.Shape",

	init: function( color, X, Y, parent ) {
		this.superInit({
			width		: 30,
			height		: 30,
		});

		this.canvas.strokeStyle	= "black";
		this.canvas.fillStyle	= color;

		var cx		= this.canvas.centerX;
		var cy		= this.canvas.centerY;

		this.canvas.fillCircle( cx, cy, 3 );
		this.canvas.strokeCircle( cx, cy, 4 );

		var bx = STONE_SIZE * (X - 1) + HALF;
		var by = STONE_SIZE * (Y - 1) + HALF;

		this.setPosition( bx, by ).addChildTo( parent );

		return this;
	}
});

// pointing.getPointing()