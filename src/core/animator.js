export default class Animatior {
  constructor(game) {
    this.game = game
    this.create()
  }

  create(bKey, wKey) {
    this.display = this.game.make.group()

    // create body sprite by sheet name
    this.body = this.game.add.sprite(0, 0, bKey, null, this.display)
    this.body.anchor.setTo(0.5, 0.5)

    // create weapon sprite by sheet name
    this.weapon = this.game.add.sprite(0, 0, wKey, null, this.display)
    this.weapon.anchor.setTo(0.5, 0.5)
  }
}
