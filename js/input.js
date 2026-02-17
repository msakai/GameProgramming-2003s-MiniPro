// GameCanvas.java input portion — keyboard handler

export class Input {
    constructor() {
        this.kLeft = false;
        this.kRight = false;
        this.kUp = false;
        this.kDown = false;
        this.kFire = false;

        // D-pad configuration
        this.DPAD_DEAD_ZONE_RATIO = 0.4; // 0.0 (no dead zone) ~ 1.0 (entire circle)

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
        // Circular D-pad
        this._dpadCanvas = document.getElementById('dpad-canvas');
        if (this._dpadCanvas) {
            this._dpadCtx = this._dpadCanvas.getContext('2d');
            this._activeDpadFlags = new Set();

            this._dpadCanvas.addEventListener('touchstart', (e) => this._onDpadTouch(e), { passive: false });
            this._dpadCanvas.addEventListener('touchmove', (e) => this._onDpadTouch(e), { passive: false });
            this._dpadCanvas.addEventListener('touchend', (e) => this._onDpadTouchEnd(e), { passive: false });
            this._dpadCanvas.addEventListener('touchcancel', (e) => this._onDpadTouchEnd(e), { passive: false });

            // Initial draw
            this._drawDpad(new Set());
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

    _getTouchDirection(touchX, touchY) {
        const rect = this._dpadCanvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const radius = rect.width / 2;
        const dx = touchX - cx;
        const dy = touchY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Dead zone (center) or outside circle
        if (dist < radius * this.DPAD_DEAD_ZONE_RATIO || dist > radius) return new Set();

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const flags = new Set();

        if (angle > -112.5 && angle <= -67.5) {
            flags.add('kUp');
        } else if (angle > -67.5 && angle <= -22.5) {
            flags.add('kUp'); flags.add('kRight');
        } else if (angle > -22.5 && angle <= 22.5) {
            flags.add('kRight');
        } else if (angle > 22.5 && angle <= 67.5) {
            flags.add('kDown'); flags.add('kRight');
        } else if (angle > 67.5 && angle <= 112.5) {
            flags.add('kDown');
        } else if (angle > 112.5 && angle <= 157.5) {
            flags.add('kDown'); flags.add('kLeft');
        } else if (angle > 157.5 || angle <= -157.5) {
            flags.add('kLeft');
        } else {
            flags.add('kUp'); flags.add('kLeft');
        }
        return flags;
    }

    _onDpadTouch(e) {
        e.preventDefault();
        const newFlags = new Set();
        for (const touch of e.touches) {
            for (const flag of this._getTouchDirection(touch.clientX, touch.clientY)) {
                newFlags.add(flag);
            }
        }
        this._applyDpadFlags(newFlags);
    }

    _onDpadTouchEnd(e) {
        e.preventDefault();
        const newFlags = new Set();
        for (const touch of e.touches) {
            for (const flag of this._getTouchDirection(touch.clientX, touch.clientY)) {
                newFlags.add(flag);
            }
        }
        this._applyDpadFlags(newFlags);
    }

    _applyDpadFlags(newFlags) {
        for (const flag of this._activeDpadFlags) {
            if (!newFlags.has(flag)) this[flag] = false;
        }
        for (const flag of newFlags) {
            this[flag] = true;
        }
        this._activeDpadFlags = newFlags;
        this._drawDpad(newFlags);
    }

    _drawDpad(activeFlags) {
        const ctx = this._dpadCtx;
        const w = this._dpadCanvas.width;
        const h = this._dpadCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = w / 2 - 2; // slight margin for stroke

        ctx.clearRect(0, 0, w, h);

        // Draw active zone highlights
        const zones = [
            { flag: 'kUp',    startAngle: -112.5, endAngle: -67.5 },
            { flag: 'kRight', startAngle: -22.5,  endAngle: 22.5 },
            { flag: 'kDown',  startAngle: 67.5,   endAngle: 112.5 },
            { flag: 'kLeft',  startAngle: 157.5,  endAngle: 202.5 },
        ];
        const innerR = r * this.DPAD_DEAD_ZONE_RATIO;

        for (const zone of zones) {
            if (activeFlags.has(zone.flag)) {
                const sa = zone.startAngle * Math.PI / 180;
                const ea = zone.endAngle * Math.PI / 180;
                ctx.beginPath();
                ctx.arc(cx, cy, r, sa, ea);
                ctx.arc(cx, cy, innerR, ea, sa, true);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.fill();
            }
        }

        // Also highlight diagonal zones
        const diagZones = [
            { flags: ['kUp', 'kRight'],   startAngle: -67.5,  endAngle: -22.5 },
            { flags: ['kDown', 'kRight'],  startAngle: 22.5,   endAngle: 67.5 },
            { flags: ['kDown', 'kLeft'],   startAngle: 112.5,  endAngle: 157.5 },
            { flags: ['kUp', 'kLeft'],     startAngle: -157.5, endAngle: -112.5 },
        ];

        for (const zone of diagZones) {
            if (zone.flags.every(f => activeFlags.has(f))) {
                const sa = zone.startAngle * Math.PI / 180;
                const ea = zone.endAngle * Math.PI / 180;
                ctx.beginPath();
                ctx.arc(cx, cy, r, sa, ea);
                ctx.arc(cx, cy, innerR, ea, sa, true);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.fill();
            }
        }

        // Outer circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner dead zone circle
        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Direction labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelR = (r + innerR) / 2;
        ctx.fillText('▲︎', cx, cy - labelR);
        ctx.fillText('▼︎', cx, cy + labelR);
        ctx.fillText('◀︎', cx - labelR, cy);
        ctx.fillText('▶︎', cx + labelR, cy);
    }
}
