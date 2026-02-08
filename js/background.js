// Background.java port — scrolling checkerboard

import { GameObject } from './gameObject.js';

export class Background extends GameObject {
    constructor(game) {
        super(game);
        this.tileSize = 30;
        this.baseY = 0;
        this.speed = 2;
    }

    update() {
        this.baseY = (this.baseY + this.speed) % (this.tileSize * 2);
    }

    paint(g) {
        const W = this.game.WIDTH;
        const H = this.game.HEIGHT;
        for (let y = -2; y <= H / this.tileSize; y++) {
            for (let x = 0; x <= H / this.tileSize; x++) {
                g.setColor(((x + y) % 2 !== 0) ? 0xFFFFFF : 0xAAAAAA);
                g.fillRect(
                    x * this.tileSize,
                    y * this.tileSize + this.baseY,
                    this.tileSize, this.tileSize
                );
            }
        }
    }
}
