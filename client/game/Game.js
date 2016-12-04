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
        if (document.getElementById(i)){
          svgStage.removeChild(document.getElementById(i))
        }
        var cir = document.createElementNS( svgns, "circle" );
        cir.setAttributeNS( null, "r", 25 );
        cir.setAttribute( "cx", game.pieces[i].cx );
        cir.setAttribute( "cy", game.pieces[i].cy );
        cir.setAttribute( "fill", game.pieces[i].fill );
        cir.setAttribute( "id", game.pieces[i].id );
        cir.setAttribute( "class", game.pieces[i].class );
        svgStage.appendChild(cir);

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
  // document.getElementById( "output" ).firstChild.data = "X: " + x + ", Y: " + y;
  var token = Session.get("mySecretToken");

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

          Meteor.call('game.updatePiece', Meteor.user().matchId, moverEle.getAttribute("id"),
            drop.x + 40, drop.y + 40, token);

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