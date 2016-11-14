const ROWS = 8,
	  COLS = 8;

var svgns = "http://www.w3.org/2000/svg";

Template.Board.onRendered(function(){
	var color = "",
		svgStage = document.getElementById("svgStage");
		console.log("svgStage: ", svgStage);

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
			// echo "<rect x='" . ( 550+(90*i) ) . "px'
			// 			y='" . ( 200+(90*j) ) . "px'
			// 			width='90px'
			// 			height='90px'
			// 			stroke-width='2px'
			// 			stroke='red'
			// 			fill='color'
			// 			id='target_ij' />";
		}
	}

	for( i = 0; i < ROWS; i++ ){

		offset = ( ( i % 2 ) != 0 ) ? 50 : 0;

		for (j = 0; j < COLS; j++) {

			// echo "<circle class='red'
			// 				cx='" . ( ( j + 1 ) * 100 + offset ) . "px'
			// 				cy='" . ( i + 1 ) * 80  . "px'
			// 				r='25px'
			// 				id='pij'
			// 				onmousedown='setMove( \"pij\" );' />";
		}
	}
});