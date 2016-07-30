var selected_gargoyle = 1;
var still = true;
var direction;
var actionTimer = 0;
var spells = ['defensive_stance', 'opportunistic_stance', 'heavy_stance', 'sacrificial_stance', 'healing_spell'];//, 'teleport_spell', 'illusory_spell'];

function initGargoyle(game, x, y){
	gargoyles.create(x + 32, y + 32, 'gargoyle', 0, true);
	gargoyles.setAll('anchor.x', '0.5');
	gargoyles.setAll('anchor.y', '0.5');
	gargoyles.setAll('str', 2, false, false, 0, true);
	gargoyles.setAll('intel', 5, false, false, 0, true);
	gargoyles.setAll('defense', 0, false, false, 0, true);
	gargoyles.setAll('opportunism', false, false, false, 0, true);
	gargoyles.setAll('health', '50');
	gargoyles.setAll('protectedflag', false, false, false, 0, true);
	gargoyles.callAll('animations.add', 'animations', 'die', [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], 10, false);
	gargoyles.callAll('animations.add', 'animations', 'punch', [1, 2, 3, 0], 5, false);
}

function initEnemySpearman(game, x, y, rotation){
	enemySpearmen.create(x + 32, y + 32, 'enemy_spearman', 0, true);
	enemySpearmen.setAll('anchor.x', '0.5');
	enemySpearmen.setAll('anchor.y', '0.5');
	enemySpearmen.setAll('health', '30');
	enemySpearmen.setAll('damage', 15);
	enemySpearmen.setAll('rotation', rotation);
	enemySpearmen.callAll('animations.add', 'animations', 'punch', [20, 21, 22, 23, 26, 27, 28, 29], 10, false);
	enemySpearmen.callAll('animations.add', 'animations', 'die', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 9, false);
}

function initControls(game){
	controls = {
		//Gargoyle selection keys
		first: game.input.keyboard.addKey(Phaser.Keyboard.ONE),
		second: game.input.keyboard.addKey(Phaser.Keyboard.TWO),
		third: game.input.keyboard.addKey(Phaser.Keyboard.THREE),
		//Spell/stance keys
		spell1: game.input.keyboard.addKey(Phaser.Keyboard.Q),
		spell2: game.input.keyboard.addKey(Phaser.Keyboard.W),
		spell3: game.input.keyboard.addKey(Phaser.Keyboard.E),
		spell4: game.input.keyboard.addKey(Phaser.Keyboard.R),
		firespell: game.input.keyboard.addKey(Phaser.Keyboard.F),
		//Debugging
		kill: game.input.keyboard.addKey(Phaser.Keyboard.V),  									// THIS ONE IS FOR DEBUGGING
	}	
	cursors = game.input.keyboard.createCursorKeys();

	cursors.up.onDown.add(function(){
	if(game.time.now > actionTimer){
		actionTimer = game.time.now + 600;
		movement_up(game, gargoyle);
	}
	}); 		
	cursors.down.onDown.add(function(){
	if(game.time.now > actionTimer){
		actionTimer = game.time.now + 600;
		movement_down(game, gargoyle);
	}
	}); 	
	cursors.right.onDown.add(function(){
	if(game.time.now > actionTimer){
		actionTimer = game.time.now + 600;
		movement_right(game, gargoyle);
	}
	}); 	
	cursors.left.onDown.add(function(){
	if(game.time.now > actionTimer){
		actionTimer = game.time.now + 600;
		movement_left(game, gargoyle);
	}
	}); 	
	controls.first.onDown.add(function(){gargoyleSelected(game, gargoyles.getChildAt(0))});
	controls.second.onDown.add(function(){gargoyleSelected(game, gargoyles.getChildAt(1))});
	controls.third.onDown.add(function(){gargoyleSelected(game, gargoyles.getChildAt(2))});
	controls.spell1.onDown.add(function(){spellSelected(game, gargoyle, gargoyle.spell1)});
	controls.spell2.onDown.add(function(){spellSelected(game, gargoyle, gargoyle.spell2)});
	controls.spell3.onDown.add(function(){spellSelected(game, gargoyle, gargoyle.spell3)});
	controls.spell4.onDown.add(function(){spellSelected(game, gargoyle, gargoyle.spell4)});
	controls.firespell.onDown.add(function(){shootSpell(game, gargoyle, gargoyle.activeSpell)});
	controls.kill.onDown.add(function(){gargoyle.health -= 5})  								// THIS IS ALSO FOR DEBUGGING

}

