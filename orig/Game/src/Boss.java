import javax.microedition.lcdui.*;
import java.util.Enumeration;
import java.io.*;

public abstract class Boss extends Enemy
{
    public void paint(Graphics g) {
	int max_width = canvas.getWidth() / 2 - 3;
        g.setColor(0xFF0000);
	g.fillRect(canvas.getWidth() / 2, 3,
		   max_width * life / get_max_life(), 10);
        g.setColor(0x000000);
	g.drawRect(canvas.getWidth() / 2, 3,
		   max_width, 10);
    }

    public abstract int get_max_life();

    public void hit() {
	super.hit();
	game.score += 10;
    }
}
