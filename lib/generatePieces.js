'use strict';

const ROWS = 8,
    COLS = 8,
    PIECES_X = 4,
    PIECES_Y = 3;

var set = {};

//creating pieces for player at the top of the board
for( let i = 0; i < PIECES_Y; i++ ){
  for (let j = 0; j < PIECES_X; j++) {
    var offsetX = 120,
      offsetXOtherPieces = 40,
      top = 0;

    // if( i > 0 ){
    if(  i %2 != 0 ){
      top = 40;
      offsetX = 40;
      offsetXOtherPieces = 120;
    }
    if( i > 1 ){
      top = 80;
    }

    set["piece" + (i + j)] = { 
      "x" : ( ( j + 1 ) * offsetX + ( j * offsetXOtherPieces ) ),
      "y" : ( i + 1 ) * 40 + top
    };
  }
}

console.log(set);