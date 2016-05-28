// create the game instance
import preload from './states/preload-state'

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'content')

game.state.add('preload', preload, false)
game.state.start('preload')
