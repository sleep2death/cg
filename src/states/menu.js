export default class Menu extends Phaser.State {
  preload() {
    this.load.bitmapFont('pixel', 'assets/font.png', 'assets/font.fnt')
  }

  create() {
    // version info
    const title = this.add.bitmapText(2, 2, 'pixel', `Crossgate Toolset, version-${this.game.config.version}`, 8)
    title.alpha = 0.6

    this.createMenuBtns()

    // const g = this.add.graphics(0, 0, this.btnGroup)

    // g.beginFill(0x333333)
    // // g.lineStyle(1, 0xCCFFCC, 1)
    // g.drawRoundedRect(0, 0, 100, 40, 4)
    // g.endFill()

    // g.width = 100
    // g.height = 40

    // this.btnGroup.x = (this.game.canvas.width - 100) * 0.5
    // this.btnGroup.y = (this.game.canvas.height - 100) * 0.5

    // console.log('on Resize', this.btns.height)

    this.game.scale.onSizeChange.add(this.onResizeCallback.bind(this))
  }

  onResizeCallback() {
    // console.log('on Resize', this.btns.height)
    this.btns.x = (this.game.width - 200) * 0.5
    this.btns.y = (this.game.height - this.btns.height) * 0.5
  }

  createMenuBtns() {
    this.btns = this.add.graphics()
    this.btns.lineStyle(1, 0xCCFFCC, 1)

    const menu = ['character viewer', 'version control', 'system']
    for (let i = 0; i < menu.length; i++) {
      this.btns.drawRoundedRect(0, 60 * i, 200, 36, 4)
      const label = this.game.make.text(0, 60 * i, menu[i], {fill: '#FFF', fontSize: 12, boundsAlignH: 'center', boundsAlignV: 'middle'})
      label.setTextBounds(0, 0, 200, 36)
      label.hitArea = new Phaser.Rectangle(0, 0, 200, 36)
      label.inputEnabled = label.autoRound = true

      label.y = 60 * i

      label.events.onInputDown.add(this.nextState, this, 0, i)

      this.btns.addChild(label)
    }

    this.onResizeCallback()
  }

  nextState(target, pointer, index) {
    if (index === 0) {
      this.game.state.start('character')
    }
  }
}
