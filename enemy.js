const staggerFrames = 5;
let enemyState = 'moving';
const spriteAnimations = []
const animationStates = [
    {
        name: 'back',
        frames: 1,
    },
    {
        name: 'moving',
        frames: 6,
    },
    {
        name: 'fast',
        frames: 6,
    },
    {
        name: 'fire',
        frames: 3,
    },
    {
        name: 'pewPew',
        frames: 1,
    },
    {
        name: 'flip',
        frames: 9,
    },
    {
        name: 'left',
        frames: 2,
    },
    {
        name: 'right',
        frames: 2,
    },
    {
        name: 'hit',
        frames: 10,
    },
    {
        name: 'destroyed',
        frames: 10,
    }
];


export class Enemy {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('enemy');
        this.width = 191;
        this.height = 191;
        this.x = this.game.width + Math.random() * 300;
        this.y = Math.random() * (this.game.height - this.height);
        this.frame = 0;
        this.markedForDeletion = false;
        this.state = "fast";

        animationStates.forEach((state, index) => {
            let frames = {
            loc: [],
            }
            for (let i = 0; i < state.frames; i++) {
                let posX = i * this.width;
                let posY = index * this.height;
                frames.loc.push({x: posX, y: posY});
            }
        spriteAnimations[state.name] = frames;
        });
    }

    update() {
        this.x -= 2;
        if (this.x + this.width < 0) this.markedForDeletion = true;

        if (this.fireTimer > 0) {
        this.fireTimer--;
        this.state = 'fire';
        } else {
        this.state = 'fast'; // vagy ami az alapállapot
        }
    }

    draw(context) { //TODO hibás animáció, felgyorsul minden enemy után
        let cursor = Math.floor(this.frame / staggerFrames) % spriteAnimations[this.state].loc.length;
        let frameX = this.width * cursor;
        let frameY = spriteAnimations[this.state].loc[cursor].y;
        context.save();

        context.translate(this.x + this.width / 2, this.y + this.height / 2);

        // tükrözés X tengely mentén (balra nézzen)
        context.scale(-1, 1);

        context.drawImage(
        this.image,
        frameX, frameY,
        this.width, this.height,
        -this.width / 2, -this.height / 2, // ezáltal helyesen jelenik meg
        this.width, this.height);

        context.restore();
        this.frame++;
    }

    checkCollision(bullet) {
        return (
            bullet.x < this.x + this.width &&
            bullet.x + bullet.width > this.x &&
            bullet.y < this.y + this.height &&
            bullet.y + bullet.height > this.y
        );
    }
}
