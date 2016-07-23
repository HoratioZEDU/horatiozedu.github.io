Game.Preload = function(){
	this.preloadBar = null;
};

Game.Preload.prototype = {
	preload: function() {
		//Logo rendering
		//this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		//this.splash.anchor.setTo(0.5);

		//Preload bar rendering
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY + 25, 'preloader');
		this.preloadBar.anchor.setTo(0.5);
		this.time.advancedTiming = true;
		this.load.setPreloadSprite(this.preloadBar);

		//Asset loading
		this.load.tilemap('map', 'assets/maps/level1.csv');
		this.load.image('tileset', 'assets/brownblock.png');
		this.load.image('player', 'assets/blackblock.png');
		this.load.spritesheet('buttons', 'assets/button_sprite_sheet.png', 193, 71);
	},

	create: function() {
		//Pass the torch to MainMenu
		this.game.state.start('MainMenu');
	}
};



//ACTUAL MENU BELOW



Game.ActualMenu = function(){};

var button;

Game.ActualMenu.prototype = {
	create: function() {

		buttons = this.add.button(this.world.centerX -95, this.world.centerY + 200, 'buttons', 
								  function(){
								  	this.game.state.start('ActualMenu');
								  },this,2,1,0);

	}
}

//MAIN MENU "FILE" BELOW

/*


Game.MainMenu = function(){};

var map;
var layer;

var player;
var controls = {};
var playerSpeed = 350; 
var jumpTimer = 0;

///var button;

Game.MainMenu = {
	preload: function() {

	},

	create: function() {
		//Background color definition
		this.stage.backgroundColor = '#d3d3d3';

		//Map initialization
		map = this.add.tilemap('map', 50, 50)
		map.addTilesetImage('tileset');
		layer = map.createLayer(0);
		layer.resizeWorld();

		//Collision/Physics 
		this.physics.arcade.gravity.y = 1400;
		map.setCollisionBetween(0,0);

		//Set player
		player = this.add.sprite(100,560, 'player');
		player.anchor.setTo(0.5,0.5);
		//player.animations.add('runRight',[6, 7, 8, 9], 5, true);
		//player.animations.add('runLeft',[0, 1, 2, 3], 5, true);
		this.physics.arcade.enable(player);
		this.camera.follow(player);
		player.body.collideWorldBounds = true;

		//Set controls
		controls = {
			right: this.input.keyboard.addKey(Phaser.Keyboard.A),
			left: this.input.keyboard.addKey(Phaser.Keyboard.D),
			up: this.input.keyboard.addKey(Phaser.Keyboard.W),
			down: this.input.keyboard.addKey(Phaser.Keyboard.S),
		}

		//button = this.add.button(this.world.centerX - 95, this.world.centerY + 200, 
		//						'buttons', function(){
		//							console.log("ay");
		//						},this,2,1,0);

	},
	update: function() {
		//Collision
		this.physics.arcade.collide(player,layer);

		//player.body.velocity.x = 0;
		//player.body.velocity.y = 0;
		if(Math.abs(player.body.velocity.x) >= playerSpeed*2){
			player.body.velocity.x = playerSpeed*2*(player.body.velocity.x/Math.abs(player.body.velocity.x));
		}
		if(Math.abs(player.body.velocity.y) >= playerSpeed*2){
			player.body.velocity.y = playerSpeed*2*(player.body.velocity.y/Math.abs(player.body.velocity.y));
		}
		player.body.allowGravity = false;
		player.body.bounce.set(0.8)

		if(controls.right.isDown){
		//	player.animations.play('runRight');
			player.body.velocity.x -= playerSpeed;
		}

		if(controls.left.isDown){
		//	player.animations.play('runLeft');
			player.body.velocity.x += playerSpeed;
		}

		if(controls.up.isDown){
			player.body.velocity.y -= playerSpeed;
		}

		if(controls.down.isDown){
			player.body.velocity.y += playerSpeed;
		}
	}
}; */