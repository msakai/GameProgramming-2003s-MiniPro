import javax.microedition.lcdui.*;
import java.util.Enumeration;
import java.io.*;

public class Boss2 extends Boss
{
    private Coroutine coroutine;

    private Image[] imgs = new Image[4];
    private Image img;

    private int r = 10;
    private int v;
    private boolean ready = false;

    private static final int MAX_LIFE = 150;

    public int x, y;

    public Boss2() {
        super();
        life = MAX_LIFE;

        try {
            img = Image.createImage("/blob.png");
        } catch(IOException ex) {
            System.out.println("Cannnot read png");
        }

        x = canvas.getWidth() / 2;
        y = -20;
        v = 2;

        coroutine = new Coroutine() {
                private void pattern_a() {
                    while (y < canvas.getHeight() / 4) {
                        y += v;
                        suspend();
                    }
		    ready = true;
                }

                public void run() {
                    suspend();

                    pattern_a();

                    int base_x = x;
                    int base_y = y;

                    Coroutine c = new Coroutine(){
                            public void run(){
				suspend();

                                while (true) {
                                    for (int i = 0; i < 35; i++)
                                        suspend();

				    for (int a = 0; a < 360; a += 20) {
					GameObject g = new EnemyBullet0(x, y, a);
					game.add_object(g);
				    }
                                }
                            }
                        };

		    try{ 
			while (life > MAX_LIFE * 3 / 4) {
			    int r = 30;

			    for (int a = 0; a < 360; a += 5) {
				int cx = base_x - r;
				int cy = base_y;

				x = cx + ((MyMath.cos8(a) * r) >> 8);
				y = cy + ((MyMath.sin8(a) * r) >> 8);

				c.resume();
				suspend();
			    }

			    for (int a = 0; a < 360; a += 5) {
				int cx = base_x + r;
				int cy = base_y;
                            
				x = cx + ((MyMath.cos8(180-a) * r) >> 8);
				y = cy + ((MyMath.sin8(180-a) * r) >> 8);

				c.resume();
				suspend();
			    }
			}
		    } finally {
			c.terminate();
		    }

		    {
			int cx = canvas.getWidth()/2;
			int cy = canvas.getHeight()/2;
			int saved_x = x;
			int saved_y = y;
			for (int i = 0; i < 40; i++) {
			    x = saved_x + (cx - saved_x) * i / 40;
			    y = saved_y + (cy - saved_y) * i / 40;
			    suspend();
			}
			x = cx;
			y = cy;
		    }

		    for (int l = 0; l < 2; l++) {
			{
			    int a = 0;
			    for (; a < 360; a += 5) {
				game.add_object(new EnemyBullet0(x, y, a));
				game.add_object(new EnemyBullet0(x, y, a+180));
				for (int k = 0; k < 4; k++)
				    suspend();
			    }
			    for (; a > 0; a -= 5) {
				game.add_object(new EnemyBullet0(x, y, a));
				game.add_object(new EnemyBullet0(x, y, a+180));
				for (int k = 0; k < 4; k++)
				    suspend();
			    }
			}

			{
			    int a = 0;
			    int i = 0;
			    boolean firing = false;

			    for (; a < 360; a += 10) {
				if (firing) {
				    game.add_object(new EnemyBullet0(x, y, a));
				    game.add_object(new EnemyBullet0(x, y, 180-a));

				    game.add_object(new EnemyBullet0(x, y, 180+a));
				    game.add_object(new EnemyBullet0(x, y, 360-a));
				}
				i += 1;
				if (i == 3) {
				    i = 0;
				    firing = !firing;
				}
				for (int k = 0; k < 3; k++)
				    suspend();
			    }
			}
		    }

		    {
			int saved_x = x;
			int saved_y = y;
			for (int i = 0; i < 40; i++) {
			    x = saved_x + (base_x - saved_x) * i / 40;
			    y = saved_y + (base_y - saved_y) * i / 40;
			    suspend();
			}
			x = base_x;
			y = base_y;
		    }

		    while (true) {
			{
			    int a = MyMath.rand(0+45, 180-45);
			    GameObject g = new TwistingBullet(x, y, a);
			    game.add_object(g);
			}
			
			for (int j = 0; j < 10; j++) suspend();

			for (int k = 0; k < 3; k++) {
			    int a = MyMath.rand(0+30, 180-30);
			    game.add_object(new EnemyBullet0(x, y, a));
			    game.add_object(new EnemyBullet0(x, y, a+30));
			    game.add_object(new EnemyBullet0(x, y, a-30));
			    for (int j = 0; j < 10; j++) suspend();
			}
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
	    game.score += 2000;
        }
    }

    public void paint(Graphics g) {
	super.paint(g);
        g.drawImage(img, x, y, g.HCENTER | g.VCENTER);
    }

    public void hit() {
	if (ready)
	    super.hit();
    }

    public void on_removed() {
	coroutine.terminate();
    }

    public int get_max_life(){
	return MAX_LIFE;
    }

    private class TwistingBullet extends GameObject {
        private final int N = 3;

        int angle;
        int ticks = 0;
        int orig_x, orig_y;

        Bullet[] b = new Bullet[N];
        int ba;
        int br = 10;
        protected int speed = 1;

        public TwistingBullet(int x, int y, int angle){
            this.orig_x = x;
            this.orig_y = y;
            this.angle = angle;

            ba = 0;
            for (int i = 0; i < N; i++) {
                b[i] = new Bullet(x, y);
                b[i].is_enemy_bullet = true;
                b[i].color = 0x0000FF; //0xFF0000;
                b[i].r = 6;
                game.add_object(b[i]);
            }
            update_bullet_pos(orig_x, orig_y);
        }

        public void update_bullet_pos(int x, int y) {
            for (int i = 0; i < N; i++) {
                b[i].x = x + (MyMath.cos8(ba + i * 360/N) * br >> 8);
                b[i].y = y + (MyMath.sin8(ba + i * 360/N) * br >> 8);
            }
        }

        public void paint(Graphics g){}

        public void update(){
            int x = orig_x + ((MyMath.cos8(angle) * speed * ticks) >> 8);
            int y = orig_y + ((MyMath.sin8(angle) * speed * ticks) >> 8);

            if (x + br <= 0 ||
                x - br >= canvas.getWidth() ||
                y + br <= 0 ||
                y - br >= canvas.getHeight())
            {
                game.remove_object(this);
                for (int i = 0; i < N; i++) {
                    game.remove_object(b[i]);
                }
            }

            ba = (ba + 10) % 360;
            update_bullet_pos(x, y);

            ticks++;
        }
    }
}
