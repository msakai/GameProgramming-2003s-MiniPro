import javax.microedition.lcdui.*;

public class SimpleBullet extends Bullet
{
    public int speed = 5;
    public int angle;
    private int orig_x, orig_y;
    private int ticks = 0;

    public SimpleBullet(int x, int y, int angle) {
	super(x,y);
        orig_x = x;
        orig_y = y;
        this.angle = angle;
    }

    public void update() {
	ticks++;

	x = orig_x + ((MyMath.cos8(angle) * speed * ticks) >> 8);
        y = orig_y + ((MyMath.sin8(angle) * speed * ticks) >> 8);

	if (x + r <= 0 ||
	    x - r >= canvas.getWidth() ||
	    y + r <= 0 ||
	    y - r >= canvas.getHeight())
            game.remove_object(this);
    }
}

