
var STONE_SIZE;
var HALF;
var BOARD_MARGIN	= [15, 15, 15, 15];

var usersColor		= BLACK;
var	computersColor	= WHITE;
var winning_point	= 5;
var level			= 1;

tm.main( function() {
	app = tm.display.CanvasApp("#world0");

	app.number		= 0;
	app.background	= boardColor;

	if( 347 < window.innerWidth )	STONE_SIZE = 29;
	else							STONE_SIZE = 27;
	HALF = STONE_SIZE / 2;

	createShape();

	app.data = new boardData( 7, 7 );
	app.resize( app.data.WIDTH, app.data.HEIGHT );
	data = app.data;

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
});



function gameStart() {			// ゲームを開始する関数

	resetBoard( app );			// 盤面、コウ、アゲハマ情報を初期化

	data.turn = BLACK;			// 黒番にする
	data.interactive = true;	// 着手を可能にする

	winning_point = 5;

	app.MainScene.OverStone.children = [];
	elmPrisoners[BLACK].innerHTML =
	elmPrisoners[WHITE].innerHTML = "０";

	if( usersColor == WHITE ) {
		// data.interactive = false;
		data.turn = BLACK;

		const prob = Math.random()
		const delay = Math.floor(Math.random() * 500) + 700
		const z = prob <= 0.33 ? 30 : (prob <= 0.66 ? 38 : 39);
		computerPut( app, z, delay );

		// data.turn = WHITE;			// 黒番にする
		// data.interactive = true;	// 着手を可能にする
	}

	boardExpression( app );


	label = tm.app.Label("あなたの勝ち！").addChildTo( app.MainScene )
				.setPosition( app.data.WIDTH / 2, app.data.HEIGHT / 2 )
				.setScale( 2 ).setAlpha( 0 ).setFillStyle("red");

	label2 = tm.app.Label("ＣＯＭの勝ち").addChildTo( app.MainScene )
				.setPosition( app.data.WIDTH / 2, app.data.HEIGHT / 2 )
				.setScale( 2 ).setAlpha( 0 ).setFillStyle("red");

	app.MainScene.Stones.ghostStone.remove();
}



function userClickProcessing( app ) {	// ユーザーの着手時の処理
	var agehama	= data.prisoners[ usersColor ];

	data.interactive = false;				// 着手を止める

	app.MainScene.OverStone.children = [];

	elmPrisoners[ usersColor ].innerHTML = zenkaku( agehama );

	if( agehama >= winning_point ) {
		window.setTimeout( "rule_info[0].innerHTML = 'あなたの勝ちです！'", 10 );
		label.tweener.clear().wait(100).to( {scaleX: 1, scaleY: 1, alpha: 1}, 500 ).wait(1500).to( {scaleX: 2, scaleY: 2, alpha: 0}, 500 );
		return;
	}

	changeTurn( app );		// 手番を変える

	if( level == 1 )	z = level_1();
	else				z = level_5();

	if( z ){
		const delay = Math.floor(Math.random() * 500) + 700
		computerPut( app, z, delay );
	}else{
		window.setTimeout( 'rule_info[0].innerHTML = "computer : 打てる場所がないのでパスします";', 30 );
		pass( app );
	}
}



function computerProcessing( app ) {	// computerの着手時の処理
	var agehama	= data.prisoners[ computersColor ];

	elmPrisoners[ computersColor ].innerHTML = zenkaku( agehama );

	lastPoint( app );

	if( agehama >= winning_point ){
		window.setTimeout( "rule_info[0].innerHTML = 'computerの勝ちです'", 10 );
		label2.tweener.clear().wait(100).to( {scaleX: 1, scaleY: 1, alpha: 1}, 500 ).wait(1500).to( {scaleX: 2, scaleY: 2, alpha: 0}, 500 );
		return;
	}

	changeTurn( app );
	data.interactive = true;
}


// αβ法
function level_6() {
	let z = null;

	const libertyArr = createLibertyArray2();

	console.table({libertyArr, data});



	return z;
}


