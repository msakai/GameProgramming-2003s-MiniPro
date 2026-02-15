// Game.java port — main game loop, object management, score

import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { Background } from './background.js';
import { Player } from './player.js';
import { Title } from './title.js';
import { GameOver } from './gameOver.js';
import { sound, soundReady } from './audio.js';

const MSECS_PER_TICK = 20;
const WIDTH = 120;
const HEIGHT = 160;

class Game {
    constructor() {
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;

        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.input = new Input();
        this.sound = sound;

        this.objects = [];
        this.removingObjects = [];
        this.player = null;
        this.background = null;
        this.nPlayers = 5;
        this.score = 0;
        this.highScore = 0;
        this.gameBreak = false;

        this.images = {};
        this._lastTime = 0;
        this._accumulator = 0;
    }

    async loadImages() {
        const names = ['ball', 'blob', 'dawa', 'kusa_down', 'kusa_left', 'kusa_right'];
        const promises = names.map(name => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images[name] = img;
                    resolve();
                };
                img.onerror = reject;
                img.src = `res/${name}.png`;
            });
        });
        await Promise.all(promises);
    }

    initGame() {
        this.nPlayers = 5;
        this.score = 0;
        this.loadHighScore();

        this.gameBreak = false;
        this.objects = [];
        this.removingObjects = [];

        this.background = new Background(this);
        this.player = new Player(this);

        this.addObject(new Title(this));

        this.sound[0].stop();
        this.sound[0].play(0);
    }

    updateGame() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
            if (this.gameBreak) break;
        }
        this.gameBreak = false;

        for (const g of this.removingObjects) {
            const idx = this.objects.indexOf(g);
            if (idx !== -1) {
                this.objects.splice(idx, 1);
            }
            g.on_removed();
        }
        this.removingObjects = [];
    }

    render() {
        this.renderer.clear();
        for (const obj of this.objects) {
            obj.paint(this.renderer);
        }
    }

    gameover(title) {
        this.gameBreak = true;
        for (const obj of this.objects) {
            this.removeObject(obj);
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }

        this.addObject(new GameOver(this, title));
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    removeObject(obj) {
        this.removingObjects.push(obj);
    }

    saveHighScore() {
        let hs = this.highScore;
        if (hs > 999999) hs = 999999;
        if (hs < 0) hs = 0;
        try {
            localStorage.setItem('tennis_ball_high_score', String(hs));
        } catch (e) {}
    }

    loadHighScore() {
        try {
            const val = localStorage.getItem('tennis_ball_high_score');
            if (val !== null) {
                this.highScore = parseInt(val, 10) || 0;
            }
        } catch (e) {}
    }

    loop(timestamp) {
        if (this._lastTime === 0) {
            this._lastTime = timestamp;
        }

        this._accumulator += timestamp - this._lastTime;
        this._lastTime = timestamp;

        // Cap accumulator to prevent spiral of death
        if (this._accumulator > 200) this._accumulator = 200;

        while (this._accumulator >= MSECS_PER_TICK) {
            this.updateGame();
            this._accumulator -= MSECS_PER_TICK;
        }

        this.render();
        requestAnimationFrame((t) => this.loop(t));
    }

    async start() {
        await Promise.all([this.loadImages(), soundReady]);
        this.initGame();
        requestAnimationFrame((t) => this.loop(t));
    }
}

const game = new Game();
game.start();
