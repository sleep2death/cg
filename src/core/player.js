export default class Player {
  constructor(game) {
    this.id = -1
    this.game = game

    this.init()
  }

  init() {
    this.game.make.group(0, 0)
  }
}
