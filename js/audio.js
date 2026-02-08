// Sound stub — PhrasePlayer replacement
// Each sound slot is an object with play() and stop() that do nothing.

class SoundStub {
    play(loop) {}
    stop() {}
}

export const sound = [
    new SoundStub(), // 0: BGM
    new SoundStub(), // 1: enemy hit
    new SoundStub(), // 2: score item pickup
    new SoundStub(), // 3: player hit
];
