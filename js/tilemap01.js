Game.tilemap01 = function(){};

Game.tilemap01.prototype = {
	init: function(game, direction){
		game.state.states['tilemap01'].direction = direction;
	},

	create: function(game){

		this.direction = game.state.states['tilemap01'].direction;

		// Initialization of the tileset
		map = this.add.tilemap('tilemap01', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);

		// Initialization of shadows
		game.add.sprite(708, 64, 'shadow_right');
		game.add.sprite(708, 128, 'shadow_right');
		game.add.sprite(708, 192, 'shadow_right');
		game.add.sprite(708, 256, 'shadow_right');
		game.add.sprite(708, 5*64, 'shadow_right');
		game.add.sprite(60, 64, 'shadow_left');
		game.add.sprite(60, 128, 'shadow_left');
		game.add.sprite(60, 192, 'shadow_left');
		game.add.sprite(60, 256, 'shadow_left');
		game.add.sprite(60, 5*64, 'shadow_left');
		game.add.sprite(60, 6*64, 'shadow_left');
		game.add.sprite(60, 7*64, 'shadow_left');
		game.add.sprite(60, 8*64, 'shadow_left');

		// Initialization of the gargoyles+first time setup
		if(this.direction=='new'){
			gargoyle_indicator = game.add.group();
			gargoyles = game.add.group();
			gargoyle_buttons = game.add.group();
			gargoyle_hp_bars = game.add.group();
			gargoyle_soul_bars = game.add.group();
			gargoyle_ui_bg = game.add.group();
			gargoyle_icons = game.add.group();
			gargoyle_spells = game.add.group();
			gargoyle_select_marker = game.add.group();
			dropped_souls = game.add.group();
			ectoplasm = game.add.group();
			enemySpearmen = game.add.group();
			initGargoyle(game, 5*64, 512);
			initGargoyle(game, 6*64, 512);
			initGargoyle(game, 7*64, 512);
			initUI(game);						 				// Manage UI on a case-by-case basis when each gargoyle dies/is gained!! Do not constantly check, it breaks it!
			gargoyleSelected(game, gargoyles.getChildAt(0));
		}
		if(this.direction == 'left') {
			var n = 1;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.x = ((game.math.snapToFloor((n%3), 3)*64) + 12*64 + 32);
				gargoyleIterable.y = (((n%3))*-64) + 512 + 32;
				gargoyleIterable.rotation = 3*Math.PI/2;
				n += 1;
			})
		} else if(this.direction == 'down') {
			var n = 1;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 0*64 + 32);
				gargoyleIterable.x = (((n%3))*-64) + 7*64 + 32;
				gargoyleIterable.rotation = Math.PI;
				n += 1;
			})
		}

		game.world.bringToTop(dropped_souls);

		game.world.bringToTop(gargoyles);

		// Initialization of enemies
		initEnemySpearman(game, 6*64, 5*64, Math.PI);
		initEnemySpearman(game, 4*64, 1*64, Math.PI);
		initEnemySpearman(game, 8*64, 1*64, Math.PI);

		game.world.bringToTop(enemySpearmen);

		// Initialization of controls
		initControls(game);	
	},

	update: function(game){
		for (i = 0; i < gargoyles.children.length; i++){
			gargoyleOccupation(game, gargoyles.children[i]);
		}
		for (i = 0; i < enemySpearmen.children.length; i++){
			enemyOccupation(game, enemySpearmen.children[i]);
		}
	}
}