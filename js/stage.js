// Stage1~3.java port

import { GameObject } from './gameObject.js';
import { Enemy1, Enemy2, Enemy3, Enemy4, Enemy5 } from './enemy.js';
import { Boss1, Boss2, Boss3 } from './boss.js';
import { rand } from './math.js';

const MSECS_PER_TICK = 20;

function* waitTicks(n) {
    for (let i = 0; i < n; i++) yield;
}

function* waitMsec(msec) {
    yield* waitTicks((msec / MSECS_PER_TICK) | 0);
}

// Stage1
export class Stage1 extends GameObject {
    constructor(game) {
        super(game);
        this._gen = this._script();
        this._gen.next();
    }

    *_script() {
        yield;

        yield* waitMsec(1000);

        // Wave 1: 20 Enemy1s
        for (let i = 0; i < 20; i++) {
            const x = rand(0, this.game.WIDTH);
            this.game.addObject(new Enemy1(this.game, x));
            yield* waitMsec(300);
        }

        yield* waitMsec(1000);

        // Wave 2: Enemy2 formations
        for (let j = 0; j < 4; j++) {
            let x;
            if (j % 2 === 0)
                x = (this.game.WIDTH / 3) | 0;
            else
                x = (this.game.WIDTH * 2 / 3) | 0;

            for (let i = 0; i < 10; i++) {
                this.game.addObject(new Enemy2(this.game, x, 0));
                yield* waitMsec(200);
            }
            yield* waitMsec(300);
        }

        // Speed up background
        const origBgSpeed = this.game.background.speed;
        while (this.game.background.speed < 4) {
            this.game.background.speed++;
            yield* waitMsec(300);
        }
        yield* waitMsec(2000);

        // Boss
        const boss = new Boss1(this.game);
        this.game.addObject(boss);

        while (boss.isAlive()) yield;

        // Slow down background
        while (this.game.background.speed !== origBgSpeed) {
            this.game.background.speed--;
            yield* waitMsec(300);
        }
        this.game.background.speed = origBgSpeed;

        this.game.removeObject(this);
        this.game.addObject(new Stage2(this.game));
    }

    update() {
        this._gen.next();
    }

    paint(g) {}

    on_removed() {
        this._gen.return();
    }
}

// Stage2
export class Stage2 extends GameObject {
    constructor(game) {
        super(game);
        this._gen = this._script();
        this._gen.next();
    }

    *_script() {
        yield;

        yield* waitMsec(1500);

        // Wave 1: Enemy3 walls
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 10; i++) {
                const x = (this.game.WIDTH * i / 10) | 0;
                const w = (this.game.WIDTH / 10) | 0;
                this.game.addObject(new Enemy3(this.game, x, w));
            }
            yield* waitMsec(500);
        }

        yield* waitMsec(1500);

        // Wave 2: Enemy1 rush
        for (let j = 0; j < 20; j++) {
            this.game.addObject(new Enemy1(this.game, rand(0, this.game.WIDTH)));
            yield* waitMsec(100);
        }

        yield* waitMsec(1500);

        // Wave 3: more Enemy3 walls
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 10; i++) {
                const x = (this.game.WIDTH * i / 10) | 0;
                const w = (this.game.WIDTH / 10) | 0;
                this.game.addObject(new Enemy3(this.game, x, w));
            }
            yield* waitMsec(500);
        }

        yield* waitMsec(1000);

        // Speed up background
        const origBgSpeed = this.game.background.speed;
        while (this.game.background.speed < 4) {
            this.game.background.speed++;
            yield* waitMsec(300);
        }
        yield* waitMsec(2000);

        // Boss
        const boss = new Boss2(this.game);
        this.game.addObject(boss);

        while (boss.isAlive()) yield;

        while (this.game.background.speed !== origBgSpeed) {
            this.game.background.speed--;
            yield* waitMsec(300);
        }
        this.game.background.speed = origBgSpeed;

        this.game.removeObject(this);
        this.game.addObject(new Stage3(this.game));
    }

    update() {
        this._gen.next();
    }

    paint(g) {}

    on_removed() {
        this._gen.return();
    }
}

// Stage3
export class Stage3 extends GameObject {
    constructor(game) {
        super(game);
        this._gen = this._script();
        this._gen.next();
    }

    *_patternA() {
        for (let i = 0; i < 10; i++) {
            this.game.addObject(new Enemy5(this.game, (this.game.WIDTH * 2 / 3) | 0, -20, 1));
            yield* waitMsec(100);
        }
        for (let i = 0; i < 10; i++) {
            this.game.addObject(new Enemy5(this.game, (this.game.WIDTH / 3) | 0, -20, -1));
            yield* waitMsec(100);
        }
    }

    *_patternB() {
        for (let i = 0; i < 5; i++) {
            this.game.addObject(new Enemy4(this.game, 5, -20));
            yield* waitMsec(400);
            this.game.addObject(new Enemy4(this.game, this.game.WIDTH - 5, -20));
            yield* waitMsec(400);
        }
    }

    *_patternC() {
        for (let j = 0; j < 20; j++) {
            this.game.addObject(new Enemy1(this.game, rand(0, this.game.WIDTH)));
            yield* waitMsec(100);
        }
    }

    *_patternD() {
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 10; i++) {
                const x = (this.game.WIDTH * i / 10) | 0;
                const w = (this.game.WIDTH / 10) | 0;
                this.game.addObject(new Enemy3(this.game, x, w));
            }
            yield* waitMsec(500);
        }
    }

    *_script() {
        yield;

        yield* waitMsec(1500);
        yield* this._patternA();
        yield* waitMsec(1000);
        yield* this._patternC();
        yield* waitMsec(1000);
        yield* this._patternA();
        yield* waitMsec(2000);
        yield* this._patternB();
        yield* waitMsec(2500);
        yield* this._patternC();
        yield* waitMsec(1500);
        yield* this._patternD();
        yield* waitMsec(1500);

        // Speed up background
        const origBgSpeed = this.game.background.speed;
        while (this.game.background.speed < 4) {
            this.game.background.speed++;
            yield* waitMsec(300);
        }
        yield* waitMsec(2000);

        // Boss
        const boss = new Boss3(this.game);
        this.game.addObject(boss);

        while (boss.isAlive()) yield;

        yield* waitMsec(2000);

        while (this.game.background.speed !== origBgSpeed) {
            this.game.background.speed--;
            yield* waitMsec(300);
        }
        this.game.background.speed = origBgSpeed;

        yield* waitMsec(2000);

        this.game.removeObject(this);
        this.game.gameover('GAME CLEAR');
    }

    update() {
        this._gen.next();
    }

    paint(g) {}

    on_removed() {
        this._gen.return();
    }
}
