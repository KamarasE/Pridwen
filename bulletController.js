import { Bullet } from './bullet.js';

export class BulletController {
    constructor() {
        this.bullets = [];
        this.shootCooldown = 0;
    }

    shoot(x, y) {
        if (this.shootCooldown <= 0) {
            this.bullets.push(new Bullet(x, y, 20));
            this.shootCooldown = 20;
        }
    }

    update() {
        this.shootCooldown--;
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
    }

    draw(ctx) {
        this.bullets.forEach(b => b.draw(ctx));
    }
}
