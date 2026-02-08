// ScoreItem.java port

import { GameObject } from './gameObject.js';
import { rand } from './math.js';

export class ScoreItem extends GameObject {
    constructor(game, x, y) {
        super(game);
        this.r = 10;
        this.x = x;
        this.y = y;
        this.score = rand(0, 30) * 10;
    }

    update() {
        this.y += 1;
        if (this.y > this.game.HEIGHT)
            this.game.removeObject(this);
    }

    paint(g) {
        g.setColor(0x0000FF);
        g.drawString('♪', this.x, this.y, 1 | 2); // HCENTER | VCENTER
    }
}
