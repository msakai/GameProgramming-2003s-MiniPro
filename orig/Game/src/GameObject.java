import javax.microedition.lcdui.*;

public class GameObject {
    protected Game game;
    protected GameCanvas canvas;

    public GameObject() {
	game = Game.instance;
        canvas = game.canvas;
    }

    public void update() {
    }

    public void paint(Graphics g) {
    }

    public void on_removed() {
    }
}
