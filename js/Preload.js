Game.Preload = function(){
	this.preloadBar = null;
};

Game.Preload.prototype = {
	preload: function(){

		// Preload bar rendering
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY + 25, 'preloader');
		this.preloadBar.anchor.setTo(0.5);
		this.time.advancedTiming = true;
		this.load.setPreloadSprite(this.preloadBar);

		// Loading assets
		this.load.spritesheet('start_button', 'assets/spritesheets/start_button.png', 196, 91);
		this.load.spritesheet('gargoyle', 'assets/spritesheets/gargoyle.png', 78, 78);
		this.load.image('tileset', 'assets/maps/tileset.png');
		this.load.image('hud_background', 'assets/images/hud_background.png');
		this.load.tilemap('tilemap01', 'assets/maps/tilemap01.csv');

	}, 

	create: function(){
		this.game.state.start('MainMenu');
	}
};