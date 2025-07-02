const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let player, cursors, scoreText, ground, obstacles;
let score = 0;

const game = new Phaser.Game(config);

function preload() {}

function create() {
    // Buat Ground
    ground = this.add.rectangle(400, 580, 800, 50, 0x654321);
    this.physics.add.existing(ground, true); // static body

    // Buat Player
    player = this.add.rectangle(100, 450, 40, 100, 0x1e90ff);
    this.physics.add.existing(player);
    player.body.setBounce(0.1);
    player.body.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    // Keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    // Buat Obstacle group
    obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 2000,
        callback: () => {
            let obs = this.add.rectangle(850, 530, 50, 50, 0x333333);
            this.physics.add.existing(obs);
            obs.body.setVelocityX(-200);
            obs.body.setImmovable(true);
            obstacles.add(obs);
        },
        loop: true
    });

    this.physics.add.collider(obstacles, ground);
    this.physics.add.collider(player, obstacles, gameOver, null, this);

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
    } else {
        player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-350);
    }

    // Tambah skor berdasarkan waktu
    score += 1;
    scoreText.setText('Score: ' + Math.floor(score / 10));
}

function gameOver() {
    this.scene.restart();
    score = 0;
}