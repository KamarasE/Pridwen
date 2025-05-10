export class Player {
    constructor(game) {
        this.game = game;
        this.width = 192;
        this.height = 191;
        this.x = 0;
        this.y = this.game.height-this.height;
        this.image = document.getElementById('player');
        this.speed = 10;
    }
    update(input){
        if (input.includes('w')) this.y -= this.speed;
        if (input.includes('a')) this.x -= this.speed;
        if (input.includes('s')) this.y += this.speed;
        if (input.includes('d')) this.x += this.speed;

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height; 
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height,this.x, this.y, this.width, this.height);
    }
}