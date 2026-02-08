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
        // D-pad: zone-based touch handling on container
        const dpad = document.getElementById('dpad');
        if (dpad) {
            this._dpadButtons = {
                'btn-up': 'kUp',
                'btn-down': 'kDown',
                'btn-left': 'kLeft',
                'btn-right': 'kRight'
            };
            this._activeDpadFlags = new Set();

            dpad.addEventListener('touchstart', (e) => this._onDpadTouch(e), { passive: false });
            dpad.addEventListener('touchmove', (e) => this._onDpadTouch(e), { passive: false });
            dpad.addEventListener('touchend', (e) => this._onDpadTouchEnd(e), { passive: false });
            dpad.addEventListener('touchcancel', (e) => this._onDpadTouchEnd(e), { passive: false });
        }

        // Canvas touch → fire (used for title/game-over screen transitions)
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
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

    _onDpadTouch(e) {
        e.preventDefault();
        const newFlags = new Set();
        const activeEls = new Set();
        for (const touch of e.touches) {
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            if (el && this._dpadButtons[el.id]) {
                newFlags.add(this._dpadButtons[el.id]);
                activeEls.add(el.id);
            }
        }
        // Update direction flags
        for (const flag of this._activeDpadFlags) {
            if (!newFlags.has(flag)) this[flag] = false;
        }
        for (const flag of newFlags) {
            this[flag] = true;
        }
        this._activeDpadFlags = newFlags;
        // Update visual feedback
        this._updateDpadActive(activeEls);
    }

    _onDpadTouchEnd(e) {
        e.preventDefault();
        const newFlags = new Set();
        const activeEls = new Set();
        for (const touch of e.touches) {
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            if (el && this._dpadButtons[el.id]) {
                newFlags.add(this._dpadButtons[el.id]);
                activeEls.add(el.id);
            }
        }
        for (const flag of this._activeDpadFlags) {
            if (!newFlags.has(flag)) this[flag] = false;
        }
        for (const flag of newFlags) {
            this[flag] = true;
        }
        this._activeDpadFlags = newFlags;
        this._updateDpadActive(activeEls);
    }

    _updateDpadActive(activeEls) {
        for (const btnId of Object.keys(this._dpadButtons)) {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.classList.toggle('active', activeEls.has(btnId));
            }
        }
    }
}
