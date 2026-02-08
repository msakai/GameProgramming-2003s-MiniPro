// GameCanvas.java input portion — keyboard handler

export class Input {
    constructor() {
        this.kLeft = false;
        this.kRight = false;
        this.kUp = false;
        this.kDown = false;
        this.kFire = false;

        window.addEventListener('keydown', (e) => this._onKeyDown(e));
        window.addEventListener('keyup', (e) => this._onKeyUp(e));

        // Touch controls setup
        this._setupTouchControls();
    }

    _onKeyDown(e) {
        switch (e.code) {
            case 'ArrowLeft':  this.kLeft  = true; e.preventDefault(); break;
            case 'ArrowRight': this.kRight = true; e.preventDefault(); break;
            case 'ArrowUp':    this.kUp    = true; e.preventDefault(); break;
            case 'ArrowDown':  this.kDown  = true; e.preventDefault(); break;
            case 'Space': case 'KeyZ': case 'Enter':
                this.kFire = true; e.preventDefault(); break;
        }
    }

    _onKeyUp(e) {
        switch (e.code) {
            case 'ArrowLeft':  this.kLeft  = false; break;
            case 'ArrowRight': this.kRight = false; break;
            case 'ArrowUp':    this.kUp    = false; break;
            case 'ArrowDown':  this.kDown  = false; break;
            case 'Space': case 'KeyZ': case 'Enter':
                this.kFire = false; break;
        }
    }

    dx() {
        let ret = 0;
        if (this.kLeft)  ret -= 1;
        if (this.kRight) ret += 1;
        return ret * 3;
    }

    dy() {
        let ret = 0;
        if (this.kUp)   ret -= 1;
        if (this.kDown) ret += 1;
        return ret * 3;
    }

    isFiring() {
        return this.kFire;
    }

    _setupTouchControls() {
        // D-pad button to flag mapping
        const buttonMap = {
            'btn-up': 'kUp',
            'btn-down': 'kDown',
            'btn-left': 'kLeft',
            'btn-right': 'kRight'
        };

        // Set up D-pad event listeners
        Object.entries(buttonMap).forEach(([btnId, flagName]) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this[flagName] = true;
            }, { passive: false });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this[flagName] = false;
            }, { passive: false });

            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this[flagName] = false;
            }, { passive: false });
        });

        // Canvas touch → fire (used for title/game-over screen transitions)
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.kFire = true;
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.kFire = false;
        }, { passive: false });

        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.kFire = false;
        }, { passive: false });
    }
}
