import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { Foreground } from "./foreground.js";
import { Paint } from "./paint.js";
import { BulletController } from './bulletController.js';
import { Enemy } from './enemy.js';
import { EnemyBulletController } from './enemyBulletController.js';
import { getDirection } from "./vector.js";
import { Health } from "./health.js";
import { DayNightCycle } from './dayNightCycle.js';


const music = new Audio('./assets/music/pridwen.mp3');
music.loop = true;
music.volume = 1;


window.addEventListener('load', function () { //LOAD esemény, futás előtt megvárja amíg minden szükséges asset betölt
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 2500;
    canvas.height = 1500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.health = new Health(this);
            this.input = new InputHandler();
            this.bulletController = new BulletController();
            this.enemyBulletController = new EnemyBulletController();
            this.score = 0;
            this.highScore = Number(localStorage.getItem('pridwenHighScore')) || 0;
            this.newHighScore = false;
            this.dayNightCycle = new DayNightCycle();

            this.background = new Background(this); //TODO Jobb lenne ha ezek egy helyen lennének 
            this.foreground = new Foreground(this);
            this.paint = new Paint(this);

            this.enemies = []; //TODO Jobb lenne ha ezekért a metódus felelne
            this.enemyTimer = 0;
            this.enemyInterval = 200; // kb. minden 200 frame után jön egy új

            this.bombersSinceCorvette = 0;
            this.corvetteThreshold = 7;

            this.gameState = 'start';

        }

        startGame() {
            this.gameState = 'playing';

            music.currentTime = 0;
            music.play();
        }

        resetRun() {
            // Reset player
            this.player.x = 0;
            this.player.y = this.height - this.player.height;
            this.player.state = 'moving';
            this.player.frame = 0;
            this.player.shootCooldown = 0;
            this.score = 0;
            this.newHighScore = false;

            // Restore health
            this.health.currentHealth = this.health.maxHealth;

            // Clear enemies and projectiles
            this.enemies = [];
            this.bulletController.bullets = [];
            this.enemyBulletController.bullets = [];

            // Reset enemy spawning
            this.enemyTimer = 0;
            this.bombersSinceCorvette = 0;
        }

        update() {
            this.dayNightCycle.update();

            if (this.gameState === 'start') {
                if (this.input.justPressed.includes('Enter')) {
                    this.startGame();

                    // Prevent the start press from firing a bullet
                    const enterIndex = this.input.keys.indexOf('Enter');

                    if (enterIndex !== -1) {
                        this.input.keys.splice(enterIndex, 1);
                    }
                }

                this.input.update();
                return;
            }

            if (this.gameState === 'gameOver') {
                if (this.input.justPressed.includes('Enter')) {
                    this.resetRun();
                    this.gameState = 'start';

                    // Prevent the restart press from firing a bullet
                    const enterIndex = this.input.keys.indexOf('Enter');

                    if (enterIndex !== -1) {
                        this.input.keys.splice(enterIndex, 1);
                    }
                }

                this.input.update();
                return;
            }

            this.player.update(this.input.keys);
            this.bulletController.update();

            this.enemyBulletController.update();
            this.enemyBulletController.checkCollisions(this.player, this.health);

            if (this.health.currentHealth <= 0) {
                this.gameState = 'gameOver';

                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    this.newHighScore = true;

                    localStorage.setItem(
                        'pridwenHighScore',
                        this.highScore
                    );
                } else {
                    this.newHighScore = false;
                }

                music.pause();
                return;
            }

            // Lövés (player)
            if (this.input.keys.includes('Enter')) {
                this.player.shoot(this.bulletController);
            }

            // Spawn enemies
            this.enemyTimer++;

            if (this.enemyTimer > this.enemyInterval) {
                const corvetteChance =
                    this.bombersSinceCorvette /
                    (this.bombersSinceCorvette + this.corvetteThreshold);

                const spawnCorvette =
                    Math.random() < corvetteChance;

                if (spawnCorvette) {
                    this.enemies.push(new Enemy(this, 'corvette'));

                    // Start counting Bombers again after a Corvette spawns
                    this.bombersSinceCorvette = 0;
                } else {
                    this.enemies.push(new Enemy(this, 'bomber'));

                    this.bombersSinceCorvette++;
                }

                this.enemyTimer = 0;
            }

            // Ellenségek frissítése és lövedékekkel való ütközés
            this.enemies.forEach(enemy => {
                enemy.update();
                this.bulletController.bullets.forEach(bullet => {
                    if (
                        !bullet.markedForDeletion &&
                        !enemy.markedForDeletion &&
                        enemy.checkCollision(bullet)
                    ) {
                        enemy.health--;
                        bullet.markedForDeletion = true;

                        if (enemy.health <= 0) {
                            enemy.markedForDeletion = true;
                            this.score += enemy.scoreValue;
                        }
                    }
                });


                if (Math.random() < enemy.type.fireChance) {
                    enemy.weapon.fire(this.player);

                    enemy.state = 'fire';
                    enemy.fireTimer = 10;
                }

            });
            this.enemies = this.enemies.filter(e => !e.markedForDeletion);

            this.input.update();
        }

        draw(context) {
            this.paint.draw(context);
            this.background.draw(context);
            this.foreground.draw(context);
            this.bulletController.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.enemyBulletController.draw(context);
            this.health.draw(context);

            if (
                this.gameState === 'start' ||
                this.gameState === 'gameOver'
            ) {
                context.save();

                // Transparent gray overlay
                context.fillStyle = 'rgba(80, 80, 80, 0.65)';
                context.fillRect(
                    0,
                    0,
                    this.width,
                    this.height
                );

                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';

                if (this.gameState === 'start') {
                    context.font = 'bold 64px Arial';

                    context.fillText(
                        'PRESS ENTER TO START',
                        this.width / 2,
                        this.height / 2
                    );
                }


                if (this.gameState === 'gameOver') {
                    context.font = 'bold 80px Arial';
                    context.fillStyle = 'white';
                    context.fillText(
                        'GAME OVER',
                        this.width / 2,
                        this.height / 2 - 100
                    );

                    context.font = 'bold 40px Arial';
                    context.fillText(
                        `Score: ${this.score}`,
                        this.width / 2,
                        this.height / 2 - 20
                    );

                    if (this.newHighScore) {
                        context.font = 'bold 40px Arial';
                        context.fillStyle = 'yellow';
                        context.fillText(
                            `NEW HIGH SCORE: ${this.highScore}`,
                            this.width / 2,
                            this.height / 2 + 40
                        );
                    }

                    context.fillStyle = 'white';
                    context.font = '28px Arial';
                    context.fillText(
                        'PRESS ENTER TO CONTINUE',
                        this.width / 2,
                        this.height / 2 + 110
                    );
                }


                context.restore();
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);

    //TEST
let lastTime = 0;
let frameCount = 0;
let fpsTimer = 0;
let currentFPS = 0;

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update();
    game.draw(ctx);

    frameCount++;

    if (lastTime !== 0) {
        fpsTimer += timestamp - lastTime;
    }

    lastTime = timestamp;

    if (fpsTimer >= 1000) {
        currentFPS = Math.round(frameCount * 1000 / fpsTimer);

        console.log(`FPS: ${currentFPS}`);

        frameCount = 0;
        fpsTimer = 0;
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

/* function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
}
animate(); */

});