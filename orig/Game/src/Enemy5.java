import javax.microedition.lcdui.*;
import java.util.Enumeration;

public class Enemy5 extends Enemy
{
    private Coroutine c1, c2;
    private int r = 5;

    public int x, y;

    public Enemy5(int arg_x, int arg_y, final int sign) {
	super();
	life = 1;
	final Enemy5 e = this;

	x = arg_x;
	y = arg_y;

        c1 = new Coroutine() {
                public void run() {
		    suspend();

		    while (y < canvas.getHeight() / 3) {
			y += 3;
			suspend();
		    }

		    int r = canvas.getWidth() / 4;
		    int base_y = y;
		    int base_x = x - r * sign;
		    for (int a = 0; a <= 360; a += 5) {
			x = base_x + ((MyMath.cos8(a) * r * sign) >> 8);
			y = base_y + ((MyMath.sin8(a) * r) >> 8);
			suspend();
		    }

		    while (y < canvas.getHeight()) {
			y += 3;
			suspend();
		    }

		    game.remove_object(e);
                }
            };

	c2 = new Coroutine() {
                public void run() {
		    int i = MyMath.rand(0, 60);
		    
		    suspend();
		    while (life > 0) {
			i += 1;

			if (i % 60 == 0) {
			    int a = MyMath.rand(90-60, 90+60);
			    game.objects.addElement(new EnemyBullet0(x, y, a));
			}
			suspend();
		    }
		}
	    };
    }

    public void update() {
        c1.resume();
        c2.resume();
	check_bullets(x, y, r);

        if (life <= 0) {
            game.remove_object(this);
	    game.add_object(new Explosion(x, y));
	    game.score += 80;
	    if (MyMath.rand(0,10) < 4)
		game.add_object(new ScoreItem(x,y));
	}
    }

    public void paint(Graphics g) {
        g.setColor(0x000000);
        g.fillRect(x-r, y-r, 2*r, 2*r);
    }

    public void on_removed() {
	c1.terminate();
	c2.terminate();
    }
}
