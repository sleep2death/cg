import Hammer from 'hammerjs'

export default class Viewer extends Phaser.State {
  preload() {
    this.load.spritesheet('icons', 'assets/rpg_icons.png', 34, 34) // load the rpg icons for character and weapon select
    this.title = this.add.bitmapText(2, 2, 'pixel', 'loading...', 8)
  }

  create() {
    this.initHammer()

    this.title.text = ''

    this.createWeaponButtons()

    this.game.scale.onSizeChange.add(this.onResizeCallback, this)
    this.onResizeCallback()
  }

  refresh() {
  }

  // create weapon switch buttons
  createWeaponButtons() {
    this.weaponBtns = this.add.group()

    this.btnBackground = this.make.graphics()
    this.weaponBtns.addChild(this.btnBackground)

    this.weapons = [
      {name: 'sword', icon: 76},
      {name: 'spear', icon: 115},
      {name: 'axe', icon: 141},
      {name: 'bow', icon: 155},
      {name: 'staff', icon: 134},
      {name: 'fist', icon: 99}
    ]

    for (let i = 0; i < this.weapons.length; ++i) {
      const btn = this.make.button(i * 50, 10, 'icons', this.onWeaponClick, this)
      btn.frame = this.weapons[i].icon
      btn.name = this.weapons[i].name

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
  }

  // create gesture input manager
  initHammer() {
    const stage = document.getElementById('content')
    const mc = new Hammer(stage)

    mc.get('swipe').set({direction: Hammer.DIRECTION_ALL})
    mc.on('swipeleft', () => {
      // this.dirIndex = this.dirIndex < this.animationDirections.length - 1 ? this.dirIndex + 1 : 0
      this.refresh()
    })

    mc.on('swiperight', () => {
      // this.dirIndex = this.dirIndex > 0 ? this.dirIndex - 1 : this.animationDirections.length - 1
      this.refresh()
    })
  }

  onResizeCallback() {
    this.weaponBtns.x = (this.game.width - this.weaponBtns.width) * 0.5
  }
}
