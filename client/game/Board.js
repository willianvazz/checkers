const ROWS = 8,
	  COLS = 8,
	  PIECES_X = 4,
	  PIECES_Y = 3;

var svgns = "http://www.w3.org/2000/svg",
	moverId,
	myX,
	myY;

Template.Board.helpers({
	
});

//creating and stting up the boad when the template is done rendering
Template.Board.onRendered(function(){
	var color = "",
		svgStage = document.getElementById("svgStage");
		// console.log("svgStage: ", svgStage);

	//creating the squares
	for( var i = 0; i < ROWS; i++ ){
		for (j = 0; j < COLS; j++) { 

			if( (j + i) %2 != 0 ){
				color = "black";
			}else{
				color = "white";
			}

			var square = document.createElementNS( svgns, "rect" );
			square.setAttribute("x", (80*i));
			square.setAttribute("y", (80*j));
			square.setAttribute("width", 80);
			square.setAttribute("height", 80);
			square.setAttribute("fill", color);
			// square.setAttribute("stroke", "red");
			square.setAttribute("id", "target_"+i+j);

			svgStage.appendChild(square);
		}
	}

	//creating pieces for player at the top of the board
	for( let i = 0; i < PIECES_Y; i++ ){
		for (let j = 0; j < PIECES_X; j++) {
			var offsetX = 120,
				offsetXOtherPieces = 40,
				top = 0
				oddRows = 0;

			// if( i > 0 ){
			if(  i %2 != 0 ){
				top = 40;
				offsetX = 40;
				offsetXOtherPieces = 120;
			}
			if( i > 1 ){
				top = 80;
			}

			var cir = document.createElementNS( svgns, "circle" );
			cir.setAttributeNS( null, "r", 25 );
			cir.setAttribute( "cx", ( ( j + 1 ) * offsetX + ( j * offsetXOtherPieces ) ) );
			cir.setAttribute( "cy", ( i + 1 ) * 40 + top);
			cir.setAttribute( "fill", "red" );
			cir.setAttribute( "id", "p1" + i + j );
			cir.setAttribute( "class", "player1" );
			svgStage.appendChild(cir);
			cir.addEventListener( "mousedown", function(){
				// console.log("in mousedown");
				setMove( "p1" + i + j )}, false );	
		}
	}

	// //creating pieces for player at the bottom of the board
	for( i = 0; i < PIECES_Y; i++ ){
		for (j = 0; j < PIECES_X; j++) {
			var offsetX = 120,
				offsetXOtherPieces = 40,
				top = 400,
				oddRows = 0;

			if(  i %2 != 0 ){
				top = 440;
				offsetX = 40;
				offsetXOtherPieces = 120;
			}
			
			if( i > 1 ){
				top = 480;
			}

			var cir = document.createElementNS( svgns, "circle" );
			cir.setAttributeNS( null, "r", 25 );
			cir.setAttribute( "cx", ( ( j + 1 ) * offsetXOtherPieces + ( j * offsetX ) ) );
			cir.setAttribute( "cy", ( i + 1 ) * 40 + top);
			cir.setAttribute( "fill", "green" );
			cir.setAttribute( "id", "p2" + i + j );
			cir.setAttribute( "class", "player2" );
			//cir.addEventListener( "onmousedown", hello() );
			//not using ES6 way
			(function(i,j) {
				cir.addEventListener( "mousedown", function(){setMove( "p2" + i + j )}, false );
			})(i,j);
			svgStage.appendChild(cir);
		}
	}
	init();
});

function init(){
	document.getElementById("svgStage").addEventListener( "mousemove", mouseMoveEvListener, false );
	document.getElementById("svgStage").addEventListener( "mouseup", mouseUpEvListener, false );
	// document.getElementById("svgStage").addEventListener( "mousemove", 
	// 	function(evt){
	// 		// console.log(evt.clientX, evt.clientY);
	// 		console.log(document.body.scrollTop);
	// 	}, false );

}

function mouseMoveEvListener( evt ){
	if( moverId ){
		var moverEle = document.getElementById( moverId );

		//actually move the piece
		moverEle.setAttribute( "cx", evt.clientX  - 100);
		moverEle.setAttribute( "cy", evt.clientY - 110 + document.body.scrollTop );
	}
}

function mouseUpEvListener() {
	// if I am dragging something
	if( moverId ){
		var curX = parseInt( document.getElementById( moverId ).getAttribute( "cx" ) ),
				curY = parseInt( document.getElementById( moverId ).getAttribute( "cy" ) );
		console.log("curX:", curX, " curY:", curY);
		var hit  = checkHit( curX, curY );


		if( hit ){
			moverId = undefined;
		}else{
			//if not on the square
			var moverEle = document.getElementById( moverId );
			moverEle.setAttribute( "cx", myX );
			moverEle.setAttribute( "cy", myY );

			moverId = undefined;
		}
	}
}

function checkHit(x, y) {
	// document.getElementById( "output" ).firstChild.data = "X: " + x + ", Y: " + y;

	//now check for a hit...
	for( var i = 0; i < ROWS; i++ ){
		for (var j = 0; j < COLS; j++) {
			var drop = document.getElementById( "target_" + i + j ).getBBox();

			//console.log(drop);
			for( var k in drop ){
				// console.log(k, drop[k]);
			}

			//fill in the target coord
			// document.getElementById( "output2" ).firstChild.nodeValue = "target_" + i + j;

			if( x > drop.x && x < ( drop.x + drop.width ) &&
				y > drop.y && y < ( drop.y + drop.height ) ){
				var moverEle = document.getElementById( moverId );
				var newY = moverEle.getAttribute("cy");
				//console.log("myY:", myY, "newY:", newY);
				if( ((j + i) %2 != 0 ) && (newY > myY)){
					//Center the piece to the square
					
					moverEle.setAttribute( "cx", drop.x + 40);
					moverEle.setAttribute( "cy", drop.y + 40);

					return true;
				}else{
					return false;
				}
			}
		}
	}
}

function setMove( id ){
	moverId = id;
	console.log("moverId: ", moverId);

	myX = parseInt( document.getElementById( moverId ).getAttribute( "cx" ) );
	myY = parseInt( document.getElementById( moverId ).getAttribute( "cy" ) );

	console.log("myX:", myX, " myY:", myY);
}

function hello(){
	console.log("hello");
}