import yaml from 'js-yaml'

export default class Player {
  constructor(game) {
    this.game = game

    this.init()
  }

  init() {
    this.group = this.game.add.group()

    // body's sprite
    this.body = this.game.add.sprite(0, 0, null, null, this.group)

    // weapon's sprite
    this.weapon = this.game.add.sprite(0, 0, null, null, this.group)
  }

  loadTexture(character, weapon, move) {
    this.loader = new Phaser.Loader(this.game)
    this.loader.image('Body', `assets/${character}/body/${move}/${move}.png`, true)
    this.loader.text('BodyMeta', `assets/${character}/body/${move}/${move}.png.meta`, true)

    const res = Player.weapons.find(w => {
      return w.name === weapon
    })
    const index = Player.weapons.indexOf(res) + 1

    this.loader.image('Weapon', `assets/${character}/weapon/${index}/${move}/${move}.png`, true)
    this.loader.text('WeaponMeta', `assets/${character}/weapon/${index}/${move}/${move}.png.meta`, true)

    this.loader.onLoadComplete.addOnce(() => {
      this.body.loadTexture('Body')
      this.weapon.loadTexture('Weapon')

      const meta = yaml.load(this.game.cache.getText('WeaponMeta'))
      console.log(meta)
    })

    this.loader.start()
  }
}

Player.weapons = [
  {name: 'sword', icon: 76},
  {name: 'spear', icon: 115},
  {name: 'axe', icon: 141},
  {name: 'bow', icon: 155},
  {name: 'staff', icon: 134},
  {name: 'fist', icon: 99}
]

