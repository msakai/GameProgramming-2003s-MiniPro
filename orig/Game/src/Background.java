import javax.microedition.lcdui.*;

class Background extends GameObject {
    private final int tile_size = 30;
    private int base_y = 0;

    public int speed = 2;

    public Background() {}

    public void update() {
        base_y = (base_y + speed) % (tile_size * 2);
    }

    public void paint(Graphics g) {
	GameCanvas c = canvas;

        for (int y = -2; y <= c.getHeight() / tile_size; y++) {
            for (int x = 0; x <= c.getHeight() / tile_size; x++) {
                g.setColor(((x+y) % 2 != 0) ? 0xFFFFFF : 0xAAAAAA);
                g.fillRect(x * tile_size,
                           y * tile_size + base_y,
                           tile_size, tile_size);
            }
        }
    }
}
