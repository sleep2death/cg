class PreloadState extends Phaser.State {
  preload() {
    this.load.image('star', 'assets/star.png')
  }

  create() {
    // console.log('preload state created')
    this.add.sprite(0, 0, 'star')
  }
}

export default PreloadState
