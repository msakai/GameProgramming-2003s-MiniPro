import javax.microedition.lcdui.*;
import java.util.Enumeration;

public class Enemy1 extends Enemy
{
    private Coroutine coroutine;

    private int r = 5;
    private int v;
    private int min_x, max_x;
    private int min_y, max_y;

    public int x, y;

    public Enemy1(int arg_x) {
	super();
	life = 1;
	final Enemy1 e = this;

	x = arg_x;
        y = -20;
        v = 1;

        min_x = 0 + r;
        min_y = 0 + r;
        max_x = canvas.getWidth() - r;
        max_y = canvas.getHeight() - r;

        coroutine = new Coroutine() {
                public void run() {
		    int i = MyMath.rand(0, 50);
		    
		    suspend();
		    while (life > 0 && y < canvas.getHeight()) {
			y += v;
			i += 1;

			if (i % 50 == 0) {
			    int a = MyMath.rand(90-60, 90+60);
			    game.objects.addElement(new EnemyBullet0(x, y, a));
			}
			suspend();
		    }

		    game.remove_object(e);
                }
            };
    }

    public void update() {
        coroutine.resume();
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
	coroutine.terminate();
    }
}
