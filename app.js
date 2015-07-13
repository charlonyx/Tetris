$(document).ready(function(){
	//initialize empty grid
	g = new Array(20);
	for(i=0; i<g.length; i++){
		g[i] = new Array(10);
	}	
	for(i=0; i<g.length; i++){
		var row = document.createElement("tr");
		for(j=0; j<g[0].length; j++){
			var cell = document.createElement("td");
			$(row).append(cell);
		}
		$("#model").append(row);
	}
	//start game
	newGame();
});

function newGame(){
	//clear board
	for(i=0; i<g.length; i++){
		for(j=0; j<g[0].length; j++){
			g[i][j] = false;
		}
	}
	//spawn a new piece
	newPiece();
}

function newPiece(){
	//choose a random type of piece
	num = Math.rand * 7;
	if(num < 1){
	//line piece (I)
		
	} else if(num <2){
	//block piece (O)
		
	} else if(num <3){
	//L piece (L)
		
	} else if(num <4){
	//backwards L piece (J)
		
	} else if(num <5){
	//T piece
		
	} else if(num <6){
	//S piece
		
	} else {
	//Z piece
		
	}
	
	//move the piece downwards until it hits a square
	
	//update board
	update_gui();
}

function check_row_clear(){
	//check each row to see if all are filled
	for(i=0; i<g.length; i++){
		var filled = true;
		for(j=0; j<g.length; j++){
			if(g[i][j]){
				filled = false;
				break;
			}
		}
		if(filled){
			//clear row
			empty_row = new Array(g[0].length);
			g.splice(i, 1);
			g.splice(g.length, 0, empty_row);
		}
	}
}

function update_gui(){
	$("td").remove();
	$("tr").remove();
	for(i=0; i<g.length; i++){
		var row = document.createElement("tr");
		for(j=0; j<g[0].length; j++){
			var cell = document.createElement("td");
			if(g[i][j]){
				$(cell).css("background-color", "#000");
			}
			$(row).append(cell);
		}
		$("#model").append(row);
	}
		
}

$(document).keydown(function(e){
//on keydown
   switch(e.which) {
        case 37: // left
		//move piece left
		break;
		
		case 38: //up
		//move piece up
		break;
		
		case:39: //right
		//move piece right
		break;
		
		case:40: //down
		//increase speed of piece
		break;
		
		default:
			return;
   }
	e.preventDefault();   
});