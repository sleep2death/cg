import Hammer from 'hammerjs'

export default class Character extends Phaser.State {
  preload() {
    this.load.atlasJSONHash('wulu_run_00', 'assets/wulu_run_00.png', 'assets/wulu_run_00.json')
    this.load.atlasJSONHash('wulu_staff_run_00', 'assets/wulu_staff_run_00.png', 'assets/wulu_staff_run_00.json')

    this.title = this.add.bitmapText(2, 2, 'pixel', 'loading...', 8)
    this.title.alpha = 0.6
  }

  create() {
    this.initMultitouch()

    this.characterName = 'wulu'
    this.animationName = 'run_00'
    this.weaponName = 'staff'

    this.title.text = `${this.characterName} ${this.animationName} ${this.weaponName}`

    this.character = this.game.add.group()

    this.character.body = this.game.add.sprite(0, 0, null, null, this.character)
    this.character.body.loadTexture(`${this.characterName}_${this.animationName}`)
    this.character.body.anchor.setTo(0.5, 0.5)

    this.character.weapon = this.game.add.sprite(0, 0, `${this.characterName}_${this.weaponName}_${this.animationName}`, null, this.character)
    this.character.weapon.anchor.setTo(0.5, 0.5)

    this.initAnimations()

    this.game.scale.onSizeChange.add(this.onResizeCallback, this)
    this.onResizeCallback()
  }

  initAnimations() {
    this.animationDirections = [0, 1, 2, 3, 4, 3, 2, 1]
    this.dirIndex = 0

    for (let i = 0; i < this.animationDirections.length; i++) {
      this.character.body.animations.add(this.animationName + i, Phaser.Animation.generateFrameNames(this.animationDirections[i], 0, 9, '', 4))
      this.character.weapon.animations.add(this.animationName + i, Phaser.Animation.generateFrameNames(this.animationDirections[i], 0, 9, '', 4))
    }

    this.refresh()
  }

  initMultitouch() {
    const stage = document.getElementById('content')
    const mc = new Hammer(stage)

    mc.get('swipe').set({direction: Hammer.DIRECTION_ALL})
    mc.on('swipeleft', () => {
      this.dirIndex = this.dirIndex < this.animationDirections.length - 1 ? this.dirIndex + 1 : 0
      this.refresh()
    })

    mc.on('swiperight', () => {
      this.dirIndex = this.dirIndex > 0 ? this.dirIndex - 1 : this.animationDirections.length - 1
      this.refresh()
    })
  }

  refresh() {
    if (this.dirIndex > 4) {
      this.character.scale.x = -1
    } else {
      this.character.scale.x = 1
    }

    this.character.body.animations.play(this.animationName + this.dirIndex, 18, true)
    this.character.weapon.animations.play(this.animationName + this.dirIndex, 18, true)
  }

  onResizeCallback() {
    this.character.x = this.game.width * 0.5
    this.character.y = this.game.height * 0.5
  }
}
