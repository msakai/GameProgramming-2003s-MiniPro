import javax.microedition.lcdui.*;
import java.util.Enumeration;
import java.io.*;

public class Boss3 extends Boss
{
    private Coroutine coroutine;

    private Image[] imgs = new Image[4];
    private Image img;

    private int r = 10;
    private int v;
    private boolean ready = false;

    private static final int MAX_LIFE = 200;

    public int x, y;

    public Boss3() {
        super();
        life = MAX_LIFE;

        try {
            img = Image.createImage("/dawa.png");
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
                                    for (int i = 0; i < 20; i++)
                                        suspend();

				    int a = MyMath.rand(0+30, 180-30);
				    int v[] = {0};//{-15,15};

				    for (int i = 0; i < v.length; i++) {
					for (int j = 1; j <= 3; j++) {
					    EnemyBullet0 g;
					    g = new EnemyBullet0(x, y, a+v[i]);
					    g.speed = j;
					    game.add_object(g);
					}
				    }
                                }
                            }
                        };

		    try { 
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

		    while (true) {
			int rand = MyMath.rand(0, 5);
			
			if (rand == 0) {
			    pattern_x();
			    for (int i = 0; i < 10; i++)
				suspend();
			} else if (rand == 1) {
			    pattern_y();
			} else if (rand == 2) {
			    pattern_z();
			} else {
			    pattern_w();
			}
		    }
                }

		private void pattern_w(){
		    for (int i = 0; i < 3; i++) {
			int new_x = MyMath.rand(0+r, canvas.getWidth()-r);
			int new_y = MyMath.rand(0+r, canvas.getHeight()/2-r);
			move_to(new_x, new_y);

			int a = MyMath.rand(0, 180);
			int v[] = {-45,-15,15,45};

			for (int k = 0; k < v.length; k++) {
			    for (int j = 1; j <= 3; j++) {
				EnemyBullet0 g;
				g = new EnemyBullet0(x, y, a+v[k]);
				g.speed = j;
				game.add_object(g);
			    }
			}
		    }
		}

		private void pattern_x(){
		    move_to_center();
		    for (int j = 0; j < 15; j++) {
			game.add_object(new XBullet(x, y));
			for (int i = 0; i < 4; i++) {
			    suspend();
			}
		    }
		}

		private void pattern_y(){
		    int start_x = canvas.getWidth()/6;
		    int dest_x = canvas.getWidth() - start_x;

		    if (MyMath.rand(0,1) == 0) {
			int tmp = start_x;
			start_x = dest_x;
			dest_x = tmp;
		    }

		    move_to(start_x, canvas.getHeight()/4);
		    for (int i = 0; i < 10; i++)
			suspend();

		    YBullet[] v = new YBullet[10];
		    try {
			for (int i = 0; i < v.length; i++){
			    int base_y = y + r;
			    int max_y = base_y + (canvas.getHeight() - base_y) * (v.length - i) / v.length;
			    v[i] = new YBullet(x, y, max_y);
			    game.add_object(v[i]);
			    for (int j = 0; j < 3; j++)
				suspend();
			}

			for (int i = 0; i < 20; i++)
			    suspend();

			int saved_x = x;
			for (int i = 0; i < 20; i++) {
			    x = saved_x + (dest_x - saved_x) * i / 20;
			    for (int j = 0; j < v.length; j++){
				v[j].x = x;
			    }
			    suspend();
			}
			x = dest_x;

			for (int i = 0; i < 10; i++)
			    suspend();
		    } finally {
			for (int j = 0; j < v.length; j++){
			    if (v[j] != null)
				game.remove_object(v[j]);
			}
		    }
		}

		private void pattern_z(){
		    move_to(canvas.getWidth()/2, r);

		    for (int j = 0; j < 4; j++) {
			int n = 4;// - j;

			for (int i = 0; i < n; i++) {
			    int x = canvas.getWidth() * i / n;
			    int y = 0;
			    game.add_object(new EnemyBullet0(x, y, 90));
			}

			for (int i = 0; i < 15; i++)
			    suspend();

			int bx = canvas.getWidth() / (2*n);
			for (int i = 0; i < n; i++) {
			    int x = bx + canvas.getWidth() * i / n;
			    int y = 0;
			    game.add_object(new EnemyBullet0(x, y, 90));
			}

			for (int i = 0; i < 15; i++)
			    suspend();
		    }
		}

		private void move_to(int new_x, int new_y) {
		    int saved_x = x;
		    int saved_y = y;
		    for (int i = 0; i < 40; i++) {
			x = saved_x + (new_x - saved_x) * i / 40;
			y = saved_y + (new_y - saved_y) * i / 40;
			suspend();
		    }
		    x = new_x;
		    y = new_y;
		}

		private void move_to_center() {
		    int cx = canvas.getWidth()/2;
		    int cy = canvas.getHeight()/2;
		    move_to(cx, cy);
		}
            };
    }

    public void update() {
        coroutine.resume();
        check_bullets(x, y, r);

        if (life <= 0) {
	    game.add_object(new Explosion(x, y));
            game.remove_object(this);
	    game.score += 5000;
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


    private class XBullet extends Bullet {
	int orig_x, orig_y;
	int len8 = 0;
	int angle = 0;

	public XBullet(int x, int y) {
	    super(x,y);
            is_enemy_bullet = true;
	    color = 0xFF0000;

	    orig_x = x;
	    orig_y = y;
	}

	public void update() {
	    angle += 10;
	    len8 += 210;

	    x = orig_x + ((MyMath.cos8(angle) * len8) >> 16);
	    y = orig_y + ((MyMath.sin8(angle) * len8) >> 16);

	    if (len8 >> 8 > canvas.getHeight())
		game.remove_object(this);
	}
    }


    private class YBullet extends Bullet
    {
	protected int speed = 5;

	private int orig_x, orig_y;
	private int max_y;
	private int ticks = 0;
	private boolean flag = false;

	public YBullet(int x, int y, int max_y) {
	    super(x,y);
	    color = 0xFF0000;
	    is_enemy_bullet = true;

	    orig_x = x;
	    orig_y = y;
	    this.max_y = max_y;
	}

	public void update() {
	    if (!flag) {
		ticks++;
		y = orig_y + speed * ticks;
		if (y > max_y) {
		    flag = true;
		    y = max_y;
		}
	    }

	    if (x + r <= 0 ||
		x - r >= canvas.getWidth() ||
		y + r <= 0 ||
		y - r >= canvas.getHeight())
		game.remove_object(this);
	}
    }


}
