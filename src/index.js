// create the game instance
const Phaser = require('phaser')
const game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {preload, create, update})

function preload() {
  game.load.image('star', 'assets/star.png')
  game.load.image('ground', 'assets/platform.png')
  game.load.image('sky', 'assets/sky.png')
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48)
}

function create() {
  this.cursors = game.input.keyboard.createCursorKeys()

  game.physics.startSystem(Phaser.Physics.ARCADE)

  game.add.sprite(0, 0, 'sky')

  // create static platforms
  this.platforms = game.add.group()
  this.platforms.enableBody = true

  const ground = this.platforms.create(0, game.world.height - 64, 'ground')
  ground.scale.setTo(2, 2)
  ground.body.immovable = true

  let ledge = this.platforms.create(400, 400, 'ground')
  ledge.body.immovable = true

  ledge = this.platforms.create(-150, 250, 'ground')
  ledge.body.immovable = true

  // add player one
  this.player = game.add.sprite(32, game.world.height - 150, 'dude')
  game.physics.arcade.enable(this.player)

  this.player.body.bounce.y = 0
  this.player.body.gravity.y = 300
  this.player.body.collideWorldBounds = true

  this.player.animations.add('left', [0, 1, 2, 3], 10, true)
  this.player.animations.add('right', [5, 6, 7, 8], 10, true)

  // add stars
  this.stars = game.add.group()
  this.stars.enableBody = true

  for (let i = 0; i < 12; i++) {
    const star = this.stars.create(i * 70, 0, 'star')
    star.body.gravity.y = 26

    star.body.bounce.y = 0.7 + Math.random() * 0.2
  }
}

function update() {
  game.physics.arcade.collide(this.player, this.platforms)
  game.physics.arcade.collide(this.platforms, this.stars)

  game.physics.arcade.overlap(this.player, this.stars, (player, star) => {
    star.kill()
  })

  this.player.body.velocity.x = 0

  if (this.cursors.left.isDown) {
    this.player.body.velocity.x = -150
    this.player.animations.play('left')
  } else if (this.cursors.right.isDown) {
    this.player.body.velocity.x = 150
    this.player.animations.play('right')
  } else {
    this.player.animations.stop()
    this.player.frame = 4
  }

  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.body.velocity.y = -350
  }
}
