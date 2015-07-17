$(document).ready(function(){
	//initialize empty grid
	player1 = new Player(1);
	player2 = new Player(2);
	for(i=1; i<player1.board.length; i++){
		var row1 = document.createElement("tr");
		var row2 = document.createElement("tr");
		for(j=0; j<player1.board[0].length; j++){
			var cell1 = document.createElement("td");
			$(row1).append(cell1);
			var cell2 = document.createElement("td");
			$(row2).append(cell2);
		}
		$("#model1").append(row1);
		$("#model2").append(row2);
	}
	//initialize speed of pieces
	speed = 1350;
	//start game
	player1.newGame();
	player2.newGame();
	
	$("#new").on("click", function(){
		player1.newGame();
		player2.newGame();
		$("#lose").css("display", "none");
	});
});

Player.prototype.newGame = function(){
	//initialize score
	this.score = 0;
	//clear board
	for(i=0; i<this.board.length; i++){
		for(j=0; j<this.board[0].length; j++){
			this.board[i][j] = false;
		}
	}
	//spawn a new piece
	this.newPiece();
}

Player.prototype.newPiece = function(){
	//randomly choose a piece shape (7 possibilities)
	//spawn with leftmost piece coming down from 4th column (for now at least)
	var board = this.board;
	var num = Math.random() * 7;
	//add to score
	this.score += 4;
	if(num < 1){
	//line piece (I)
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[0][6] = true;
		this.moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:0, col:6}];
		this.pivot = 0; //pivot is the index in "moving" where the pivot point of the piece is 
	} else if(num <2){
	//block piece (O)
		board[0][4] = true;
		board[0][5] = true;
		board[1][4] = true;
		board[1][5] = true;
		this.moving = [{row:0, col:4},{row:0, col:5},{row:1, col:4},{row:1, col:5}];
		this.pivot = 1;
	} else if(num <3){
	//L piece (L)
		board[1][3] = true;
		board[1][4] = true;
		board[1][5] = true;
		board[0][5] = true;
		this.moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:5}];
		this.pivot = 0;
	} else if(num <4){
	//backwards L piece (J)
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[1][3] = true;
		this.moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:3}];
		this.pivot = 2;
	} else if(num <5){
	//T piece
		board[0][3] = true;
		board[0][4] = true;
		board[0][5] = true;
		board[1][4] = true;
		this.moving = [{row:0, col:3},{row:0, col:4},{row:0, col:5},{row:1, col:4}];
		this.pivot = 1;
	} else if(num <6){
	//S piece
		board[0][4] = true;
		board[0][5] = true;
		board[1][3] = true;
		board[1][4] = true;
		this.moving = [{row:0, col:4},{row:0, col:5},{row:1, col:3},{row:1, col:4}];	
		this.pivot = 1;
	} else {
	//Z piece
		board[0][3] = true;
		board[0][4] = true;
		board[1][4] = true;
		board[1][5] = true;
		this.moving = [{row:0, col:3},{row:0, col:4},{row:1, col:4},{row:1, col:5}];
		this.pivot = 0;
	}
	var player = this;
	//move the piece downwards until it hits a square
	this.movePiece = setInterval(function(){
		player.moveDown();
	}, this.speed);

	update_gui(board, this.num, this.score);
}

Player.prototype.check_row_clear = function(){
	//check each row to see if all are filled
	for(i=0; i<this.board.length; i++){
		var filled = true;
		for(j=0; j<this.board[0].length; j++){
			if(!this.board[i][j]){
				filled = false;
				break;
			}
		}
		if(filled){
			//clear row
			empty_row = new Array(this.board[0].length);
			this.board.splice(i, 1);
			this.board.splice(0, 0, empty_row);
			//increase speed
			speed -= 5;
			//increase score
			this.score += 10;
			update_gui(this.board, this.num, this.score);
		}
	}
}

function update_gui(board, num, score){
	$("#model" + num + " td").remove();
	$("#model" + num + " tr").remove();
	for(i=1; i<board.length; i++){
		var row = document.createElement("tr");
		for(j=0; j<board[0].length; j++){
			var cell = document.createElement("td");
			if(board[i][j]){
				$(cell).css("background-color", "#000");
			}
			$(row).append(cell);
		}
		$("#model" + num).append(row);
	}
	$("#score" + num).html("Score: " + score);	
}

$(document).keydown(function(e){
//on keydown
   switch(e.which) {
		//BOARD 1
        case 37: // left (player1)
			player1.moveLeft();
		break;
		
		case 38: //up (player1)
			player1.rotate();
		break;
		
		case 39: //right
			player1.moveRight();
		break;
		
		case 40: //down
			//increase speed of piece
			clearInterval(player1.movePiece);
			player1.movePiece = setInterval(function(){
				player1.moveDown();
			}, 25);
		break;
		
		//BOARD 2
		case 65: //a
			player2.moveLeft();
		break;
		
		case 68: //d
			player2.moveRight();
		break;
		
		case 83://s
			//increase speed of piece
			clearInterval(player2.movePiece);
			player2.movePiece = setInterval(function(){
				player2.moveDown();
			}, 25);
		break;
		
		case 87: //w
			player2.rotate();
		break;
		
		default:
			return;
   }
	e.preventDefault();   
});

Player.prototype.moveDown = function(){
	var hit_block = false;
	var hit_bottom = false;
	var moving = this.moving;
	var board = this.board;
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
	update_gui(board, this.num, this.score);
	//deal with the piece hitting something
	if(hit_bottom || hit_block){
	//piece hits something
		clearInterval(this.movePiece); //stop freefall
		this.check_row_clear(); //see if a row can be cleared
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
			this.newPiece(); //call down a new piece
		}
	}
}

Player.prototype.rotateCheck = function(){
	//see if a block is in the way of rotation
	var can_move = true;
	var board = this.board;
	var moving = this.moving;
	for(i=0; i<moving.length; i++){
		if(i != this.pivot){
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

Player.prototype.moveLeft = function(){
	var can_move = true;
	var board = this.board;
	var moving = this.moving;
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
		update_gui(board, this.num, this.score);
	}
}

Player.prototype.moveRight = function(){
	//see if piece can move right
	var can_move = true;
	var board = this.board;
	var moving = this.moving;
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
		update_gui(board, this.num, this.score);
	}
}

Player.prototype.rotate = function(){
//rotate piece clockwise
	var board = this.board;
	var moving = this.moving;
	var pivot = this.pivot;
	pivot_row = moving[pivot].row;
	pivot_col = moving[pivot].col
	var can_rotate = this.rotateCheck();
	if(can_rotate){
		for(i=0; i<moving.length; i++){
			if(i != pivot){
			//move the block if it is not at the pivot point;
				var r = moving[i].row;
				var c = moving[i].col;
				board[r][c] = false;
			}
		}
		update_gui(board, this.num, this.score);
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
		update_gui(board, this.num, this.score);
	}	
}

function Player(num){
	this.board = new Array(21);
	for(i=0; i<this.board.length; i++){
		this.board[i] = new Array(10);
	}	
	this.num = num;
	this.score = 0;
}