function level_5() {		// 鬼強いプログラム
	var z			= null,
		original	= data.board.concat(),
		universe	= data.universe.concat();

	libertyArr = createLibertyArray2();	// 調査関数２

	var selectFunc = (function( color ) {		// どこに打つのが一番ダメが増えるかを調べる
		var groupArr = libertyArr[ color ][i];

		for(var j=0; j<groupArr.length; j++) {	// グループの数だけ調べる
			var group	= groupArr[j];
			var max_num	= -1;					// ダメの数の最大値

			for(var k=0; k<group.libertyNum; k++) {	// ダメの数だけループ
				var sz = group.libertyPlace[ k ];

				data.turn = color;										// その石の手番にする
				var return_value = putStone( app, sz, false, true );	// 石を置く（ここでダメも分かる）
				data.board	= original.concat();						// 盤面を最初の状態に戻す

				if( max_num < data.liberty ){		// もしその結果、ダメの数が最大になったら
					var dame = data.liberty;

					data.turn = computersColor;
					if( !possible( data, sz ) ) continue;	// 打てるかどうかを確かめて
					z		= sz;							// 座標を更新する
					max_num = dame;
				}
			}
			if( z ) break;
		}
	});

	for(var i=1; i<15; i++) {	// ダメが少ない順に調べる
		// もしそのダメの数の石があれば
		if( libertyArr[ usersColor ][i][0] )			selectFunc( usersColor );
		else if( libertyArr[ computersColor ][i][0] )	selectFunc( computersColor );

		if( z ) break;
	}

	data.turn	= computersColor;
	data.board	= original;

level_6();

	return z;
}


var com_win					= 1;	// 石を取っていいかどうか

// 選択する確率
var probability_of_atari	= 0.5;	// アタリの石を逃げる
var probability_of_suicide	= 0.1;	// 最も身ダメが詰まる点に打つ
var probability_of_egoism	= 0.1;	// 最も身ダメが延びる点に打つ
var probability_of_tuke		= 0.6;	// ダメが少ない石にツケる
var probability_of_nobi		= 0.2;	// ダメが少ない石からノビる


function level_1() {			// Computerの手を選ぶアルゴリズム
	var universe	= data.universe.concat(),
		z			= null;

	board		= data.board;				// board配列のグローバル化
	libertyArr	= createLibertyArray();		// ダメ座標の三次元配列


	this_way = Math.random() < probability_of_atari;

	if( this_way && libertyArr[WHITE][1].length ){	// アタリの石を逃げる（あれば）
		var kouho	= libertyArr[WHITE][1].concat();
		var len		= kouho.length;

		while( !z && len ){
			var i			= Math.floor( Math.random() * len );
			var temporaryZ	= kouho[ i ];

			result = possible( data, temporaryZ );
			if( (com_win && result) || result == 2 )
				z = temporaryZ;
			else
				kouho[i] = kouho[--len];
		}
		console.log("アタリの石を逃げる");
	}

	random_num	= Math.random();
	prob_1		= probability_of_suicide;
	prob_2		= probability_of_egoism;

	if( random_num < prob_1 )				this_way = 2;
	else if( random_num < prob_1 + prob_2 )	this_way = 1;
	else									this_way = 0;

	if( !z && this_way ){	// 最も身ダメが延びる（詰まる）地点に打つ

		var noTrespassing = [];	// 打ってはいけない場所

		// （石を取る手とアタリを逃げる手）
		if( !com_win )				noTrespassing = libertyArr[BLACK][1].concat( libertyArr[WHITE][1] );
		// ８割の確率で一の１も追加する
		if( Math.random() > 0.2 )	noTrespassing = noTrespassing.concat( [10, 16, 64, 70] );

		for( i=0, len=noTrespassing.length; i<len; i++ )
			for( j=0, len2=universe.length; j<len2; j++ )
				if( universe[j] == noTrespassing[i] ){
					universe[j] = 0;
					break;
				}

		kouho	= extreme( universe, 2 - this_way );
		z		= kouho[ Math.floor( Math.random() * kouho.length ) ];
	}

	random_num	= Math.random();
	prob_1		= probability_of_tuke;
	prob_2		= probability_of_nobi;

	if( random_num < prob_1 )				this_way = 1;
	else if( random_num < prob_1 + prob_2 )	this_way = 2;
	else									this_way = 0;

	if( !z && this_way ){	// 最もダメが少ない石に（ツケる／ノビる）
		var dame_no_kazu = 0;
		var color = (this_way == 1)?	usersColor:	computersColor;

		for(var i=1; i<20; i++){					// １から順番に調べていく
			if( libertyArr[ color ][i][0] ){		// もしそのダメ数の石があれば
				dame_no_kazu = i;

				kouho	= libertyArr[ color ][i];
				len		= kouho.length;

				while( !z && len ){						// その中に打てる場所があるか探す
					var j			= Math.floor( Math.random() * len );
					var temporaryZ	= kouho[ j ];

					result = possible( data, temporaryZ );
					if( (com_win && result) || result == 2 )
						z = temporaryZ;
					else
						kouho[i] = kouho[--len];
				}
			}

			if( z )	break;
		}
	}

	// ランダムの地点に打つ
	if( !z ){
		universe	= data.universe.concat();
		toreru		= [];
		torenai		= [];

		for( i=0, len=universe.length; i<len; i++ ){
			var temporaryZ = universe[i];
			var judge = possible( data, temporaryZ );

			if( judge == 1 ) toreru.push( temporaryZ );
			if( judge == 2 ) torenai.push( temporaryZ );
		}

		if( torenai.length )		z = torenai[ Math.floor( Math.random() * torenai.length ) ];
		else if( toreru.length )	z = toreru[ Math.floor( Math.random() * toreru.length ) ];
	}

	return z;
}



