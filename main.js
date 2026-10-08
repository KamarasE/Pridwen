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

            this.background = new Background(this); //TODO Jobb lenne ha ezek egy helyen lennének 
            this.foreground = new Foreground(this);
            this.paint = new Paint(this);

            this.enemies = []; //TODO Jobb lenne ha ezekért a metódus felelne
            this.enemyTimer = 0;
            this.enemyInterval = 200; // kb. minden 200 frame után jön egy új

            this.gameState = 'start';

        }
        update() {
            if (this.gameState === 'start') {
                if (this.input.justPressed.includes('Enter')) {
                    this.gameState = 'playing';

                    music.play();

                    // Enter lenyomásáig nincs semmi
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

            // Lövés (player)
            if (this.input.keys.includes('Enter')) {
                this.player.shoot(this.bulletController);
            }

            // Ellenségek generálása időközönként
            this.enemyTimer++;
            if (this.enemyTimer > this.enemyInterval) {
                this.enemies.push(new Enemy(this));
                this.enemyTimer = 0;
            }

            // Ellenségek frissítése és lövedékekkel való ütközés
            this.enemies.forEach(enemy => {
                enemy.update();
                this.bulletController.bullets.forEach(bullet => {
                    if (enemy.checkCollision(bullet)) {
                        enemy.markedForDeletion = true;
                        bullet.markedForDeletion = true;
                    }
                });

                if (Math.random() < 0.02) { //esély az új spawnra tolteny
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;

                    const playerCenterX =
                        this.player.x + this.player.width / 2;

                    const playerCenterY =
                        this.player.y + this.player.height / 2;

                    const direction = getDirection(
                        enemyCenterX,
                        enemyCenterY,
                        playerCenterX,
                        playerCenterY
                    );

                    this.enemyBulletController.shoot(
                        enemyCenterX,
                        enemyCenterY,
                        direction.x,
                        direction.y
                    );

                    enemy.state = 'fire';
                    enemy.fireTimer = 10; //csak az animáció
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

            if (this.gameState === 'start') {
                context.save();

                // Transparent gray overlay
                context.fillStyle = 'rgba(80, 80, 80, 0.65)';
                context.fillRect(
                    0,
                    0,
                    this.width,
                    this.height
                );

                // Start text
                context.fillStyle = 'white';
                context.font = 'bold 64px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';

                context.fillText(
                    'PRESS ENTER TO START',
                    this.width / 2,
                    this.height / 2
                );

                context.restore();
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});