import javax.microedition.midlet.*;
import javax.microedition.lcdui.*;
import java.io.*;
import java.util.Vector;
import java.util.Enumeration;
import javax.microedition.rms.*;
import com.j_phone.amuse.*;

public class Game extends MIDlet implements CommandListener, Runnable {

    public static final int MSECS_PER_TICK = 20;

    ////////////////////////////////////////////////////////////////////////

    public static Game instance;

    public GameCanvas canvas;
    public Vector objects = new Vector();
    public Player player;
    public Background background;
    public Image ball_img;
    public int n_players;
    public int score;
    public int high_score = 0;

    public boolean game_break;

    ////////////////////////////////////////////////////////////////////////

    private Command resetCommand = new Command("Reset", Command.SCREEN, 2);
    private Command exitCommand	 = new Command("Exit",  Command.SCREEN, 1);  
    private Vector removing_objects = new Vector();
    public PhraseTrack sound[] = new PhraseTrack[4]; // XXX

    public Game() {
	instance = this;

        try {
            ball_img = Image.createImage("/ball.png");
        } catch(IOException ex) {
            System.out.println("Cannnot read png");
        }

        try{
            PhrasePlayer player = PhrasePlayer.getPlayer();

            Phrase bgm = new Phrase("resource:bgm.spf");
            sound[0] = player.getTrack();
            sound[0].setPhrase(bgm);
	    
            Phrase sound1 = new Phrase("resource:Gun3.spf");
            sound[1] = player.getTrack();
            sound[1].setPhrase(sound1);

            Phrase clear = new Phrase("resource:Click10.spf");
            sound[2] = player.getTrack();
            sound[2].setPhrase(clear);

	    Phrase hit = new Phrase("resource:Hit4.spf");
	    sound[3] = player.getTrack();
	    sound[3].setPhrase(hit);
        } catch(Exception e){
        }

        canvas = new GameCanvas(this);
        canvas.addCommand(exitCommand);
        canvas.addCommand(resetCommand);
        canvas.setCommandListener(this);
        Display.getDisplay(this).setCurrent(canvas);
    }

    ////////////////////////////////////////////////////////////////////////
    // MIDlet implementation

    Coroutine main_coroutine;

    public void startApp() {
        Thread thread;
        thread = new Thread(this);
        thread.start();
    }

    public void pauseApp() {}
    public void destroyApp(boolean unconditional) {}

    ////////////////////////////////////////////////////////////////////////
    // CommandListener implementation

    public void commandAction(Command c, Displayable s) {
        if (c==resetCommand) {
            initGame();
        } else if (c == exitCommand) {
            destroyApp(false);
            notifyDestroyed();
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // Runnable implementation

    public void run() {
	Thread thread = Thread.currentThread();

        initGame();

	try {
        while(true){
            try {
                thread.sleep(MSECS_PER_TICK);
            } catch (InterruptedException e) {
            }
            updateGame();
            canvas.repaint();
        }
	} catch (Exception e) {
	    System.out.println(e.getMessage());
	    e.printStackTrace();
	}
    }

    ////////////////////////////////////////////////////////////////////////

    public synchronized void initGame() {
        n_players = 5;
        score = 0;
	loadHighScore();

	game_break = false;

        objects.removeAllElements();
        removing_objects.removeAllElements();

	background = new Background();
	player = new Player();

	add_object(new Title());

        sound[0].stop();
        sound[0].play(0);
	//setBGM(bgm);
    }
    
    public synchronized void updateGame() {
        for (Enumeration e = objects.elements(); e.hasMoreElements(); ) {
            ((GameObject)e.nextElement()).update();
	    if (game_break)
		break;
        }
	game_break = false;

        for (Enumeration e = removing_objects.elements();
	     e.hasMoreElements();
	     )
	{
	    GameObject g = (GameObject)e.nextElement();
            objects.removeElement(g);
	    g.on_removed();
        }
	//objects.removeAll(removing_objects);
        removing_objects.removeAllElements();
    }

    //public static void suspend_msec(Coroutine c, int msec) {
    //}

    ////////////////////////////////////////////////////////////////////////

    public void gameover(String title) {
	game_break = true;
	for (Enumeration e = objects.elements(); e.hasMoreElements(); ) {
            remove_object((GameObject)e.nextElement());
	}

	if (score > high_score) {
	    high_score = score;
	    saveHighScore();
	}

	add_object(new GameOver(title));
    }

    ////////////////////////////////////////////////////////////////////////

    public void saveHighScore() {
      if(high_score>999999)high_score=999999;
      if(high_score<0)high_score=0;
    
      try{
        RecordStore RS = RecordStore.openRecordStore("hs",true );
        byte[] bytstr = new byte[200];
    
        bytstr[0] = (byte)(high_score%100);
        bytstr[1] = (byte)((high_score / 100) % 100);
        bytstr[2] = (byte)((high_score / 10000) % 100);
    
        RS.setRecord( 1, bytstr, 0, bytstr.length );
        RS.closeRecordStore();
      }
      catch(Exception e){
        System.out.println(e.toString());
      }
    }

    public void loadHighScore() {
        try{
            RecordStore RS = RecordStore.openRecordStore("hs", true);
            byte[] bytstr = new byte[200];
    
            if ( RS.getNumRecords() == 0 ) {
                RS.addRecord(bytstr, 0, bytstr.length);
            } else {
                bytstr = RS.getRecord(1);                
                high_score = bytstr[0] + bytstr[1] * 100 + bytstr[2] * 10000;
            }
            RS.closeRecordStore();
        } catch(Exception e){
            System.out.println(e.toString());
        }
    }

    ////////////////////////////////////////////////////////////////////////

    public void add_object(GameObject obj){
	objects.addElement(obj);
    }

    public void remove_object(GameObject obj){
        removing_objects.addElement(obj);
    }

    ////////////////////////////////////////////////////////////////////////

    /*
    public void setBGM(Phrase bgm) {
	sound[0].stop();
	sound[0].setPhrase(bgm);
	sound[0].play(0);	
    }
    */
}

