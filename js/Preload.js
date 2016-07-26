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
		this.load.spritesheet('start_button', 'assets/spritesheets/start_button.png', 286, 106);
		this.load.spritesheet('gargoyle', 'assets/spritesheets/gargoyle.png', 78, 78, 28);
		this.load.spritesheet('1_button', 'assets/spritesheets/1_button.png', 64, 64, 2);
		this.load.spritesheet('2_button', 'assets/spritesheets/2_button.png', 64, 64, 2);
		this.load.spritesheet('3_button', 'assets/spritesheets/3_button.png', 64, 64, 2);
		//this.load.spritesheet('enemy_spearman', 'assets/spritesheets/spearman.png', 71, 79, 5);
		this.load.image('tileset', 'assets/maps/tileset.png');
		this.load.image('hud_background', 'assets/images/hud_background.png');
		this.load.image('shadow_right', 'assets/images/shadow1.png');
		this.load.image('shadow_left', 'assets/images/shadow2.png');
		this.load.image('hp_bar', 'assets/images/hp_bar.png');
		this.load.image('back_bar', 'assets/images/hud_back_bar.png');
		this.load.image('soul_bar', 'assets/images/hud_souls.png');
		this.load.tilemap('tilemap01', 'assets/maps/tilemap01.csv');
		this.load.tilemap('tilemap02', 'assets/maps/tilemap02.csv');
		this.load.tilemap('tilemap03', 'assets/maps/tilemap03.csv');

	}, 

	create: function(){
		this.game.state.start('MainMenu');
	}
};