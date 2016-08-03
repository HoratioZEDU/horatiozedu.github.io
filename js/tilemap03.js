Game.tilemap03 = function(){};

Game.tilemap03.prototype = {
	init: function(game, direction){
		game.state.states['tilemap03'].direction = direction;
	},

	create: function(game){

		this.direction = game.state.states['tilemap03'].direction;

		// Initialization of the tileset
		map = this.add.tilemap('tilemap03', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);

		// Initialization of shadows
		game.add.sprite(708, 64, 'shadow_right');
		game.add.sprite(708, 128, 'shadow_right');
		game.add.sprite(708, 192, 'shadow_right');
		game.add.sprite(708, 7*64, 'shadow_right');
		game.add.sprite(708, 8*64, 'shadow_right');
		game.add.sprite(5*64, 1*64, 'shadow_right');
		game.add.sprite(5*64, 2*64, 'shadow_right');
		game.add.sprite(5*64, 5*64, 'shadow_right');
		game.add.sprite(5*64, 6*64, 'shadow_right');
		game.add.sprite(5*64, 7*64, 'shadow_right');
		game.add.sprite(4*64, 8*64, 'shadow_right');
		game.add.sprite(4*64, 9*64, 'shadow_right');
		game.add.sprite(4*64, 10*64, 'shadow_right');
		game.add.sprite(60, 64, 'shadow_left');
		game.add.sprite(60, 128, 'shadow_left');
		game.add.sprite(60, 192, 'shadow_left');
		game.add.sprite(60, 256, 'shadow_left');
		game.add.sprite(60, 5*64, 'shadow_left');
		game.add.sprite(60, 6*64, 'shadow_left');
		game.add.sprite(60, 7*64, 'shadow_left');
		game.add.sprite(60, 8*64, 'shadow_left');
		game.add.sprite(7*64 - 4, 1*64, 'shadow_left');
		game.add.sprite(7*64 - 4, 2*64, 'shadow_left');
		game.add.sprite(8*64 - 4, 5*64, 'shadow_left');
		game.add.sprite(8*64 - 4, 6*64, 'shadow_left');
		game.add.sprite(8*64 - 4, 7*64, 'shadow_left');
		game.add.sprite(9*64 - 4, 8*64, 'shadow_left');

		// Initialization of gargoyles

		if(this.direction == 'left') {
			var n = 1;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.x = ((game.math.snapToFloor((n%3), 3)*64) + 12*64 + 32);
				gargoyleIterable.y = (((n%3))*-64) + 6*64 + 32;
				gargoyleIterable.rotation = 3*Math.PI/2;
				n += 1;
			})
		} else if(this.direction == 'up') {
			var n = 1;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 9*64 + 32);
				gargoyleIterable.x = (((n%3))*-64) + 4*64 + 32;
				gargoyleIterable.rotation = 0;
				n += 1;
			})
		}

		game.world.bringToTop(dropped_souls);

		game.world.bringToTop(gargoyles);

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
	}
}