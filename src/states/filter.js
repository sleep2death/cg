 /*"20000.png": {
        "rotated": false,
        "trimmed": true,
        "frame": {
                "x": 0,
                "y": 0,
                "w": 111,
                "h": 143
              },
        "spriteSourceSize": {
                "x": 257,
                "y": 244,
                "w": 111,
                "h": 143
              },
        "sourceSize": {
                "w": 615,
                "h": 615
              }
              },
              "30001.png": {
                    "rotated": false,
                          "trimmed": true,
                                "frame": {
                                        "x": 103,
                                        "y": 143,
                                        "w": 95,
                                        "h": 152
                                      },
                                "spriteSourceSize": {
                                        "x": 258,
                                        "y": 247,
                                        "w": 95,
                                        "h": 152
                                      },
                                            "sourceSize": {
                                                    "w": 615,
                                                    "h": 615
                                                  }
                                          },

 */
export default class Filter extends Phaser.State {
  preload() {
    this.load.image('baseSprite', 'assets/feite/body_run.png')
    this.load.image('alphaSprite', 'assets/feite/body_run_a.png')
    this.load.script('Blur', './filters/pixi/AlphaMaskFilter.js')
  }

  create() {
    const oW = 615
    const oH = 615
    const oX = 258
    const oY = 247

    const x = 103
    const y = 143
    const w = 95
    const h = 152

    const b = this.game.add.sprite(0, 0, 'baseSprite')
    b.anchor.setTo(0.5, 0.5)
    b.x = b.y = 200
    b.scale.x = -1

    const a = this.game.make.sprite(0, 0, 'alphaSprite')

    const filter = new PIXI.AlphaMaskFilter(a.texture, -(-oX + x + (oW * 0.5)) - b.x, 512 - h - (oH - h) + oY - y - (oH * 0.5) + b.y, false)
    const frame = new Phaser.Frame(0, x, y, w, h)
    // frame.setTrim(true, 615, 615, 254, 244, 111, 143)

    frame.setTrim(true, oW, oH, oX, oY, 111, 143)

    b.setFrame(frame)
    // b.scale.x = -1

    b.filters = [filter]

    // console.log(b.width)
  }
}
