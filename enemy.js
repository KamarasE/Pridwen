import { ENEMY_TYPES } from './enemyTypes.js';
import { EnemyWeapon } from './enemyWeapon.js';
import { EnemyMovement } from './enemyMovement.js';

const staggerFrames = 5;



export class Enemy {
    constructor(game, type = 'bomber') {
        this.game = game;
        this.typeName = type;
        this.type = ENEMY_TYPES[type];

        if (!this.type) {
            throw new Error(`Unknown enemy type: ${type}`);
        }

        this.weapon = new EnemyWeapon(
            this,
            this.game.enemyBulletController
        );

        this.movement = new EnemyMovement(this);

        this.image = document.getElementById(this.type.imageId);

        this.maxHealth = this.type.maxHealth;
        this.health = this.type.maxHealth;
        this.scoreValue = this.type.scoreValue;
        this.speed = this.type.speed;

        this.width = 191;
        this.height = 191;
        this.x = this.game.width + Math.random() * 300;
        this.y = Math.random() * (this.game.height - this.height);
        this.frame = 0;
        this.markedForDeletion = false;
        this.state = "fast";
        this.staggerFrames = 5;
        this.spriteAnimations = {};

        this.type.animations.forEach((state, index) => {
            const frames = { loc: [] };

            for (let i = 0; i < state.frames; i++) {
                frames.loc.push({
                    x: i * this.type.frameWidth,
                    y: index * this.type.frameHeight
                });
            }

            this.spriteAnimations[state.name] = frames;
        });
    }

    update() {
        this.movement.update();
        if (this.x + this.width < 0) this.markedForDeletion = true;

        if (this.fireTimer > 0) {
            this.fireTimer--;
        } else if (this.movement.dodgeTimer <= 0) {
            this.state = 'fast';
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
            this.type.frameWidth,
            this.type.frameHeight,
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
