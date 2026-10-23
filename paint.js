
const gameSpeed = 20;
const LAYER_COUNT = 8;

export class Paint {
    constructor(game) {
        this.game = game;
        this.width = game.width;
        this.height = game.height;
        this.layers = [];

        for (let i = 1; i <= LAYER_COUNT; i++) {
            const image = document.getElementById(`P_layer${i}`);

            this.layers.push({
                image,
                x: (i - 1) * this.width
            });
        }
    }

    draw(context) {
        for (const layer of this.layers) {
            context.drawImage(
                layer.image,
                layer.x,
                0,
                this.width,
                this.height
            );

            layer.x -= gameSpeed;

            if (layer.x <= -this.width) {
                const rightmostX = Math.max(
                    ...this.layers.map(item => item.x)
                );

                layer.x = rightmostX + this.width - gameSpeed;
            }
        }
    }
}
