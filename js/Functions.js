var gargoyles = {};

function initGargoyle(game, game_start, x, y, id){
	gargoyles[id] = game.add.sprite(x - 6, y - 6, 'gargoyle');
	game.physics.arcade.enable(gargoyles[id]);
	gargoyles[id].body.collideWorldBounds = true;
	game.physics.enable(gargoyles[id], Phaser.Physics.ARCADE);
	gargoyles[id].physicsBodyType = Phaser.Physics.ARCADE;
	gargoyles[id].body.allowGravity = false;
}

function initControls(game){
	controls = {
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: game.input.keyboard.addKey(Phaser.Keyboard.S),
	}	
	cursors = game.input.keyboard.createCursorKeys();
}

function gargoyleMovement(game, gargoyle){

	if(gargoyle.body.velocity.x == 0 && gargoyle.body.velocity.y == 0){
		if(controls.right.isDown){
			if(map.getTileRight(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index!=4){
				gargoyle.body.moveTo(500, 58, 0)
			}
		}

		if(controls.left.isDown){
			if(map.getTileLeft(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index!=4){
				gargoyle.body.moveTo(500, -58, 0)
			}
		}

		if(controls.up.isDown){
			if(map.getTileAbove(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index!=4){
				gargoyle.body.moveTo(500, -58, 90)
			}
		}

		if(controls.down.isDown){
			if(map.getTileBelow(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index!=4){
				gargoyle.body.moveTo(500, 58, 90)
			}
		}


		// Aligns gargoyle, don't mess with this
		gargoyle.x = game.math.snapToFloor(gargoyle.x + 6, 64);
		gargoyle.y = game.math.snapToFloor(gargoyle.y + 6, 64);
	}
}
