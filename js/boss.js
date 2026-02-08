// Boss.java + Boss1~3 port

import { Enemy } from './enemy.js';
import { Bullet, EnemyBullet0 } from './bullet.js';
import { Explosion } from './explosion.js';
import { GameObject } from './gameObject.js';
import { sin8, cos8, rand } from './math.js';
import { HCENTER, VCENTER } from './renderer.js';

// Base Boss class
class Boss extends Enemy {
    constructor(game) {
        super(game);
    }

    paint(g) {
        const maxWidth = (this.game.WIDTH / 2 - 3) | 0;
        g.setColor(0xFF0000);
        g.fillRect(
            (this.game.WIDTH / 2) | 0, 3,
            (maxWidth * this.life / this.getMaxLife()) | 0, 10
        );
        g.setColor(0x000000);
        g.drawRect((this.game.WIDTH / 2) | 0, 3, maxWidth, 10);
    }

    getMaxLife() { return 1; }

    hit() {
        super.hit();
        this.game.score += 10;
    }
}

// Boss1 — first boss with kusa images
export class Boss1 extends Boss {
    constructor(game) {
        super(game);
        this.MAX_LIFE = 60;
        this.life = this.MAX_LIFE;
        this.r = 10;

        this.imgs = [
            game.images.kusa_down,
            game.images.kusa_left,
            game.images.kusa_right
        ];
        this.img = this.imgs[0];

        this.x = (game.WIDTH / 2) | 0;
        this.y = -20;
        this.v = 2;

        this.minX = 0 + this.r;
        this.minY = 0 + this.r;
        this.maxX = game.WIDTH - this.r;
        this.maxY = game.HEIGHT - this.r;

        this._gen = this._script();
        this._gen.next();
    }

    *_patternA() {
        this.img = this.imgs[0];
        while (this.y < this.game.HEIGHT / 3) {
            this.y += this.v;
            yield;
        }
    }

    _patternB() {
        if (this.v > 0)
            this.img = this.imgs[2];
        else
            this.img = this.imgs[1];

        this.x += this.v;
        if (this.x < this.minX) {
            this.x = this.minX;
            this.v = -this.v;
            this.img = this.imgs[2];
        } else if (this.x > this.maxX) {
            this.x = this.maxX;
            this.v = -this.v;
            this.img = this.imgs[1];
        }

        if (rand(0, 20) === 0) {
            const a = rand(90 - 60, 90 + 60);
            this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a));
            this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a + 30));
            this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, a - 30));
        }
    }

    *_patternC() {
        const cx = ((this.minX + this.maxX) / 2) | 0;

        if (this.v < 0) this.v = -this.v;

        this.img = this.imgs[2];
        while (this.x < cx && this.x + this.v < this.maxX) {
            this.x += 2 * this.v;
            yield;
        }
        this.img = this.imgs[1];
        while (cx < this.x && this.minX < this.x - this.v) {
            this.x -= 2 * this.v;
            yield;
        }

        this.img = this.imgs[0];
        for (let i = 0; i < ((360 * 3) / 20) | 0; i++) {
            const angle = (20 * i) % 360;
            this.game.objects.push(new EnemyBullet0(this.game, this.x, this.y, angle));
            yield;
        }
    }

    *_patternD() {
        this.img = this.imgs[0];
        const W = this.game.WIDTH;
        for (let k = 0; k < (W / 5) | 0; k++) {
            this.game.objects.push(
                new EnemyBullet0(this.game, (k * W / 5) | 0, 0, 90)
            );
            yield;
        }
    }

    *_script() {
        yield;

        yield* this._patternA();

        let tick = 0;
        while (true) {
            tick = (tick + 1) % 200;
            if (tick === 0)
                yield* this._patternC();
            else if (tick === 100)
                yield* this._patternD();
            else
                this._patternB();
            yield;
        }
    }

    update() {
        this._gen.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.removeObject(this);
            this.game.score += 1000;
        }
    }

    paint(g) {
        super.paint(g);
        g.drawImage(this.img, this.x, this.y, HCENTER | VCENTER);
    }

    getMaxLife() { return this.MAX_LIFE; }

    on_removed() {
        this._gen.return();
    }
}

// TwistingBullet — used by Boss2
class TwistingBullet extends GameObject {
    constructor(game, x, y, angle) {
        super(game);
        this.N = 3;
        this.origX = x;
        this.origY = y;
        this.angle = angle;
        this.ticks = 0;
        this.ba = 0;
        this.br = 10;
        this.speed = 1;

        this.bullets = [];
        for (let i = 0; i < this.N; i++) {
            const b = new Bullet(game, x, y);
            b.isEnemyBullet = true;
            b.color = 0x0000FF;
            b.r = 6;
            game.addObject(b);
            this.bullets.push(b);
        }
        this._updateBulletPos(this.origX, this.origY);
    }

