import javax.microedition.lcdui.*;
import java.util.Enumeration;

public class Enemy extends GameObject
{
    protected int life;

    public Enemy() {
	super();
    }

    public void update() {
    }

    public void paint(Graphics g) {
    }

    protected void check_bullets(int x, int y, int r) {
        for (Enumeration e = game.objects.elements(); e.hasMoreElements(); ) {
            Object o = (GameObject)e.nextElement();
            if (o instanceof Bullet) {
                Bullet b = (Bullet)o;
                if (b.is_enemy_bullet)
		    continue;
		
		int x2 = b.x - x;
		int y2 = b.y - y;
		int r2 = b.r + r;
		x2 *= x2;
		y2 *= y2;
		r2 *= r2;

		if (x2 + y2 < r2) {
		    hit();
		    game.sound[1].stop();
		    game.sound[1].play(1);
		    game.remove_object(b);
                }
            }
        }
    }

    protected void hit() {
	life--;
    }

    public boolean is_alive() {
	return life > 0;
    }
}
