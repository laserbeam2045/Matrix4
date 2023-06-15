


function setting0( client ) {	// 「１、黒と白が順番に打つ」の初期盤面
	var num = infoNum[0];

	if( !client ){
		resetBoard( appArr[0] );		// 何もない状態にする
		appArr[0].data.turn = BLACK;
	}

	turn_info[0].style.border = "1px solid gray";

	palette[0].style.visibility = "visible";
	appArr[0].data.interactive	= true;
	return;

	if( num == 1 ){
		palette[0].style.visibility = "hidden";
		appArr[0].data.interactive	= false;
	}else{
		palette[0].style.visibility = "visible";
		appArr[0].data.interactive	= true;
	}
}


function click0() {
	changeTurn( appArr[0] );	// 手番を入れ替える

	if( infoNum[0] == 2 ){
		changeInfo( 0, "info0-2-2" );
		turn_info[0].style.border = "1px solid red";
	}
}



function setting1( client ) {	// 「２、相手の石は囲めば取れる」の初期盤面
	var app = appArr[1], data = app.data, b = data.board, num = infoNum[1];

	var under = app.MainScene.UnderStone;
	var over  = app.MainScene.OverStone;

	resetBoard( app );
	under.children = [];
	over.children  = [];
	data.turn = WHITE;
	data.interactive = (num == 1 || num == 7)? false: true;

	switch( num ){
		case 1: palette[1].style.visibility = "hidden";	break;
		case 2:	palette[1].style.visibility = "visible";
				var color = "white";
				circle( color, 4, 3, under );
				circle( color, 3, 4, under );
				circle( color, 5, 4, under );
				circle( color, 4, 5, under );
				b[40] = BLACK;									break;
		case 3: b[67] = BLACK;									break;
		case 4: b[64] = BLACK;									break;
		case 5: b[39] = b[40] = BLACK;							break;
		case 6: b[48] = b[40] = BLACK;
				b[39] = b[49] = WHITE;
				palette[1].style.visibility = "visible";		break;
		case 7:	palette[1].style.visibility = "hidden";
				tm.display.Sprite( "goke", data.WIDTH, data.HEIGHT ).addChildTo( under )
					.setOrigin( 0, 0 ).setPosition( -15, -15 );
	}
}


function click1() {
	var data = appArr[1].data, b = data.board, flag = "end";

	switch( infoNum[1] ){
		case 2: if (b[40] == BLACK)						flag = "yet"; break;
		case 3: if (b[67] == BLACK)						flag = "yet"; break;
		case 4: if (b[64] == BLACK)						flag = "yet"; break;
		case 5: if (b[40] == BLACK)						flag = "yet"; break;
		case 6: if( b[48] == BLACK || b[40] == BLACK )	flag = "yet"; break;
	}

	if (flag == "end") {
		data.interactive = false;
		switch( infoNum[1] ){
			case 2:	changeInfo(1, "info1-2-2");	break;
			case 3:	changeInfo(1, "info1-3-2");	break;
			case 4: changeInfo(1, "info1-4-2");	break;
		}
/*
		appArr[1].rule_info("SUCCESS！", "blue");
		if( infoNum[1] == 2 && b.toString() == "4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,3,0,0,0,4,4,0,0,3,0,3,0,0,4,4,0,0,0,3,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4" ||
			infoNum[1] == 3 && b.toString() == "4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,3,0,0,0,3,0,0,4,4,0,3,0,3,0,3,0,4,4,4,4,4,4,4,4,4,4" ||
			infoNum[1] == 4 && b.toString() == "4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,3,3,0,0,0,4,4,0,3,0,0,3,0,0,4,4,0,0,3,3,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4" ||
			infoNum[1] == 5 && b.toString() == "4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,3,0,0,0,4,4,0,0,3,0,3,0,0,4,4,0,3,0,3,0,0,0,4,4,0,0,3,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4")
				rule_info[1].innerHTML = "PERFECT！";
*/
	}
}



