#/usr/bin/env ruby
# written by Masahiro Sakai <s01397ms@sfc.keio.ac.jp>

sin_table = (0...360).map{|i|
  (Math.sin(2 * Math::PI * i/360.0) * 256).to_i
}

print <<END
import java.util.Random;

public class MyMath {
    static final int PI2 = 360;
    static final int PI  = 180;

    static final int sin8(int arg) {
        final int[] table = {
          #{sin_table.join(",\n          ")}
        };

        while (arg < 0)
           arg += PI2;
        arg %= PI2;
        return table[arg];
    }

    static final int cos8(int arg) {
        return sin8(PI/2 - arg);
    }

    static private Random rand = new Random();
    static public final int rand(int min,int max) {
        return ((rand.nextInt() >>> 1)%(max-min+1))+min;
    }
}
END
