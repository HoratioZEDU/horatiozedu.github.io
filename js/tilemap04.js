Game.tilemap04 = function(){};

Game.tilemap04.prototype = {
	init: function(game, direction){
		game.state.states['tilemap04'].direction = direction;
	},

	create: function(game){

		this.direction = game.state.states['tilemap04'].direction;

		// Initialization of the tileset
		map = this.add.tilemap('tilemap04', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);

		// Initialization of shadows
		game.add.sprite(10*64, 0*64, 'shadow_right');
		game.add.sprite(10*64, 1*64, 'shadow_right');
		game.add.sprite(10*64, 2*64, 'shadow_right');
		game.add.sprite(10*64, 3*64, 'shadow_right');
		game.add.sprite(7*64, 4*64, 'shadow_right');
		game.add.sprite(7*64, 5*64, 'shadow_right');
		game.add.sprite(11*64, 6*64, 'shadow_right');
		game.add.sprite(11*64, 7*64, 'shadow_right');
		game.add.sprite(11*64, 8*64, 'shadow_right');
		game.add.sprite(11*64, 9*64, 'shadow_right');
		game.add.sprite(60, 4*64, 'shadow_left');
		game.add.sprite(60, 5*64, 'shadow_left');
		game.add.sprite(60, 6*64, 'shadow_left');
		game.add.sprite(60, 7*64, 'shadow_left');
		game.add.sprite(60, 8*64, 'shadow_left');

		// Initialization of gargoyles

		if(this.direction == 'right') {
			var n = 0;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.x = ((game.math.snapToFloor((n%3), 3)*64) + 0*64 + 32);
				gargoyleIterable.y = (((n%3))*64) + 1*64 + 32;
				gargoyleIterable.rotation = Math.PI/2;
				n += 1;
			})
		} else if(this.direction == 'up') {
			var n = 0;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 9*64 + 32);
				gargoyleIterable.x = (((n%3))*64) + 8*64 + 32;
				gargoyleIterable.rotation = 0;
				n += 1;
			})
		} else if(this.direction == 'down'){
			var n = 0;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 0*64 + 32);
				gargoyleIterable.x = (((n%3))*64) + 7*64 + 32;
				gargoyleIterable.rotation = Math.PI;
				n += 1;
			})
		}

		game.world.bringToTop(dropped_souls);
		game.world.bringToTop(ectoplasm);
		game.world.bringToTop(gargoyle_indicator);
		game.world.bringToTop(gargoyles);

		// Initialization of enemies

		initEnemyHeadboi(game, 10*64, 3*64, Math.PI);
		initEnemyHeadboi(game, 8*64, 3*64, Math.PI);
		initEnemyHeadboi(game, 7*64, 6*64, Math.PI);
		initEnemyHeadboi(game, 7*64, 8*64, Math.PI);
		game.world.bringToTop(enemyHeadboi);
		game.world.bringToTop(enemySpearmen);

		// Initialization of controls
		initControls(game);

		// Initialization of the User Interface
		//initUI(game);
	},

	update: function(game){
		for (i = 0; i < gargoyles.children.length; i++){
			gargoyleOccupation(game, gargoyles.children[i]);
		}
		for (i = 0; i < enemySpearmen.children.length; i++){
			enemyOccupation(game, enemySpearmen.children[i]);
		}
		for (i = 0; i < enemyHeadboi.children.length; i++){
			enemyOccupation(game, enemyHeadboi.children[i]);
		}
	}
}