function initUI(game){
	game.add.sprite(852, 0, 'hud_background').sendToBack();

	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		gargoyle_ofinterest.souls = 100;
		gargoyle_id = gargoyles.getIndex(gargoyle_ofinterest);
		gargoyle_buttons.addChild(game.add.button(884, 85 + 85*(gargoyle_id), (gargoyle_id+1).toString() + '_button', function(){
			gargoyleSelected(game, gargoyle_ofinterest);
		}, 1, 1, 0, 1));
		gargoyle_ofinterest.hp_bar = game.add.bitmapData(50*3, 8);
		gargoyle_ofinterest.soul_bar = game.add.bitmapData(50*3, 8);
		gargoyle_hp_bars.addChild(game.add.sprite(979, 100 + 85*(gargoyle_id), gargoyle_ofinterest.hp_bar));
		gargoyle_hp_bars.addChild(game.add.sprite(960, 97 + 85*(gargoyle_id), 'hp_icon'));
		gargoyle_soul_bars.addChild(game.add.sprite(979, 125 + 85*(gargoyle_id), gargoyle_ofinterest.soul_bar));
		gargoyle_soul_bars.addChild(game.add.sprite(960, 122 + 85*(gargoyle_id), 'soul_icon'));
		gargoyle_ui_bg.addChild(game.add.sprite(976, 97 + 85*(gargoyle_id), 'hud_overlay'));
		generateSpells(game, gargoyle_ofinterest);
	})
}

