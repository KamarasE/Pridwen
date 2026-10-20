
import { getDirection } from './vector.js';

export class EnemyWeapon {
    constructor(enemy, bulletController) {
        this.enemy = enemy;
        this.bulletController = bulletController;

        // Each enemy remembers its own next volley.
        this.nextVolleyIsQuad = false;
    }

    fire(player) {
        const enemyCenterX =
            this.enemy.x + this.enemy.width / 2;
        const enemyCenterY =
            this.enemy.y + this.enemy.height / 2;

        const playerCenterX =
            player.x + player.width / 2;
        const playerCenterY =
            player.y + player.height / 2;

        const direction = getDirection(
            enemyCenterX,
            enemyCenterY,
            playerCenterX,
            playerCenterY
        );

        const pattern = this.enemy.type.bulletPattern;

        switch (pattern) {
            case 'aimed':
                this.fireAimed(direction);
                break;

            case 'tripleQuad':
                this.fireTripleQuad(direction);
                break;

            case 'circular':
                this.fireCircular(direction);
                break;

            default:
                console.warn(`Unknown bullet pattern: ${pattern}`);
                this.fireAimed(direction);
                break;
        }
    }

    fireAimed(direction) {
        this.shootBullet(direction.x, direction.y);
    }

    fireTripleQuad(direction) {
        this.nextVolleyIsQuad = !this.nextVolleyIsQuad;

        const angles = this.nextVolleyIsQuad
            ? [-0.32, -0.10, 0.10, 0.32]
            : [-0.22, 0, 0.22];

        for (const angle of angles) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const velocityX =
                direction.x * cos - direction.y * sin;
            const velocityY =
                direction.x * sin + direction.y * cos;

            this.shootBullet(velocityX, velocityY);
        }
    }

    fireCircular(direction) {
        // Temporary implementation: use aimed fire until
        // we implement the actual circular pattern.
        this.fireAimed(direction);
    }

    shootBullet(velocityX, velocityY) {
        const x = this.enemy.x + this.enemy.width / 2;
        const y = this.enemy.y + this.enemy.height / 2;

        this.bulletController.shoot(
            x,
            y,
            velocityX,
            velocityY
        );
    }
}
