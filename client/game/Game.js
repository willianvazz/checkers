const ROWS = 8,
		COLS = 8,
		PIECES_X = 4,
		PIECES_Y = 3;

var svgns = "http://www.w3.org/2000/svg",
	moverId,
	myX,
	myY,
	game;

//allowing the client to have access to collection chat from the server
Template.Game.onCreated(function (){
	Meteor.subscribe('game', Meteor.user().matchId);
});

Template.Game.helpers({
	GameSetup(){
		try{
			var color = "",
				svgStage = document.getElementById("svgStage");
		// getting pieces created in the server
		game = Game.find().fetch()[0];
		 	//creating pieces
			for(let i = 0; i < game.pieces.length; i++) {
				let oldPiece = document.getElementById(game.pieces[i].id)       
				if (oldPiece){          
					var square = getSquare(oldPiece.getAttribute("cx"), oldPiece.getAttribute("cy"));
					square.removeAttribute("data-occupied");
					svgStage.removeChild(oldPiece);
				}

				if (!game.pieces[i].captured){
					var cir = document.createElementNS( svgns, "circle" );
					cir.setAttributeNS( null, "r", 25 );
					cir.setAttribute( "cx", game.pieces[i].cx );
					cir.setAttribute( "cy", game.pieces[i].cy );
					cir.setAttribute( "fill", game.pieces[i].fill );
					cir.setAttribute( "id", game.pieces[i].id );
					cir.setAttribute( "data-pos", game.pieces[i]['data-pos'] );
					cir.setAttribute( "class", game.pieces[i].class );
					svgStage.appendChild(cir);
					//setting square to occupied
					setSquareOccupation(game.pieces[i].id);

					cir.addEventListener( "mousedown", function(){
						setMove( game.pieces[i].id )
					}, false );
				}
			}
			init();
		}
		catch(err){
		}
	}
});

Template.Game.onRendered(function(){
	createBoard();
});

function createBoard(){
	var color = "",
			svgStage = document.getElementById("svgStage");

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
			square.setAttribute("id", "target_"+i+j);

			svgStage.appendChild(square);
		}
	}
}

function init(){
	document.getElementById("svgStage").addEventListener( "mousemove", mouseMoveEvListener, false );
	document.getElementById("svgStage").addEventListener( "mouseup", mouseUpEvListener, false );
	// document.getElementById("svgStage").addEventListener( "mousemove", 
	//  function(evt){
	//    // console.log(evt.clientX, evt.clientY);
	//    console.log(document.body.scrollTop);
	//  }, false );

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
	var newSquare = getSquare(x, y),
			currentSquare = getSquare(myX, myY),
			moverEle = document.getElementById( moverId );

	if (validPieceMove()){
		currentSquare.removeAttribute("data-occupied");
		//updating piece in the database
		Meteor.call('game.updatePiece', Meteor.user().matchId, moverEle.getAttribute("data-pos"),
			newSquare.getBBox().x + 40, newSquare.getBBox().y + 40, Session.get("mySecretToken"));

		return true;
	} else {
		return false;
	}
}

function checkCaptured(currentSquare, newSquare){
	var currentSquareId = currentSquare.getAttribute("id"),
		newSquareId = newSquare.getAttribute("id"),
		middleSquare = null;

	var firstDigitDiff = parseInt(currentSquareId.substr(7,1)) - parseInt(newSquareId.substr(7,1))
		lastDigitDiff = parseInt(currentSquareId.substr(8,1)) - parseInt(newSquareId.substr(8,1));

	if (Math.abs(firstDigitDiff) === 2 && Math.abs(lastDigitDiff) === 2){
		//piece is going up
		if (lastDigitDiff < 0){
			if (firstDigitDiff < 0){
				middleSquare = document.getElementById("target_" + (parseInt(currentSquareId.substr(7,1)) + 1) + (parseInt(currentSquareId.substr(8,1)) + 1));  
			} else {
				middleSquare = document.getElementById("target_" + (parseInt(currentSquareId.substr(7,1)) - 1) + (parseInt(currentSquareId.substr(8,1)) + 1));  
			}      
		} 
		//piece is going down
		else {
			if (firstDigitDiff < 0){
				middleSquare = document.getElementById("target_" + (parseInt(currentSquareId.substr(7,1)) + 1) + (parseInt(currentSquareId.substr(8,1)) - 1));  
			} else {
				middleSquare = document.getElementById("target_" + (parseInt(currentSquareId.substr(7,1)) - 1) + (parseInt(currentSquareId.substr(8,1)) - 1));  
			}
		}

		if (middleSquare.getAttribute("data-occupied")) {
			var pieceCaptured = document.getElementById(middleSquare.getAttribute("data-occupied"));
			middleSquare.removeAttribute("data-occupied");
			//removing piece if it was captured
			Meteor.call('game.capturePiece', Meteor.user().matchId, pieceCaptured.getAttribute("data-pos"), 
				Session.get("mySecretToken"));
		}
	}
}

function validPieceMove(){
	var piece = document.getElementById( moverId );
	var newSquare = getSquare(piece.getAttribute("cx"), piece.getAttribute("cy")),
			currentSquare = getSquare(myX, myY)
			newY = piece.getAttribute("cy");

	//checking if it's the user's turn
	if(game.turn === Meteor.user().username){
		//checking if the user is the owner of the piece
		if(piece.getAttribute("id").includes(Meteor.user().username)){
			//checking if the piece is moving in a valid direction
			if((piece.getAttribute("data-pos") < 12 && (newY > myY + 40)) || 
					(piece.getAttribute("data-pos") >= 12 && (newY < myY - 40))){
				//checking if the new square is already occupied by another piece
				if(!newSquare.getAttribute("data-occupied")){
					//checking if a piece was captured during the move
					checkCaptured(currentSquare, newSquare)
					return true;                
				}      
			}
		}
	}
	return false;
}

function setSquareOccupation(pieceId){
	var piece = document.getElementById(pieceId);
	var square = getSquare(piece.getAttribute("cx"), piece.getAttribute("cy"));

	square.setAttribute("data-occupied", pieceId);
}

function getSquare(x, y){
	for( var i = 0; i < ROWS; i++ ){
		for (var j = 0; j < COLS; j++) {
			var square = document.getElementById( "target_" + i + j );

			// returning only odd (black) squares
			if( x > square.getBBox().x && x < ( square.getBBox().x + square.getBBox().width ) && 
					y > square.getBBox().y && y < ( square.getBBox().y + square.getBBox().height ) 
					&& ((j + i) %2 != 0 )){
				return square;
			}
		}
	}
}

function setMove( id ){
	moverId = id;
	//console.log("moverId: ", moverId);

	myX = parseInt( document.getElementById( moverId ).getAttribute( "cx" ) );
	myY = parseInt( document.getElementById( moverId ).getAttribute( "cy" ) );

	//console.log("myX:", myX, " myY:", myY);
}