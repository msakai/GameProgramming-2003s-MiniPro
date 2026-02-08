// Bullet.java + SimpleBullet.java + EnemyBullet0.java port

import { GameObject } from './gameObject.js';
import { sin8, cos8 } from './math.js';

export class Bullet extends GameObject {
    constructor(game, x, y) {
        super(game);
        this.color = 0x00FFFF;
        this.r = 4;
        this.x = x;
        this.y = y;
        this.isEnemyBullet = false;
    }

    update() {}

    paint(g) {
        g.setColor(this.color);
        g.fillArc(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2, 0, 360);
        g.setColor(0xFFFFFF);
        g.fillArc(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r, 0, 360);
    }
}

export class SimpleBullet extends Bullet {
    constructor(game, x, y, angle) {
        super(game, x, y);
        this.speed = 5;
        this.angle = angle;
        this.origX = x;
        this.origY = y;
        this.ticks = 0;
    }

    update() {
        this.ticks++;
        this.x = this.origX + ((cos8(this.angle) * this.speed * this.ticks) >> 8);
        this.y = this.origY + ((sin8(this.angle) * this.speed * this.ticks) >> 8);

        if (this.x + this.r <= 0 ||
            this.x - this.r >= this.game.WIDTH ||
            this.y + this.r <= 0 ||
            this.y - this.r >= this.game.HEIGHT) {
            this.game.removeObject(this);
        }
    }
}

export class EnemyBullet0 extends SimpleBullet {
    constructor(game, x, y, angle) {
        super(game, x, y, angle);
        this.color = 0xFF0000;
        this.speed = 2;
        this.isEnemyBullet = true;
    }
}
