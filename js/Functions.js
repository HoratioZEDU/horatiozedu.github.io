var selected_gargoyle = 1;
var still = true;
var direction;
var actionTimer = 0;
var spells = ['defensive_stance', 'opportunistic_stance', 'heavy_stance', 'sacrificial_stance', 'healing_spell'];//, 'teleport_spell', 'illusory_spell'];
var help_text;
var text_launched = false;

function initGargoyle(game, x, y){
	gargoyles.create(x + 32, y + 32, 'gargoyle', 0, true);
	gargoyles.setAll('anchor.x', '0.5');
	gargoyles.setAll('anchor.y', '0.5');
	gargoyles.setAll('str', 2, false, false, 0, true);
	gargoyles.setAll('intel', 5, false, false, 0, true);
	gargoyles.setAll('defense', 0, false, false, 0, true);
	gargoyles.setAll('base_defense', 0, false, false, 0, true);
	gargoyles.setAll('opportunism', false, false, false, 0, true);
	gargoyles.setAll('maxhp', 50, false, false, 0, true);
	gargoyles.setAll('souls', 100, false, false, 0, true);
	gargoyles.setAll('max_souls', 100, false, false, 0, true);
	gargoyles.setAll('health', 50);
	gargoyles.setAll('protectedflag', false, false, false, 0, true);
	gargoyles.callAll('animations.add', 'animations', 'die', [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], 10, false);
	gargoyles.callAll('animations.add', 'animations', 'punch', [1, 2, 3, 0], 5, false);
}

function initEnemySpearman(game, x, y, rotation){
	enemySpearmen.create(x + 32, y + 32, 'enemy_spearman');
	enemySpearmen.setAll('anchor.x', '0.5');
	enemySpearmen.setAll('anchor.y', '0.5');
	enemySpearmen.setAll('health', '30');
	enemySpearmen.setAll('damage', 15);
	enemySpearmen.setAll('rotation', rotation);
	enemySpearmen.callAll('animations.add', 'animations', 'punch', [20, 21, 22, 23, 26, 27, 28, 29], 10, false);
	enemySpearmen.callAll('animations.add', 'animations', 'die', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 9, false);
}

function initEnemyHeadboi(game, x, y, rotation){
	enemyHeadboi.create(x + 32, y + 32, 'enemy_headboi');
	enemyHeadboi.setAll('anchor.x', '0.5');
	enemyHeadboi.setAll('anchor.y', '0.5');
	enemyHeadboi.setAll('health', '40');
	enemyHeadboi.setAll('damage', 10);
	enemyHeadboi.setAll('rotation', rotation);
	enemyHeadboi.callAll('animations.add', 'animations', 'punch', [1, 2, 3, 4, 5], 9, false);
	enemyHeadboi.callAll('animations.add', 'animations', 'die', [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 10, false);
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
	controls.spell1.onDown.add(function(){moveMarker(game, gargoyle_spells.getChildAt(0+4*(gargoyles.getIndex(gargoyle))), gargoyle)});
	controls.spell2.onDown.add(function(){moveMarker(game, gargoyle_spells.getChildAt(1+4*(gargoyles.getIndex(gargoyle))), gargoyle)});
	controls.spell3.onDown.add(function(){moveMarker(game, gargoyle_spells.getChildAt(2+4*(gargoyles.getIndex(gargoyle))), gargoyle)});
	controls.spell4.onDown.add(function(){moveMarker(game, gargoyle_spells.getChildAt(3+4*(gargoyles.getIndex(gargoyle))), gargoyle)});
	controls.firespell.onDown.add(function(){shootSpell(game, gargoyle, gargoyle.activeSpell)});
	controls.kill.onDown.add(function(){gargoyle.health -= 5})  								// THIS IS ALSO FOR DEBUGGING

}

function initUI(game){
	game.add.sprite(852, 0, 'hud_background').sendToBack();

	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		gargoyle_id = gargoyles.getIndex(gargoyle_ofinterest);
		gargoyle_buttons.addChild(game.add.button(884, 85 + 85*(gargoyle_id), (gargoyle_id+1).toString() + '_button', function(){
			gargoyleSelected(game, gargoyle_ofinterest);
		}, 1, 1, 0, 1));
		gargoyle_ofinterest.hp_bar = game.add.graphics(983, 87 + 85*(gargoyle_id));
		gargoyle_ofinterest.hp_bar.beginFill(0xcc0000);
		gargoyle_ofinterest.hp_bar.drawRect(0, 0, 50*3, 8);
		gargoyle_ofinterest.hp_bar.endFill();
		gargoyle_ofinterest.soul_bar = game.add.graphics(983, 101 + 85*(gargoyle_id));
		gargoyle_ofinterest.soul_bar.beginFill(0x6600cc);
		gargoyle_ofinterest.soul_bar.drawRect(0, 0, 50*3, 8);
		gargoyle_ofinterest.soul_bar.endFill();
		gargoyle_hp_bars.addChild(gargoyle_ofinterest.hp_bar);
		gargoyle_icons.addChild(game.add.sprite(960, 84 + 85*(gargoyle_id), 'hp_icon'));
		gargoyle_soul_bars.addChild(gargoyle_ofinterest.soul_bar);
		gargoyle_icons.addChild(game.add.sprite(960, 100 + 85*(gargoyle_id), 'soul_icon'));
		gargoyle_ui_bg.addChild(game.add.sprite(880, 83 + 85*(gargoyle_id), 'hud_overlay'));
		generateSpells(game, gargoyle_ofinterest);
		gargoyle_spells.addChild(game.add.button(986, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell1, function(){
			// spellSelected(game, gargoyle, 1);
		}));
		gargoyle_spells.addChild(game.add.button(1023, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell2, function(){
			// spellSelected(game, gargoyle, 2);
		}));
		gargoyle_spells.addChild(game.add.button(1060, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell3, function(){
			// spellSelected(game, gargoyle, 3);
		}));
		gargoyle_spells.addChild(game.add.button(1099, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell4, function(){
			// spellSelected(game, gargoyle, 4);
		}));
		gargoyle_ofinterest.select_marker = game.add.sprite(986, 114 + 85*(gargoyle_id), 'select_marker');
		gargoyle_select_marker.add(gargoyle_ofinterest.select_marker);
		gargoyle_ofinterest.indicator = game.add.sprite(gargoyle_ofinterest.x - 39, gargoyle_ofinterest.y -39, 'gargoyle_selected')
		gargoyle_ofinterest.indicator.visible = false;
	})
	gargoyle_spells.setAll('help_text', game.add.text(), false, false, 0, true);
}

