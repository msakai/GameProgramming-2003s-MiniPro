import javax.microedition.lcdui.*;

public class Bullet extends GameObject {
    protected int color = 0x00FFFF;

    public int r = 4;
    public int x, y;
    public boolean is_enemy_bullet = false;

    public Bullet(int x, int y) {
	super();
        this.x = x;
        this.y = y;
    }

    public void update() {
    }

    public void paint(Graphics g) {
        g.setColor(color);
        g.fillArc(x-r, y-r, r*2, r*2, 0, 360);

        g.setColor(0xFFFFFF);
        g.fillArc(x-r/2, y-r/2, r, r, 0, 360);
    }
}
