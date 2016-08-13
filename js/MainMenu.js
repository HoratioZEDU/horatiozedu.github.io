Game.MainMenu = function(){};

Game.MainMenu.prototype = {
	create: function(){
		//Main menu buttons + text
		titleText = this.game.add.text(395, 75, "Set in Stone", {fontSize: '72px', fill:'#fff'});
		startButton = this.add.button(this.world.centerX - 143, 225, 'start_button', function(){
			this.game.state.start('tilemap01', true, false, this.game, 'new');
		},this,1,0,2);
	}
};