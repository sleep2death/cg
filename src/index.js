// create the game instance
import boot from './states/boot'
import menu from './states/menu'
import viewer from './states/viewer'
import filter from './states/filter'

const game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, 'content')

game.state.add('boot', boot, false)
game.state.add('viewer', viewer, false)
game.state.add('menu', menu, false)
game.state.add('filter', filter, false)

game.state.start('boot')
