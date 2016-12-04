const ROWS = 8,
    COLS = 8,
    PIECES_X = 4,
    PIECES_Y = 3;

export default function createPieces(challenger, challenged){
  var pieces = [],
      count = 0;

  //creating pieces for challenger player (top of the board)
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

      pieces.push({
        "cx": ( ( j + 1 ) * offsetX + ( j * offsetXOtherPieces ) ),
        "cy": ( ( i + 1 ) * 40 + top ),
        "fill": "red",
        "data-pos": count,
        "id": challenger + i + j,
        "class": challenger,
        "captured": false
      });
      count++;
    }
  }

  // //creating pieces for challenged player (bottom of the board)
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

      pieces.push({
        "cx": ( ( j + 1 ) * offsetXOtherPieces + ( j * offsetX ) ),
        "cy": ( ( i + 1 ) * 40 + top ),
        "fill": "green",
        "data-pos": count,
        "id": challenged + i + j,
        "class": challenged,
        "captured": false
      });
      count++;
    }
  }
  
  return pieces;
};