

var SPACE	= 0;
var BLACK	= 2;
var WHITE	= 3;
var OUT		= 4;



function boardData( X, Y ) {	// 盤面の情報を作るコンストラクタ関数

	this.X			= X;				// 縦と横の路数
	this.Y			= Y;
	this.MX			= X + 2;			// 番兵を含む縦と横の路数
	this.MY			= Y + 2;
	this.turn		= BLACK;			// 手番
	this.interactive = true;			// ユーザーの着手を認めるかどうか
	this.board		= [];				// 局面を表す配列
	this.universe	= [];				// 着手可能な座標の配列
	this.ko			= [];				// コウの座標を記録する配列
	this.prisoners	= [ 0, 0, 0, 0 ];	// アゲハマの数
	this.dir4		= [ -this.MX, 1, this.MX, -1 ];		// 上下左右への移動量

	this.WIDTH		= STONE_SIZE * X + BOARD_MARGIN[1] + BOARD_MARGIN[3];	// 画面のサイズ
	this.HEIGHT		= STONE_SIZE * Y + BOARD_MARGIN[0] + BOARD_MARGIN[2];

	for(var x=0; x<this.MX; x++)		// board配列とuniverse配列に盤面の情報を入れる
	for(var y=0; y<this.MY; y++) {
		var z = fusion( this, x, y );
		if( x == 0 || x == this.MX-1 || y == 0 || y == this.MY-1 )
			this.board[z] = OUT;		// 碁盤の外側（番兵）
		else{
			this.board[z] = SPACE;		// 碁盤の内側
			this.universe.push( z );	// 着手可能なz座標を追加
		}
	}
}



function fusion( data, X, Y ) {		// XY座標を１次元座標にする関数
	return data.MX * Y + X;
}



function changeTurn( app ) {		// 手番を入れ替える関数
	app.data.turn = 5 - app.data.turn;
}



function pass( app ) {				// パスする関数
	changeTurn( app );					// 手番を変える
	app.data.ko.push( 0 );				// コウの制約を消す
	app.data.interactive = true;		// 着手を可能にする
}



function resetBoard( app ) {			// 盤面の石を片付ける関数
	var data		= app.data,
		board		= data.board,
		universe	= data.universe;

	for(var i=0, len=universe.length; i<len; i++) board[ universe[i] ] = SPACE;

	data.ko = [];					// コウ情報を初期化
	data.prisoners[ BLACK ] =		// アゲハマを初期化
	data.prisoners[ WHITE ] = 0;
}



function putStone( app, z, user, test ) {		// 着手する関数
	var data		= app.data,
		board		= data.board,
		color		= data.turn,
		enemy		= 5 - color,
		ko_z		= null,
		get			= false;

	if( board[z] )								return 0;	// 既に石があったらreturn
	if( z == data.ko[ data.ko.length - 1 ] )	return -1;	// コウの取り返しもreturn

	board[z] = color;					// 仮の着手

	for(var i=0; i<4; i++) {			// 上下左右を調査する
		var new_z = z + data.dir4[i];

		if( board[ new_z ] == enemy ) {					// もし相手の石があれば、ダメの数を数える
			countLiberty( data, new_z, enemy, true );
			if( !data.liberty ){
				removeStone( data, new_z, enemy );		// その石のダメが０なら取り除く
				if( test ){ get = true; continue; }
				if( data.self == 1 ) ko_z = new_z;		// 取った石が１つならコウかもしれないので座標を記録
				data.prisoners[ color ] += data.self;	// アゲハマを加算
			}
		}
	}

	countLiberty( data, z, color, true );	// 自分の石のダメの数を数える

	if( !data.liberty ) {						// もし０なら、着手を中止する
		board[z] = SPACE;
		return -2;
	}

	// ここで着手が確定 
	if( test ) if( get ) return 1; else return 2;	// テスト着手ならreturn
	data.lastZ		= z;
	data.lastColor	= color;	// 座標と色を記録

	// 取った石数＝自身の石数＝自身のダメ＝１ならコウ
	if( ko_z && data.self == 1 && data.liberty == 1 )	data.ko.push( ko_z );
	else												data.ko.push( 0 );

	if( user )	userClickProcessing( app );	// 着手時処理（ユーザー）
	else		computerProcessing( app );	// 着手時処理（computer）

	boardExpression( app );				// 碁石画像を反映する
}



function countLiberty( data, z, color, firstTime ) {	// ダメの数を数える関数
	if( firstTime ){	// もし初回呼び出しなら、
		data.self			= 0;	// 自身の数を０に初期化
		data.liberty		= 0;	// ダメの数を０に初期化
		data.libertyPlace	= [];	// ダメ座標配列を初期化
		data.researched		= [];	// 調査済み配列を初期化
	}

	data.self++;				// 自身の石数を加算
	data.researched[z] = true;	// ここを調査済みとする

	for(var i=0; i<4; i++) {							// 上下左右を調べる
		var new_z = z + data.dir4[i];
		if( data.researched[ new_z ] )		continue;		// 調査済みならcontinue

		if( data.board[ new_z ] == SPACE ) {				// もしダメがあればカウント
			data.liberty++;
			data.libertyPlace.push( new_z );
			data.researched[ new_z ] = true;
		}else if( data.board[ new_z ] == color )			// 味方の石なら再起呼び出し
			countLiberty( data, new_z, color, false );
	}
}



function countLibertyDeluxe( data, z, color, object ) {	// ダメの数を数える関数（ダメ座標とその持ち主も記録）

	object.stoneNum++;			// 石数を加算
	object.stonePlace.push( z );
	data.researched[z]		= 
	data.allResearched[z]	= true;	// ここを調査済みとする

	for(var i=0; i<4; i++) {							// 上下左右を調べる
		var new_z = z + data.dir4[i];
		if( data.researched[ new_z ] ) continue;		// 調査済みならcontinue

		if( data.board[ new_z ] == SPACE ) {				// もしダメがあればカウント
			object.libertyNum++;
			object.libertyPlace.push( new_z );
			data.researched[ new_z ] = true;
		}else if( data.board[ new_z ] == color )			// 味方の石なら再起呼び出し
			countLibertyDeluxe( data, new_z, color, object );
	}
}



function removeStone( data, z, color ) {				// 石を取り除く関数
	data.board[z] = SPACE;

	for(var i=0; i<4; i++) {
		var new_z = z + data.dir4[i];

		if( data.board[ new_z ] == color ) removeStone( data, new_z, color );
	}
}



function computerPut( app, z, time ) {			// computerに打たせる関数

	timer = window.setTimeout( function(a,b){putStone(a, b)}, time, app, z );
}



function possible( data, z ) {		// そこに着手するのが可能かどうかを調べる関数
	var board	= data.board,
		color	= data.turn,
		enemy	= 5 - color;

		if( board[z] )							return 0;	// 石があったら打てない
		if( z == data.ko[data.ko.length - 1] )	return 0;	// コウの取り返し

		for(var i=0; i<4; i++) {
			var new_z = z + data.dir4[i];
			if( board[ new_z ] == enemy ){					// 上下左右を調べる
				countLiberty( data, new_z, enemy, true );	// もし相手の石であり
				if( data.liberty == 1 ) return 1;			// ダメが１つなら、石を取れるので着手可能
			}
		}

		board[z] = color;		// 仮の着手
		countLiberty( data, z, color, true );	// ダメの数を数える
		board[z] = SPACE;		// 戻す

		if( data.liberty )	return 2;			// ダメが１つでもあれば着手可能
		else				return 0;			// １つもなければ着手不可
}