    _updateBulletPos(x, y) {
        for (let i = 0; i < this.N; i++) {
            this.bullets[i].x = x + (cos8(this.ba + ((i * 360 / this.N) | 0)) * this.br >> 8);
            this.bullets[i].y = y + (sin8(this.ba + ((i * 360 / this.N) | 0)) * this.br >> 8);
        }
    }

    paint(g) {}

    update() {
        const x = this.origX + ((cos8(this.angle) * this.speed * this.ticks) >> 8);
        const y = this.origY + ((sin8(this.angle) * this.speed * this.ticks) >> 8);

        if (x + this.br <= 0 ||
            x - this.br >= this.game.WIDTH ||
            y + this.br <= 0 ||
            y - this.br >= this.game.HEIGHT) {
            this.game.removeObject(this);
            for (let i = 0; i < this.N; i++) {
                this.game.removeObject(this.bullets[i]);
            }
        }

        this.ba = (this.ba + 10) % 360;
        this._updateBulletPos(x, y);
        this.ticks++;
    }
}

// Boss2
export class Boss2 extends Boss {
    constructor(game) {
        super(game);
        this.MAX_LIFE = 150;
        this.life = this.MAX_LIFE;
        this.r = 10;
        this.ready = false;

        this.img = game.images.blob;

        this.x = (game.WIDTH / 2) | 0;
        this.y = -20;
        this.v = 2;

        this._gen = this._script();
        this._gen.next();
    }

    *_script() {
        yield;

        // pattern_a: enter screen
        while (this.y < this.game.HEIGHT / 4) {
            this.y += this.v;
            yield;
        }
        this.ready = true;

        const baseX = this.x;
        const baseY = this.y;

        // Phase 1: circular movement with sub-coroutine firing
        {
            const subGen = this._subFire1();
            subGen.next();
            try {
                while (this.life > this.MAX_LIFE * 3 / 4) {
                    const r = 30;
                    for (let a = 0; a < 360; a += 5) {
                        const cx = baseX - r;
                        const cy = baseY;
                        this.x = cx + ((cos8(a) * r) >> 8);
                        this.y = cy + ((sin8(a) * r) >> 8);
                        subGen.next();
                        yield;
                    }
                    for (let a = 0; a < 360; a += 5) {
                        const cx = baseX + r;
                        const cy = baseY;
                        this.x = cx + ((cos8(180 - a) * r) >> 8);
                        this.y = cy + ((sin8(180 - a) * r) >> 8);
                        subGen.next();
                        yield;
                    }
                }
            } finally {
                subGen.return();
            }
        }

        // Move to center
        {
            const cx = (this.game.WIDTH / 2) | 0;
            const cy = (this.game.HEIGHT / 2) | 0;
            const savedX = this.x;
            const savedY = this.y;
            for (let i = 0; i < 40; i++) {
                this.x = savedX + ((cx - savedX) * i / 40) | 0;
                this.y = savedY + ((cy - savedY) * i / 40) | 0;
                yield;
            }
            this.x = cx;
            this.y = cy;
        }

        // Phase 2: sweeping bullet patterns (2 loops)
        for (let l = 0; l < 2; l++) {
            {
                let a = 0;
                for (; a < 360; a += 5) {
                    this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a));
                    this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a + 180));
                    for (let k = 0; k < 4; k++) yield;
                }
                for (; a > 0; a -= 5) {
                    this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a));
                    this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a + 180));
                    for (let k = 0; k < 4; k++) yield;
                }
            }
            {
                let a = 0;
                let i = 0;
                let firing = false;
                for (; a < 360; a += 10) {
                    if (firing) {
                        this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a));
                        this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, 180 - a));
                        this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, 180 + a));
                        this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, 360 - a));
                    }
                    i += 1;
                    if (i === 3) { i = 0; firing = !firing; }
                    for (let k = 0; k < 3; k++) yield;
                }
            }
        }

        // Move back to base position
        {
            const savedX = this.x;
            const savedY = this.y;
            for (let i = 0; i < 40; i++) {
                this.x = savedX + ((baseX - savedX) * i / 40) | 0;
                this.y = savedY + ((baseY - savedY) * i / 40) | 0;
                yield;
            }
            this.x = baseX;
            this.y = baseY;
        }

        // Phase 3: twisting bullets + spread shots
        while (true) {
            {
                const a = rand(0 + 45, 180 - 45);
                this.game.addObject(new TwistingBullet(this.game, this.x, this.y, a));
            }
            for (let j = 0; j < 10; j++) yield;

            for (let k = 0; k < 3; k++) {
                const a = rand(0 + 30, 180 - 30);
                this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a));
                this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a + 30));
                this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a - 30));
                for (let j = 0; j < 10; j++) yield;
            }
        }
    }

    *_subFire1() {
        yield;
        while (true) {
            for (let i = 0; i < 35; i++) yield;
            for (let a = 0; a < 360; a += 20) {
                this.game.addObject(new EnemyBullet0(this.game, this.x, this.y, a));
            }
        }
    }

    update() {
        this._gen.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.removeObject(this);
            this.game.score += 2000;
        }
    }

    paint(g) {
        super.paint(g);
        g.drawImage(this.img, this.x, this.y, HCENTER | VCENTER);
    }

    hit() {
        if (this.ready) super.hit();
    }

    getMaxLife() { return this.MAX_LIFE; }

    on_removed() {
        this._gen.return();
    }
}

