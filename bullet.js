export class Bullet {
    constructor(x, y, speed, velocityX = 1, velocityY = 0) {
        this.x = x;
        this.y = y;

        this.speed = speed;

        this.velocityX = velocityX;
        this.velocityY = velocityY;

        this.radius = 8;

        this.markedForDeletion = false;
    }

    update() {
        this.x += this.velocityX * this.speed;
        this.y += this.velocityY * this.speed;

        if (
            this.x - this.radius > 2500 ||
            this.y + this.radius < 0 ||
            this.y - this.radius > 1500
        ) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'lime';

        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}
