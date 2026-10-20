
export class EnemyMovement {
    constructor(enemy) {
        this.enemy = enemy;

        this.dodgeChance = 0.35;
        this.dodgeDistance = 300;
        this.dodgeSpeed = 10;

        this.dodgeTimer = 0;
        this.dodgeDirection = 0;
        this.dodgeCooldown = 0;
        this.dodgeStartY = 0;
    }

    update() {
        const enemy = this.enemy;

        // All movement types advance from right to left.
        enemy.x -= enemy.speed;

        switch (enemy.type.movementType) {
            case 'straight':
                break;

            case 'dodge':
                this.updateDodge();
                break;

            default:
                console.warn(
                    `Unknown movement type: ${enemy.type.movementType}`
                );
                break;
        }

        // Keep the enemy inside the vertical playfield.
        enemy.y = Math.max(
            0,
            Math.min(enemy.game.height - enemy.height, enemy.y)
        );
    }

    updateDodge() {
        const enemy = this.enemy;

        if (this.dodgeTimer > 0) {
            enemy.y += this.dodgeDirection * this.dodgeSpeed;
            this.dodgeTimer--;
            return;
        }

        if (this.dodgeCooldown > 0) {
            this.dodgeCooldown--;
            return;
        }

        const bullets = enemy.game.bulletController.bullets;
        const enemyCenterY = enemy.y + enemy.height / 2;

        const bulletApproaching = bullets.some(bullet => {
            if (bullet.markedForDeletion || bullet.velocityX <= 0) {
                return false;
            }

            const distanceX = enemy.x - bullet.x;
            const distanceY = Math.abs(bullet.y - enemyCenterY);

            return (
                distanceX > 0 &&
                distanceX < 250 &&
                distanceY < enemy.height / 2 + 20
            );
        });

        if (bulletApproaching && Math.random() < this.dodgeChance) {
            this.dodgeDirection = Math.random() < 0.5 ? -1 : 1;

            // Select the animation matching the dodge direction.
            this.enemy.state =
                this.dodgeDirection < 0 ? 'left' : 'right';

            this.dodgeTimer = Math.ceil(
                this.dodgeDistance / this.dodgeSpeed
            );
            this.dodgeCooldown = 60;
        }
    }
}
