const animationStates = [
    {
        name: 'back',
        frames: 1,
        startX: 0,
        startY: 5
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
        startY: 960,
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
        startX: 5,
        startY: 1545,

    },
    {
        name: 'destroyed',
        frames: 15,
        startX: 5,
        startY: 1737,
    }
];

export class Player {
    constructor(game) {
        this.game = game;
        // Source frame dimensions in the sprite sheet
        this.frameWidth = 192;
        this.frameHeight = 192;

        // Display dimensions on the game canvas
        this.width = 192;
        this.height = 192;

        this.x = 0;
        this.y = this.game.height - this.height;
        this.image = document.getElementById('player');
        this.speed = 10;
        this.hitboxRadius = 8;
        this.isDestroyed = false;



        this.invulnerabilityDuration = 60; // 60 frames, approximately 1 second
        this.invulnerabilityTimer = 0;
        this.hitAnimationTimer = 0;
        this.hitAnimationDuration = 9 * this.staggerFrames;


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
                const posX = (state.startX ?? 0) + i * this.width;
                const posY = state.startY ?? index * this.height;

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

        if (this.isDestroyed) {
            return;
        }



        const isHit = this.invulnerabilityTimer > 0;

        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer--;
        }

        if (!isHit) {
            this.state = 'moving';
        }



        let dx = 0;
        let dy = 0;

        if (input.includes('w')) {
            dy -= 1;
            if (!isHit) this.state = 'left';
        }

        if (input.includes('a')) {
            dx -= 1;
            if (!isHit) this.state = 'back';
        }

        if (input.includes('s')) {
            dy += 1;
            if (!isHit) this.state = 'right';
        }

        if (input.includes('d')) {
            dx += 1;
            if (!isHit) this.state = 'fast';
        }

        if (input.includes('Enter')) {
            if (!isHit) this.state = 'fire';
        }

        if (input.includes('Shift')) {
            if (!isHit) this.state = 'flip';
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
            this.frameWidth,
            this.frameHeight,
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

    playDestroyedAnimation() {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.state = 'destroyed';
        this.frame = 0;
    }

    isDestroyedAnimationFinished() {
        const totalFrames = this.spriteAnimations.destroyed.loc.length;
        return this.frame >= totalFrames * this.staggerFrames;
    }

    takeDamage(health) {
        if (this.invulnerabilityTimer > 0) {
            return;
        }

        if (health.currentHealth > 0) {
            //health.currentHealth--; TODO TESZT
            this.invulnerabilityTimer = this.invulnerabilityDuration;

            this.state = 'hit';
            this.frame = 0;

            console.log("Player HIT!");
        }
    }
}