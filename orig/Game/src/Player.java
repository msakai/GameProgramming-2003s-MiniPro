import javax.microedition.lcdui.*;
import java.util.Enumeration;
import com.j_phone.amuse.*;

public class Player extends GameObject {
    private Image img;

    public int r;
    public int x, y;
    private int min_x, max_x;
    private int min_y, max_y;
    private int fire_wait = 3;
    private int muteki_jikan = 0;

    public Player() {
        img = game.instance.ball_img;

        r = img.getWidth() / 2;

        min_x = 0 + r;
        min_y = 0 + r;
        max_x = canvas.getWidth() - r;
        max_y = canvas.getHeight() - r;

        x = (min_x + max_x) / 2;
        y = max_y;
    }

    public void move(int dx, int dy){
        x += dx;
        y += dy;

        if (x < min_x)
            x = min_x;
        else if (x > max_x)
            x = max_x;

        if (y < min_y)
            y = min_y;
        else if (y > max_y)
            y = max_y;
    }

    public void update() {
        move(canvas.dx(), canvas.dy());

        //if (canvas.is_fireing()) {
            fire_wait--;
            if (fire_wait <= 0) {
            int angle = -90 + MyMath.rand(-15, 15);
            Bullet b = new SimpleBullet(x, y, angle);
            game.objects.addElement(b);
            fire_wait = 3;
            }
	    //}

        for (Enumeration e = game.objects.elements(); e.hasMoreElements(); ) {
            Object o = (GameObject)e.nextElement();

            if (o instanceof Bullet) {
                Bullet b = (Bullet)o;
		int r = this.r / 2;

                if (!b.is_enemy_bullet)
		    continue;
		
		int x2 = b.x - x;
		int y2 = b.y - y;
		int r2 = b.r + r;
		x2 *= x2;
		y2 *= y2;
		r2 *= r2;

		if (x2 + y2 < r2) {
		    game.remove_object(b);
		    hit();
                }
            }

	    if (o instanceof ScoreItem) {
		ScoreItem s = (ScoreItem)o;

		int x2 = s.x - x;
		int y2 = s.y - y;
		int r2 = s.r + r;
		x2 *= x2;
		y2 *= y2;
		r2 *= r2;

		if (x2 + y2 < r2) {
		    game.remove_object(s);
		    game.score += s.score;
		    game.sound[2].play(1);
		}
	    }
        }

	if (muteki_jikan > 0)
	    muteki_jikan--;
    }

    public void paint(Graphics g) {
	if (muteki_jikan > 0) {
	    int r2 = r + 2;
	    g.setColor(0x00FFFF);
	    g.fillArc(x-r2, y-r2, r2*2, r2*2, 0, 360);
	}

        g.drawImage(img, x, y, g.HCENTER | g.VCENTER);

        for (int i = 0; i < game.n_players; i++)
            g.drawImage(img, 2 + i * (img.getWidth() + 2), 2,
                        g.LEFT | g.TOP);

	g.setColor(0x000000);
	g.drawString("Score:" + game.score,
		     2, img.getHeight() + 4, g.TOP | g.LEFT);
    }

    private void hit() {
	if (muteki_jikan <= 0) {
	    game.add_object(new Explosion(x, y));
	    game.sound[3].play(1);
	    
	    if (game.n_players == 0) {
		game.gameover("GAME OVER");
	    } else {
		game.n_players--;
		muteki_jikan = 100;
	    }
	}
    }
}
