Game.tilemap01 = function(){};

Game.tilemap01.prototype = {
	create: function(game){

		// Initialization of the tileset
		map = this.add.tilemap('tilemap01', 64, 64);
		map.addTilesetImage('tileset');
		map.addTilesetImage('walls', null, 64, 64, 0, 0, 8)
		layer = map.createLayer(0);


		// Initialization of the player
		initGargoyle(game, true, 384, 512, 1);
		initGargoyle(game, true, 64, 64, 2);

		// Initialization of controls
		initControls(game);

		// Initialization of the User Interface
		initUI(game);
	},

	update: function(game){
		gargoyleMovement(game, gargoyles[selected_gargoyle]);
	}
}