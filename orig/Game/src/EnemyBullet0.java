public class EnemyBullet0 extends SimpleBullet {
    public EnemyBullet0(int x, int y, int angle) {
        super(x, y, angle);
        color = 0xFF0000;
        speed = 2;
        is_enemy_bullet = true;
    }
}
