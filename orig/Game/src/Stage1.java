import javax.microedition.lcdui.*;

public class Stage1 extends GameObject
{
    private Coroutine c;
    
    public Stage1() {

	final Stage1 stage = this;

        c = new Coroutine() {
                private void suspend_msec(int msec){
                    for (int i = 0; i < msec / Game.MSECS_PER_TICK; i++) {
                        suspend();
                    }
                }

                public void run() {
                    suspend();

                    suspend_msec(1000);
                    for (int i = 0; i < 20; i++) {
                        int x = MyMath.rand(0, canvas.getWidth());
                        game.add_object(new Enemy1(x));
                        suspend_msec(300);
		    }

                    suspend_msec(1000);

		    {
			int x;

			for (int j = 0; j < 4; j++) {
			    if (j%2 == 0)
				x = canvas.getWidth() / 3;
			    else
				x = canvas.getWidth() * 2 / 3;

			    for (int i = 0; i < 10; i++) {
				game.add_object(new Enemy2(x, 0));
				suspend_msec(200);
			    }
			    
			    suspend_msec(300);
			}
		    }

		    int orig_bg_speed = game.background.speed;
		    for (;
			 game.background.speed < 4;
			 game.background.speed++)
                    {
			suspend_msec(300);
		    }
                    suspend_msec(2000);

		    //game.setBGM(game.boss_bgm);

		    Boss1 boss = new Boss1();
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
		    game.add_object(new Stage2());
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
