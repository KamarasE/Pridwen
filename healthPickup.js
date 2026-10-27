
export class HealthPickup {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;

        this.radius = 12;
        this.speed = 2;
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speed;

        // Remove the orb when it reaches the bottom.
        if (this.y - this.radius >= this.game.height) {
            this.markedForDeletion = true;
            return;
        }

        // Collect the orb when it touches the player.
        const player = this.game.player;

        const closestX = Math.max(
            player.x,
            Math.min(this.x, player.x + player.width)
        );

        const closestY = Math.max(
            player.y,
            Math.min(this.y, player.y + player.height)
        );

        const dx = this.x - closestX;
        const dy = this.y - closestY;

        if (Math.hypot(dx, dy) <= this.radius) {
            const health = this.game.health;

            if (health.currentHealth < health.maxHealth) {
                health.currentHealth = Math.min(
                    health.currentHealth + 1,
                    health.maxHealth
                );

                this.markedForDeletion = true;
            }
        }
    }

    draw(context) {
        context.save();

        context.fillStyle = 'yellow';
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );
        context.fill();

        context.restore();
    }
}
