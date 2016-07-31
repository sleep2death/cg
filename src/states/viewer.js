import Hammer from 'hammerjs'
import Player from '../core/player'

export default class Viewer extends Phaser.State {
  preload() {
    this.load.spritesheet('icons', 'assets/rpg_icons.png', 34, 34) // load the rpg icons for character and weapon select
    this.title = this.add.bitmapText(2, 2, 'pixel', 'loading...', 8)
  }

  create() {
    this.initHammer()

    this.title.text = ''

    this.currentWeapon = 'sword'
    this.currentMove = 'attack'
    this.currentCharacter = 'feite'

    this.createWeaponButtons()

    this.player = new Player(this.game)

    this.game.scale.onSizeChange.add(this.onResizeCallback, this)
    this.onResizeCallback()
  }

  update() {
    this.player.update()
  }

  refresh() {
    this.player.loadTexture(this.currentCharacter, this.currentWeapon, this.currentMove)
  }

  // create weapon switch buttons
  createWeaponButtons() {
    this.weaponBtns = this.add.group()

    this.btnBackground = this.make.graphics()
    this.weaponBtns.addChild(this.btnBackground)

    for (let i = 0; i < Player.weapons.length; ++i) {
      const btn = this.make.button(i * 50, 10, 'icons', this.onWeaponClick, this)

      btn.frame = Player.weapons[i].icon
      btn.name = Player.weapons[i].name

      this.weaponBtns.add(btn)
    }
  }

  onWeaponClick(context) {
    this.btnBackground.clear()

    this.btnBackground.lineStyle(1, 0xAAAAAA, 1)
    this.btnBackground.beginFill(0x333333, 1)
    this.btnBackground.drawRoundedRect(context.x, context.y, 34, 34, 4)
    this.btnBackground.endFill()

    this.currentWeapon = context.name
    this.refresh()
  }

  // create gesture input manager
  initHammer() {
    const stage = document.getElementById('content')
    const mc = new Hammer(stage)

    mc.get('swipe').set({direction: Hammer.DIRECTION_ALL})
    mc.on('swipeleft', () => {
      // this.dirIndex = this.dirIndex < this.animationDirections.length - 1 ? this.dirIndex + 1 : 0
      this.player.nextDir(1)
    })

    mc.on('swiperight', () => {
      // this.dirIndex = this.dirIndex > 0 ? this.dirIndex - 1 : this.animationDirections.length - 1
      this.player.nextDir(-1)
    })
  }

  onResizeCallback() {
    this.weaponBtns.x = (this.game.width - this.weaponBtns.width) * 0.5
    this.player.setPos(this.game.width * 0.5, this.game.height * 0.5)
  }
}
