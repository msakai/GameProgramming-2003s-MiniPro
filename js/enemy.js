// Enemy.java + Enemy1~5 port

import { GameObject } from './gameObject.js';
import { Bullet, EnemyBullet0 } from './bullet.js';
import { Explosion } from './explosion.js';
import { ScoreItem } from './scoreItem.js';
import { sin8, cos8, rand } from './math.js';

// Base Enemy class
export class Enemy extends GameObject {
    constructor(game) {
        super(game);
        this.life = 1;
    }

    checkBullets(x, y, r) {
        for (const o of this.game.objects) {
            if (o instanceof Bullet) {
                if (o.isEnemyBullet) continue;
                const x2 = o.x - x;
                const y2 = o.y - y;
                const r2 = o.r + r;
                if (x2 * x2 + y2 * y2 < r2 * r2) {
                    this.hit();
                    this.game.sound[1].stop();
                    this.game.sound[1].play(1);
                    this.game.removeObject(o);
                }
            }
        }
    }

    hit() {
        this.life--;
    }

    isAlive() {
        return this.life > 0;
    }
}

// Enemy1 — simple falling enemy that fires occasionally
export class Enemy1 extends Enemy {
    constructor(game, argX) {
        super(game);
        this.life = 1;
        this.r = 5;
        this.x = argX;
        this.y = -20;
        this.v = 1;

        const self = this;
        this._gen = this._script();
        this._gen.next(); // advance to first yield
    }

    *_script() {
        let i = rand(0, 50);
        yield;
        while (this.life > 0 && this.y < this.game.HEIGHT) {
            this.y += this.v;
            i += 1;
            if (i % 50 === 0) {
                const a = rand(90 - 60, 90 + 60);
                this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a));
            }
            yield;
        }
        this.game.removeObject(this);
    }

    update() {
        this._gen.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.removeObject(this);
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.score += 50;
            if (rand(0, 10) < 3)
                this.game.addObject(new ScoreItem(this.game, this.x, this.y));
        }
    }

    paint(g) {
        g.setColor(0x000000);
        g.fillRect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
    }

    on_removed() {
        this._gen.return();
    }
}

// Enemy2 — circular arc movement
export class Enemy2 extends Enemy {
    constructor(game, argX, argY) {
        super(game);
        this.life = 1;
        this.r = 5;
        this.x = argX;
        this.y = argY;

        this._gen1 = this._script1();
        this._gen1.next();
        this._gen2 = this._script2();
        this._gen2.next();
    }

    *_script1() {
        yield;
        const r = (this.game.WIDTH / 2) | 0;
        const baseY = this.y;

        if (this.x < this.game.WIDTH / 2) {
            const baseX = this.x + r;
            for (let a = 180; a > 0; a -= 3) {
                this.x = baseX + (cos8(a) * r >> 8);
                this.y = baseY + (sin8(a) * r >> 8);
                yield;
            }
        } else {
            const baseX = this.x - r;
            for (let a = 0; a < 180; a += 3) {
                this.x = baseX + (cos8(a) * r >> 8);
                this.y = baseY + (sin8(a) * r >> 8);
                yield;
            }
        }
        this.game.removeObject(this);
    }

    *_script2() {
        let i = rand(0, 30);
        yield;
        while (this.life > 0) {
            i += 1;
            if (i % 30 === 0) {
                const a = rand(90 - 60, 90 + 60);
                this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a));
            }
            yield;
        }
    }

    update() {
        this._gen1.next();
        this._gen2.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.removeObject(this);
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.score += 50;
            if (rand(0, 10) < 3)
                this.game.addObject(new ScoreItem(this.game, this.x, this.y));
        }
    }

    paint(g) {
        g.setColor(0x000000);
        g.fillRect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
    }

    on_removed() {
        this._gen1.return();
        this._gen2.return();
    }
}

