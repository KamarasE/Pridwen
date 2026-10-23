
const gameSpeed = 10;
const LAYER_COUNT = 8;

export class Background {
    constructor(game) {
        this.game = game;
        this.width = game.width;
        this.height = game.height;
        this.x = 0;
        this.layers = [];

        for (let i = 1; i <= LAYER_COUNT; i++) {
            const image = document.getElementById(`B_layer${i}`);

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

            // Move this section to the end when it leaves the screen.
            if (layer.x + this.width <= 0) {
                const rightmostX = Math.max(
                    ...this.layers.map(item => item.x)
                );

                layer.x = rightmostX + this.width - gameSpeed;
            }
        }
    }
}

//if (this.x < -2500) this.x = 2500 + this.x2 - gameSpeed;



/*draw(context) {
    // Move all sections first.
    for (const layer of this.layers) {
        layer.x -= gameSpeed;
    }

    // Then recycle sections that have left the screen.
    for (const layer of this.layers) {
        if (layer.x + this.width <= 0) {
            const rightmostX = Math.max(
                ...this.layers.map(item => item.x + this.width)
            );

            layer.x = rightmostX;
        }

        context.drawImage(
            layer.image,
            layer.x,
            0,
            this.width,
            this.height
        );
    }
}*/
