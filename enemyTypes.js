export const ENEMY_TYPES = {
    bomber: {
        name: 'Bomber',
        imageId: 'bomber',

        maxHealth: 3,
        scoreValue: 100,
        speed: 4,

        fireChance: 0.08,
        bulletSpeed: 10,
        bulletPattern: 'aimed',

        frameWidth: 191,
        frameHeight: 191,

        animations: [
            { name: 'back', frames: 1 },
            { name: 'moving', frames: 6 },
            { name: 'fast', frames: 6 },
            { name: 'fire', frames: 3 },
            { name: 'pewPew', frames: 1 },
            { name: 'flip', frames: 9 },
            { name: 'left', frames: 2 },
            { name: 'right', frames: 2 },
            { name: 'hit', frames: 10 },
            { name: 'destroyed', frames: 10 }
        ]
    },

    corvette: {
        name: 'Corvette',
        imageId: 'corvette',

        maxHealth: 5,
        scoreValue: 200,
        speed: 2,

        fireChance: 0.02,
        bulletSpeed: 5,
        bulletPattern: 'circular',

        frameWidth: 191,
        frameHeight: 191,

        animations: [ // EZ HIBÁS, MÁSAK AZ ANIMÁCIÓK, CSAK IDEIGLENESEN VAN ÍGY
            { name: 'back', frames: 1 },
            { name: 'moving', frames: 6 },
            { name: 'fast', frames: 5 },
            { name: 'fire', frames: 4 },
            { name: 'pewPew', frames: 4 },
            { name: 'flip', frames: 7 },
            { name: 'left', frames: 6 },
            { name: 'right', frames: 8 },
            { name: 'hit', frames: 10 },
            { name: 'destroyed', frames: 21 }
        ]
    }
};