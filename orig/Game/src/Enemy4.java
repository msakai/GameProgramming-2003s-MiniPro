import javax.microedition.lcdui.*;
import java.util.Enumeration;

public class Enemy4 extends Enemy
{
    private Coroutine c1, c2;

    private int r = 5;
    private int v;

    public int x, y;
    public int width, height;

    public Enemy4(int arg_x, int arg_y) {
	super();
	final Enemy4 e = this;

	life = 4;
	x = arg_x;
        y = arg_y;
        v = 1;

        c1 = new Coroutine() {
                public void run() {   
		    suspend();
		    while (life > 0 && y < canvas.getHeight()) {
			y += v;
			suspend();
		    }
		    game.remove_object(e);
                }
            };
	
        c2 = new Coroutine() {
                public void run() {
		    suspend();
		    while (true) {
			int a;

			if (x < canvas.getWidth() / 2) {
			    a = 0+30;
			} else {
			    a = 180-30;
			}

			for (int i = 0; i < 4; i++) {
			    game.objects.addElement(new EnemyBullet0(x, y, a));
			    for (int j = 0; j < 4; j++)
				suspend();
			}

			for (int j = 0; j < 25; j++)
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
	    game.score += 200;
	    if (MyMath.rand(0,10) < 5)
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
