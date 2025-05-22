export class EnemyBullet {
    constructor(x, y, speed = 5) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 4;
        this.speed = speed;
        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = 'cyan';
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
