// Player.java port

import { GameObject } from './gameObject.js';
import { SimpleBullet } from './bullet.js';
import { Bullet } from './bullet.js';
import { Explosion } from './explosion.js';
import { ScoreItem } from './scoreItem.js';
import { rand } from './math.js';
import { HCENTER, VCENTER, LEFT, TOP } from './renderer.js';

export class Player extends GameObject {
    constructor(game) {
        super(game);
        this.img = game.images.ball;
        this.r = this.img.width / 2;

        this.minX = 0 + this.r;
        this.minY = 0 + this.r;
        this.maxX = game.WIDTH - this.r;
        this.maxY = game.HEIGHT - this.r;

        this.x = ((this.minX + this.maxX) / 2) | 0;
        this.y = this.maxY;
        this.fireWait = 3;
        this.mutekiJikan = 0;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;

        if (this.x < this.minX) this.x = this.minX;
        else if (this.x > this.maxX) this.x = this.maxX;

        if (this.y < this.minY) this.y = this.minY;
        else if (this.y > this.maxY) this.y = this.maxY;
    }

    update() {
        this.move(this.game.input.dx(), this.game.input.dy());

        // Auto-fire (original has fire always on)
        this.fireWait--;
        if (this.fireWait <= 0) {
            const angle = -90 + rand(-15, 15);
            const b = new SimpleBullet(this.game, this.x, this.y, angle);
            this.game.objects.push(b);
            this.fireWait = 3;
        }

        // Check collision with enemy bullets and score items
        for (const o of this.game.objects) {
            if (o instanceof Bullet) {
                if (!o.isEnemyBullet) continue;
                const r = (this.r / 2) | 0;
                const x2 = o.x - this.x;
                const y2 = o.y - this.y;
                const r2 = o.r + r;
                if (x2 * x2 + y2 * y2 < r2 * r2) {
                    this.game.removeObject(o);
                    this.hit();
                }
            }

            if (o instanceof ScoreItem) {
                const r = (this.r / 2) | 0;
                const x2 = o.x - this.x;
                const y2 = o.y - this.y;
                const r2 = o.r + r;
                if (x2 * x2 + y2 * y2 < r2 * r2) {
                    this.game.removeObject(o);
                    this.game.score += o.score;
                    this.game.sound[2].play(1);
                }
            }
        }

        if (this.mutekiJikan > 0)
            this.mutekiJikan--;
    }

    paint(g) {
        if (this.mutekiJikan > 0) {
            const r2 = this.r + 2;
            g.setColor(0x00FFFF);
            g.fillArc(this.x - r2, this.y - r2, r2 * 2, r2 * 2, 0, 360);
        }

        g.drawImage(this.img, this.x, this.y, HCENTER | VCENTER);

        // Lives display
        for (let i = 0; i < this.game.nPlayers; i++) {
            g.drawImage(this.img, 2 + i * (this.img.width + 2), 2, LEFT | TOP);
        }

        // Score display
        g.setColor(0x000000);
        g.drawString('Score:' + this.game.score,
                      2, this.img.height + 4, TOP | LEFT);
    }

    hit() {
        if (this.mutekiJikan <= 0) {
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.sound[3].play(1);

            if (this.game.nPlayers === 0) {
                this.game.gameover('GAME OVER');
            } else {
                this.game.nPlayers--;
                this.mutekiJikan = 100;
            }
        }
    }
}
