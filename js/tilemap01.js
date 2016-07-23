Game.tilemap01 = function(){};

Game.tilemap01.prototype = {
	create: function(game){

		// Initialization of the tileset
		map = this.add.tilemap('tilemap01', 64, 64);
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);
		game.add.sprite(852, 0, 'hud_background');

		// Initialization of the player
		initGargoyle(game, true, 384, 512, 1);

		// Initialization of controls
		initControls(game);
	},

	update: function(game){
		gargoyleMovement(game, gargoyles[1]);
	}
}