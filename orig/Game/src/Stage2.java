import javax.microedition.lcdui.*;

public class Stage2 extends GameObject
{
    private Coroutine c;
    
    public Stage2() {
	final Stage2 stage = this;

        c = new Coroutine() {
                private void suspend_msec(int msec){
                    for (int i = 0; i < msec / Game.MSECS_PER_TICK; i++) {
                        suspend();
                    }
                }

                public void run() {
                    suspend();

                    suspend_msec(1500);

		    for (int j = 0; j < 3; j++) {
			for (int i = 0; i < 10; i++) {
			    int x = canvas.getWidth() * i / 10;
			    int w = canvas.getWidth() / 10;
			    game.add_object(new Enemy3(x, w));
			}
			suspend_msec(500);
		    }

                    suspend_msec(1500);

		    for (int j = 0; j < 20; j++) {
			game.add_object(new Enemy1(MyMath.rand(0, canvas.getWidth())));
			suspend_msec(100);
		    }

                    suspend_msec(1500);

		    for (int j = 0; j < 3; j++) {
			for (int i = 0; i < 10; i++) {
			    int x = canvas.getWidth() * i / 10;
			    int w = canvas.getWidth() / 10;
			    game.add_object(new Enemy3(x, w));
			}
			suspend_msec(500);
		    }

                    suspend_msec(1000);

		    int orig_bg_speed = game.background.speed;
		    for (;
			 game.background.speed < 4;
			 game.background.speed++)
                    {
			suspend_msec(300);
		    }
                    suspend_msec(2000);

		    Boss2 boss = new Boss2();
                    game.add_object(boss);

		    while (boss.is_alive())
			suspend();

		    for (;
			 game.background.speed != orig_bg_speed;
			 game.background.speed--)
		    {
			suspend_msec(300);
		    }
		    game.background.speed = orig_bg_speed;

		    game.remove_object(stage);
		    game.add_object(new Stage3());
                }
            };
    }

    public void update() {
        c.resume();
    }

    public void paint(Graphics g) {}

    public void on_removed() {
	c.terminate();
    }
}