function setting2( client ) {	// 「３、打てない場所がある」の初期盤面
	var app = appArr[2], data = app.data, b	= data.board, num = infoNum[2],
		over = app.MainScene.OverStone;

	over.children	= [];

	palette[2].style.visibility	= (num == 1 || num == 8 || num == 9)?	"hidden": "visible";
	data.interactive			= (num == 1 || num == 8 || num == 9)?	false	: true;

//	app.MainScene.Lines.children[17].alpha =
//	app.MainScene.Lines.children[24].alpha = (num == 6)? 0: 1;

	if (num == 4) {
		createLabel( "Ａ", 3, 4, over, "black" );
		createLabel( "Ｂ", 4, 4, over, "black" );
		app.MainScene.Line.clear(3, 4);
		app.MainScene.Line.clear(4, 4);
	} else if (num == 5) {
		app.MainScene.Line.drawLine();
		stoneCircle("blue", 3, 5, over);
		stoneCircle("blue", 4, 5, over);
		if( client == 1 ) return;
	}

	if( num == 7 && client == 1 ) {
		app.MainScene.Line.drawLine();
		return;
	}

	data.turn = (num == 3 || num == 9)? WHITE: BLACK;

	resetBoard( app );

	var ko = function(){
				b[30] = b[38] = b[48] = BLACK;
				b[31] = b[39] = b[41] = b[49] = WHITE;
			};

	switch( num ){
		case 2:	b[31] = b[39] = b[41] = b[49] = WHITE;					break;
		case 3: b[31] = b[39] = b[41] = b[49] = WHITE;
						app.MainScene.Line.drawLine();					break;
		case 4:
		case 5: b[30] = b[31] = b[38] = b[41] =	b[48] = b[49] = WHITE;	break;
		case 6:	ko();	createLabel( "Ａ", 4, 4, over, "black" );
						app.MainScene.Line.clear(4, 4);					break;
		case 7: ko();	app.MainScene.Line.drawLine();					break;
		case 8:	ko();	app.MainScene.Line.drawLine();
						computerPut( app, 40, 1000 );					break;
		case 9:	ko();	computerPut( app, 58, 1000 );
				b[40] = BLACK;	b[39] = SPACE;	stoneCircle( "red", 4, 4, over );
	}
}


function click2() {				// 「３、打てない場所がある」の着手時
	var app = appArr[2], data = app.data, b = data.board,
		over = app.MainScene.OverStone, num = infoNum[2];

	switch( num ){
		case 2:	data.interactive = false;							break;
		case 3:	data.interactive = false;
				if( b[40] == WHITE ) changeInfo( 2, "info2-3-2" );	break;
		case 4:	var id = info[2].firstChild.id;
				data.interactive = false;
				if( id == "info2-4" && (b[39] == BLACK || b[40] == BLACK) ){
					changeInfo( 2, "info2-4-2" );
					data.interactive = true;
					app.MainScene.Line.drawLine();
					over.children = [];
				}
				break;
		case 5: if( b[39] == BLACK && b[40] == BLACK ){
					over.children = [];
					changeInfo( 2, "info2-5-2" );
				}
				break;
		case 6:
		case 7:	changeTurn( app );	data.ko.push( 0 );
				if( num == 7 ) return;

				var id = info[2].firstChild.id;

				if( id == "info2-6" && b[40] == BLACK ){
					changeInfo( 2, "info2-6-2" );
					over.children = [];
					createLabel( "Ｂ", 3, 4, over, "white" );
					app.MainScene.Line.clear(3, 4);
				}
				if( id == "info2-6-2" && b[39] == WHITE ){
					changeInfo( 2, "info2-6-3" );
					//app.MainScene.Lines.children[17].setAlpha( 1 );
					//app.MainScene.Lines.children[24].setAlpha( 1 );
					over.children = [];
					app.MainScene.Line.drawLine();
				}
				break;
		case 8: over.children = [];	break;
		case 9:	over.children = [];	lastPoint( app );	changeTurn( app );
	}
}



function setting3( client ) {	// 「４、石には生き死にがある」の初期配置
	var app = appArr[3], data = app.data, num = infoNum[3], over = app.MainScene.OverStone;

	if (num <= 4) {
		app.MainScene.Line.drawLine();
	} else if (num == 9) return;

	over.children = [];
	var b = data.board	= [4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,2,0,0,0,0,0,4,4,0,0,2,2,2,2,2,4,4,2,2,3,3,3,3,2,4,4,3,3,3,2,0,3,3,4,4,0,0,0,3,0,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4];

	switch( num ){
		case 1:										app.MainScene.Line.drawLine();		break; 
		case 2: data.turn = WHITE;					createLabel( "Ａ", 5, 5, over, "white" );
													app.MainScene.Line.clear(5, 5);
													stoneCircle( "red", 4, 5, over );	break;
		case 3: data.turn = BLACK; 					computerPut( app, 50, 1500, true );
													app.MainScene.Line.drawLine();		break;
		case 4:										createLabel( "×", 4, 5, over );		break;
		case 6: data.turn = BLACK; b[28] = WHITE;	stoneCircle( "blue", 1, 3, over );	break;
		case 7: data.turn = BLACK; b[29] = WHITE;	stoneCircle( "blue", 2, 3, over );	break;
	}

	data.interactive			= (num == 2 || num == 6 || num == 7)?				true		: false;
	palette[3].style.visibility	= (num == 2 || num == 3 || num == 6 || num == 7)?	"visible"	: "hidden";
}