// XBullet — spiral outward bullet (Boss3)
class XBullet extends Bullet {
    constructor(game, x, y) {
        super(game, x, y);
        this.isEnemyBullet = true;
        this.color = 0xFF0000;
        this.origX = x;
        this.origY = y;
        this.len8 = 0;
        this.angle = 0;
    }

    update() {
        this.angle += 10;
        this.len8 += 210;
        this.x = this.origX + ((cos8(this.angle) * this.len8) >> 16);
        this.y = this.origY + ((sin8(this.angle) * this.len8) >> 16);

        if ((this.len8 >> 8) > this.game.HEIGHT)
            this.game.removeObject(this);
    }
}

// YBullet — vertical falling bullet that stops (Boss3)
class YBullet extends Bullet {
    constructor(game, x, y, maxY) {
        super(game, x, y);
        this.color = 0xFF0000;
        this.isEnemyBullet = true;
        this.speed = 5;
        this.origX = x;
        this.origY = y;
        this.maxY = maxY;
        this.ticks = 0;
        this.flag = false;
    }

    update() {
        if (!this.flag) {
            this.ticks++;
            this.y = this.origY + this.speed * this.ticks;
            if (this.y > this.maxY) {
                this.flag = true;
                this.y = this.maxY;
            }
        }

        if (this.x + this.r <= 0 ||
            this.x - this.r >= this.game.WIDTH ||
            this.y + this.r <= 0 ||
            this.y - this.r >= this.game.HEIGHT) {
            this.game.removeObject(this);
        }
    }
}

// Boss3 — final boss
export class Boss3 extends Boss {
    constructor(game) {
        super(game);
        this.MAX_LIFE = 200;
        this.life = this.MAX_LIFE;
        this.r = 10;
        this.ready = false;

        this.img = game.images.dawa;

        this.x = (game.WIDTH / 2) | 0;
        this.y = -20;
        this.v = 2;

        this._gen = this._script();
        this._gen.next();
    }

    *_moveTo(newX, newY) {
        const savedX = this.x;
        const savedY = this.y;
        for (let i = 0; i < 40; i++) {
            this.x = savedX + ((newX - savedX) * i / 40) | 0;
            this.y = savedY + ((newY - savedY) * i / 40) | 0;
            yield;
        }
        this.x = newX;
        this.y = newY;
    }

    *_moveToCenter() {
        yield* this._moveTo((this.game.WIDTH / 2) | 0, (this.game.HEIGHT / 2) | 0);
    }

    *_patternW() {
        for (let i = 0; i < 3; i++) {
            const newX = rand(0 + this.r, this.game.WIDTH - this.r);
            const newY = rand(0 + this.r, (this.game.HEIGHT / 2 - this.r) | 0);
            yield* this._moveTo(newX, newY);

            const a = rand(0, 180);
            const v = [-45, -15, 15, 45];
            for (let k = 0; k < v.length; k++) {
                for (let j = 1; j <= 3; j++) {
                    const b = new EnemyBullet0(this.game, this.x, this.y, a + v[k]);
                    b.speed = j;
                    this.game.addObject(b);
                }
            }
        }
    }

    *_patternX() {
        yield* this._moveToCenter();
        for (let j = 0; j < 15; j++) {
            this.game.addObject(new XBullet(this.game, this.x, this.y));
            for (let i = 0; i < 4; i++) yield;
        }
    }

