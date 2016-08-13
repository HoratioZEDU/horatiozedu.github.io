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
		this.load.spritesheet('enemy_spearman', 'assets/spritesheets/enemy_spearman.png', 80, 128, 30);
		this.load.spritesheet('enemy_headboi', 'assets/spritesheets/enemy_headboi.png', 128, 128, 22);
		this.load.spritesheet('healsprite', 'assets/spritesheets/healsprite.png', 64, 64, 8);
		this.load.spritesheet('defsprite', 'assets/spritesheets/defsprite.png', 64, 64, 5);
		this.load.spritesheet('kindlesprite', 'assets/spritesheets/kindlesprite.png', 128, 128, 10);
		this.load.spritesheet('ectoplasmpickup', 'assets/spritesheets/ectoplasm.png', 64, 64, 3);
		this.load.spritesheet('collected_ectoplasm', 'assets/spritesheets/collected_ectoplasm.png', 192, 192, 3);
		this.load.image('tileset', 'assets/maps/tileset.png');
		this.load.image('hud_background', 'assets/images/hud_background.png');
		this.load.image('infotext_background', 'assets/images/infotext_background.png');
		this.load.image('shadow_right', 'assets/images/shadow1.png');
		this.load.image('shadow_left', 'assets/images/shadow2.png');
		this.load.image('hud_overlay', 'assets/images/hud_overlay.png');
		this.load.image('hp_icon', 'assets/images/hp_icon.png');
		this.load.image('soul_icon', 'assets/images/soul_icon.png');
		this.load.image('soulpickup', 'assets/images/soul_icon.png');
		this.load.image('defensive_stance', 'assets/images/defensive_stance.png');
		this.load.image('healing_spell', 'assets/images/healing_spell.png');
		this.load.image('heavy_stance', 'assets/images/heavy_stance.png');
		this.load.image('opportunistic_stance', 'assets/images/opportunistic_stance.png');
		this.load.image('teleport_spell', 'assets/images/teleport_spell.png');
		this.load.image('sacrificial_stance', 'assets/images/sacrificial_stance.png');
		this.load.image('select_marker', 'assets/images/select_marker.png');
		this.load.image('gargoyle_selected', 'assets/images/gargoyle_selected.png');
		this.load.tilemap('tilemap01', 'assets/maps/tilemap01.csv');
		this.load.tilemap('tilemap02', 'assets/maps/tilemap02.csv');
		this.load.tilemap('tilemap03', 'assets/maps/tilemap03.csv');
		this.load.audio('movement', 'assets/audio/movement.ogg');
		this.load.audio('attack', 'assets/audio/attack.ogg');
		this.load.audio('soulpickup', 'assets/audio/soulpickup.ogg');
		this.load.audio('defensive_stance', 'assets/audio/defensive_stance.ogg');
		this.load.audio('heal_spell', 'assets/audio/heal.ogg');

	}, 

	create: function(){
		this.game.state.start('MainMenu');
	}
};