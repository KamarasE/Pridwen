let gameSpeed = 10;

export class Background {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.x2 = 2500;
        this.y = 0;
        this.width = this.game.width;
        this.height = this.game.height;
        this.layer1 = document.getElementById('B_layer1');
        this.layer2 = document.getElementById('B_layer2');
    }
    drawBackground (context){
        context.drawImage(this.layer1, this.x, this.y, this.width, this.height);
        context.drawImage(this.layer2, this.x2, this.y, this.width, this.height);
        if (this.x < -2500) this.x = 2500 + this.x2 - gameSpeed;
        else this.x -= gameSpeed;
        if (this.x2 < -2500) this.x2 = 2500 + this.x - gameSpeed;
        else this.x2 -= gameSpeed;
    }
}