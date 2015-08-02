let game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'game');

let resizeGame = () => {
  let height = window.innerHeight || 
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  let width = window.innerWidth || 
    document.documentElement.clientWidth || 
    document.body.clientWidth;
    
  game.width = width;
  game.height = height;
  game.stage.bounds.width = width;
  game.stage.bounds.height = height;
    
  if(game.renderType === Phaser.WEBGL) {
    game.renderer.resize(width, height);
  }
};

window.onresize = resizeGame;