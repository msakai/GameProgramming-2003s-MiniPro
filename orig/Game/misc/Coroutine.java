import java.util.*;

class Debug
{
    public final static boolean DEBUG = false;
}

/**
 * Class coroutine implements single control flow for multiple threads.
 * Functions attach and deatach controls threads and switches between
 * them.
 */
public abstract class Coroutine
        implements Runnable
{
    /** Action on exit */
    private final int NONE_ON_EXIT = 0;
    /** Action on exit */
    private final int ATTACH_ON_EXIT = 1;
    /** Action on exit */
    private final int DETACH_ON_EXIT = 2;

    /** First coroutine? */
    private static boolean first = true;

    /** First variable monitor */
    private static Object firstMonitor = new Object();

    /** Action to perform on exit thread */
    private int actionOnExit = NONE_ON_EXIT;

    /** last coroutine launched */
    private static Coroutine lastCoroutine;

    /** whether thred has finished its job */
    private boolean threadExited = false;

    /** thread of this coroutine */
    private Thread coroutineThread;

    /**
     * Configure
     * coroutine creating bed for sleeping.
     * Object created first is immediately launched.
     */
    public Coroutine()
    {
        coroutineThread = new Thread(this);

        synchronized (Coroutine.firstMonitor)
        {
            if (Coroutine.first)
            {
                first = false;
                coroutineThread.start();
            }
        }
    }

    /**
     * Implementing Runnable, thread (launched by constructor
     * or attach) runs this first.
     */
    public final void run()
    {
        if (Debug.DEBUG)
            System.out.println("Coroutine is runned");

        coroutineStart();

        /* removing finished coroutine */
        threadExited = true;

        try {
            switch (actionOnExit)
            {
            case ATTACH_ON_EXIT:
            case DETACH_ON_EXIT:
                if (Debug.DEBUG)
                    System.out.println("attach/detach on exit");

                attach(Coroutine.lastCoroutine, true);
                break;
            case NONE_ON_EXIT:
            default:
            }
        } catch (Exception e) {
            System.err.println(e);
        }

        if (Debug.DEBUG)
            System.out.println("Coroutine's exit");
    }

    /**
     * This methods fires coroutine c and this thread
     * optionally falls asleep
     * @param c Coroutine to attach to
     * @param onExit False if attachOnExit or detachOnExit
     */
    synchronized private final void attach(Coroutine c, boolean onExit)
        throws Exception
    {
        if (Debug.DEBUG)
            System.out.println("Attach start");

        if (onExit)
        {
            /* when exiting from thread, no where to detach */
            Coroutine.lastCoroutine = c;

            if (c == this)
                throw new Exception("Cannot attach/detach coroutine itself on exit!");
        }
        else
            /* remember where to get back */
            Coroutine.lastCoroutine = this;

        /* is there any control flow change? */
        if (c == this)
            return;

        /* wheather thread is started */
        if (!c.coroutineThread.isAlive())
        {
            /* first attach to thread */
            if (Debug.DEBUG)
                System.out.println("Thread start");
            c.coroutineThread.start();
            if (Debug.DEBUG)
                System.out.println("c.coroutineThread.isAlive() " + c.coroutineThread.isAlive());

            if (!onExit) wait();
        }
        else
        {
            /* not the first attach to thread */
            if (!c.threadExited)
            {
                c.wakeCoroutineUp();
                if (!onExit) wait();
            }
            else
                throw new Exception("No coroutine to run");
        }
    }

    /**
     * This methods fires coroutine c and this thread
     * falls asleep
     * @param c Coroutine to attach to
     */
    synchronized protected final void attach(Coroutine c)
        throws Exception
    {
        attach(c, false);
    }

    /**
     * This methods fires coroutine c and this thread
     * falls asleep
     */
    synchronized protected final void detach()
        throws Exception
    {
        attach(Coroutine.lastCoroutine);
    }

    /**
     * Performed on thread exit
     */
    synchronized protected final void attachOnExit(Coroutine c)
    {
        actionOnExit = ATTACH_ON_EXIT;
        Coroutine.lastCoroutine = c;
    }

    /**
     * Performed on thread exit
     */
    synchronized protected final void detachOnExit()
    {
        actionOnExit = DETACH_ON_EXIT;
    }

    /**
     * ready to inherit - coroutine body
     */
    abstract protected void coroutineStart();

    /**
     * Wakes selected coroutine (called by attach, detach)
     */
    private synchronized void wakeCoroutineUp()
    {
        notify();
    }

}