function gargoyleOccupation(game, gargoyle){
	gargoyle.current_tile = map.getTile(game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64, 0);
	gargoyle.current_tile.occupied = true;
	gargoyle.current_tile.inhabitedBy = gargoyle;

	gargoyle.tile_above = map.getTileAbove(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.tile_right = map.getTileRight(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.tile_left = map.getTileLeft(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.tile_below = map.getTileBelow(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);

	if(gargoyle.health <= 0){
		actionTimer = game.time.now + 1200;
		gargoyle.animations.play('die').onComplete.add(function(){gargoyleDead(game, gargoyle)});
	}

	if(gargoyle.protecting == true){
		if(typeof gargoyle.tile_above.inhabitedBy != "undefined" && gargoyle.tile_above.inhabitedBy != null){
			if(gargoyle.tile_above.inhabitedBy.protectedflag == false){
				gargoyle.tile_above.inhabitedBy.protectedflag = true;
				gargoyle.tile_above.inhabitedBy.protectedBy = gargoyle;
			}
		}
		if(typeof gargoyle.tile_below.inhabitedBy != "undefined" && gargoyle.tile_below.inhabitedBy != null){
			if(gargoyle.tile_below.inhabitedBy.protectedflag == false){
				gargoyle.tile_below.inhabitedBy.protectedflag = true;
				gargoyle.tile_below.inhabitedBy.protectedBy = gargoyle;
			}
		}
		if(typeof gargoyle.tile_right.inhabitedBy != "undefined" && gargoyle.tile_right.inhabitedBy != null){
			if(gargoyle.tile_right.inhabitedBy.protectedflag == false){
				gargoyle.tile_right.inhabitedBy.protectedflag = true;
				gargoyle.tile_right.inhabitedBy.protectedBy = gargoyle;
			}
		}
		if(typeof gargoyle.tile_left.inhabitedBy != "undefined" && gargoyle.tile_left.inhabitedBy != null){
			if(gargoyle.tile_left.inhabitedBy.protectedflag == false){
				gargoyle.tile_left.inhabitedBy.protectedflag = true;
				gargoyle.tile_left.inhabitedBy.protectedBy = gargoyle;
			}
		}
	}
	
	gargoyle.hp_bar.context.clearRect(0, 0, gargoyle.hp_bar.width, gargoyle.hp_bar.height);
	gargoyle.hp_bar.context.fillStyle = '#cc0000';
	gargoyle.hp_bar.context.fillRect(0, 0, gargoyle.health*3, 8);
	gargoyle.soul_bar.context.clearRect(0, 0, gargoyle.soul_bar.width, gargoyle.soul_bar.height);
	gargoyle.soul_bar.context.fillStyle = '#6600cc';
	gargoyle.soul_bar.context.fillRect(0, 0, gargoyle.souls*(150/100), 8);
	
}

function enemyOccupation(game, enemy){
	enemy.current_tile = map.getTile(game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64, 0);

	if(enemy.alive==true){
		enemy.current_tile.occupied = true;
		enemy.current_tile.inhabitedBy = enemy;
	}

	if (enemy.health <= 0){
		enemy.alive = false;
		enemy.current_tile.inhabitedBy = null;
		enemy.animations.play('die').onComplete.add(function(){enemyDead(game, enemy)});
	}
}

function gargoyleDead(game, gargoyle){
	gargoyle.destroy();
	gargoyle.current_tile.occupied = false;
	gargoyle.current_tile.inhabitedBy = null;
	gargoyle_buttons.removeAll(true);
	gargoyle_hp_bars.removeAll(true);
	gargoyle_soul_bars.removeAll(true);
	gargoyle_ui_bg.removeAll(true);
	gargoyles.forEach(function(gargoyle_ofinterest){
		gargoyle_id = gargoyles.getIndex(gargoyle_ofinterest);
		gargoyle_buttons.addChild(game.add.button(884, 85 + 85*(gargoyle_id), (gargoyle_id+1).toString() + '_button', function(){
			gargoyleSelected(game, gargoyle_ofinterest);
		}, 1, 1, 0, 1));
		gargoyle_ofinterest.hp_bar = game.add.bitmapData(50*3, 8);
		gargoyle_ofinterest.soul_bar = game.add.bitmapData(50*3, 8);
		gargoyle_hp_bars.addChild(game.add.sprite(979, 100 + 85*(gargoyle_id), gargoyle_ofinterest.hp_bar));
		gargoyle_hp_bars.addChild(game.add.sprite(960, 97 + 85*(gargoyle_id), 'hp_icon'));
		gargoyle_soul_bars.addChild(game.add.sprite(979, 125 + 85*(gargoyle_id), gargoyle_ofinterest.soul_bar));
		gargoyle_soul_bars.addChild(game.add.sprite(960, 122 + 85*(gargoyle_id), 'soul_icon'));
		gargoyle_ui_bg.addChild(game.add.sprite(976, 97 + 85*(gargoyle_id), 'hud_overlay'));
	});
	if(gargoyles.children.length == 0){
		game.state.start('MainMenu');
	}
}

function enemyDead(game, enemy){
	enemy.destroy();
	enemy.current_tile.occupied = false;
	enemy.current_tile.inhabitedBy = null;
}

function enemyMovement(game, enemy){
	enemy.possibilities = [];
	closest_gargoyle = gargoyles.getClosestTo(enemy);
	enemy.current_tile = map.getTile(game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64, 0);
	enemy_tile_above = map.getTileAbove(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
	enemy_tile_below = map.getTileBelow(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
	enemy_tile_left = map.getTileLeft(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
	enemy_tile_right = map.getTileRight(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);

	//enemy.current_tile.occupied = false; 
	//enemy.current_tile.inhabitedBy = null;

	gargoyles.forEachAlive(function(gargoyle){
		if(gargoyle.heavy_iterable >= 0 && gargoyle.heavy_iterable < 5){gargoyle.heavy_iterable+=1/gargoyles.children.length; console.log(gargoyle.heavy_iterable)}
	})

	if(closest_gargoyle == enemy_tile_above.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage - 5, enemy.damage + 5);		// Punch up
		if(enemy_tile_above.inhabitedBy.protectedflag == true){
			enemy_tile_above.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_above.inhabitedBy.health -= enemy.damage - enemy_tile_above.inhabitedBy.defense;
		}
		enemy.rotation = 0;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
	} else if(closest_gargoyle == enemy_tile_below.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage - 5, enemy.damage + 5);		// Punch down
		if(enemy_tile_below.inhabitedBy.protectedflag == true){
			enemy_tile_below.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_below.inhabitedBy.health -= enemy.damage - enemy_tile_below.inhabitedBy.defense;
		}
		enemy.rotation = Math.PI;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
	} else if(closest_gargoyle == enemy_tile_left.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage - 5, enemy.damage + 5);		// Punch left
		if(enemy_tile_left.inhabitedBy.protectedflag == true){
			enemy_tile_left.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_left.inhabitedBy.health -= enemy.damage - enemy_tile_left.inhabitedBy.defense;
		}
		enemy.rotation = 3*Math.PI/2;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
	} else if(closest_gargoyle == enemy_tile_right.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage - 5, enemy.damage + 5);		// Punch right
		if(enemy_tile_right.inhabitedBy.protectedflag == true){
			enemy_tile_right.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_right.inhabitedBy.health -= enemy.damage - enemy_tile_right.inhabitedBy.defense;
		}
		enemy.rotation = Math.PI/2;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
	} else if(closest_gargoyle.x < enemy.x && (typeof enemy_tile_left.occupied==="undefined" || enemy_tile_left.occupied == false) && enemy_tile_left.index<=8){		// Walk left
		enemy_tile_left.occupied = true;
		enemy_tile_left.inhabitedBy = enemy;
		enemy_tween = game.add.tween(enemy);
		enemy_tween.onComplete.add(function(){
			enemy_tile_right = map.getTileRight(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
			enemy_tile_right.occupied = false;
			enemy_tile_right.inhabitedBy = null;
		})
		enemy_tween.to({x:(enemy_tile_left.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		enemy.rotation = 3*Math.PI/2;
	} else if (closest_gargoyle.x  > enemy.x && (typeof enemy_tile_right.occupied==="undefined" || enemy_tile_right.occupied == false) && enemy_tile_right.index<=8){	// Walk right
		enemy_tile_right.occupied = true;
		enemy_tile_right.inhabitedBy = enemy;
		enemy_tween = game.add.tween(enemy);
		enemy_tween.onComplete.add(function(){
			enemy_tile_left = map.getTileLeft(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
			enemy_tile_left.occupied = false;
			enemy_tile_left.inhabitedBy = null;
		})
		enemy_tween.to({x:(enemy_tile_right.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		enemy.rotation = Math.PI/2;
	} else if (closest_gargoyle.y  > enemy.y && (typeof enemy_tile_below.occupied==="undefined" || enemy_tile_below.occupied == false) && enemy_tile_below.index<=8){	// Walk down
		enemy_tile_below.occupied = true;
		enemy_tile_below.inhabitedBy = enemy;
		enemy_tween = game.add.tween(enemy);
		enemy_tween.onComplete.add(function(){
			enemy_tile_above = map.getTileAbove(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
			enemy_tile_above.occupied = false;
			enemy_tile_above.inhabitedBy = null;
		})
		enemy_tween.to({y:(enemy_tile_below.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		enemy.rotation = Math.PI;
	} else if (closest_gargoyle.y  < enemy.y && (typeof enemy_tile_above.occupied==="undefined" || enemy_tile_above.occupied == false) && enemy_tile_above.index<=8){	// Walk up
		enemy_tile_above.occupied = true;
		enemy_tile_above.inhabitedBy = enemy;
		enemy_tween = game.add.tween(enemy);
		enemy_tween.onComplete.add(function(){
			enemy_tile_below = map.getTileBelow(0, game.math.snapToFloor(enemy.x, 64) / 64, game.math.snapToFloor(enemy.y, 64) / 64);
			enemy_tile_below.occupied = false;
			enemy_tile_below.inhabitedBy = null;
		})
		enemy_tween.to({y:(enemy_tile_above.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		enemy.rotation = 0;
	}
}

function movement_up(game, gargoyle){
	tile_above = map.getTileAbove(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(tile_above==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'up')}
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}													// Making sure gargoyle.gargoyle_tween is defined																			// Checking if you're sauntering off into the inky blackness
	if((typeof tile_above.occupied == "undefined" || tile_above.occupied == false) && tile_above.index<=8 && gargoyle.gargoyle_tween.isRunning == false){			// Screaming, just screaming
		gargoyle.gargoyle_tween = game.add.tween(gargoyle);
		gargoyle.gargoyle_tween.onComplete.add(function(){
			map.getTileBelow(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
			map.getTileBelow(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
		})
		gargoyle.gargoyle_tween.to({y:(tile_above.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = 0;
	} 
	if(tile_above.occupied = true && tile_above.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){			// Attacking
		gargoyle.animations.play('punch');
		if(gargoyle.opportunism == true && tile_above.inhabitedBy.rotation != Math.PI){
			gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
		} else if(gargoyle.heavy_iterable>=1){
			gargoyle.damage = 20*(1 + gargoyle.heavy_iterable/2) + game.rnd.integerInRange(-5, gargoyle.str * 2 * gargoyle.heavy_iterable);
		} else {
			gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
		}
		tile_above.inhabitedBy.health -= gargoyle.damage;
		gargoyle.rotation = 0;
		gargoyle.current_tile.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.gargoyle_tween.isRunning==true){																			// Enemy movement
		tile_above.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
}

function movement_down(game, gargoyle){
	tile_below = map.getTileBelow(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(tile_below==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'down')}
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}
	if((typeof tile_below.occupied == "undefined" || tile_below.occupied == false) && tile_below.index<=8 && gargoyle.gargoyle_tween.isRunning == false){
		gargoyle.gargoyle_tween = game.add.tween(gargoyle);
		gargoyle.gargoyle_tween.onComplete.add(function(){
			map.getTileAbove(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
			map.getTileAbove(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
		})
		gargoyle.gargoyle_tween.to({y:(tile_below.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = Math.PI;
	}
	if(tile_below.occupied = true && tile_below.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){
		gargoyle.animations.play('punch');
		if(gargoyle.opportunism == true && tile_below.inhabitedBy.rotation != 0){
			gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
		} else {
			gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
		}
		tile_below.inhabitedBy.health -= gargoyle.damage;
		gargoyle.rotation = Math.PI;
		gargoyle.current_tile.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.gargoyle_tween.isRunning==true){
		tile_below.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
}

function movement_right(game, gargoyle){
	tile_right = map.getTileRight(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false;
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}
	if(tile_right==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'right')}
	if((typeof tile_right.occupied == "undefined" || tile_right.occupied == false) && tile_right.index<=8 && gargoyle.gargoyle_tween.isRunning == false){
		gargoyle.gargoyle_tween = game.add.tween(gargoyle);
		gargoyle.gargoyle_tween.onComplete.add(function(){
			map.getTileLeft(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
			map.getTileLeft(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
		})
		gargoyle.gargoyle_tween.to({x:(tile_right.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = Math.PI/2;
	}
	if(tile_right.occupied = true && tile_right.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){
		gargoyle.animations.play('punch');
		if(gargoyle.opportunism == true && tile_right.inhabitedBy.rotation != 3*Math.PI/2){
			gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
			console.log(gargoyle.damage);
		} else {
			gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
		}
		tile_right.inhabitedBy.health -= gargoyle.damage;
		gargoyle.rotation = Math.PI/2;
		gargoyle.current_tile.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.gargoyle_tween.isRunning==true){
		tile_right.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
}

function movement_left(game, gargoyle){
	tile_left = map.getTileLeft(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64);
	gargoyle.current_tile.occupied = false; 
	if(tile_left==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'left')}
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}
	if((typeof tile_left.occupied == "undefined" || tile_left.occupied == false) && tile_left.index<=8 && gargoyle.gargoyle_tween.isRunning == false){	
		gargoyle.gargoyle_tween = game.add.tween(gargoyle);
		gargoyle.gargoyle_tween.onComplete.add(function(){
			map.getTileRight(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
			map.getTileRight(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
		})
		gargoyle.gargoyle_tween.to({x:(tile_left.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
		gargoyle.rotation = 3*Math.PI/2
	}
	if(tile_left.occupied = true && tile_left.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){
		gargoyle.animations.play('punch');
		if(gargoyle.opportunism == true && tile_left.inhabitedBy.rotation != Math.PI/2){
			gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
		} else {
			gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
		}
		tile_left.inhabitedBy.health -= gargoyle.damage;
		gargoyle.rotation = 3*Math.PI/2;
		gargoyle.current_tile.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.gargoyle_tween.isRunning==true){
		tile_left.occupied = true;
		enemySpearmen.forEachAlive(function(enemy){
			enemyMovement(game, enemy);
		})
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
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

function generateSpells(game, gargoyle){
	gargoyle.spell1 = spells[game.rnd.integerInRange(0, 4)];
	gargoyle.spell2 = spells[game.rnd.integerInRange(0, 4)];
	while(gargoyle.spell2 == gargoyle.spell1){
		gargoyle.spell2 = spells[game.rnd.integerInRange(0, 4)];
	}
	gargoyle.spell3 = spells[game.rnd.integerInRange(0, 4)];
	while(gargoyle.spell3 == gargoyle.spell1 || gargoyle.spell3 == gargoyle.spell2){
		gargoyle.spell3 = spells[game.rnd.integerInRange(0, 4)];
	}
	gargoyle.spell4 = spells[game.rnd.integerInRange(0, 4)];
	while(gargoyle.spell4 == gargoyle.spell1 || gargoyle.spell4 == gargoyle.spell2 || gargoyle.spell4 == gargoyle.spell3){
		gargoyle.spell4 = spells[game.rnd.integerInRange(0, 4)];
	}
}

function spellSelected(game, gargoyle, spellCool){
	gargoyle.activeSpell = spellCool;
	console.log(gargoyle.activeSpell);

	// TODO: add UI interaction here
}

function shootSpell(game, gargoyle, spell){
	console.log(spell);
	switch(spell){
		case 'defensive_stance':
			undoAllStances(game, gargoyle);
			gargoyle.defense = 13;
			break;
		case 'opportunistic_stance':
			undoAllStances(game, gargoyle);
			gargoyle.opportunism = true;
			break;
		case 'heavy_stance':
			undoAllStances(game, gargoyle);
			gargoyle.heavy_iterable = 0;
			break;
		case 'sacrificial_stance':
			undoAllStances(game, gargoyle);
			gargoyle.protecting = true;
			break;
		case 'healing_spell':
			healspell(game, gargoyle);
			break;
	}
}

function undoAllStances(game, gargoyle){
	gargoyle.defense -= 13;
	gargoyle.opportunism = false;
	gargoyle.heavy_iterable = -1;
	gargoyle.protecting = false;
}

function healspell(game, gargoyle){
	if(typeof gargoyle.tile_above.inhabitedBy != "undefined" && gargoyle.tile_above.inhabitedBy.key == 'gargoyle'){
		gargoyle.tile_above.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
		healsprite_above = game.add.sprite(gargoyle.tile_above.x * 64, gargoyle.tile_above.y * 64, 'healsprite');
		healsprite_above.animations.add('idle', [0, 1, 2, 3, 4], 6, false).onComplete.add(function(){healsprite_above.destroy()});
		healsprite_above.play('idle');
	}
	if(typeof gargoyle.tile_below.inhabitedBy != "undefined" && gargoyle.tile_below.inhabitedBy.key == 'gargoyle'){
		gargoyle.tile_below.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
		healsprite_below = game.add.sprite(gargoyle.tile_below.x * 64, gargoyle.tile_below.y * 64, 'healsprite');
		healsprite_below.animations.add('idle', [0, 1, 2, 3, 4], 6, false).onComplete.add(function(){healsprite_below.destroy()});
		healsprite_below.play('idle');		
	}
	if(typeof gargoyle.tile_right.inhabitedBy != "undefined" && gargoyle.tile_right.inhabitedBy.key == 'gargoyle'){
		gargoyle.tile_right.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
		healsprite_right = game.add.sprite(gargoyle.tile_right.x * 64, gargoyle.tile_right.y * 64, 'healsprite');
		healsprite_right.animations.add('idle', [0, 1, 2, 3, 4], 6, false).onComplete.add(function(){healsprite_right.destroy()});
		healsprite_right.play('idle');
	}
	if(typeof gargoyle.tile_left.inhabitedBy != "undefined" && gargoyle.tile_left.inhabitedBy.key == 'gargoyle'){
		gargoyle.tile_left.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
		healsprite_left = game.add.sprite(gargoyle.tile_left.x * 64, gargoyle.tile_left.y * 64, 'healsprite');
		healsprite_left.animations.add('idle', [0, 1, 2, 3, 4], 6, false).onComplete.add(function(){healsprite_left.destroy()});
		healsprite_left.play('idle');
	}
	enemySpearmen.forEachAlive(function(enemy){
		enemyMovement(game, enemy);
	})
	gargoyle.souls -= 20;
}

function moveToNewRoom(game, direction){

	current_room = game.state.getCurrentState().key;
	switch(direction){
		case 'up':
			next_room = game.rnd.pick([2, 3]);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick([2, 3]);
			}
			break;

		case 'down':
			next_room = game.rnd.pick([1]);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick([1]);
			}
			break;

		case 'left':
			next_room = game.rnd.pick([1, 3]);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick([1, 3]);
			}
			break;

		case 'right':
			next_room = game.rnd.pick([2]);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick([2]);
			}
			break;
	}

	gargoyles.forEach(function(gargoyle){
		gargoyle.souls -= 35;
	})

	enemySpearmen.forEach(function(spearman){
		spearman.health -= 100;
	})

	game.state.start('tilemap0' + next_room, false, false, game, direction);
}	
