Game.MainMenu = function(){};

Game.MainMenu.prototype = {
	create: function(){
		//Main menu buttons + text
		titleText = this.game.add.sprite(395, 50, "setinstone");
		startButton = this.add.button(this.world.centerX - 143, 225, 'start_button', function(){
			this.game.state.start('tilemap01', true, false, this.game, 'new');
		},this,1,0,2);
	}
};