export class Health {
    constructor(game) {
        this.game = game;

        this.maxHealth = 3;
        this.currentHealth = 3;

        this.heartSize = 55;
        this.heartSpacing = 15;

        this.x = 40;
        this.y = 40;
    }

    draw(context) {
        for (let i = 0; i < this.maxHealth; i++) {
            const heartX =
                this.x + i * (this.heartSize + this.heartSpacing);

            const heartY = this.y;

            this.drawHeart(
                context,
                heartX,
                heartY,
                this.heartSize,
                i < this.currentHealth
            );
        }
    }

    drawHeart(context, x, y, size, filled) {
        const d = size;
        const k = 0;

        context.save();

        context.translate(x, y);

        context.strokeStyle = "#000000";
        context.lineWidth = 3;
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur = 0;

        context.fillStyle = "#FF0000";

        // Filled hearts are fully visible.
        // Lost hearts are mostly transparent.
        context.globalAlpha = filled ? 1 : 0.15;

        context.beginPath();

        context.moveTo(
            k,
            k + d / 4
        );

        context.quadraticCurveTo(
            k,
            k,
            k + d / 4,
            k
        );

        context.quadraticCurveTo(
            k + d / 2,
            k,
            k + d / 2,
            k + d / 4
        );

        context.quadraticCurveTo(
            k + d / 2,
            k,
            k + d * 3 / 4,
            k
        );

        context.quadraticCurveTo(
            k + d,
            k,
            k + d,
            k + d / 4
        );

        context.quadraticCurveTo(
            k + d,
            k + d / 2,
            k + d * 3 / 4,
            k + d * 3 / 4
        );

        context.lineTo(
            k + d / 2,
            k + d
        );

        context.lineTo(
            k + d / 4,
            k + d * 3 / 4
        );

        context.quadraticCurveTo(
            k,
            k + d / 2,
            k,
            k + d / 4
        );

        context.closePath();

        context.stroke();
        context.fill();

        context.restore();
    }
}