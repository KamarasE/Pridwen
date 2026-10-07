const staggerFrames = 5;

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
        this.staggerFrames = 5;
        this.spriteAnimations = {};

        animationStates.forEach((state, index) => {
            let frames = {
                loc: [],
            }
            for (let i = 0; i < state.frames; i++) {
                let posX = i * this.width;
                let posY = index * this.height;
                frames.loc.push({ x: posX, y: posY });
            }
            this.spriteAnimations[state.name] = frames;
        });
    }

    update() {
        this.x -= 4;
        if (this.x + this.width < 0) this.markedForDeletion = true;

        if (this.fireTimer > 0) {
            this.fireTimer--;
            this.state = 'fire';
        } else {
            this.state = 'fast'; // vagy ami az alapállapot
        }
    }

    draw(context) {
        const animation = this.spriteAnimations[this.state];

        const cursor =
            Math.floor(this.frame / this.staggerFrames) %
            animation.loc.length;

        const frameX = animation.loc[cursor].x;
        const frameY = animation.loc[cursor].y;

        context.save();

        context.translate(
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        // Make the enemy face left
        context.scale(-1, 1);

        context.drawImage(
            this.image,
            frameX,
            frameY,
            this.width,
            this.height,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        context.restore();
        //DEBUG

        context.save();

        context.strokeStyle = 'yellow';
        context.lineWidth = 2;
        context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        context.restore();
        //

        this.frame++;
    }

    checkCollision(bullet) {

        const closestX = Math.max(
            this.x,
            Math.min(bullet.x, this.x + this.width)
        );

        const closestY = Math.max(
            this.y,
            Math.min(bullet.y, this.y + this.height)
        );

        const dx = bullet.x - closestX;
        const dy = bullet.y - closestY;

        const distance = Math.hypot(dx, dy);

        return distance < bullet.radius;
    }
}
