import java.util.Enumeration;
import javax.microedition.lcdui.*;

public class GameCanvas extends Canvas {
    private Game game;
    private boolean k_left, k_right, k_up, k_down;
    private boolean k_fire;

    public GameCanvas(Game game) {
	this.game = game;
        k_left = k_right = k_up = k_down = false;
    }

    public int dx(){
        int ret = 0;
        if (k_left)  ret += -1;
        if (k_right) ret += +1;
        ret *= 3;
        return ret;
   }

    public int dy(){
        int ret = 0;
        if (k_up)   ret += -1;
        if (k_down) ret += +1;
        ret *= 3;
        return ret;
    }

    public boolean is_fireing(){
        return k_fire;
    }

    protected synchronized void keyPressed(int keyCode) {            
        if (keyCode == Canvas.FIRE)
            k_fire = true;

        switch (getGameAction(keyCode)) {
        case LEFT:  k_left  = true; break;
        case RIGHT: k_right = true; break;
        case UP:    k_up    = true; break;
        case DOWN:  k_down  = true; break;
        default:
            break;
        }
    }

    protected synchronized void keyReleased(int keyCode) {
        if (keyCode == Canvas.FIRE)
            k_fire = false;

        switch (getGameAction(keyCode)) {
        case LEFT:  k_left  = false; break;
        case RIGHT: k_right = false; break;
        case UP:    k_up    = false; break;
        case DOWN:  k_down  = false; break;
        default:
            break;
        }
    }

    public synchronized void paint(Graphics g) {
        for (Enumeration e = game.objects.elements(); e.hasMoreElements(); )
            ((GameObject)e.nextElement()).paint(g);
    }
}