function spell_information(gargoyle){
	spell_info = {
		'defensive_stance':"Stance of Steel\nThis gargoyle assumes a defensive\nstance, reducing all damage taken by 14.",
		'sacrificial_stance':"Stance of Sacrifice\nThe selected gargoyle takes damage on\nbehalf of its adjacent allies.",
		'opportunistic_stance':"Stance of Opportunism\nThis gargoyle exploits its enemies' weak\nspots, dealing extra damage to targets\nfacing away from it.",
		'healing_spell':"Healing Spell\nThis gargoyle drains 20 of its own souls\nto repair " + (25+gargoyle.intel).toString() + "-" + (25+gargoyle.intel*2).toString() + " HP to adjacent gargoyles.",
		'heavy_stance':"Stance of Kindling\nThe gargoyle stands still to carefully\nkindle a flame, multiplying damage dealt\non its next attack."
	}
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
		gargoyle.health = 0;
		actionTimer = game.time.now + 1000;
		gargoyle.animations.play('die').onComplete.add(function(){gargoyleDead(game, gargoyle)});
	}

	if(gargoyle.souls >= gargoyle.max_souls){
		gargoyle.souls = gargoyle.max_souls;
	}

	if(gargoyle.protecting == true){
		if(gargoyle.tile_above != null && typeof gargoyle.tile_above.inhabitedBy != "undefined" && gargoyle.tile_above.inhabitedBy != null){
			if(gargoyle.tile_above.inhabitedBy.protectedflag == false){
				gargoyle.tile_above.inhabitedBy.protectedflag = true;
				gargoyle.tile_above.inhabitedBy.protectedBy = gargoyle;
			}
		}
		if(gargoyle.tile_below != null && typeof gargoyle.tile_below.inhabitedBy != "undefined" && gargoyle.tile_below.inhabitedBy != null){
			if(gargoyle.tile_below.inhabitedBy.protectedflag == false){
				gargoyle.tile_below.inhabitedBy.protectedflag = true;
				gargoyle.tile_below.inhabitedBy.protectedBy = gargoyle;
			}
		}
		if(gargoyle.tile_right != null && typeof gargoyle.tile_right.inhabitedBy != "undefined" && gargoyle.tile_right.inhabitedBy != null){
			if(gargoyle.tile_right.inhabitedBy.protectedflag == false){
				gargoyle.tile_right.inhabitedBy.protectedflag = true;
				gargoyle.tile_right.inhabitedBy.protectedBy = gargoyle;
			}
		}
		if(gargoyle.tile_left != null && typeof gargoyle.tile_left.inhabitedBy != "undefined" && gargoyle.tile_left.inhabitedBy != null){
			if(gargoyle.tile_left.inhabitedBy.protectedflag == false){
				gargoyle.tile_left.inhabitedBy.protectedflag = true;
				gargoyle.tile_left.inhabitedBy.protectedBy = gargoyle;
			}
		}
	}
	
	// gargoyle.hp_bar.context.clearRect(0, 0, gargoyle.hp_bar.width, gargoyle.hp_bar.height);
	// gargoyle.hp_bar.context.fillStyle = '#cc0000';
	// gargoyle.hp_bar.context.fillRect(0, 0, gargoyle.health*3, 8);
	
	gargoyle.hp_bar.clear();
	gargoyle.hp_bar.beginFill(0xcc0000);
	gargoyle.hp_bar.drawRect(0, 0, (gargoyle.health/gargoyle.maxhp)*150, 8);
	gargoyle.hp_bar.endFill();
	
	gargoyle.soul_bar.clear();
	gargoyle.soul_bar.beginFill(0x6600cc);
	gargoyle.soul_bar.drawRect(0, 0, gargoyle.souls*3/2, 8);
	gargoyle.soul_bar.endFill();

	if(gargoyle.souls<=0){
		actionTimer = game.time.now + 1000;
		gargoyle.animations.play('die').onComplete.add(function(){gargoyleDead(game, gargoyle)});
	}

	gargoyle_spells.forEachAlive(function(spell_icon){
		gargoyle_ofinterest = gargoyles.getChildAt(game.math.snapToFloor(gargoyle_spells.getIndex(spell_icon) / 4, 1));
		spell_information(gargoyle_ofinterest);		// Gargoyle specific now
		if(spell_icon.input.pointerOver() && spell_icon.help_text.text == "" && gargoyle_ofinterest.frame == 0){
			spell_icon.help_background = game.add.sprite(880, 10, 'infotext_background');
			spell_icon.help_text = game.add.text(895, 20, spell_info[spell_icon.key], {fontSize: '12px', fill:'#999999'});
		}
		if(spell_icon.input.pointerOut()){
			if(spell_icon.help_text.text != ""){
				spell_icon.help_text.text = "";
				spell_icon.help_background.visible = false;
			} 
		}
		if(spell_icon.input.pointerDown() && spell_icon.input.pointerOver()){
			moveMarker(game, spell_icon, gargoyles.getChildAt(game.math.snapToFloor(gargoyle_spells.getIndex(spell_icon) / 4, 1)));
		}
		if(gargoyle_ofinterest.frame != 0 && spell_icon.help_text.text != ""){
			spell_icon.help_text.text = "";
			spell_icon.help_background.visible = false;
		}
 	});

	dropped_souls.forEachAlive(function(soul){
		if(gargoyle.current_tile == map.getTile(game.math.snapToFloor(soul.x, 64) / 64, game.math.snapToFloor(soul.y, 64) / 64, 0)){   			// Picking up souls
			soul.destroy();
			gargoyle.souls += soul.soul_value;
			game.add.audio('soulpickup').play();
		}
	});

	ectoplasm.forEachAlive(function(soul){																										// Picking up ectoplasm
		if(gargoyle.current_tile == map.getTile(game.math.snapToFloor(soul.x, 64) / 64, game.math.snapToFloor(soul.y, 64) / 64, 0)){
			soul.destroy();
			gargoyle.souls += soul.soul_value;
			game.add.audio('soulpickup').play();
			switch(soul.stat_type){
				case 2:
					gargoyle.intel += 2;
					soul.ectoplasm_text = game.add.text(300, 400, "+2 Intelligence", {fontSize:'32px'});
					break;
				case 1:
					gargoyle.str += 3;
					soul.ectoplasm_text = game.add.text(300, 400, "+3 Strength", {fontSize:'32px'});
					break;
				case 0: 
					gargoyle.maxhp += 10;
					gargoyle.health += 10;
					soul.ectoplasm_text = game.add.text(300, 400, "+10 Max Health", {fontSize:'32px'});
					break;
			}
			soul.collected_ectoplasm = game.add.sprite(300, 200, "collected_ectoplasm");
			soul.collected_ectoplasm.frame = soul.stat_type;
			soul.collected_ectoplasm.timer = game.time.events.add(1000, function(){soul.ectoplasm_text.destroy();soul.collected_ectoplasm.destroy();}, this);
			actionTimer = game.time.now + 1000;
		}
	})

	if(gargoyle.health >= gargoyle.maxhp){
		gargoyle.health = gargoyle.maxhp;
	}

	if(typeof gargoyle.kindlesprite != "undefined"){
		if(gargoyle.kindlesprite.visible == true){
			gargoyle.kindlesprite.x = gargoyle.x;
			gargoyle.kindlesprite.y = gargoyle.y;
			gargoyle.kindlesprite.anchor.x = 0.5;
			gargoyle.kindlesprite.anchor.y = 0.5;
			gargoyle.kindlesprite.frame = (gargoyle.heavy_iterable+1)*2
			console.log(gargoyle.kindlesprite.frame);
			if(gargoyle.kindlesprite.animations.frame >= 6){
				gargoyle.kindlesprite.rotation = gargoyle.rotation;
			} else {
				gargoyle.kindlesprite.rotation = 0;
			}
		}
	}

	gargoyle.indicator.x = gargoyle.x - 39
	gargoyle.indicator.y = gargoyle.y - 39;
}

