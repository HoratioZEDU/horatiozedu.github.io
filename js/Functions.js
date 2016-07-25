var selected_gargoyle = 1;
var still = true;
var direction;

function initGargoyle(game, x, y){
	gargoyles.create(x + 32, y + 32, 'gargoyle', 0, true);
	gargoyles.setAll('anchor.x', '0.5');
	gargoyles.setAll('anchor.y', '0.5');
}

function initControls(game){
	controls = {
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		punch: game.input.keyboard.addKey(Phaser.Keyboard.F),
		first: game.input.keyboard.addKey(Phaser.Keyboard.ONE),
		second: game.input.keyboard.addKey(Phaser.Keyboard.TWO),
		third: game.input.keyboard.addKey(Phaser.Keyboard.THREE),
	}	
	cursors = game.input.keyboard.createCursorKeys();

	controls.up.onDown.add(function(game){movement_up(game, gargoyle)}); 		
	controls.down.onDown.add(function(game){movement_down(game, gargoyle)});
	controls.right.onDown.add(function(game){movement_right(game, gargoyle)});
	controls.left.onDown.add(function(game){movement_left(game, gargoyle)});

}

function initUI(game){
	game.add.sprite(852, 0, 'hud_background').sendToBack();	

	// for (i = 0; i < gargoyles.children.length; i++){

	// 	game.add.button(884, 100*(i+1), '1_button', function(){}, this, 0, 0, 1, 0, gargoyle_buttons);

	// 	// gargoyle_buttons.create(884, 100*(i+1), '1_button', 0, true);
	// 	// gargoyle_buttons.setAll('anchor.x', '0.5');
	// 	// gargoyle_buttons.setAll('anchor.y', '0.5');
	// 	// gargoyle_buttons.setAll('inputEnableChildren', 'true');
	// 	// gargoyle_buttons.setAll('classType', 'Phaser.Button');
	// 	// console.log(gargoyle_buttons);

	// }

	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		gargoyle_id = gargoyles.getIndex(gargoyle_ofinterest);
		gargoyle_buttons.addChild(game.add.button(884, 100*(gargoyle_id + 1), '1_button', function(){
			gargoyleSelected(game, gargoyle_ofinterest);
		}, 1, 1, 0, 1));
	})
}

function gargoyleOccupation(game, gargoyle){
	gargoyle.current_tile = map.getTile(game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64, 0);
	gargoyle.current_tile.occupied = true;
}

function moveToNewRoom(game, direction){
	current_room = game.game.state.getCurrentState().key;
	next_room = game.game.rnd.integerInRange(1, 2);
	while('tilemap0'+next_room==current_room){
		next_room = game.game.rnd.integerInRange(1, 2); 
	}
	game.game.state.start('tilemap0' + next_room, false, false, game.game, direction)
	//TODO: Case-switch to determine case(room) and its outlets
}	

function movement_up(game, gargoyle){
	tile_above = map.getTileAbove(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(tile_above==null && gargoyle_tween.isRunning == false){moveToNewRoom(game, 'up')}
	if(typeof gargoyle_tween==="undefined"){gargoyle_tween = game.game.add.tween(gargoyle);}													// Making sure gargoyle_tween is defined																			// Checking if you're sauntering off into the inky blackness
	if((typeof tile_above.occupied == "undefined" || tile_above.occupied == false) && tile_above.index<=8 && gargoyle_tween.isRunning == false){			// Screaming, just screaming
		gargoyle_tween = game.game.add.tween(gargoyle);
		gargoyle_tween.onComplete.add(function(){
			map.getTileBelow(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
		})
		gargoyle_tween.to({y:(tile_above.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = 0;
	} 
	console.log(gargoyles.children);
}

function movement_down(game, gargoyle){
	tile_below = map.getTileBelow(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(tile_below==null && gargoyle_tween.isRunning == false){moveToNewRoom(game, 'down')}
	if(typeof gargoyle_tween==="undefined"){gargoyle_tween = game.game.add.tween(gargoyle);}
	if((typeof tile_below.occupied == "undefined" || tile_below.occupied == false) && tile_below.index<=8 && gargoyle_tween.isRunning == false){
		gargoyle_tween = game.game.add.tween(gargoyle);
		gargoyle_tween.onComplete.add(function(){
			map.getTileAbove(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
		})
		gargoyle_tween.to({y:(tile_below.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = Math.PI;
	}
}

function movement_right(game, gargoyle){
	tile_right = map.getTileRight(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(typeof gargoyle_tween==="undefined"){gargoyle_tween = game.game.add.tween(gargoyle);}
	if(tile_right==null && gargoyle_tween.isRunning == false){moveToNewRoom(game, 'right')}
	if((typeof tile_right.occupied == "undefined" || tile_right.occupied == false) && tile_right.index<=8 && gargoyle_tween.isRunning == false){
		gargoyle_tween = game.game.add.tween(gargoyle);
		gargoyle_tween.onComplete.add(function(){
			map.getTileLeft(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
		})
		gargoyle_tween.to({x:(tile_right.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = Math.PI/2;
	}
}

function movement_left(game, gargoyle){
	tile_left = map.getTileLeft(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(tile_left==null && gargoyle_tween.isRunning == false){moveToNewRoom(game, 'left')}
	if(typeof gargoyle_tween==="undefined"){gargoyle_tween = game.game.add.tween(gargoyle);}
	if((typeof tile_left.occupied == "undefined" || tile_left.occupied == false) && tile_left.index<=8 && gargoyle_tween.isRunning == false){	
		gargoyle_tween = game.game.add.tween(gargoyle);
		gargoyle_tween.onComplete.add(function(){
			map.getTileRight(0, game.game.math.snapToFloor(gargoyle.x, 64) / 64, game.game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
		})
		gargoyle_tween.to({x:(tile_left.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = 3*Math.PI/2
	}
}

function gargoyleSelected(game, gargoyleInteresting){
	gargoyle = gargoyleInteresting;

	button_pressed = gargoyle_buttons.getChildAt(gargoyles.getIndex(gargoyleInteresting));

	button_pressed.setFrames(1, 1, 1);

	gargoyle_buttons.forEachAlive(function(other_button){
		if(button_pressed!=other_button){
			other_button.setFrames(0, 0, 0);
		}
	})
}