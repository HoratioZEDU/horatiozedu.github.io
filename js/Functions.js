Game.gargoyles = {};
var selected_gargoyle = 1;
var gargoyle_buttons = {};
var still = true;
var direction;

function initGargoyle(game, game_start, x, y, id){
	Game.gargoyles[id] = game.add.sprite(x + 32, y + 32, 'gargoyle');
	game.physics.arcade.enable(Game.gargoyles[id]);
	Game.gargoyles[id].anchor.setTo(0.5);
	Game.gargoyles[id].body.collideWorldBounds = true;
	game.physics.enable(Game.gargoyles[id], Phaser.Physics.ARCADE);
	Game.gargoyles[id].physicsBodyType = Phaser.Physics.ARCADE;
	Game.gargoyles[id].body.allowGravity = false;
	Game.gargoyles[id].animations.add('punch', [1, 2, 3, 0], 5, false);
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
	}	
	cursors = game.input.keyboard.createCursorKeys();
}

function initUI(game){
	game.add.sprite(852, 0, 'hud_background');	

	if (Object.keys(Game.gargoyles).length >= 1){
		gargoyle_buttons["first_button"] = game.add.button(884, 100, '1_button', function(){

			for (gargoi in Game.gargoyles){
				if (Math.abs(Game.gargoyles[gargoi].body.velocity.y) >= 0.1 || Math.abs(Game.gargoyles[gargoi].body.velocity.x) >= 0.1){
					still = false;
				}
			}
			if(still){
				for (button in gargoyle_buttons){
					gargoyle_buttons[button].setFrames(0, 0, 0);
				}
				gargoyle_buttons["first_button"].setFrames(1, 1, 0);
				selected_gargoyle = 1;
			} else { 
				still = true;
			}
		})
	}

	if (Object.keys(Game.gargoyles).length >= 2){
		gargoyle_buttons["second_button"] = game.add.button(884, 200, '1_button', function(){
			for (gargoi in Game.gargoyles){
				if (Math.abs(Game.gargoyles[gargoi].body.velocity.y) >= 0.1 || Math.abs(Game.gargoyles[gargoi].body.velocity.x) >= 0.1){
					still = false;
				}
			}
			if(still){
				for (button in gargoyle_buttons){
					gargoyle_buttons[button].setFrames(0, 0, 0);
				}
				gargoyle_buttons["second_button"].setFrames(1, 1, 0);
				selected_gargoyle = 2;
			} else {
				still = true;
			}
		})
	}

	if (Object.keys(Game.gargoyles).length >= 3){
		gargoyle_buttons["third_button"] = game.add.button(884, 300, '1_button', function(){
			for (gargoi in Game.gargoyles){
				if (Math.abs(Game.gargoyles[gargoi].body.velocity.y) >= 0.1 || Math.abs(Game.gargoyles[gargoi].body.velocity.x) >= 0.1){
					still = false;
				}
			}
			if(still){
				for (button in gargoyle_buttons){
					gargoyle_buttons[button].setFrames(0, 0, 0);
				}
				gargoyle_buttons["third_button"].setFrames(1, 1, 0);
				selected_gargoyle = 3;
			} else {
				still = true;
			}
		})
	}

	gargoyle_buttons["first_button"].setFrames(1, 1, 0);
}

