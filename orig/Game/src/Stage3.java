import javax.microedition.lcdui.*;

public class Stage3 extends GameObject
{
    private Coroutine c;
    
    public Stage3() {
	final Stage3 stage = this;

        c = new Coroutine() {
                private void suspend_msec(int msec){
                    for (int i = 0; i < msec / Game.MSECS_PER_TICK; i++) {
                        suspend();
                    }
                }

		private void pattern_a(){
		    for (int i = 0; i < 10; i++) {
			game.add_object(new Enemy5(canvas.getWidth()*2/3, -20, 1));
			suspend_msec(100);
		    }
		    for (int i = 0; i < 10; i++) {
			game.add_object(new Enemy5(canvas.getWidth()/3, -20, -1));
			suspend_msec(100);
		    }
		}

		private void pattern_b() {
		    for (int i = 0; i < 5; i++) {
			game.add_object(new Enemy4(5, -20));
			suspend_msec(400);
			game.add_object(new Enemy4(canvas.getWidth()-5, -20));
			suspend_msec(400);
		    }
		}

		private void pattern_c() {
		    for (int j = 0; j < 20; j++) {
			game.add_object(new Enemy1(MyMath.rand(0, canvas.getWidth())));
			suspend_msec(100);
		    }
		}

		private void pattern_d() {
		    for (int j = 0; j < 2; j++) {
			for (int i = 0; i < 10; i++) {
			    int x = canvas.getWidth() * i / 10;
			    int w = canvas.getWidth() / 10;
			    game.add_object(new Enemy3(x, w));
			}
			suspend_msec(500);
		    }
		}

                public void run() {
                    suspend();

                    suspend_msec(1500);
		    pattern_a();
                    suspend_msec(1000);
		    pattern_c();
                    suspend_msec(1000);
		    pattern_a();
                    suspend_msec(2000/*1500*/);
		    pattern_b();
                    suspend_msec(2500/*1500*/);
		    pattern_c();
                    suspend_msec(1500);
		    pattern_d();
                    suspend_msec(1500);

		    int orig_bg_speed = game.background.speed;
		    for (;
			 game.background.speed < 4;
			 game.background.speed++)
                    {
			suspend_msec(300);
		    }
                    suspend_msec(2000);

		    Boss3 boss = new Boss3();
                    game.add_object(boss);

		    while (boss.is_alive())
			suspend();

                    suspend_msec(2000);

		    for (;
			 game.background.speed != orig_bg_speed;
			 game.background.speed--)
		    {
			suspend_msec(300);
		    }
		    game.background.speed = orig_bg_speed;

                    suspend_msec(2000);

		    game.remove_object(stage);
		    game.gameover("GAME CLEAR");
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
