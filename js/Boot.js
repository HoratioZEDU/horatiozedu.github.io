var Game = {};

Game.Boot = function(){};

//Loading the loading screen

Game.Boot.prototype = {

	init: function() {
		this.input.maxPointers = 1;

		this.stage.disableVisibilityChange = true;
	},

	//Assets we need for the loading screen
	preload: function() {
		this.load.image('logo', 'assets/diamond.png');
		this.load.image('preloader', 'assets/redblock.png');
	},

	create: function() {
		//Pass the torch to preload
		this.state.start('Preload');
	}
};