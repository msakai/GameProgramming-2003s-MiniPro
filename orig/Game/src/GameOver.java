import javax.microedition.lcdui.*;

public class GameOver extends GameObject
{
    String title;

    public GameOver(String title) {
	this.title = title;
    }

    private boolean flag = false;

    public void update() {
	if (canvas.is_fireing()) {
	    flag = true;
	} else if (flag) {
	    game.initGame();
	}
    }

    public void paint(Graphics g) {
        g.setColor(0x000000);
        g.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());

        g.setColor(0xFFFFFF);
	g.drawString(title,
		     canvas.getWidth()/2, 20,
		     g.HCENTER | g.TOP);

	g.drawString("Score: " + game.score,
		     canvas.getWidth()/2, 50,
		     g.HCENTER | g.TOP);
	g.drawString("High Score: " + game.high_score,
		     canvas.getWidth()/2, 70,
		     g.HCENTER | g.TOP);
    }
}