function moveMarker(game, spell_destination, gargoyle_ofinterest){
	gargoyle_id = gargoyles.getIndex(gargoyle_ofinterest);
	marker = gargoyle_ofinterest.select_marker;
	marker.x = spell_destination.x;
	spell_selected = (gargoyle_spells.getIndex(spell_destination) % 4) + 1;
	spellSelected(game, gargoyle_ofinterest, spell_selected);
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

function gargoyleDead(game, gargoyleGood){
	gargoyleGood.destroy();
	gargoyleGood.current_tile.occupied = false;
	gargoyleGood.current_tile.inhabitedBy = null;
	gargoyleGood.indicator.visible = false;
	gargoyle_select_marker.removeAll(true);
	gargoyle_buttons.removeAll(true);
	gargoyle_hp_bars.removeAll(true);
	gargoyle_soul_bars.removeAll(true);
	gargoyle_ui_bg.removeAll(true);
	gargoyle_icons.removeAll(true);
	gargoyle_spells.removeAll(true);
	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		gargoyle_id = gargoyles.getIndex(gargoyle_ofinterest);
		gargoyle_buttons.addChild(game.add.button(884, 85 + 85*(gargoyle_id), (gargoyle_id+1).toString() + '_button', function(){
			gargoyleSelected(game, gargoyle_ofinterest);
		}, 1, 1, 0, 1));
		gargoyle_ofinterest.hp_bar = game.add.graphics(983, 87 + 85*(gargoyle_id));
		gargoyle_ofinterest.hp_bar.beginFill(0xcc0000);
		gargoyle_ofinterest.hp_bar.drawRect(0, 0, 50*3, 8);
		gargoyle_ofinterest.hp_bar.endFill();
		gargoyle_ofinterest.soul_bar = game.add.graphics(983, 101 + 85*(gargoyle_id));
		gargoyle_ofinterest.soul_bar.beginFill(0x6600cc);
		gargoyle_ofinterest.soul_bar.drawRect(0, 0, 50*3, 8);
		gargoyle_ofinterest.soul_bar.endFill();
		gargoyle_hp_bars.addChild(gargoyle_ofinterest.hp_bar);
		gargoyle_icons.addChild(game.add.sprite(960, 84 + 85*(gargoyle_id), 'hp_icon'));
		gargoyle_soul_bars.addChild(gargoyle_ofinterest.soul_bar);
		gargoyle_icons.addChild(game.add.sprite(960, 100 + 85*(gargoyle_id), 'soul_icon'));
		gargoyle_ui_bg.addChild(game.add.sprite(880, 83 + 85*(gargoyle_id), 'hud_overlay'));
		gargoyle_spells.addChild(game.add.button(986, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell1, function(){
			spellSelected(game, gargoyle, gargoyle_ofinterest.spell1);
		}));
		gargoyle_spells.addChild(game.add.button(1023, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell2, function(){
			spellSelected(game, gargoyle, gargoyle_ofinterest.spell2);
		}));
		gargoyle_spells.addChild(game.add.button(1060, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell3, function(){
			spellSelected(game, gargoyle, gargoyle_ofinterest.spell3);
		}));
		gargoyle_spells.addChild(game.add.button(1099, 114 + 85*(gargoyle_id), gargoyle_ofinterest.spell4, function(){
			spellSelected(game, gargoyle, gargoyle_ofinterest.spell4);
		}));
		switch(gargoyle_ofinterest.activeSpell){
			case gargoyle_ofinterest.spell2:
				gargoyle_ofinterest.select_marker = game.add.sprite(1023, 114 + 85*(gargoyle_id), 'select_marker');
				break;
			case gargoyle_ofinterest.spell3:
				gargoyle_ofinterest.select_marker = game.add.sprite(1060, 114 + 85*(gargoyle_id), 'select_marker');
				break;
			case gargoyle_ofinterest.spell4:
				gargoyle_ofinterest.select_marker = game.add.sprite(1099, 114 + 85*(gargoyle_id), 'select_marker');
				break;
			default:
				gargoyle_ofinterest.select_marker = game.add.sprite(986, 114 + 85*(gargoyle_id), 'select_marker');
		}
		gargoyle_select_marker.add(gargoyle_ofinterest.select_marker);
		//gargoyleSelected(game, gargoyle_ofinterest);
	})
	gargoyle_spells.setAll('help_text', game.add.text(), false, false, 0, true);
	if(gargoyles.children.length == 0){
		game.state.start('MainMenu');
	}
	if(gargoyle == gargoyleGood && gargoyles.children.length != 0){
		gargoyleSelected(game, gargoyles.getChildAt(0));
	} else if(gargoyles.children.length != 0) {
		gargoyleSelected(game, gargoyle);
	}

	// game.world.filters = [game.add.filter('BlurX'), game.add.filter('BlurY')];
}

