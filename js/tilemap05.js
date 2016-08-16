Game.tilemap05 = function(){};

Game.tilemap05.prototype = {
	init: function(game, direction){
		game.state.states['tilemap05'].direction = direction;
	},

	create: function(game){

		this.direction = game.state.states['tilemap05'].direction;

		// Initialization of the tileset
		map = this.add.tilemap('tilemap05', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);

		// Initialization of shadows

		// Initialization of gargoyles

		if(this.direction == 'down') {
			var n = 0;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 0*64 + 32);
				gargoyleIterable.x = (((n%3))*64) + 5*64 + 32;
				gargoyleIterable.rotation = Math.PI/2;
				n += 1;
			})
		} else if(this.direction == 'up') {
			var n = 0;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 9*64 + 32);
				gargoyleIterable.x = (((n%3))*64) + 5*64 + 32;
				gargoyleIterable.rotation = 0;
				n += 1;
			})
		}

		game.world.bringToTop(dropped_souls);
		game.world.bringToTop(ectoplasm);
		game.world.bringToTop(gargoyle_indicator);
		game.world.bringToTop(gargoyles);

		// Initialization of enemies

		initEnemySpearman(game, 5*64, 6*64, Math.PI);			// Currently a spearman, maybe a stronger enemy in future?
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