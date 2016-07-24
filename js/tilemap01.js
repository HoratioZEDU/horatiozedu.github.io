Game.tilemap01 = function(){};

Game.tilemap01.prototype = {
	init: function(game, newgame, direction){
		game.state.states['tilemap01'].direction = direction;
		if (newgame == true){
			initGargoyle(game, true, 7*64, 512, 1);
			Game.gargoyles[1].bringToTop();
			initGargoyle(game, true, 6*64, 512, 2);
			Game.gargoyles[2].bringToTop();
			initGargoyle(game, true, 5*64, 512, 3);
			Game.gargoyles[3].bringToTop();
		}
	},

	create: function(game){

		this.direction = game.state.states['tilemap01'].direction;

		// Initialization of the tileset
		map = this.add.tilemap('tilemap01', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);

		// Initialization of the gargoyles
		
		for (i=0; i < Object.keys(Game.gargoyles).length; i++){

			// Sorting the gargoyles and making them show up properly 
			game.add.existing(Game.gargoyles[(i+1).toString()])
			Game.gargoyles[(i+1).toString()].bringToTop();
			Game.gargoyles[(i+1).toString()].anchor.setTo(0.5);

			// Setting directions for which door they're coming out of
			if(this.direction == 'left'){ // ---------- Left section
				Game.gargoyles[(i+1).toString()].x = ((game.math.snapToFloor((i%3), 3)*64) + 12*64 + 32);
				Game.gargoyles[(i+1).toString()].y = (((i%3))*-64)+ 512 + 32;
				Game.gargoyles[(i+1).toString()].rotation = 3*Math.PI/2;
			} else if (this.direction == 'down'){ // ---------- Down section
				Game.gargoyles[(i+1).toString()].y = ((game.math.snapToFloor((i%3), 3)*64) + 32);
				Game.gargoyles[(i+1).toString()].x = (i*-64)+ 512 - 64 + 32;
				Game.gargoyles[(i+1).toString()].rotation = Math.PI;
			}
		}

		// Initialization of controls
		initControls(game);

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

		// Initialization of the User Interface
		initUI(game);
	},

	update: function(game){
		gargoyleMovement(game, Game.gargoyles[selected_gargoyle], 1);
	}
}