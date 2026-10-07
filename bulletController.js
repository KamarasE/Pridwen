import { Bullet } from './bullet.js';

export class BulletController {
    constructor() {
        this.bullets = [];
    }

    shoot(x, y, velocityX = 1, velocityY = 0) {
    this.bullets.push(
        new Bullet(x, y, 20, velocityX, velocityY)
    );
}

    update() {
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
    }

    draw(ctx) {
        this.bullets.forEach(b => b.draw(ctx));
    }
}
