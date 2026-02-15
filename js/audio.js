// Sound module — PhrasePlayer replacement using Web Audio API
// Pre-decodes audio into memory buffers for low-latency, low-CPU playback.

const audioCtx = new AudioContext();

class Sound {
    constructor(src) {
        this.buffer = null;
        this.sourceNode = null;
        this.loop = false;
        this._loadPromise = fetch(src)
            .then(res => res.arrayBuffer())
            .then(buf => audioCtx.decodeAudioData(buf))
            .then(decoded => { this.buffer = decoded; })
            .catch(() => {});
    }

    play(loop) {
        if (!this.buffer) return;
        this.stop();
        this.loop = (loop === 0);
        const source = audioCtx.createBufferSource();
        source.buffer = this.buffer;
        source.loop = this.loop;
        source.connect(audioCtx.destination);
        source.start(0);
        this.sourceNode = source;
    }

    stop() {
        if (this.sourceNode) {
            try { this.sourceNode.stop(); } catch (e) {}
            this.sourceNode = null;
        }
    }
}

export const sound = [
    new Sound('res/bgm.mp3'),       // 0: BGM (loop)
    new Sound('res/Gun3.opus'),     // 1: enemy hit
    new Sound('res/Click10.opus'),  // 2: score item pickup
    new Sound('res/Hit4.opus'),     // 3: player hit
];

export const soundReady = Promise.all(sound.map(s => s._loadPromise));

// Autoplay workaround: browsers suspend AudioContext before user interaction.
function resumeAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    document.removeEventListener('keydown', resumeAudio);
    document.removeEventListener('click', resumeAudio);
    document.removeEventListener('touchstart', resumeAudio);
}
document.addEventListener('keydown', resumeAudio);
document.addEventListener('click', resumeAudio);
document.addEventListener('touchstart', resumeAudio);