    *_patternY() {
        let startX = (this.game.WIDTH / 6) | 0;
        let destX = this.game.WIDTH - startX;

        if (rand(0, 1) === 0) {
            const tmp = startX; startX = destX; destX = tmp;
        }

        yield* this._moveTo(startX, (this.game.HEIGHT / 4) | 0);
        for (let i = 0; i < 10; i++) yield;

        const yBullets = [];
        try {
            for (let i = 0; i < 10; i++) {
                const baseYY = this.y + this.r;
                const maxYY = baseYY + ((this.game.HEIGHT - baseYY) * (10 - i) / 10) | 0;
                const yb = new YBullet(this.game, this.x, this.y, maxYY);
                this.game.addObject(yb);
                yBullets.push(yb);
                for (let j = 0; j < 3; j++) yield;
            }

            for (let i = 0; i < 20; i++) yield;

            const savedX = this.x;
            for (let i = 0; i < 20; i++) {
                this.x = savedX + ((destX - savedX) * i / 20) | 0;
                for (let j = 0; j < yBullets.length; j++) {
                    yBullets[j].x = this.x;
                }
                yield;
            }
            this.x = destX;

            for (let i = 0; i < 10; i++) yield;
        } finally {
            for (let j = 0; j < yBullets.length; j++) {
                if (yBullets[j] != null)
                    this.game.removeObject(yBullets[j]);
            }
        }
    }

    *_patternZ() {
        yield* this._moveTo((this.game.WIDTH / 2) | 0, this.r);

        for (let j = 0; j < 4; j++) {
            const n = 4;
            for (let i = 0; i < n; i++) {
                const xx = (this.game.WIDTH * i / n) | 0;
                this.game.addObject(new EnemyBullet0(this.game, xx, 0, 90));
            }
            for (let i = 0; i < 15; i++) yield;

            const bx = (this.game.WIDTH / (2 * n)) | 0;
            for (let i = 0; i < n; i++) {
                const xx = bx + (this.game.WIDTH * i / n) | 0;
                this.game.addObject(new EnemyBullet0(this.game, xx, 0, 90));
            }
            for (let i = 0; i < 15; i++) yield;
        }
    }

    *_script() {
        yield;

        // Enter screen
        while (this.y < this.game.HEIGHT / 4) {
            this.y += this.v;
            yield;
        }
        this.ready = true;

        const baseX = this.x;
        const baseY = this.y;

        // Phase 1: circular movement with sub-coroutine
        {
            const subGen = this._subFire1();
            subGen.next();
            try {
                while (this.life > this.MAX_LIFE * 3 / 4) {
                    const r = 30;
                    for (let a = 0; a < 360; a += 5) {
                        const cx = baseX - r;
                        const cy = baseY;
                        this.x = cx + ((cos8(a) * r) >> 8);
                        this.y = cy + ((sin8(a) * r) >> 8);
                        subGen.next();
                        yield;
                    }
                    for (let a = 0; a < 360; a += 5) {
                        const cx = baseX + r;
                        const cy = baseY;
                        this.x = cx + ((cos8(180 - a) * r) >> 8);
                        this.y = cy + ((sin8(180 - a) * r) >> 8);
                        subGen.next();
                        yield;
                    }
                }
            } finally {
                subGen.return();
            }
        }

        // Phase 2: random attack patterns
        while (true) {
            const r = rand(0, 5);
            if (r === 0) {
                yield* this._patternX();
                for (let i = 0; i < 10; i++) yield;
            } else if (r === 1) {
                yield* this._patternY();
            } else if (r === 2) {
                yield* this._patternZ();
            } else {
                yield* this._patternW();
            }
        }
    }

    *_subFire1() {
        yield;
        while (true) {
            for (let i = 0; i < 20; i++) yield;
            const a = rand(0 + 30, 180 - 30);
            for (let j = 1; j <= 3; j++) {
                const b = new EnemyBullet0(this.game, this.x, this.y, a);
                b.speed = j;
                this.game.addObject(b);
            }
        }
    }

    update() {
        this._gen.next();
        this.checkBullets(this.x, this.y, this.r);
        if (this.life <= 0) {
            this.game.addObject(new Explosion(this.game, this.x, this.y));
            this.game.removeObject(this);
            this.game.score += 5000;
        }
    }

    paint(g) {
        super.paint(g);
        g.drawImage(this.img, this.x, this.y, HCENTER | VCENTER);
    }

    hit() {
        if (this.ready) super.hit();
    }

    getMaxLife() { return this.MAX_LIFE; }

    on_removed() {
        this._gen.return();
    }
}
