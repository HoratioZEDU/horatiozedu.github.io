Game.tilemap02 = function(){};

Game.tilemap02.prototype = {
	init: function(game, direction){
		game.state.states['tilemap02'].direction = direction;
	},

	create: function(game){

		this.direction = game.state.states['tilemap02'].direction;

		// Initialization of the tileset
		map = this.add.tilemap('tilemap02', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);

		// Initialization of the Game.gargoyles
		// for (i=0; i < Object.keys(Game.gargoyles).length; i++){

		// 	// Sorting the gargoyles and making them show up properly 
		// 	game.add.existing(Game.gargoyles[(i+1).toString()])
		// 	Game.gargoyles[(i+1).toString()].bringToTop();
		// 	Game.gargoyles[(i+1).toString()].anchor.setTo(0.5);

		// 	// Setting directions for which door they're coming out of
		// 	if(this.direction == 'right'){ // ---------- Right section
		// 		Game.gargoyles[(i+1).toString()].x = ((game.math.snapToFloor((i%3), 3)*64) + 32);
		// 		Game.gargoyles[(i+1).toString()].y = (i*-64)+ 512 + 32;
		// 		Game.gargoyles[(i+1).toString()].rotation = Math.PI/2;
		// 	} else if (this.direction == 'up'){ // ---------- Up section
		// 		Game.gargoyles[(i+1).toString()].y = ((game.math.snapToFloor((i%3), 3)*64) + 9*64 + 32);
		// 		Game.gargoyles[(i+1).toString()].x = (i*-64)+ 512 - 128 + 32;
		// 		Game.gargoyles[(i+1).toString()].rotation = 0;
		// 	}
		// }
		console.log(gargoyle_buttons);
		if(this.direction == 'right') {
			var n = 1;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.x = ((game.math.snapToFloor((n%3), 3)*64) + 0*64 + 32);
				gargoyleIterable.y = (((n%3))*-64) + 512 + 32;
				gargoyleIterable.rotation = Math.PI/2;
				n += 1;
			})
		} else if(this.direction == 'up') {
			var n = 1;
			gargoyles.forEach(function(gargoyleIterable){
				gargoyleIterable.y = ((game.math.snapToFloor((n%3), 3)*64) + 9*64 + 32);
				gargoyleIterable.x = (((n%3))*-64) + 6*64 + 32;
				gargoyleIterable.rotation = 0;
				n += 1;
			})
		}

		game.world.bringToTop(gargoyles);

		// Initialization of controls
		initControls(game);

		// Initialization of shadows
		game.add.sprite(708, 64, 'shadow_right');
		game.add.sprite(708, 128, 'shadow_right');
		game.add.sprite(708, 192, 'shadow_right');
		game.add.sprite(708, 256, 'shadow_right');
		game.add.sprite(708, 5*64, 'shadow_right');
		game.add.sprite(708, 6*64, 'shadow_right');
		game.add.sprite(708, 7*64, 'shadow_right');
		game.add.sprite(708, 8*64, 'shadow_right');
		game.add.sprite(60, 64, 'shadow_left');
		game.add.sprite(60, 128, 'shadow_left');
		game.add.sprite(60, 192, 'shadow_left');
		game.add.sprite(60, 256, 'shadow_left');
		game.add.sprite(60, 5*64, 'shadow_left');

		// Initialization of the User Interface
		//initUI(game);
	},

	update: function(game){
		for (i = 0; i < gargoyles.children.length; i++){
			gargoyleOccupation(game, gargoyles.children[i]);
		}
	}
}