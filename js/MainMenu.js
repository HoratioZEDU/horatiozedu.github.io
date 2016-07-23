Game.MainMenu = function(){};

Game.MainMenu.prototype = {
	create: function(){
		//Main menu buttons + text
		titleText = this.game.add.text(125, 75, "risk of supergrim", {fontSize: '72px', fill:'#fff'});
		startButton = this.add.button(this.world.centerX - 98, 225, 'start_button', function(){
			this.game.state.start('tilemap0' + this.game.rnd.integerInRange(1, 1));
		},this,1,0,2);

	}
};