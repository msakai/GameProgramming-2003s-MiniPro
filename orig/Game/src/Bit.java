import javax.microedition.lcdui.*;

public class Bit extends GameObject {
    private Player player;
    private int angle = 0;
    private int r = 5;
    public int x, y;

    public Bit(Player player) {
        this.player = player;
    }

    public void update() {
        int l = 20;
        angle = (angle + 3) % 360;
        x = player.x + ((MyMath.cos8(angle) * l) >> 8);
        y = player.y + ((MyMath.sin8(angle) * l) >> 8);
    }

    public void paint(Graphics g) {
        g.setColor(0x0000FF);
        g.fillArc(x-r, y-r, r*2, r*2, 0, 360);
    }
}