function click3() {				// 「４、石には生き死にがある」の着手時
	var app = appArr[3], data = app.data, b = data.board,
		num = infoNum[3], over = app.MainScene.OverStone;

	data.interactive = false;

	switch( num ){
		case 2: if(b[49] == SPACE)	over.children = [];	break;
		case 3: if(b[49] == SPACE)	over.children = [];	break;
		case 6: if(b[29] == BLACK) {
					changeInfo( app.number, "info3-6-2" );
				}else{
					changeInfo( app.number, "info3-6-3" );
					data.turn = WHITE;
					computerPut( app, 29, 1000 );
				}
				lastPoint( app );
				break;
		case 7:	if(b[28] == BLACK) {
					changeInfo( app.number, "info3-7-2" );
				}else{
					changeInfo( app.number, "info3-6-3" );
					data.turn = WHITE;
					computerPut( app, 28, 1000 );
				}
				lastPoint( app );
				break;
	}
}



function setting4( client ) {	// 「５、地が多いほうの勝ち」の初期配置
	var app = appArr[4], data = app.data, b = data.board, num = infoNum[ app.number ],
		over = app.MainScene.OverStone,	under = app.MainScene.UnderStone;

	over.children = [];
	data.interactive = false;
	if( num != 7 ) under.children = [];

	if( num == 1 || num == 11 )	data.board = [4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,2,0,0,0,0,0,4,4,0,0,2,2,2,2,2,4,4,2,2,3,3,3,3,2,4,4,3,3,3,2,0,3,3,4,4,0,0,0,3,0,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4];
	if( num == 4 )				b[49] = BLACK;
	if( num == 5 )				b[49] = b[29] = SPACE;
	if( num == 6 )				b[29] = BLACK;
	if( num == 7 ){				b[20] = BLACK;	b[58] = WHITE; }
	if( num == 8 )				b[20] = b[28] = b[49] = b[58] = SPACE;
	if( num == 9 )				data.board = [4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,2,2,2,2,2,2,2,4,4,2,2,3,3,3,3,2,4,4,3,3,3,3,0,3,3,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4];
	if( num == 10 )				b[25] = SPACE;
	if( num == 12 )				b[25] = b[70] = SPACE;
	if( num == 13 )				b[70] = WHITE;
	if( num == 14 )				b[70] = SPACE;

	if( num == 6 || num == 8 ){
		for(var X=1; X<=7; X++)
		for(var Y=1; Y<=3; Y++) {
			createLabel( "▲", X, Y, under, "black" );
		}
		for(var X=1; X<=7; X++)
		for(var Y=5; Y<=7; Y++) {
			createLabel( "■", X, Y, under, "white" );
		}
	}

	if( num == 5 ){
		var pointArr = [STONE_SIZE * 3 + HALF,			STONE_SIZE * 4 + HALF,
						STONE_SIZE * 3 + HALF * 1.5,	STONE_SIZE * 3 + HALF,
						STONE_SIZE * 3 + HALF * 0.5,	STONE_SIZE * 2 + HALF + HALF / 3,
						STONE_SIZE * 2 + HALF,			STONE_SIZE * 2 + HALF];

		var arrow1 = arrow( pointArr, "red", -80 ).setAlpha( 0 ).addChildTo( over );

		var bs = tm.display.Sprite( stoneShape, STONE_SIZE, STONE_SIZE ).addChildTo( over )
					.setFrameIndex( BLACK ).setOrigin( 0, 0 )
					.setPosition( STONE_SIZE * 3, STONE_SIZE * 4 );

		bs.tweener.wait( 500 ).call( function(){ arrow1.setAlpha(1); } )
					.wait( 500 ).by( {x: -STONE_SIZE * 2, y: -STONE_SIZE * 2}, 2500, "easeInOutQuad" )
					.wait( 500 ).call( function(){ bs.children = []; arrow1.remove(); } );

		stoneCircle( "white", 1, 1, bs );
	}else if( num == 8 ){
		var bs = tm.display.Sprite( stoneShape, STONE_SIZE, STONE_SIZE ).addChildTo( over );
		var ws = tm.display.Sprite( stoneShape, STONE_SIZE, STONE_SIZE ).addChildTo( over );

		bs.setFrameIndex( BLACK ).setOrigin( 0, 0 ).setPosition( STONE_SIZE, STONE_SIZE );
		ws.setFrameIndex( WHITE ).setOrigin( 0, 0 ).setPosition( STONE_SIZE * 3, STONE_SIZE * 5 );

		bs.tweener.to( {x: 0}, 1000, "easeInOutQuad").by( {y: STONE_SIZE}, 1000, "easeInOutQuad" );
		ws.tweener.wait( 2000 ).by( {y: -STONE_SIZE}, 1000, "easeInOutQuad" );
	}else if( num == 11 ){
		data.turn = WHITE;
		computerPut( app, 25, 1500 );
	}else if( num == 12 ){
		var pointArr = [STONE_SIZE * 6 + HALF,					STONE_SIZE + HALF,
						STONE_SIZE * 5 + HALF - STONE_SIZE / 5,	STONE_SIZE * 2 + HALF,
						STONE_SIZE * 5 + HALF - STONE_SIZE / 5,	STONE_SIZE * 4 + HALF,
						STONE_SIZE * 6 - STONE_SIZE / 8,		STONE_SIZE * 6 - STONE_SIZE / 5];

		var arrow1	= arrow( pointArr, "red", 150 );
		var ws1		= tm.display.Sprite( stoneShape, STONE_SIZE, STONE_SIZE ).addChildTo( over );
		ws1.setFrameIndex( WHITE ).setOrigin( 0, 0 ).setPosition( STONE_SIZE * 6, STONE_SIZE );

		ws1.tweener.wait( 1000 ).call( function(){ arrow1.addChildTo( over ); } )
					.wait( 1000 ).by( {y: STONE_SIZE * 5}, 2000, "easeInOutQuad" )
					.wait( 1000 ).call( function(){ arrow1.remove(); } );
	}
}


