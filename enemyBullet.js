export class EnemyBullet {
    constructor(x, y, speed = 10) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 10;
        this.speed = speed;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}
