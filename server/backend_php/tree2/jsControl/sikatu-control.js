



function setting2( add ) {			// ２目の一眼
	var num		= infoNum[2],
		data	= appArr[2].data;

	data.board = [4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,4,4,0,0,2,2,2,2,0,0,4,4,0,2,3,3,3,3,2,0,4,4,0,2,3,0,0,3,2,0,4,4,0,2,3,3,3,3,2,0,4,4,0,0,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4];

	data.interactive	= true;
	data.turn			= (num == 3)? WHITE: BLACK;
}

function clicked2() {

	if( iNum == 1 ){
		var infoElm = document.getElementById("information2");
		var id		= infoElm.firstChild.id;

		if( id == "info2-1" && (b[44] == BLACK || b[45] == BLACK) ) changeInfo( 2, "info2-1-2" );
		if( b[33] == SPACE ) data.interactive = false;
	}else if( iNum == 2 ){
		if( b[33] == SPACE ){
			data.interactive = false;
		}else if( b[44] == BLACK ){
			data.interactive = false;
			data.turn = WHITE;
			computerPut( app, 45, 1000 );
		}else if( b[45] == BLACK ){
			data.interactive = false;
			data.turn = WHITE;
			computerPut( app, 44, 1000 );
		}
	}else if( iNum == 3 ){
		data.interactive = false;
		data.turn = BLACK;
		if( b[44] == WHITE )	computerPut( app, 45, 1000 );
		if( b[45] == WHITE )	computerPut( app, 44, 1000 );
	}
}



function setting4( add ) {			// 隙間があっても
	var num		= infoNum[4],
		data	= appArr[4].data,
		over	= appArr[4].MainScene.OverStone,
		reset	= document.getElementsByClassName("reset")[4];

	if( num <= 2 )	data.board = [4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,2,2,2,0,0,4,4,0,2,3,3,3,2,0,4,4,0,2,3,0,3,2,0,4,4,0,2,3,3,3,0,0,4,4,0,0,2,2,2,2,0,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4];
	else			data.board = [4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,4,4,0,0,0,2,0,0,0,4,4,0,0,2,0,2,2,2,4,4,0,2,0,2,0,0,0,4,4,0,0,2,2,3,3,3,4,4,0,0,0,2,0,3,0,4,4,4,4,4,4,4,4,4,4];
	over.children	= [];

	reset.style.visibility	= (num == 1 || num == 5)? "hidden": "visible";	// リセットボタンの表示・非表示
	data.interactive		= (num == 2 || num == 3)? true: false;			// 着手可能・不可能

	if( num == 3 )	data.turn = BLACK;
	if( num == 4 ){
		data.turn = WHITE;
		computerPut( appArr[4], 52, 1000 );
	}else if( num == 5 ){
		createLabel( "×", 5, 6, over, "black" );
		createLabel( "×", 6, 6, over, "black" );
		createLabel( "×", 7, 6, over, "black" );
		createLabel( "×", 6, 7, over, "black" );
	}
}

function clicked4() {
	if( iNum == 2 && b[30] == SPACE ){
		changeInfo( 4, "info4-2-2" );
		data.interactive = false;
	}else if( iNum == 3 && b[59] == SPACE ){
		changeInfo( 4, "info4-3-2" );
		data.interactive = false;
	}else if( iNum == 4 && b[59] == SPACE )
		data.interactive = false;
}



function setting5( add ) {		// 三目中手（その一）
	var num		= infoNum[5],
		data	= appArr[5].data,
		reset	= document.getElementsByClassName("reset")[5],
		over 	= appArr[5].MainScene.OverStone;

	var b = data.board = [4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,2,3,3,3,3,3,2,0,4,4,0,2,3,0,0,0,3,2,0,4,4,0,2,3,3,3,3,3,2,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4];
	over.children = [];

	if( num == 1 ){
		appArr[5].MainScene.Lines.children[31].setAlpha(0);
		createLabel( "A", 5, 4, over, "white" ).setFontSize(16).setFontWeight(500);
	}else if( num == 2 )
		appArr[5].MainScene.Lines.children[31].setAlpha(1);

	if( num == 1 || 7 <= num ){
		reset.style.visibility	= "hidden";
		data.interactive		= false;
	}else{
		reset.style.visibility	= "visible";
		data.interactive		= true;
	}

	data.turn = BLACK;

	if( num == 3 ){
		b[50] = WHITE;
		stoneCircle( "blue", 6, 4, over );
	}
	if( num == 4 ){
		b[48] = WHITE;
		stoneCircle( "blue", 4, 4, over );
	}
	if( num == 5)
		b[48] = b[50] = WHITE;
	if( num == 3 || num == 4 || 6 <= num )
		b[49] = BLACK;
}

function clicked5() {
	appArr[5].MainScene.OverStone.children = [];

	if( iNum == 2 ){
		data.interactive = false;
		if( b[49] == BLACK ){
			changeInfo( 5, "info5-2-2" );
		}else{
			changeInfo( 5, "info5-2-3" );
			data.turn = WHITE;
			computerPut( app, 49, 1000 );
		}
	}

	if( iNum == 3 || iNum == 4 || iNum == 5 ){
		if( b[36] != WHITE ) data.interactive = false;
	}

	if( iNum == 6 ){
		if( b[36] != WHITE ){
			data.interactive = false;
			changeInfo( 5, "info5-6-2" );
		}else{
			data.turn = WHITE;
			var z = pinch( 36 );

			if( z ){
				data.interactive = false;
				computerPut( app, z, 1000 );
			}else{
				data.turn = BLACK;
			}
		}
	}
}



function setting6( add ) {		// 三目中手（その二）
	appArr[6].data.board = [4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,4,4,0,0,0,2,2,2,0,0,4,4,0,0,2,3,3,3,2,0,4,4,0,2,3,3,0,3,2,0,4,4,0,2,3,0,0,3,2,0,4,4,0,2,3,3,3,3,2,0,4,4,0,0,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4];
}

function clicked6() {

}



function setting7() {
	appArr[7].data.board = [4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,0,0,2,2,2,2,0,0,0,4,4,0,2,3,3,3,3,2,2,0,4,4,0,2,3,0,3,0,3,2,0,4,4,0,2,3,3,3,3,2,0,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4];
}

function clicked7() {

}



function setting8() {
	appArr[8].data.board = [4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,2,3,3,2,3,3,2,0,4,4,0,2,3,0,3,0,3,2,0,4,4,0,2,3,3,3,3,2,0,0,4,4,0,0,2,2,2,2,2,0,0,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4];
}


function pinch( z ) {	// z地点の石がアタリで、かつ、ダメに打てるなら、その座標を返す。

	countLiberty( data, z, b[z], true );
	var z = data.libertyPlace[0];

	if( data.liberty == 1 && possible( data, z ) )
		return data.libertyPlace[0];
	else
		return false;
}
