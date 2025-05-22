export class Bullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 20;
        this.height = 10;
        this.markedForDeletion = false;
    }

    update() {
        this.x += this.speed;
        if (this.x > 2500) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = 'lime';
        ctx.fillRect(this.x, this.y, this.width, this.height); //TODO van saját rajzolt töltényem ami jobban néz ki
    }
}
