// Title.java port

import { GameObject } from './gameObject.js';
import { Background } from './background.js';
import { Player } from './player.js';
import { Stage1 } from './stage.js';
import { HCENTER, LEFT, TOP, BOTTOM } from './renderer.js';
import { t } from './i18n.js';

export class Title extends GameObject {
    constructor(game) {
        super(game);
        this.flag = false;
    }

    update() {
        if (this.game.input.isFiring()) {
            this.flag = true;
        } else if (this.flag) {
            this.game.removeObject(this);

            this.game.addObject(this.game.background);
            this.game.addObject(this.game.player);
            this.game.addObject(new Stage1(this.game));
        }
    }

    paint(g) {
        const W = this.game.WIDTH;
        const H = this.game.HEIGHT;

        g.setColor(0x000000);
        g.fillRect(0, 0, W, H);

        g.setColor(0xFFFFFF);
        g.drawString(t('titleLine1'), W / 2, 20, HCENTER | TOP);
        g.drawString(t('titleLine2'), W / 2, 40, HCENTER | TOP);

        let y = (H / 2 - 10) | 0;
        const x = 10;
        const fh = g.getFontHeight();

        g.drawString(t('howToMove'), x, y, LEFT | TOP);
        y += fh;
        g.drawString(t('noteItem'), x, y, LEFT | TOP);
        y += fh;
        g.drawString(t('goalScore'), x, y, LEFT | TOP);

        g.drawString(t('pressEnter'), W / 2, H - 20, HCENTER | BOTTOM);
    }
}
