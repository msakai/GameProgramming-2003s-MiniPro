// Sound module — PhrasePlayer replacement using Web Audio API
// Pre-decodes audio into AudioBuffers for low-latency, low-CPU playback.
//
// Mobile browsers suspend AudioContext until a user gesture (touchend/click),
// and play() may be called before decoding finishes. To handle every ordering
// of {buffer ready, context unlocked, play() called}, we use a _pending flag:
//
//   play() called while buffer or context not ready → set _pending
//   Buffer decoded while _pending and context running → start playback
//   Context unlocked (statechange) while _pending and buffer ready → start playback

const audioCtx = new AudioContext();

class Sound {
    constructor(src) {
        this.buffer = null;
        this.sourceNode = null;
        this.loop = false;
        this._pending = false;
        this._loadPromise = fetch(src)
            .then(res => res.arrayBuffer())
            .then(buf => audioCtx.decodeAudioData(buf))
            .then(decoded => {
                this.buffer = decoded;
                if (this._pending && audioCtx.state === 'running') {
                    this._startSource();
                }
            })
            .catch(() => {});
    }

    play(loop) {
        this.stop();
        this.loop = (loop === 0);
        if (!this.buffer || audioCtx.state !== 'running') {
            this._pending = true;
            return;
        }
        this._startSource();
    }

    _startSource() {
        const source = audioCtx.createBufferSource();
        source.buffer = this.buffer;
        source.loop = this.loop;
        source.connect(audioCtx.destination);
        source.start(0);
        this.sourceNode = source;
        this._pending = false;
    }

    stop() {
        this._pending = false;
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

// When context transitions to running, start any deferred sounds.
audioCtx.addEventListener('statechange', () => {
    if (audioCtx.state === 'running') {
        for (const s of sound) {
            if (s._pending && s.buffer) {
                s._startSource();
            }
        }
    }
});

// Autoplay workaround: browsers suspend AudioContext until a user gesture.
// Use touchend/click (not touchstart) — iOS requires these for audio unlock.
// Keep listeners active until context is actually running.
function resumeAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (audioCtx.state === 'running') {
        document.removeEventListener('keydown', resumeAudio);
        document.removeEventListener('touchend', resumeAudio);
        document.removeEventListener('click', resumeAudio);
    }
}
document.addEventListener('keydown', resumeAudio);
document.addEventListener('touchend', resumeAudio);
document.addEventListener('click', resumeAudio);
