export default class Boot extends Phaser.State {
  preload() {
    this.load.json('config', 'assets/config.json')
  }

  create() {
    this.game.config = this.game.cache.getJSON('config')

    this.game.scale.scalemode = Phaser.ScaleManager.RESIZE
    this.game.renderer.renderSession.roundPixels = true

    $(window).resize(this.resize.bind(this))
    this.game.state.start('menu')
    this.game.stage.backgroundColor = 0x7A7A7A
  }

  resize() {
      // get the window size
    const height = $(window).height()
    const width = $(window).width()

    this.game.scale.setGameSize(width, height)

    // this.game.canvas.width = width
    // this.game.canvas.height = height

    if (this.game.renderType === Phaser.WEBGL) {
      this.game.renderer.resize(width, height)
    }

    // this.game.scale.width = width
    // this.game.scale.height = height

    this.game.camera.setBoundsToWorld()
  }
}
