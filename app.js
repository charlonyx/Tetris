$(document).ready(function(){
	//initialize empty grid
	board = new Array(21);
	for(i=0; i<board.length; i++){
		board[i] = new Array(10);
	}	
	for(i=1; i<board.length; i++){
		var row = document.createElement("tr");
		for(j=0; j<board[0].length; j++){
			var cell = document.createElement("td");
			$(row).append(cell);
		}
		$("#model").append(row);
	}
	//initialize speed of pieces
	speed = .3;
	//start game
	newGame();
});

function newGame(){
	//clear board
	for(i=0; i<board.length; i++){
		for(j=0; j<board[0].length; j++){
			board[i][j] = false;
		}
	}
	//spawn a new piece
	newPiece();
}

function newPiece(){
	//randomly choose a piece shape (7 possibilities)
	//spawn with leftmost piece coming down from 4th column (for now at least)
	num = Math.random() * 7;
	if(num < 1){
	//line piece (I)
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[0][6] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:0, col:6}];
	} else if(num <2){
	//block piece (O)
		board[0][4] = true;
		board[0][5] = true;
		board[1][4] = true;
		board[1][5] = true;
		moving = [{row:0, col:4},{row:0, col:5},{row:1, col:4},{row:0, col:5}];
	} else if(num <3){
	//L piece (L)
		board[1][3] = true;
		board[1][4] = true;
		board[1][5] = true;
		board[0][5] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:5}];
	} else if(num <4){
	//backwards L piece (J)
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[1][3] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:3}];
	} else if(num <5){
	//T piece
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[1][4] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:4}];
	} else if(num <6){
	//S piece
		//THIS PIECE IS NOT DISPLAYING PROPERLY
		board[0][4] = true;
		board[0][5] = true;
		board[1][3] = true;
		board[1][4] = true;
		moving = [{row:0, col:4},{row:0, col:5},{row:1, col:3},{row:1, col:4}];	
	} else {
	//Z piece
		board[0][3] = true;
		board[0][4] = true;
		board[1][4] = true;
		board[1][5] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:1, col:4},{row:1, col:5}];
	}
	
	//move the piece downwards until it hits a square
	movePiece = setInterval(function(){
		var hit_block = false;
		var hit_bottom = false;
		for(i=moving.length - 1; i>-1; i--){
			var r = moving[i].row;
			var c = moving[i].col;
			board[r][c] = false;
			board[r+1][c] = true;
			moving[i] = {row:r+1, col:c};
			
			//see if the piece has hit the bottom
			if(r + 2 >= board.length){
				hit_bottom = true;
			} else if(board[r+2][c]){ //see if the piece has hit a block
				var part_of_piece = false;
				for(j=0; j<moving.length; j++){
					if(moving[j].row == r+2 && moving[j].col == c){
						part_of_piece = true;
					}
				}
				if(!part_of_piece){
					hit_block = true;
				}
			}

		}
		update_gui();
		//deal with the piece hitting something
		if(hit_bottom || hit_block){
			clearInterval(movePiece);
			newPiece();
		}
		//if(false){
		//	break;
		//} 
	}, speed*1000);
	//square is hit
/*	if(square_hit){
		check_row_clear();
	}
*/	//update board
	update_gui();
}

function check_row_clear(){
	//check each row to see if all are filled
	for(i=0; i<board.length; i++){
		var filled = true;
		for(j=0; j<board.length; j++){
			if(board[i][j]){
				filled = false;
				break;
			}
		}
		if(filled){
			//clear row
			empty_row = new Array(board[0].length);
			board.splice(i, 1);
			board.splice(board.length, 0, empty_row);
		}
	}
}

function update_gui(){
	$("td").remove();
	$("tr").remove();
	for(i=1; i<board.length; i++){
		var row = document.createElement("tr");
		for(j=0; j<board[0].length; j++){
			var cell = document.createElement("td");
			if(board[i][j]){
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
		//see if piece can move left
		var can_move = true;
		for(i=0;i<moving.length;i++){
			if(moving[i].col == 0){
				can_move = false;
			}
		}
		if(can_move){
			//move piece left
			for(i=0; i<moving.length; i++){
				var r = moving[i].row;
				var c = moving[i].col;
				board[r][c] = false;
				board[r][c-1] = true;
				moving[i].col = c - 1;			
			}
			update_gui();
		}
		break;
		
		case 38: //up
		//rotate piece clockwise
			for(i=0; i<moving.length; i++){
				var r = moving[i].row;
				var c = moving[i].col;
			//	board[r][c] = false;
			//	board[][] = true;
			//	moving[i].col = ;
			//	moving[i].row = ;
			}
		break;
		
		case 39: //right
		//see if piece can move left
			var can_move = true;
			for(i=0;i<moving.length;i++){
				if(moving[i].col == board[0].length - 1){
					can_move = false;
				}
			}
			if(can_move){
				//move piece left
				for(i=0; i<moving.length; i++){
					var r = moving[i].row;
					var c = moving[i].col;
					board[r][c] = false;
					board[r][c+1] = true;
					moving[i].col = c + 1;			
				}
				update_gui();
			}
		break;
		
		case 40: //down
			//increase speed of piece
			//speed = .2;
		break;
		
		default:
			return;
   }
	e.preventDefault();   
});