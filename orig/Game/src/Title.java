import javax.microedition.lcdui.*;

public class Title extends GameObject
{
    private Coroutine c;
    
    public Title() {
    }

    private boolean flag = false;

    public void update() {
	if (canvas.is_fireing()) {
	    flag = true;
	} else if (flag) {
	    game.remove_object(this);

	    game.add_object(game.background);
	    game.add_object(game.player);
	    game.add_object(new Stage1());
	}
    }

    public void paint(Graphics g) {
        g.setColor(0x000000);
        g.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());

        g.setColor(0xFFFFFF);
	g.drawString("テニスボールの",
		     canvas.getWidth()/2, 20,
		     g.HCENTER | g.TOP);
	g.drawString("奇妙なシューティング",
		     canvas.getWidth()/2, 40,
		     g.HCENTER | g.TOP);

	int y = canvas.getHeight()/2 - 10;
	int x = 10;
	Font f = g.getFont();

	g.drawString("←→↑↓で移動",
		     x, y,
		     g.LEFT | g.TOP);
	y += f.getHeight();
	g.drawString("「♪」は得点",
		     x, y,
		     g.LEFT | g.TOP);
	y += f.getHeight();
	g.drawString("目標2万点",
		     x, y,
		     g.LEFT | g.TOP);

	g.drawString("★ PRESS ENTER ★",
		     canvas.getWidth()/2, canvas.getHeight()-20,
		     g.HCENTER | g.BOTTOM);
    }
}
