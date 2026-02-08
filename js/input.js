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
        // Button to flag mapping
        const buttonMap = {
            'btn-up': 'kUp',
            'btn-down': 'kDown',
            'btn-left': 'kLeft',
            'btn-right': 'kRight',
            'btn-fire': 'kFire'
        };

        // Set up event listeners for each button
        Object.entries(buttonMap).forEach(([btnId, flagName]) => {
            const btn = document.getElementById(btnId);
            if (!btn) return; // Graceful degradation if button doesn't exist

            // Touch start → set flag to true
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this[flagName] = true;
            }, { passive: false });

            // Touch end → set flag to false
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this[flagName] = false;
            }, { passive: false });

            // Touch cancel → set flag to false (handles interruptions like phone calls)
            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this[flagName] = false;
            }, { passive: false });
        });
    }
}
