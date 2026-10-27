
export class DayNightCycle {
    constructor() {
        // Durations are measured in frames (assuming 60 FPS).
        this.nightDuration = 5 * 60; // 30 seconds TESZTRE CSAK 5 TODO
        this.dayDuration = 5 * 60;   // 30 seconds
        this.transitionDuration = 10 * 60; // 10 seconds

        this.phase = 'day';
        this.timer = 0;

        // 0 = fully night, 1 = fully day.
        this.dayAlpha = 0;
    }

    update() {
        this.timer++;

        switch (this.phase) {
            case 'night':
                this.dayAlpha = 0;

                if (this.timer >= this.nightDuration) {
                    this.startPhase('transitionToDay');
                }
                break;

            case 'transitionToDay':
                this.dayAlpha = Math.min(
                    this.timer / this.transitionDuration,
                    1
                );

                if (this.timer >= this.transitionDuration) {
                    this.dayAlpha = 1;
                    this.startPhase('day');
                }
                break;

            case 'day':
                this.dayAlpha = 1;

                if (this.timer >= this.dayDuration) {
                    this.startPhase('transitionToNight');
                }
                break;

            case 'transitionToNight':
                this.dayAlpha = Math.max(
                    1 - this.timer / this.transitionDuration,
                    0
                );

                if (this.timer >= this.transitionDuration) {
                    this.dayAlpha = 0;
                    this.startPhase('night');
                }
                break;
        }
    }

    startPhase(phase) {
        this.phase = phase;
        this.timer = 0;
    }
}
