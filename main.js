import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { Foreground } from "./foreground.js";

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 2500;
    canvas.height = 1500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler();
            this.background = new Background(this);
            this.foreground = new Foreground(this);
        }
        update() {
            this.player.update(this.input.keys);
        }
        draw(context) {
            this.player.draw(context);
        }
        drawBackground(context) {
            this.background.drawBackground(context);
        }
        drawForeground(context) {
            this.foreground.drawForeground(context);
        }
    }

    const game = new Game (canvas.width, canvas.height);
    console.log(game);

    function animate (){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.drawForeground(ctx);
        game.drawBackground(ctx); //TODO switch name with foreground and make better
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});