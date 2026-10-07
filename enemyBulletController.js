import { EnemyBullet } from './enemyBullet.js';

export class EnemyBulletController {
    constructor() {
        this.bullets = [];
        this.shootCooldown = 0;
    }

    shoot(x, y, velocityX = -1, velocityY = 0) {
        this.bullets.push(
            new EnemyBullet(x, y, 10, velocityX, velocityY)
        );
    }

    update() {
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
    }

    draw(ctx) {
        this.bullets.forEach(b => b.draw(ctx));
    }

    checkCollisions(player) {
        this.bullets.forEach(bullet => {
            if (bullet.checkCollision(player)) {
                bullet.markedForDeletion = true;
                // Itt lehetne pl. player.health--
                console.log("Player HIT!");
            }
        });
    }
}
