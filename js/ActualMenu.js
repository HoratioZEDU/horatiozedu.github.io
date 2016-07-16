Game.ActualMenu = function(){};

var button;

Game.ActualMenu.prototype = {
	create: function() {

		buttons = this.add.button(this.world.centerX -95, this.world.centerY + 200, 'buttons', 
								  function(){
								  	this.state.start('ActualMenu');
								  },this,2,1,0);

	}
}
