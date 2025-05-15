const staggerFrames = 5;
let gameFrame = 0;
let playerState = 'moving';
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
        this.y = this.game.height-this.height;
        this.image = document.getElementById('player');
        this.speed = 10;

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
        console.log(animationStates);
    }
    update(input){
        playerState = 'moving';
        if (input.includes('w')) this.y -= this.speed, playerState = 'left';
        if (input.includes('a')) this.x -= this.speed, playerState = 'back';
        if (input.includes('s')) this.y += this.speed, playerState = 'right';
        if (input.includes('d')) this.x += this.speed*1.2, playerState = 'fast';
        if (input.includes('Enter')) playerState = 'fire';
        if (input.includes('Shift')) this.x+= this.speed*1.3, playerState = 'flip';
        

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height; 
    }

    draw(context) {
        //context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        let cursor = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
        let frameX = this.width * cursor;
        let frameY = spriteAnimations[playerState].loc[cursor].y;
        context.drawImage(this.image, frameX, frameY, this.width,
             this.height, this.x, this.y, this.width, this.height);
         gameFrame++;
    }
}