import javax.microedition.lcdui.*;
import java.util.Enumeration;
import java.io.*;

public class Boss1 extends Boss
{
    private Coroutine coroutine;

    private Image[] imgs = new Image[4];
    private Image img;

    private int r = 10;
    private int v;
    private int min_x, max_x;
    private int min_y, max_y;

    private static final int MAX_LIFE = 60;

    public int x, y;

    public Boss1() {
	super();
	life = MAX_LIFE;

        try {
            //img = Image.createImage("/dawa.png");
	    imgs[0] = Image.createImage("/kusa_down.png");
	    imgs[1] = Image.createImage("/kusa_left.png");
	    imgs[2] = Image.createImage("/kusa_right.png");
	    img = imgs[0];
        } catch(IOException ex) {
            System.out.println("Cannnot read png");
        }

        x = canvas.getWidth() / 2;
        y = -20;
        v = 2;

        min_x = 0 + r;
        min_y = 0 + r;
        max_x = canvas.getWidth() - r;
        max_y = canvas.getHeight() - r;

        coroutine = new Coroutine() {
                private void pattern_a() {
		    img = imgs[0];

                    while (y < canvas.getHeight() / 3) {
                        y += v;
                        suspend();
                    }
                }

                private void pattern_b() {
		    if (v > 0)
			img = imgs[2];
		    else
			img = imgs[1];			

                    x += v;
                    if (x < min_x) {
                        x = min_x;
                        v = -v;
			img = imgs[2];
                    } else if (x > max_x) {
                        x = max_x;
                        v = -v;
			img = imgs[1];
                    }

                    if (MyMath.rand(0, 20) == 0) {
                        int a = MyMath.rand(90-60, 90+60);
                        game.objects.addElement(new EnemyBullet0(x, y, a));
                        game.objects.addElement(new EnemyBullet0(x, y, a+30));
                        game.objects.addElement(new EnemyBullet0(x, y, a-30));
                    }
                }

                private void pattern_c() {
                    int cx = (min_x + max_x) / 2;

                    if (v < 0)
                        v = -v;

		    img = imgs[2];
                    while (x < cx && x + v < max_x){
                        x += 2 * v;
                        suspend();
                    }
		    img = imgs[1];
                    while (cx < x && min_x < x - v){
                        x -= 2 * v;
                        suspend();
                    }

		    img = imgs[0];
                    for (int i = 0; i < (360 * 3)/20; i++) {
                        int angle = 20 * i % 360;
                        EnemyBullet0 b =
                            new EnemyBullet0(x, y, angle);
                        game.objects.addElement(b);
                        suspend();
                    }
                }

                private void pattern_d() {
		    img = imgs[0];
		    for (int k = 0; k < canvas.getWidth()/5; k++) {
			EnemyBullet0 b = 
			    new EnemyBullet0(k*canvas.getWidth()/5, 0, 90);
			game.objects.addElement(b);
			suspend();
		    }
                }

                public void run() {
                    suspend();

                    pattern_a();

                    int tick = 0;
                    while (true) {
                        tick = (tick + 1) % 200;
                        if (tick == 0)
                            pattern_c();
                        else if (tick == 100)
			    pattern_d();
			else
                            pattern_b();
                        suspend();
                    }
                }
            };
    }

    public void update() {
        coroutine.resume();
	check_bullets(x, y, r);

        if (life <= 0) {
	    game.add_object(new Explosion(x, y));
            game.remove_object(this);
	    game.score += 1000;
	}
    }

    public void paint(Graphics g) {
	super.paint(g);
        g.drawImage(img, x, y, g.HCENTER | g.VCENTER);
    }

    public int get_max_life(){
	return MAX_LIFE;
    }

    public void on_removed() {
	coroutine.terminate();
    }
}
