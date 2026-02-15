// Sound module — PhrasePlayer replacement using HTML5 Audio
// Each sound slot wraps an Audio element with play(loop)/stop() interface.

class Sound {
    constructor(src) {
        this.audio = new Audio(src);
    }

    play(loop) {
        this.audio.loop = (loop === 0);
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

export const sound = [
    new Sound('res/bgm.mp3'),       // 0: BGM (loop)
    new Sound('res/Gun3.opus'),     // 1: enemy hit
    new Sound('res/Click10.opus'),  // 2: score item pickup
    new Sound('res/Hit4.opus'),     // 3: player hit
];

// Autoplay workaround: browsers block audio before user interaction.
// On the first keydown/click, retry BGM playback if it hasn't started.
function resumeAudio() {
    const bgm = sound[0].audio;
    if (bgm.paused && bgm.loop) {
        bgm.play().catch(() => {});
    }
    document.removeEventListener('keydown', resumeAudio);
    document.removeEventListener('click', resumeAudio);
}
document.addEventListener('keydown', resumeAudio);
document.addEventListener('click', resumeAudio);