// Enemy3 — two-health falling enemy
export class Enemy3 extends Enemy {
    constructor(game, argX, width) {
        super(game);
        this.life = 2;
        this.r = 5;
        this.x = argX + this.r;
        this.y = -20;
        this.v = 1;

        this._gen = this._script();
        this._gen.next();
    }

    *_script() {
        yield;
        while (this.life > 0 && this.y < this.game.HEIGHT) {
            this.y += this.v;
            yield;
        }
        this.game.removeObject(this);
    }

    update() {
        this._gen.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.removeObject(this);
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.score += 50;
            if (rand(0, 10) < 3)
                this.game.addObject(new ScoreItem(this.game, this.x, this.y));
        }
    }

    paint(g) {
        g.setColor(0x000000);
        g.fillRect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
    }

    on_removed() {
        this._gen.return();
    }
}

// Enemy4 — four-health enemy that fires bursts
export class Enemy4 extends Enemy {
    constructor(game, argX, argY) {
        super(game);
        this.life = 4;
        this.r = 5;
        this.x = argX;
        this.y = argY;
        this.v = 1;

        this._gen1 = this._script1();
        this._gen1.next();
        this._gen2 = this._script2();
        this._gen2.next();
    }

    *_script1() {
        yield;
        while (this.life > 0 && this.y < this.game.HEIGHT) {
            this.y += this.v;
            yield;
        }
        this.game.removeObject(this);
    }

    *_script2() {
        yield;
        while (true) {
            let a;
            if (this.x < this.game.WIDTH / 2) {
                a = 0 + 30;
            } else {
                a = 180 - 30;
            }
            for (let i = 0; i < 4; i++) {
                this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a));
                for (let j = 0; j < 4; j++) yield;
            }
            for (let j = 0; j < 25; j++) yield;
        }
    }

    update() {
        this._gen1.next();
        this._gen2.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.removeObject(this);
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.score += 200;
            if (rand(0, 10) < 5)
                this.game.addObject(new ScoreItem(this.game, this.x, this.y));
        }
    }

    paint(g) {
        g.setColor(0x000000);
        g.fillRect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
    }

    on_removed() {
        this._gen1.return();
        this._gen2.return();
    }
}

// Enemy5 — spiral movement
export class Enemy5 extends Enemy {
    constructor(game, argX, argY, sign) {
        super(game);
        this.life = 1;
        this.r = 5;
        this.x = argX;
        this.y = argY;
        this.sign = sign;

        this._gen1 = this._script1();
        this._gen1.next();
        this._gen2 = this._script2();
        this._gen2.next();
    }

    *_script1() {
        yield;
        while (this.y < this.game.HEIGHT / 3) {
            this.y += 3;
            yield;
        }

        const r = (this.game.WIDTH / 4) | 0;
        const baseY = this.y;
        const baseX = this.x - r * this.sign;
        for (let a = 0; a <= 360; a += 5) {
            this.x = baseX + ((cos8(a) * r * this.sign) >> 8);
            this.y = baseY + ((sin8(a) * r) >> 8);
            yield;
        }

        while (this.y < this.game.HEIGHT) {
            this.y += 3;
            yield;
        }
        this.game.removeObject(this);
    }

    *_script2() {
        let i = rand(0, 60);
        yield;
        while (this.life > 0) {
            i += 1;
            if (i % 60 === 0) {
                const a = rand(90 - 60, 90 + 60);
                this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a));
            }
            yield;
        }
    }

    update() {
        this._gen1.next();
        this._gen2.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.removeObject(this);
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.score += 80;
            if (rand(0, 10) < 4)
                this.game.addObject(new ScoreItem(this.game, this.x, this.y));
        }
    }

    paint(g) {
        g.setColor(0x000000);
        g.fillRect(this.x - this.r, this.y - this.r, 2 * this.r, 2 * this.r);
    }

    on_removed() {
        this._gen1.return();
        this._gen2.return();
    }
}
