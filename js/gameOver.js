// GameOver.java port

import { GameObject } from './gameObject.js';
import { HCENTER, TOP } from './renderer.js';
import { t } from './i18n.js';

export class GameOver extends GameObject {
    constructor(game, title) {
        super(game);
        this.title = title;
        this.flag = false;
    }

    update() {
        if (this.game.input.isFiring()) {
            this.flag = true;
        } else if (this.flag) {
            this.game.initGame();
        }
    }

    paint(g) {
        const W = this.game.WIDTH;

        g.setColor(0x000000);
        g.fillRect(0, 0, this.game.WIDTH, this.game.HEIGHT);

        g.setColor(0xFFFFFF);
        g.drawString(this.title, W / 2, 20, HCENTER | TOP);
        g.drawString(t('score') + this.game.score, W / 2, 50, HCENTER | TOP);
        g.drawString(t('highScore') + this.game.highScore, W / 2, 70, HCENTER | TOP);
    }
}