function createLibertyArray() {		// 盤上の石のダメの座標を、色と数ごとに配列にする関数
	var board		= data.board,
		universe	= data.universe.concat(),
		i, len		= universe.length,
		arr			= [ 0, 0, [], [] ];		// 記録する配列（１つ目の添え字はBLACK,WHITE）

	for( i=0; i<40; i++ ){		// ３次元配列にする（２つ目の添え字はダメの数）
		arr[BLACK][i] = [];
		arr[WHITE][i] = [];
	}

	for( i=0; i<len; i++ ){			// 盤面を走査する
		var z		= universe[i],
			color	= board[z];

		if( color ){
			countLiberty( data, z, color, true );
			arr[ color ][ data.liberty ] = arr[ color ][ data.liberty ].concat( data.libertyPlace );
		}
	}

	return arr;
}


function createLibertyArray2() {	// 盤面の情報を総合的に調べる関数
	var board		= data.board,
		universe	= data.universe.concat(),
		i, len		= universe.length,
		arr			= [ 0, 0, [], [] ];		// 記録する配列（１つ目の添え字はBLACK,WHITE）

	// arr[ 色 ][ ダメの数 ][ グループ ] = { 石数: 0, ダメ数: 0, 石座標: [], ダメ座標: [] }

	for( i=0; i<40; i++ ){		// ３次元配列にする（２つ目の添え字はダメの数）
		arr[BLACK][i] = [];
		arr[WHITE][i] = [];
	}

	data.allResearched = [];	// 盤面全体の調査済み配列

	for( i=0; i<len; i++ ){			// 盤面を走査する
		var z		= universe[i],
			color	= board[z];

		if( color && !data.allResearched[z] ){		// そこに石があり、かつ、非調査済みなら
			var object = { stoneNum: 0, libertyNum: 0, stonePlace: [], libertyPlace: [] };

			data.researched = [];
			countLibertyDeluxe( data, z, color, object );
			arr[ color ][ object.libertyNum ].push( object );
		}
	}

	return arr;
}


function extreme( kouho, plus ) {	// 打った時に自分のダメが最も多く（少なく）なる場所を探す関数
	var dame			= plus? 0: 100;
	var board			= data.board;
	var z, i, j, len	= kouho.length;
	var place_arr		= [];

	for( i=0; i<len; i++ ){
		z = kouho[i];

		if( plus )	var meet = data.liberty >= dame;
		else		var meet = possible(data, z) == 2 && data.liberty <= dame;

		// 着手が可能、かつ、ダメが以上・以下の場合
		if( possible(data, z) == 2 && ((plus && data.liberty >= dame) || (!plus && data.liberty <= dame)) ){
			if( (plus && data.liberty > dame) || (!plus && data.liberty < dame) ){
				dame		= data.liberty;
				place_arr	= [];			// 超・未満なら配列を初期化
			}
			place_arr.push( z );		// 座標を追加
		}
	}

	return place_arr;
}



function tuke( z ) {			// それがツケの手かどうかを返す関数
	var board	= data.board;
	var enemy	= 5 - data.turn;

	for(var i=0; i<4; i++) {
		var new_z = z + data.dir4[i];
		if( board[ new_z ] == enemy ) return true;
	}

	return false;
}



function searchMinority() {		// 盤上で最もダメが少ない石のダメを探す関数
	var board		= data.board;
	var universe	= data.universe;

	var worstNum	= 100;
	var worstArr	= null;

	for(var i=0, len=universe.length; i<len; i++) {
		var z = universe[i];

		if( !board[ z ] ) continue;
		
		countLiberty( data, z, board[z], true );

		if( data.liberty < worstNum ){
			worstNum	= data.liberty;
			worstArr	= data.libertyPlace.concat();
		}else if( data.liberty == worstNum ){
			worstArr = worstArr.concat( data.libertyPlace );
		}
	}

	return worstArr;
}



function zenkaku( num ) {		// 半角数字を全角数字文字列にして返す関数
	var str = num.toString();

	return str.replace(/[A-Za-z0-9]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
	});
}
