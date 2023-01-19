import { Math as PhaserMath } from "phaser";

const { Between, FloatBetween } = PhaserMath;

export function create() {
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.add.image(400, 300, "sky");

  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, "platform").setScale(2).refreshBody();
  platforms.create(600, 400, "platform");
  platforms.create(50, 250, "platform");
  platforms.create(750, 220, "platform");

  this.player = this.physics.add.sprite(100, 450, "dude");
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  this.physics.add.collider(this.player, platforms);

  this.cursors = this.input.keyboard.createCursorKeys();

  const stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    child.setBounceY(FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(this.player, stars, collectStar, null, this);

  let score = 0;

  const scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      const newBombX = player.x < 400 ? Between(400, 800) : Between(0, 400);

      bombs
        .create(newBombX, 16, "bomb")
        .setBounce(1)
        .setCollideWorldBounds(true)
        .setVelocity(Between(-200, 200), 20);
    }
  }

  const bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(this.player, bombs, hitBomb, null, this);

  function hitBomb(player) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver = true;
  }
}
