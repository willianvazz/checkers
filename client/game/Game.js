const ROWS = 8,
    COLS = 8,
    PIECES_X = 4,
    PIECES_Y = 3;

var svgns = "http://www.w3.org/2000/svg",
  moverId,
  myX,
  myY;

//allowing the client to have access to collection chat from the server
Template.Game.onCreated(function (){
  Meteor.subscribe('game', Meteor.user().matchId);
});

Template.Game.helpers({
  GameSetup(){
    try{
      var color = "",
          svgStage = document.getElementById("svgStage");

     var game = Game.find().fetch()[0];

      for(let i = 0; i < game.pieces.length; i++) {        
        if (document.getElementById(game.pieces[i].id)){
          svgStage.removeChild(document.getElementById(game.pieces[i].id))
        }
        var cir = document.createElementNS( svgns, "circle" );
        cir.setAttributeNS( null, "r", 25 );
        cir.setAttribute( "cx", game.pieces[i].cx );
        cir.setAttribute( "cy", game.pieces[i].cy );
        cir.setAttribute( "fill", game.pieces[i].fill );
        cir.setAttribute( "id", game.pieces[i].id );
        cir.setAttribute( "data-pos", game.pieces[i]['data-pos'] );
        cir.setAttribute( "class", game.pieces[i].class );
        svgStage.appendChild(cir);

        setSquareOccupation(game.pieces[i].id);

        cir.addEventListener( "mousedown", function(){
          setMove( game.pieces[i].id )
        }, false );  
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
  var newSquare = getSquare(x, y),
      currentSquare = getSquare(myX, myY),
      moverEle = document.getElementById( moverId );

  if (validPieceMove()){
    currentSquare.removeAttribute("data-occupied");

    Meteor.call('game.updatePiece', Meteor.user().matchId, moverEle.getAttribute("data-pos"),
      newSquare.getBBox().x + 40, newSquare.getBBox().y + 40, Session.get("mySecretToken"));

    return true;
  } else {
    return false;
  }
}

function validPieceMove(){
  var piece = document.getElementById( moverId );
  var square = getSquare(piece.getAttribute("cx"), piece.getAttribute("cy"));
  var newY = piece.getAttribute("cy");
  if(piece.getAttribute("id").includes(Meteor.user().username)){
    if((piece.getAttribute("data-pos") < 12 && (newY > myY + 40)) || 
        (piece.getAttribute("data-pos") >= 12 && (newY < myY - 40))){
      if(!square.getAttribute("data-occupied")){
        return true;  
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
  console.log("moverId: ", moverId);

  myX = parseInt( document.getElementById( moverId ).getAttribute( "cx" ) );
  myY = parseInt( document.getElementById( moverId ).getAttribute( "cy" ) );

  console.log("myX:", myX, " myY:", myY);
}

function hello(){
  console.log("hello");
}