settBoardFunc = [ setting0, setting1, setting2, setting3, setting4 ];







tm.define("arrow", {
	superClass: "tm.display.Shape",

	init: function( arr, color, rotation ) {
		this.superInit({
			width	: 205,
			height	: 205,
		});

		this.canvas.strokeStyle = color;
		this.canvas.fillStyle	= color;

		var sentan = triangle( color ).addChildTo( this ).setPosition( arr[6], arr[7] );
		sentan.rotation += rotation;

		//this.canvas.drawLine( sx, sy, ex, ey );
		
		//for(var i=-3; i<=3; i++) this.canvas.drawLine( sx+i, sy+i, ex+i, ey+i );

		if( arr.length == 8 ) Bezier( arr ).addChildTo( this ).setOrigin(0, 0);
		else{
			for(var i=-1; i<=1; i++) this.canvas.drawLine( arr[0] + i, arr[1] + i, arr[2] + i, arr[3] + i );
		}
/*
this.canvas.strokeStyle = "skyblue";
this.canvas.drawPoint(arr[0], arr[1]);
this.canvas.drawPoint(arr[4], arr[5]);
this.canvas.drawPoint(arr[6], arr[7]);
this.canvas.drawPoint(arr[2], arr[3]);
*/
		return this;
	}
});


tm.define("triangle", {
	superClass: "tm.display.Shape",

	init: function( color ) {
		this.superInit({
			width	: 10,
			height	: 10,
		});

		this.canvas.strokeStyle =
		this.canvas.fillStyle	= color;

		this.canvas.fillTriangle( 5, 0, 0, 10, 10, 10);
		this.originY = 0.8;
	}
});


var getListBezierCurve3D = function (x0,y0,x1,y1,x2,y2,x3,y3,interpolate) {
	var result = [];
    
    // tの増加量を予め取得
	var plus = 1.0 / (interpolate - 1);
    
    // 分割数分ループして座標をスタックしていく
	for(var i = 0; i < interpolate; ++i) {
        // tを求める
		var t = plus*i;

		var v0 = (1-t) * (1-t) * (1-t);
		var v1 = 3 * t * (1-t) * (1-t);
		var v2 = 3 * t * t * (1-t);
		var v3 = t * t * t;

        result.push({
        	x: (v0 * x0) + (v1 * x1) + (v2 * x2) + (v3 * x3),
        	y: (v0 * y0) + (v1 * y1) + (v2 * y2) + (v3 * y3),
        });
	}
	return result;
};


tm.define("Bezier", {
	superClass: "tm.display.Shape",

	init: function ( arr ) {
		this.superInit(640, 600);

		var c = this.canvas;
		c.setStrokeStyle("rgba(255,0,0,1.0)");
		c.setLineStyle(2, "round", "round", 2);

		var list = getListBezierCurve3D(	arr[0], arr[1],
											arr[2], arr[3],
											arr[4], arr[5],
											arr[6], arr[7], 40 );
        //console.dir(list);

		for (var i = 1; i < 40; ++i) {
			for(var j = 0; j <= 1; j++)
				this.canvas.drawLine(
				list[i-1].x + j,
				list[i-1].y + j,
				list[i].x + j,
				list[i].y + j);
		}
	},
});