function gargoyleMovement(game, gargoyle, from){

	if(gargoyle.body.velocity.x == 0 && gargoyle.body.velocity.y == 0 && gargoyle.animations.frame == 0){
		if(controls.right.isDown){
			gargoyle.blocked = false;  //Needs to be on the outside of the FOR loop, as it'll reset to false in any non-blocked case
			for (key in Game.gargoyles){
				if (Game.gargoyles[key]!=gargoyle){
					console.log(Game.gargoyles[key]);
					if (Game.gargoyles[key].x >= gargoyle.x + 60 && Game.gargoyles[key].x <= gargoyle.x + 68 && Game.gargoyles[key].y >= gargoyle.y - 4 && Game.gargoyles[key].y <= gargoyle.y + 4){
						gargoyle.blocked = true;
					}
				}
			}
			if(map.getTileRight(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64) == null){
				moveToNewRoom(game, 'right', from);
			} else if(map.getTileRight(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index<=8 && !gargoyle.blocked){
				gargoyle.body.moveTo(500, 63, 0)
				gargoyle.body.rotation = 90;
				gargoyle.x = game.math.snapToFloor(gargoyle.x, 64) + 32;
				gargoyle.y = game.math.snapToFloor(gargoyle.y, 64) + 32;
			}
			console.log(Game.gargoyles);
		}

		if(controls.left.isDown){
			gargoyle.blocked = false;
			for (key in Game.gargoyles){
				if (Game.gargoyles[key]!=gargoyle){
					if (Game.gargoyles[key].x <= gargoyle.x - 60 && Game.gargoyles[key].x >= gargoyle.x - 68 && Game.gargoyles[key].y >= gargoyle.y - 4 && Game.gargoyles[key].y <= gargoyle.y + 4){
						gargoyle.blocked = true;
					}
				}
			}
			if(map.getTileLeft(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64) == null){
				moveToNewRoom(game, 'left', from);
			} else if(map.getTileLeft(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index<=8 && !gargoyle.blocked){
				gargoyle.body.moveTo(500, -63, 0)
				gargoyle.body.rotation = 270;
				gargoyle.x = game.math.snapToFloor(gargoyle.x, 64) + 32;
				gargoyle.y = game.math.snapToFloor(gargoyle.y, 64) + 32;
			}
		}

		if(controls.up.isDown){
			gargoyle.blocked = false;
			for (key in Game.gargoyles){
				if (Game.gargoyles[key]!=gargoyle){
					console.log(gargoyle);
					console.log(Game.gargoyles[key]);
					if (Game.gargoyles[key].x >= gargoyle.x - 4 && Game.gargoyles[key].x <= gargoyle.x + 4 && Game.gargoyles[key].y <= gargoyle.y - 60 && Game.gargoyles[key].y >= gargoyle.y - 68){
						gargoyle.blocked = true;
					}
				}
			}
			if(map.getTileAbove(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64) == null){
				moveToNewRoom(game, 'up', from);
			} else if(map.getTileAbove(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index<=8 && !gargoyle.blocked){
				gargoyle.body.moveTo(500, -63, 90)
				gargoyle.body.rotation = 0;
				gargoyle.x = game.math.snapToFloor(gargoyle.x, 64) + 32;
				gargoyle.y = game.math.snapToFloor(gargoyle.y, 64) + 32;
			}
		}

		if(controls.down.isDown){
			gargoyle.blocked = false;
			for (key in Game.gargoyles){
				if (Game.gargoyles[key]!=gargoyle){
					if (Game.gargoyles[key].x >= gargoyle.x - 4 && Game.gargoyles[key].x <= gargoyle.x + 4 && Game.gargoyles[key].y >= gargoyle.y + 60 && Game.gargoyles[key].y <= gargoyle.y + 68){
						gargoyle.blocked = true;
					}
				}
			}
			if(map.getTileBelow(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64) == null){
				moveToNewRoom(game, 'down', from);
			} else if(map.getTileBelow(map.getLayer(), game.math.snapToFloor(gargoyle.x + 6, 64) / 64, game.math.snapToFloor(gargoyle.y + 6, 64) / 64).index<=8 && !gargoyle.blocked){
				gargoyle.body.moveTo(500, 63, 90)
				gargoyle.body.rotation = 180;
				gargoyle.x = game.math.snapToFloor(gargoyle.x, 64) + 32;
				gargoyle.y = game.math.snapToFloor(gargoyle.y, 64) + 32;
			}
		}

		if(controls.punch.isDown){
			gargoyle.animations.play('punch');
		}

		if(controls.first.isDown){
			for (gargoi in Game.gargoyles){
				if (Math.abs(Game.gargoyles[gargoi].body.velocity.y) >= 0.1 || Math.abs(Game.gargoyles[gargoi].body.velocity.x) >= 0.1){
					still = false;
				}
			}
			if(still){
				for (button in gargoyle_buttons){
					gargoyle_buttons[button].setFrames(0, 0, 0);
				}
				gargoyle_buttons["first_button"].setFrames(1, 1, 0);
				selected_gargoyle = 1;
			} else {
				still = true;
			}
		}

		if(controls.second.isDown){
			for (gargoi in Game.gargoyles){
				if (Math.abs(Game.gargoyles[gargoi].body.velocity.y) >= 0.1 || Math.abs(Game.gargoyles[gargoi].body.velocity.x) >= 0.1){
					still = false;
				}
			}
			if(still){
				for (button in gargoyle_buttons){
					gargoyle_buttons[button].setFrames(0, 0, 0);
				}
				gargoyle_buttons["second_button"].setFrames(1, 1, 0);
				selected_gargoyle = 2;
			} else {
				still = true;
			}
		}		
	}
}

function moveToNewRoom(game, direction, from){
	next_room = game.rnd.integerInRange(1, 2);
	// Makes sure that you dont' visit the same room twice.
	while(from == next_room){
		next_room = game.rnd.integerInRange(1, 2);
	}
	console.log(direction);
	game.state.start('tilemap0' + next_room, false, false, game, false, direction)
}	