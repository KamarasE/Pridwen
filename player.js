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
        frames: 5,
    },
    {
        name: 'fire',
        frames: 4,
    },
    {
        name: 'pewPew',
        frames: 2,
    },
    {
        name: 'flip',
        frames: 8,
    },
    {
        name: 'left',
        frames: 4,
    },
    {
        name: 'right',
        frames: 4,
    },
    {
        name: 'hit',
        frames: 9,
    },
    {
        name: 'destroyed',
        frames: 15,
    }
];

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 192;
        this.height = 191;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.image = document.getElementById('player');
        this.speed = 10;
        this.hitboxRadius = 8;

        this.state = 'moving';
        this.frame = 0;
        this.staggerFrames = 5;
        this.spriteAnimations = {};
        this.shootCooldown = 0;
        this.shootInterval = 20;

        animationStates.forEach((state, index) => {
            const frames = {
                loc: [],
            };

            for (let i = 0; i < state.frames; i++) {
                const posX = i * this.width;
                const posY = index * this.height;

                frames.loc.push({
                    x: posX,
                    y: posY
                });
            }

            this.spriteAnimations[state.name] = frames;
        });
        console.log(animationStates);
    }
    update(input) {
        this.state = 'moving';

        let dx = 0;
        let dy = 0;

        if (input.includes('w')) {
            dy -= 1;
            this.state = 'left';
        }

        if (input.includes('a')) {
            dx -= 1;
            this.state = 'back';
        }

        if (input.includes('s')) {
            dy += 1;
            this.state = 'right';
        }

        if (input.includes('d')) {
            dx += 1;
            this.state = 'fast';
        }

        if (input.includes('Enter')) {
            this.state = 'fire';
        }

        if (input.includes('Shift')) {
            this.state = 'flip';
            dx += 1.3;
        }

        if (dx !== 0 || dy !== 0) {
            const length = Math.hypot(dx, dy);

            dx /= length;
            dy /= length;

            this.x += dx * this.speed;
            this.y += dy * this.speed;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width)
            this.x = this.game.width - this.width;

        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height)
            this.y = this.game.height - this.height;
    }

    shoot(bulletController) {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }

        if (this.shootCooldown <= 0) {
            const bulletX = this.x + this.width - 20;
            const bulletY = this.y + this.height / 2;

            bulletController.shoot(
                bulletX,
                bulletY
            );

            this.shootCooldown = this.shootInterval;
        }
    }


    draw(context) {
        const animation = this.spriteAnimations[this.state];

        const cursor =
            Math.floor(this.frame / this.staggerFrames) %
            animation.loc.length;

        const frameX = animation.loc[cursor].x;
        const frameY = animation.loc[cursor].y;

        context.drawImage(
            this.image,
            frameX,
            frameY,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.frame++;


        context.save();

        context.strokeStyle = 'white';
        context.beginPath();
        context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.hitboxRadius,
            0,
            Math.PI * 2
        );
        context.stroke();

        context.restore();
    }
}