function enemyDead(game, enemy){
	switch(enemy.key){
		case 'enemy_spearman':
			if(game.rnd.integerInRange(0, 2) == 0){
				enemy.current_tile.inhabitedBy = ectoplasm.addChild(game.add.sprite(enemy.x - 32, enemy.y - 32, 'ectoplasmpickup'));
				enemy.current_tile.inhabitedBy.stat_type = game.rnd.integerInRange(0, 2);
				enemy.current_tile.inhabitedBy.frame = enemy.current_tile.inhabitedBy.stat_type;
				enemy.current_tile.inhabitedBy.soul_value = game.rnd.integerInRange(8, 12);
			} else {
				enemy.current_tile.inhabitedBy = dropped_souls.addChild(game.add.sprite(enemy.x - 8, enemy.y - 8, 'soulpickup'));
				enemy.current_tile.inhabitedBy.soul_value = game.rnd.integerInRange(13, 17);
			}
			break;
		case 'enemy_headboi':
			if(game.rnd.integerInRange(0, 2) == 0){
				enemy.current_tile.inhabitedBy = ectoplasm.addChild(game.add.sprite(enemy.x - 32, enemy.y - 32, 'ectoplasmpickup'));
				enemy.current_tile.inhabitedBy.stat_type = game.rnd.integerInRange(0, 2);
				enemy.current_tile.inhabitedBy.frame = enemy.current_tile.inhabitedBy.stat_type;
				enemy.current_tile.inhabitedBy.soul_value = game.rnd.integerInRange(10, 14);
			} else {
				enemy.current_tile.inhabitedBy = dropped_souls.addChild(game.add.sprite(enemy.x - 8, enemy.y - 8, 'soulpickup'));
				enemy.current_tile.inhabitedBy.soul_value = game.rnd.integerInRange(18, 22);
			}
			break;
	}
	enemy.destroy();
	enemy.current_tile.occupied = false;
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

	// gargoyles.forEachAlive(function(gargoyle){
	// 	if(gargoyle.heavy_iterable >= 0 && gargoyle.heavy_iterable < 5){gargoyle.heavy_iterable+=1/gargoyles.children.length; console.log(gargoyle.heavy_iterable)}
	// })

	if(closest_gargoyle == enemy_tile_above.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage, enemy.damage + 5);		// Punch up
		if(enemy_tile_above.inhabitedBy.protectedflag == true){
			enemy_tile_above.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_above.inhabitedBy.health -= enemy.damage - enemy_tile_above.inhabitedBy.defense;
		}
		enemy.rotation = 0;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
		game.time.events.add(300, function(){game.add.audio('attack').play();}, this);
	} else if(closest_gargoyle == enemy_tile_below.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage, enemy.damage + 5);		// Punch down
		if(enemy_tile_below.inhabitedBy.protectedflag == true){
			enemy_tile_below.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_below.inhabitedBy.health -= enemy.damage - enemy_tile_below.inhabitedBy.defense;
		}
		enemy.rotation = Math.PI;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
		game.time.events.add(300, function(){game.add.audio('attack').play();}, this);
	} else if(closest_gargoyle == enemy_tile_left.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage, enemy.damage + 5);		// Punch left
		if(enemy_tile_left.inhabitedBy.protectedflag == true){
			enemy_tile_left.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_left.inhabitedBy.health -= enemy.damage - enemy_tile_left.inhabitedBy.defense;
		}
		enemy.rotation = 3*Math.PI/2;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
		game.time.events.add(300, function(){game.add.audio('attack').play();}, this);
	} else if(closest_gargoyle == enemy_tile_right.inhabitedBy){
		enemy.damage = game.rnd.integerInRange(enemy.damage, enemy.damage + 5);		// Punch right
		if(enemy_tile_right.inhabitedBy.protectedflag == true){
			enemy_tile_right.inhabitedBy.protectedBy.health -= enemy.damage / 5;
		} else {
			enemy_tile_right.inhabitedBy.health -= enemy.damage - enemy_tile_right.inhabitedBy.defense;
		}
		enemy.rotation = Math.PI/2;
		enemy.animations.play('punch').onComplete.add(function(){enemy.frame = 0});
		game.time.events.add(300, function(){game.add.audio('attack').play();}, this);
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
	gargoyle.current_tile.occupied = false;
	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		if(gargoyle_ofinterest.heavy_iterable >= 0 && gargoyle_ofinterest.heavy_iterable < 3){
			gargoyle_ofinterest.heavy_iterable+=1; 
			console.log(gargoyle_ofinterest.heavy_iterable)
		}
	});
	if(gargoyle.tile_above==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'up')}
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}													// Making sure gargoyle.gargoyle_tween is defined																			// Checking if you're sauntering off into the inky blackness
	if(gargoyle.tile_above!=null){
		if((typeof gargoyle.tile_above.occupied == "undefined" || gargoyle.tile_above.occupied == false) && gargoyle.tile_above.index<=8 && gargoyle.gargoyle_tween.isRunning == false){			// Screaming, just screaming
			gargoyle.gargoyle_tween = game.add.tween(gargoyle);
			gargoyle.gargoyle_tween.onComplete.add(function(){
				map.getTileBelow(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
				map.getTileBelow(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
			})
			gargoyle.gargoyle_tween.to({y:(gargoyle.tile_above.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
			gargoyle.rotation = 0;
			game.add.audio('movement').play();
		} 
		if(gargoyle.tile_above.occupied = true && gargoyle.tile_above.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){			// Attacking
			gargoyle.animations.play('punch');
			if(gargoyle.opportunism == true && gargoyle.tile_above.inhabitedBy.rotation != Math.PI){
				gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
			} else if(gargoyle.heavy_iterable>=1){
				gargoyle.damage = 20*(1 + gargoyle.heavy_iterable/2) + game.rnd.integerInRange(-5, gargoyle.str * 2 * gargoyle.heavy_iterable);
			} else {
				gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
			}
			gargoyle.tile_above.inhabitedBy.health -= gargoyle.damage;
			gargoyle.rotation = 0;
			gargoyle.current_tile.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
		if(gargoyle.gargoyle_tween.isRunning==true){																			// Enemy movement
			gargoyle.tile_above.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
}

function movement_down(game, gargoyle){
	gargoyle.current_tile.occupied = false;
	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		if(gargoyle_ofinterest.heavy_iterable >= 0 && gargoyle_ofinterest.heavy_iterable < 3){
			gargoyle_ofinterest.heavy_iterable+=1; 
			console.log(gargoyle_ofinterest.heavy_iterable
		)}
	});
	if(gargoyle.tile_below==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'down')}
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}
	if(gargoyle.tile_below!= null){
		if((typeof gargoyle.tile_below.occupied == "undefined" || gargoyle.tile_below.occupied == false) && gargoyle.tile_below.index<=8 && gargoyle.gargoyle_tween.isRunning == false){
			gargoyle.gargoyle_tween = game.add.tween(gargoyle);
			gargoyle.gargoyle_tween.onComplete.add(function(){
				map.getTileAbove(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
				map.getTileAbove(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
			})
			gargoyle.gargoyle_tween.to({y:(gargoyle.tile_below.y * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
			gargoyle.rotation = Math.PI;
			game.add.audio('movement').play();
		}
		if(gargoyle.tile_below.occupied = true && gargoyle.tile_below.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){
			gargoyle.animations.play('punch');
			if(gargoyle.opportunism == true && gargoyle.tile_below.inhabitedBy.rotation != 0){
				gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
			} else {
				gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
			}
			gargoyle.tile_below.inhabitedBy.health -= gargoyle.damage;
			gargoyle.rotation = Math.PI;
			gargoyle.current_tile.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
		if(gargoyle.gargoyle_tween.isRunning==true){
			gargoyle.tile_below.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
}

function movement_right(game, gargoyle){
	gargoyle.current_tile.occupied = false;
	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		if(gargoyle_ofinterest.heavy_iterable >= 0 && gargoyle_ofinterest.heavy_iterable < 3){
			gargoyle_ofinterest.heavy_iterable+=1; 
			console.log(gargoyle_ofinterest.heavy_iterable
		)}
	});
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}
	if(gargoyle.tile_right==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'right')}
	if(gargoyle.tile_right!=null){
		if((typeof gargoyle.tile_right.occupied == "undefined" || gargoyle.tile_right.occupied == false) && gargoyle.tile_right.index<=8 && gargoyle.gargoyle_tween.isRunning == false){
			gargoyle.gargoyle_tween = game.add.tween(gargoyle);
			gargoyle.gargoyle_tween.onComplete.add(function(){
				map.getTileLeft(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
				map.getTileLeft(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
			})
			gargoyle.gargoyle_tween.to({x:(gargoyle.tile_right.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
			gargoyle.rotation = Math.PI/2;
			game.add.audio('movement').play();
		}
		if(gargoyle.tile_right.occupied = true && gargoyle.tile_right.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){
			gargoyle.animations.play('punch');
			if(gargoyle.opportunism == true && gargoyle.tile_right.inhabitedBy.rotation != 3*Math.PI/2){
				gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
				console.log(gargoyle.damage);
			} else {
				gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
			}
			gargoyle.tile_right.inhabitedBy.health -= gargoyle.damage;
			gargoyle.rotation = Math.PI/2;
			gargoyle.current_tile.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
		if(gargoyle.gargoyle_tween.isRunning==true){
			gargoyle.tile_right.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
	}
	if(gargoyle.heavy_iterable >= 0){gargoyle.heavy_iterable=0}
	gargoyle.current_tile.inhabitedBy = null;
}

function movement_left(game, gargoyle){
	gargoyle.current_tile.occupied = false; 
	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		if(gargoyle_ofinterest.heavy_iterable >= 0 && gargoyle_ofinterest.heavy_iterable < 3){
			gargoyle_ofinterest.heavy_iterable+=1; 
			console.log(gargoyle_ofinterest.heavy_iterable
		)}
	});
	if(gargoyle.tile_left==null && gargoyle.gargoyle_tween.isRunning == false){moveToNewRoom(game, 'left')}
	if(typeof gargoyle.gargoyle_tween==="undefined"){gargoyle.gargoyle_tween = game.add.tween(gargoyle);}
	if(gargoyle.tile_left!=null){
		if((typeof gargoyle.tile_left.occupied == "undefined" || gargoyle.tile_left.occupied == false) && gargoyle.tile_left.index<=8 && gargoyle.gargoyle_tween.isRunning == false){	
			gargoyle.gargoyle_tween = game.add.tween(gargoyle);
			gargoyle.gargoyle_tween.onComplete.add(function(){
				map.getTileRight(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).occupied = false;
				map.getTileRight(0, game.math.snapToFloor(gargoyle.x, 64) / 64, game.math.snapToFloor(gargoyle.y, 64) / 64).inhabitedBy = null;
			})
			gargoyle.gargoyle_tween.to({x:(gargoyle.tile_left.x * 64) + 32}, 600, Phaser.Easing.Linear.None, true, 0);
			gargoyle.rotation = 3*Math.PI/2
			game.add.audio('movement').play();
		}
		if(gargoyle.tile_left.occupied = true && gargoyle.tile_left.inhabitedBy!=null && gargoyle.gargoyle_tween.isRunning == false){
			gargoyle.animations.play('punch');
			if(gargoyle.opportunism == true && gargoyle.tile_left.inhabitedBy.rotation != Math.PI/2){
				gargoyle.damage = 30 + game.rnd.integerInRange(5, gargoyle.str * 3);
			} else {
				gargoyle.damage = 20 + game.rnd.integerInRange(-5, gargoyle.str * 2);
			}
			gargoyle.tile_left.inhabitedBy.health -= gargoyle.damage;
			gargoyle.rotation = 3*Math.PI/2;
			gargoyle.current_tile.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
		if(gargoyle.gargoyle_tween.isRunning==true){
			gargoyle.tile_left.occupied = true;
			enemySpearmen.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
			enemyHeadboi.forEachAlive(function(enemy){
				enemyMovement(game, enemy);
			})
		}
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

	gargoyleInteresting.indicator.visible = true;

	gargoyles.forEachAlive(function(gargoyle_ofinterest){
		if(gargoyle_ofinterest!=gargoyleInteresting){
			gargoyle_ofinterest.indicator.visible = false;
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

function spellSelected(game, gargoyle_ofinterest, spellCool){
	switch(spellCool){
		case 1:
			gargoyle_ofinterest.activeSpell = gargoyle_ofinterest.spell1;
			break;
		case 2:
			gargoyle_ofinterest.activeSpell = gargoyle_ofinterest.spell2;
			break;
		case 3:
			gargoyle_ofinterest.activeSpell = gargoyle_ofinterest.spell3;
			break;
		case 4:
			gargoyle_ofinterest.activeSpell = gargoyle_ofinterest.spell4;
			break;
	}
	console.log(gargoyle.activeSpell); 

	// TODO: add UI interaction here
	// gargoyle_ofinterest.select_marker.x = gargoyle_spells.getChildAt((spellCool - 1) + 4*gargoyles.getIndex(gargoyle)).x;   	//working, find a better solution
}

function shootSpell(game, gargoyle, spell){
	console.log(spell);
	switch(spell){
		case 'defensive_stance':
			if(game.time.now > actionTimer){
				actionTimer = game.time.now + 700;
				undoAllStances(game, gargoyle);
				gargoyle.defense = 13;
				defensive_sprite = game.add.sprite(gargoyle.x, gargoyle.y, 'defsprite');
				defensive_sprite.anchor.x = 0.5;
				defensive_sprite.anchor.y = 0.5;
				defensive_sprite.animations.add('idle', [0, 1, 2, 3, 4], 7, false).onComplete.add(function(){defensive_sprite.destroy()});
				defensive_sprite.play('idle');
				game.time.events.add(400, function(){game.add.audio('defensive_stance').play()}, this);
			}
			break;
		case 'opportunistic_stance':
			undoAllStances(game, gargoyle);
			gargoyle.opportunism = true;
			break;
		case 'heavy_stance':
			undoAllStances(game, gargoyle);
			gargoyle.heavy_iterable = 0;
			gargoyle.kindlesprite = game.add.sprite(gargoyle.x, gargoyle.y, 'kindlesprite');
			gargoyle.kindlesprite.animations.add('idle', [8, 9], 3, true);
			gargoyle.kindlesprite.anchor.x = 0.5;
			gargoyle.kindlesprite.anchor.y = 0.5;
			gargoyle.kindlesprite.frame = 1;
			break;
		case 'sacrificial_stance':
			undoAllStances(game, gargoyle);
			gargoyle.protecting = true;
			break;
		case 'healing_spell':
			if(game.time.now > actionTimer){actionTimer = game.time.now + 600;healspell(game, gargoyle);game.add.audio('heal_spell').play();};
			break;
	}
}

function undoAllStances(game, gargoyle){
	gargoyle.defense = gargoyle.base_defense;
	gargoyle.opportunism = false;
	if(gargoyle.heavy_iterable>=0){
		gargoyle.kindlesprite.destroy();
	}
	gargoyle.heavy_iterable = -1;
	gargoyle.protecting = false;
}

function healspell(game, gargoyle){
	if(gargoyle.tile_above!=null){
		if(typeof gargoyle.tile_above.inhabitedBy != "undefined" && gargoyle.tile_above.inhabitedBy != null && gargoyle.tile_above.inhabitedBy.key == 'gargoyle'){
			gargoyle.tile_above.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
			healsprite_above = game.add.sprite(gargoyle.tile_above.x * 64, gargoyle.tile_above.y * 64, 'healsprite');
			healsprite_above.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 9, false).onComplete.add(function(){healsprite_above.destroy()});
			healsprite_above.play('idle');
		}
	}
	if(gargoyle.tile_below!=null){
		if(typeof gargoyle.tile_below.inhabitedBy != "undefined" && gargoyle.tile_below.inhabitedBy != null && gargoyle.tile_below.inhabitedBy.key == 'gargoyle'){
			gargoyle.tile_below.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
			healsprite_below = game.add.sprite(gargoyle.tile_below.x * 64, gargoyle.tile_below.y * 64, 'healsprite');
			healsprite_below.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 9, false).onComplete.add(function(){healsprite_below.destroy()});
			healsprite_below.play('idle');		
		}
	}
	if(gargoyle.tile_right!=null){
		if(typeof gargoyle.tile_right.inhabitedBy != "undefined" && gargoyle.tile_right.inhabitedBy != null && gargoyle.tile_right.inhabitedBy.key == 'gargoyle'){
			gargoyle.tile_right.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
			healsprite_right = game.add.sprite(gargoyle.tile_right.x * 64, gargoyle.tile_right.y * 64, 'healsprite');
			healsprite_right.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 9, false).onComplete.add(function(){healsprite_right.destroy()});
			healsprite_right.play('idle');
		}
	}
	if(gargoyle.tile_left!=null){
		if(typeof gargoyle.tile_left.inhabitedBy != "undefined" && gargoyle.tile_left.inhabitedBy != null && gargoyle.tile_left.inhabitedBy.key == 'gargoyle'){
			gargoyle.tile_left.inhabitedBy.health += 25 + game.rnd.integerInRange(gargoyle.intel, gargoyle.intel*2);
			healsprite_left = game.add.sprite(gargoyle.tile_left.x * 64, gargoyle.tile_left.y * 64, 'healsprite');
			healsprite_left.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 9, false).onComplete.add(function(){healsprite_left.destroy()});
			healsprite_left.play('idle');
		}
	}
	enemySpearmen.forEachAlive(function(enemy){
		enemyMovement(game, enemy);
	})
	enemyHeadboi.forEachAlive(function(enemy){
		enemyMovement(game, enemy);
	})
	gargoyle.souls -= 20;
}

function moveToNewRoom(game, direction){
	current_room = game.state.getCurrentState().key;
	uprooms = [2, 3];
	downrooms = [1];
	leftrooms = [1, 3];
	rightrooms = [2];
	switch(direction){
		case 'up':
			next_room = game.rnd.pick(uprooms);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick(uprooms);
			}
			break;

		case 'down':
			next_room = game.rnd.pick(downrooms);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick(downrooms);
			}
			break;

		case 'left':
			next_room = game.rnd.pick(leftrooms);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick(leftrooms);
			}
			break;

		case 'right':
			next_room = game.rnd.pick(rightrooms);
			while('tilemap0'+next_room==current_room){
				next_room = game.rnd.pick(rightrooms);
			}
			break;
	}

	gargoyles.forEach(function(gargoyle){
		gargoyle.souls -= 25;
	})

	enemySpearmen.removeAll(true);

	enemyHeadboi.removeAll(true);

	ectoplasm.removeAll(true);

	dropped_souls.removeAll(true);

	game.state.start('tilemap0' + next_room, false, false, game, direction);
}	
