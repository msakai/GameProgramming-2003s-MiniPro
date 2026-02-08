
/*
スレッドを使ってコルーチンもどきを実装
suspend()で中断するのって、Iconっぽい?
*/

public abstract class Coroutine
{
    private Thread thread = null;
    private Object resume_value = null;
    private boolean terminated = false;
    private boolean terminating = false;

    public class Terminating extends RuntimeException {
    }

    public Coroutine(){
        final Coroutine c = this;

        thread = new Thread() {
                public void run(){
                    try{
			try {
			    c.run();
			} catch (Terminating e) {
			    //System.out.println("terminated");
			}
                    } finally {
                        resume_value = null;
                        terminated = true;
                        synchronized(c) {
                            c.notify();
                        }
                    }
                }
            };

        synchronized(this) {
            thread.start();
            try{
                wait();
            }catch(InterruptedException e){
            }
        }
    }

    public synchronized Object resume(Object arg) {
        if (terminated) {
            return null;
        } else {
            resume_value = arg;
            notify();
            try{
                wait();
            }catch(InterruptedException e){
		// XXX
            }
            return resume_value;
        }
    }

    public synchronized Object suspend(Object arg)  {
        if (terminated) {
            return null;
        } else {
            resume_value = arg;
            notify();
            try{
                wait();
            }catch(InterruptedException e){
		// XXX
            }

	    if (terminating)
		throw new Terminating();
            return resume_value;
        }
    }

    public Object resume() { return resume(null); }
    public Object suspend() { return suspend(null); }

    public abstract void run();

    public synchronized void terminate() {
	terminating = true;
	notify();
    }
}
