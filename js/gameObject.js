// GameObject.java port — base class for all game objects

export class GameObject {
    constructor(game) {
        this.game = game;
    }

    update() {}
    paint(g) {}
    on_removed() {}
}
