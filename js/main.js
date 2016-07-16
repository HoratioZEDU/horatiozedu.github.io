
// Initialization of everything
var Meaty = Meaty || {};

Meaty.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');


Meaty.game.state.add('Boot', Meaty.Boot);
Meaty.game.state.add('Preload', Meaty.Preload);
Meaty.game.state.add('MainMenu', Meaty.MainMenu);
Meaty.game.state.start('Boot');


