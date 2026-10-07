export class EnemyBullet {
    constructor(x, y, speed = 10, velocityX = -1, velocityY = 0) {
        this.x = x;
        this.y = y;

        this.radius = 8;

        this.speed = speed;

        this.velocityX = velocityX;
        this.velocityY = velocityY;

        this.markedForDeletion = false;
    }

    update() {
        this.x += this.velocityX * this.speed;
        this.y += this.velocityY * this.speed;

        if (
            this.x + this.width < 0 ||
            this.x > 2500 ||
            this.y + this.height < 0 ||
            this.y > 1500
        ) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'red';

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

    checkCollision(player) {
        const playerCenterX =
            player.x + player.width / 2;

        const playerCenterY =
            player.y + player.height / 2;

        const dx = playerCenterX - this.x;
        const dy = playerCenterY - this.y;

        const distance = Math.hypot(dx, dy);

        return distance <
            player.hitboxRadius + this.radius;
    }
}
