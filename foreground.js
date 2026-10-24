
const gameSpeed = 10;
const LAYER_COUNT = 8;

export class Foreground {
    constructor(game) {
        this.game = game;
        this.width = game.width;
        this.height = game.height;
        this.layers = [];

        for (let i = 1; i <= LAYER_COUNT; i++) {
            const nightImage = new Image();
            nightImage.src = `assets/1_Backgrounds/${i}/Night/3.png`;

            const dayImage = new Image();
            dayImage.src = `assets/1_Backgrounds/${i}/Day/3.png`;

            this.layers.push({
                nightImage,
                dayImage,
                x: (i - 1) * this.width
            });
        }
    }

    draw(context) {
        const dayAlpha = this.game.dayNightCycle.dayAlpha;

        for (const layer of this.layers) {
            if (layer.nightImage.complete && layer.nightImage.naturalWidth > 0) {
                context.drawImage(
                    layer.nightImage,
                    layer.x,
                    0,
                    this.width,
                    this.height
                );
            }

            if (
                dayAlpha > 0 &&
                layer.dayImage.complete &&
                layer.dayImage.naturalWidth > 0
            ) {
                context.save();
                context.globalAlpha = dayAlpha;
                context.drawImage(
                    layer.dayImage,
                    layer.x,
                    0,
                    this.width,
                    this.height
                );
                context.restore();
            }

            // Keep the existing scrolling and reset logic.
            layer.x -= gameSpeed;

            if (layer.x + this.width <= 0) {
                const rightmostX = Math.max(
                    ...this.layers.map(item => item.x)
                );
                layer.x = rightmostX + this.width - gameSpeed;
            }
        }
    }
}
