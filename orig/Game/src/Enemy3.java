import javax.microedition.lcdui.*;
import java.util.Enumeration;

public class Enemy3 extends Enemy
{
    private Coroutine coroutine;

    private int r = 5;
    private int v;

    public int x, y;
    public int width, height;

    public Enemy3(int arg_x, int width) {
	super();
	final Enemy3 e = this;

	life = 2;
	x = arg_x + r;
        y = -20;
        v = 1;

        coroutine = new Coroutine() {
                public void run() {		    
		    suspend();
		    while (life > 0 && y < canvas.getHeight()) {
			y += v;
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
