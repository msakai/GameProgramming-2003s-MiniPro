import javax.microedition.lcdui.*;
import java.util.Enumeration;

public class Enemy2 extends Enemy
{
    private Coroutine c1, c2;
    private int r = 5;

    public int x, y;

    public Enemy2(int arg_x, int arg_y) {
	super();
	life = 1;
	final Enemy2 e = this;

	x = arg_x;
	y = arg_y;

        c1 = new Coroutine() {
                public void run() {
		    suspend();

		    int r = canvas.getWidth() / 2;
		    int base_y = y;

		    if (x < canvas.getWidth() / 2) {
			int base_x = x + r;

			for (int a = 180; a > 0; a -= 3) {
			    x = base_x + (MyMath.cos8(a) * r >> 8);
			    y = base_y + (MyMath.sin8(a) * r >> 8);
			    suspend();
			}
			
		    } else {
			int base_x = x - r;

			for (int a = 0; a < 180; a += 3) {
			    x = base_x + (MyMath.cos8(a) * r >> 8);
			    y = base_y + (MyMath.sin8(a) * r >> 8);
			    suspend();
			}
		    }

		    game.remove_object(e);
                }
            };

	c2 = new Coroutine() {
                public void run() {
		    int i = MyMath.rand(0, 30);
		    
		    suspend();
		    while (life > 0) {
			i += 1;

			if (i % 30 == 0) {
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
	    game.score += 50;
	    if (MyMath.rand(0,10) < 3)
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
