// Explosion.java port

import { GameObject } from './gameObject.js';

export class Explosion extends GameObject {
    constructor(game, x, y) {
        super(game);
        this.x = x;
        this.y = y;
        this.r = 0;
    }

    update() {
        this.r += 2;
        if (this.r >= 20)
            this.game.removeObject(this);
    }

    paint(g) {
        g.setColor(0xFFFFFF);
        g.drawArc(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2, 0, 360);
    }
}
