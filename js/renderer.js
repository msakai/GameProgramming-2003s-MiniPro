// Graphics API wrapper for Canvas 2D

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    setColor(rgb) {
        const hex = '#' + rgb.toString(16).padStart(6, '0');
        this.ctx.fillStyle = hex;
        this.ctx.strokeStyle = hex;
    }

    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
    }

    drawRect(x, y, w, h) {
        this.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
    }

    fillArc(x, y, w, h, startAngle, arcAngle) {
        // Java ME fillArc(x, y, w, h, ...) — x,y is top-left of bounding box
        const cx = x + w / 2;
        const cy = y + h / 2;
        const rx = w / 2;
        const ry = h / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawArc(x, y, w, h, startAngle, arcAngle) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const rx = w / 2;
        const ry = h / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawImage(img, x, y, anchor) {
        // anchor constants: HCENTER=1, VCENTER=2, LEFT=4, TOP=8
        const HCENTER = 1, VCENTER = 2, LEFT = 4, TOP = 8;
        let dx = x, dy = y;
        if (anchor & HCENTER) dx = x - img.width / 2;
        else if (anchor & LEFT) dx = x;
        if (anchor & VCENTER) dy = y - img.height / 2;
        else if (anchor & TOP) dy = y;
        this.ctx.drawImage(img, dx, dy);
    }

    drawString(str, x, y, anchor) {
        const HCENTER = 1, VCENTER = 2, LEFT = 4, TOP = 8, BOTTOM = 16;
        this.ctx.font = '8px monospace';

        if (anchor & HCENTER) this.ctx.textAlign = 'center';
        else if (anchor & LEFT) this.ctx.textAlign = 'left';
        else this.ctx.textAlign = 'left';

        if (anchor & VCENTER) this.ctx.textBaseline = 'middle';
        else if (anchor & TOP) this.ctx.textBaseline = 'top';
        else if (anchor & BOTTOM) this.ctx.textBaseline = 'bottom';
        else this.ctx.textBaseline = 'top';

        this.ctx.fillText(str, x, y);
    }

    getFontHeight() {
        return 10;
    }
}

// Anchor constants matching Java ME
export const HCENTER = 1;
export const VCENTER = 2;
export const LEFT = 4;
export const TOP = 8;
export const BOTTOM = 16;
