import javax.microedition.lcdui.*;

public class Explosion extends GameObject
{
    int x, y, r;

    public Explosion(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void update() {
	r += 2;
	if (r >= 20)
	    game.remove_object(this);
    }

    public void paint(Graphics g) {
        g.setColor(0xFFFFFF);
        g.drawArc(x-r, y-r, r*2, r*2, 0, 360);
    }
}
