import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { Foreground } from "./foreground.js";
import { Paint } from "./paint.js";
import { BulletController } from './bulletController.js';
import { Enemy } from './enemy.js';
import { EnemyBulletController } from './enemyBulletController.js';


window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 2500;
    canvas.height = 1500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler();
            this.bulletController = new BulletController();
            this.enemyBulletController = new EnemyBulletController();


            this.background = new Background(this); //TODO Jobb lenne ha ezek egy helyen lennének 
            this.foreground = new Foreground(this);
            this.paint = new Paint(this);

            this.enemies = []; //TODO Jobb lenne ha ezekért a metódus felelne
            this.enemyTimer = 0;
            this.enemyInterval = 200; // kb. minden 200 frame után jön egy új

        }
        update() {
            this.player.update(this.input.keys);
            this.bulletController.update();

            this.enemyBulletController.update();
            this.enemyBulletController.checkCollisions(this.player);

            // Lövés (player)
            if (this.input.keys.includes('Enter')) {
                this.bulletController.shoot(this.player.x + this.player.width -90, this.player.y + this.player.height/2);
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
                    if (Math.random() < 0.02) { // kb. 1% esély frame-enként
                    this.enemyBulletController.shoot(enemy.x, enemy.y + enemy.height / 2);
                    enemy.state = 'fire';
                    enemy.fireTimer = 10; // pl. 10 frame-en át látszik a tűz animáció
                    }
            });
            this.enemies = this.enemies.filter(e => !e.markedForDeletion);             
        }

        draw(context) {
            this.paint.draw(context);
            this.background.draw(context);
            this.foreground.draw(context);
            this.bulletController.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.enemyBulletController.draw(context);
        }
    }

    const game = new Game (canvas.width, canvas.height);
    console.log(game);

    function animate (){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});