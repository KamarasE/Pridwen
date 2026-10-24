
const gameSpeed = 5;
const LAYER_COUNT = 8;

export class Background {
    constructor(game) {
        this.game = game;
        this.width = game.width;
        this.height = game.height;
        this.x = 0;
        this.layers = [];

        for (let i = 1; i <= LAYER_COUNT; i++) {
            const nightImage = new Image();
            nightImage.src = `assets/1_Backgrounds/${i}/Night/2.png`;

            const dayImage = new Image();
            dayImage.src = `assets/1_Backgrounds/${i}/Day/2.png`;

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
        // Draw the Night image as the base layer.
        if (layer.nightImage.complete && layer.nightImage.naturalWidth > 0) {
            context.drawImage(
                layer.nightImage,
                layer.x,
                0,
                this.width,
                this.height
            );
        }

        // Fade the Day image over the Night image.
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

        // Keep your existing scrolling and reset behavior.
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
