export default class Player {
  constructor(game) {
    this.game = game
    this.init()
  }

  init() {
    this.isReady = false
    this.currentFrame = 0
    this.currentDirIndex = 0

    this.group = this.game.add.group()

    // body's sprite
    this.bodyContainer = this.game.add.sprite(0, 0, null, null, this.group)

    // weapon's sprite
    this.weaponContainer = this.game.add.sprite(0, 0, null, null, this.group)
  }

  loadTexture(character, weapon, move) {
    this.isReady = false

    if (!this.character && !character) throw new Error('Character must be defined')
    if (!this.weapon && !weapon) this.weapon = 'empty'
    if (!this.move && !move) this.move = 'idle'

    this.character = character === undefined ? this.character : character
    this.weapon = weapon === undefined ? this.weapon : weapon
    this.move = move === undefined ? this.move : move

    console.log('Loading texture for player:', this.character, this.weapon, this.move)
    this.loadConfig()
  }

  loadConfig() {
    const configKey = `${this.character}_texture_config`
    const configPath = `./assets/${this.character}/config.json`

    this.loader = new Phaser.Loader(this.game)
    this.loader.resetLocked = true

    this.loader.json(configKey, configPath, false)
    this.loader.onLoadComplete.addOnce(() => {
      this.textureConfig = this.game.cache.getJSON(configKey)
      this.loadSprites()
    })

    this.loader.start()
  }

  loadSprites() {
    const config = this.textureConfig[this.weapon][this.move]

    const bodyPath = `./assets/${this.character}/${config.body}`.match(/(.+)_a$/)[1]
    const weaponPath = `./assets/${this.character}/${config.weapon}`

    this.bodyTexture = config.body
    this.weaponTexture = config.weapon

    this.loader.atlasJSONHash(this.bodyTexture, `${bodyPath}.png`, `${bodyPath}.json`, false)
    this.loader.atlasJSONHash(this.weaponTexture, `${weaponPath}.png`, `${weaponPath}.json`, false)

    this.loader.image(`${this.bodyTexture}_a`, `${bodyPath}_a.png`, false)
    this.loader.image(`${this.weaponTexture}_a`, `${weaponPath}_a.png`, false)

    this.loader.script('AlphaMask', './filters/pixi/AlphaMaskFilter.js')

    this.loader.onLoadComplete.addOnce(() => {
      this.bodyContainer.loadTexture(`${this.bodyTexture}`)
      this.weaponContainer.loadTexture(this.weaponTexture)

      const bodyAlphaTexture = this.game.make.image(0, 0, `${this.bodyTexture}_a`)
      this.bodyFilter = new PIXI.AlphaMaskFilter(bodyAlphaTexture.texture, 0, 0, 1.0)

      const weaponAlphaTexture = this.game.make.image(0, 0, `${this.weaponTexture}_a`)
      this.weaponFilter = new PIXI.AlphaMaskFilter(weaponAlphaTexture.texture, 0, 0, 1.0)

      this.initAnimation()
    })

    this.loader.start()
  }

  initAnimation() {
    if(this.move === 'idle' || this.move === 'run') {
      this.animationDirections = [0, 1, 2, 3, 4, 3, 2, 1, 0]
      this.dirNum = 5
    }else{
      this.animationDirections = [1, 3, 3, 1]
      this.dirNum = 2
    }
    this.dirIndex = 0
    this.animationName = `${this.bodyTexture}_${this.weaponTexture}`
    this.totalFrame = this.bodyContainer.animations.frameData.total / this.dirNum

    for (let i = 0; i < this.animationDirections.length; i++) {
      this.bodyContainer.animations.add(`${this.animationName}${i}`, Phaser.Animation.generateFrameNames(this.animationDirections[i], 0, this.totalFrame - 1, '.png', 4), null, true)
      this.weaponContainer.animations.add(`${this.animationName}${i}`, Phaser.Animation.generateFrameNames(this.animationDirections[i], 0, this.totalFrame - 1, '.png', 4), null, true)
    }

    this.bodyContainer.anchor.setTo(0.5, 0.5)
    this.weaponContainer.anchor.setTo(0.5, 0.5)

    // this.group.x = this.x <= 307.5 ? this.x : this.x - 307.5
    // this.group.y = this.y <= 307.5 ? this.y : this.y - 307.5

    this.group.x = this.x
    this.group.y = this.y

    this.bodyContainer.filters = [this.bodyFilter]
    this.weaponContainer.filters = [this.weaponFilter]

    this.isReady = true
  }

  update() {
    if(!this.isReady) return

    this.currentFrame ++
    if(this.currentFrame % 4 !== 0) return

    const dir = this.animationDirections[this.currentDirIndex]

    // console.log(this.currentDirIndex >= this.animationDirections.length * 0.5)
    if(this.currentDirIndex >= this.animationDirections.length * 0.5) {
      this.bodyContainer.scale.x = -1
      this.bodyFilter.flipped = -1
    }else{
      this.bodyContainer.scale.x = 1
    }

    this.bodyContainer.animations.currentAnim = this.bodyContainer.animations.getAnimation(`${this.animationName}${dir}`)
    this.weaponContainer.animations.currentAnim = this.weaponContainer.animations.getAnimation(`${this.animationName}${dir}`)

    this.bodyContainer.animations.next()
    this.weaponContainer.animations.next()

    let frame = this.bodyContainer.animations.currentFrame
    let texture = this.bodyContainer.texture.baseTexture

    let offsetX = this.bodyFilter.flipped * (-frame.spriteSourceSizeX + frame.x + frame.sourceSizeW * 0.5 - this.group.x + (this.x % (frame.sourceSizeW * 0.5)))
    let offsetY = texture.height - frame.height - (frame.sourceSizeH - frame.height) + frame.spriteSourceSizeY - frame.y - frame.sourceSizeH * 0.5 + this.group.y - (this.y % (frame.sourceSizeH * 0.5))

    this.bodyFilter.offset = {x: offsetX, y: offsetY}

    frame = this.weaponContainer.animations.currentFrame
    texture = this.weaponContainer.texture.baseTexture

    offsetX = this.weaponFilter.flipped * (-frame.spriteSourceSizeX + frame.x + frame.sourceSizeW * 0.5 - this.group.x + (this.x % (frame.sourceSizeW * 0.5)))
    offsetY = texture.height - frame.height - (frame.sourceSizeH - frame.height) + frame.spriteSourceSizeY - frame.y - frame.sourceSizeH * 0.5 + this.group.y - (this.y % (frame.sourceSizeH * 0.5))

    this.weaponFilter.offset = {x: offsetX, y: offsetY}
  }

  nextDir(index) {
    this.currentDirIndex += index
    if(this.currentDirIndex > this.animationDirections.length - 1) {
      this.currentDirIndex = 0
    }else if(this.currentDirIndex < 0) {
      this.currentDirIndex = this.animationDirections.length - 1
    }
  }

  setPos(x, y) {
    this.x = x
    this.y = y
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

