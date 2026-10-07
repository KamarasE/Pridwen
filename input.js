export class InputHandler {
    constructor() {
        this.keys = [];
        this.justPressed = [];

        window.addEventListener('keydown', e => {
            if (
                e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === 'Enter' ||
                e.key === 'Shift'
            ) {
                if (this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                    this.justPressed.push(e.key);
                }
            }
        });

        window.addEventListener('keyup', e => {
            if (
                e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === 'Enter' ||
                e.key === 'Shift'
            ) {
                const index = this.keys.indexOf(e.key);

                if (index !== -1) {
                    this.keys.splice(index, 1);
                }
            }
            //DEBUG
            //console.log(e.key, this.keys);
            //
        });
    }

    update() {
        this.justPressed = [];
    }
}