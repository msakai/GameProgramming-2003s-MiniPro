import javax.microedition.lcdui.*;

public class ScoreItem extends GameObject {
    public int r = 10;
    public int x, y;
    public boolean is_enemy_bullet = false;
    public int score;

    public ScoreItem(int x, int y) {
	super();
        this.x = x;
        this.y = y;

	score += MyMath.rand(0, 30) * 10;
    }

    public void update() {
	y += 1;
	if (y > canvas.getHeight())
	    game.remove_object(this);
    }

    public void paint(Graphics g) {
        g.setColor(0x0000FF);
        g.drawString("ÅÙ", x, y, g.HCENTER | g.VCENTER);
    }
}
