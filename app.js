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
	speed = 350;
	//start game
	newGame();
	
	$("#new").on("click", function(){
		newGame();
		$("#lose").css("display", "none");
	});
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
		pivot = 0; //pivot is the index in "moving" where the pivot point of the piece is 
	} else if(num <2){
	//block piece (O)
		board[0][4] = true;
		board[0][5] = true;
		board[1][4] = true;
		board[1][5] = true;
		moving = [{row:0, col:4},{row:0, col:5},{row:1, col:4},{row:1, col:5}];
		pivot = 1;
	} else if(num <3){
	//L piece (L)
		board[1][3] = true;
		board[1][4] = true;
		board[1][5] = true;
		board[0][5] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:5}];
		pivot = 0;
	} else if(num <4){
	//backwards L piece (J)
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[1][3] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:3}];
		pivot = 2;
	} else if(num <5){
	//T piece
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[1][4] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:4}];
		pivot = 1;
	} else if(num <6){
	//S piece
		board[0][4] = true;
		board[0][5] = true;
		board[1][3] = true;
		board[1][4] = true;
		moving = [{row:0, col:4},{row:0, col:5},{row:1, col:3},{row:1, col:4}];	
		pivot = 1;
	} else {
	//Z piece
		board[0][3] = true;
		board[0][4] = true;
		board[1][4] = true;
		board[1][5] = true;
		moving = [{row:0, col:3},{row:0, col:4},{row:1, col:4},{row:1, col:5}];
		pivot = 0;
	}
	
	//move the piece downwards until it hits a square
	movePiece = setInterval(function(){
		moveDown();
	}, speed);
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
		for(j=0; j<board[0].length; j++){
			if(!board[i][j]){
				filled = false;
				break;
			}
		}
		if(filled){
			//clear row
			empty_row = new Array(board[0].length);
			board.splice(i, 1);
			board.splice(0, 0, empty_row);
			//increase speed
			speed -= 5;
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
			var r = moving[i].row;
			var c = moving[i].col;
			if(c == 0){
				can_move = false; //piece is on the left edge
			} else if(board[r][c-1] == true){
				var part_of_piece = false;
				for(j=0;j<moving.length;j++){
					if(moving[j].row == r && moving[j].col == c-1){
						part_of_piece = true;
					}
				}
				if(!part_of_piece){
					can_move = false; //there is a block in the way
				}
			}
		}
		if(can_move){
			//move piece left
			for(i=0; i<moving.length; i++){
				var r = moving[i].row;
				var c = moving[i].col;
				board[r][c] = false;
			}
			for(i=0; i<moving.length; i++){
				var r = moving[i].row;
				var c = moving[i].col;
				board[r][c-1] = true;
				moving[i].col = c - 1;			
			}
			update_gui();
		}
		break;
		
		case 38: //up
		//rotate piece clockwise
			pivot_row = moving[pivot].row;
			pivot_col = moving[pivot].col
			var can_rotate = rotateCheck();
			if(can_rotate){
				for(i=0; i<moving.length; i++){
					if(i != pivot){
					//move the block if it is not at the pivot point;
						var r = moving[i].row;
						var c = moving[i].col;
						board[r][c] = false;
					}
				}
				update_gui();
				for(i=0; i<moving.length; i++){
					if(i != pivot){
					//move the block if it is not at the pivot point;
						var r = moving[i].row;
						var c = moving[i].col;
						var row_dist = r - pivot_row;
						var col_dist = c - pivot_col;
						board[pivot_row + col_dist][pivot_col - row_dist] = true;
						moving[i] = {row:pivot_row + col_dist, col:pivot_col - row_dist};
					}
				}
				//if the piece has been rotated "offscreen", move it over
				var min_col = 0;
				var max_col = board[0].length;
				var min_row = 0;
				var off_left = false;
				var off_right = false;
				var off_top = false;
				for(i=0; i<moving.length; i++){
					var r = moving[i].row;
					var c = moving[i].col;
					if(c < 0){//see if the piece is offscreen to the left
						off_left = true;
						if(c < min_col){
							min_col = c;
						}
					}else if(c >= board[0].length){//see if the piece is offscreen to the right
						off_right = true;
						if(c > max_col){
							max_col = c;
						}
					} else if(r < 0){//see if the piece is offscreeen to the top
						off_top = true;
						if(r < min_row){
							min_row = r;
						}
					}
				}
				//move onscreen if necessary
				if(off_left){
					for(i=0; i<moving.length;i++){
						var r = moving[i].row;
						var c = moving[i].col;
						board[r][c] = false;
					}
					for(i=0; i<moving.length;i++){
						var r = moving[i].row;
						var c = moving[i].col;
						var dist = 0 - min_col;
						board[r][c + dist] = true;
						moving[i].col = c + dist;
					}				
				}else if(off_right){
					for(i=0; i<moving.length;i++){
						var r = moving[i].row;
						var c = moving[i].col;
						board[r][c] = false;
					}
					for(i=0; i<moving.length;i++){
						var r = moving[i].row;
						var c = moving[i].col;
						var dist = max_col - board[0].length + 1;
						board[r][c - dist] = true;
						moving[i].col = c - dist;
					}				
				}else if(off_top){
					for(i=0; i<moving.length;i++){
						var r = moving[i].row;
						var c = moving[i].col;
						if(r>=0){
							board[r][c] = false;
						}
					}
					for(i=0; i<moving.length;i++){
						var r = moving[i].row;
						var c = moving[i].col;
						var dist = 0 - min_row;
						board[r+dist][c] = true;
						moving[i].row = r + dist;
					}
				}
				update_gui();
			}
		break;
		
		case 39: //right
		//see if piece can move right
			var can_move = true;
			for(i=0;i<moving.length;i++){
				var r = moving[i].row;
				var c = moving[i].col;
				if(c == board[0].length - 1){
					can_move = false; //piece is on the right edge
				} else if(board[r][c+1] == true){
					var part_of_piece = false;
					for(j=0;j<moving.length;j++){
						if(moving[j].row == r && moving[j].col == c+1){
							part_of_piece = true;
						}
					}
					if(!part_of_piece){
						can_move = false; //there is a block in the way
					}
				}
			}
			if(can_move){
				//move piece right
				for(i=0; i<moving.length; i++){
					var r = moving[i].row;
					var c = moving[i].col;
					board[r][c] = false;
				}
				for(i=0; i<moving.length; i++){
					var r = moving[i].row;
					var c = moving[i].col;
					board[r][c+1] = true;
					moving[i].col = c + 1;			
				}
				update_gui();
			}
		break;
		
		case 40: //down
			//increase speed of piece
			clearInterval(movePiece);
			movePiece = setInterval(function(){
				moveDown();
			}, 25);
		break;
		
		default:
			return;
   }
	e.preventDefault();   
});
function moveDown(){
	var hit_block = false;
	var hit_bottom = false;
	for(i=0; i<moving.length; i++){
		var r = moving[i].row;
		var c = moving[i].col;
		board[r][c] = false;
	}
	for(i=0; i<moving.length; i++){
		var r = moving[i].row;
		var c = moving[i].col;
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
	//piece hits something
		clearInterval(movePiece); //stop freefall
		check_row_clear(); //see if a row can be cleared
		//check to see if the game has been lost
		var game_lost = false;
		for(i=0; i<moving.length; i++){
			if(moving[i].row == 1){
				game_lost = true;
			}
		}
		if(game_lost){
			$("#lose").css("display", "block");
		} else {
			newPiece(); //call down a new piece
		}
	}
}

function rotateCheck(){
	//see if a block is in the way of rotation
	var can_move = true;
	for(i=0; i<moving.length; i++){
		if(i != pivot){
		//move the block if it is not at the pivot point;
			var r = moving[i].row;
			var c = moving[i].col;
			var row_dist = r - pivot_row;
			var col_dist = c - pivot_col;
			if(board[pivot_row + col_dist][pivot_col - row_dist]){
				var in_piece = false;
				for(i=0; i<moving.length; i++){
					if(moving[i].row == pivot_row + col_dist && moving[i].col == pivot_col - row_dist){
						in_piece = true;
					}
				}
				if(!in_piece){
					can_move = false;
				}
			} 
		}
	}
	return can_move;
}