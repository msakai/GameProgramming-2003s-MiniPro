// Internationalization support

const messages = {
    ja: {
        titleLine1: 'テニスボールの',
        titleLine2: '奇妙なシューティング',
        howToMove: '←→↑↓で移動',
        noteItem: '「♪」は得点',
        goalScore: '目標2万点',
        pressEnter: '★ PRESS ENTER ★',
        gameOver: 'GAME OVER',
        gameClear: 'GAME CLEAR',
        score: 'Score: ',
        highScore: 'High Score: ',
        documentTitle: 'テニスボールの奇妙なシューティング',
    },
    en: {
        titleLine1: 'Tennis Ball',
        titleLine2: 'Bizarre Shooting',
        howToMove: 'Arrow keys to move',
        noteItem: '"♪" gives points',
        goalScore: 'Goal: 20000 pts',
        pressEnter: '★ PRESS ENTER ★',
        gameOver: 'GAME OVER',
        gameClear: 'GAME CLEAR',
        score: 'Score: ',
        highScore: 'High Score: ',
        documentTitle: 'Tennis Ball Bizarre Shooting',
    },
};

function detectLanguage() {
    const params = new URLSearchParams(location.search);
    const lang = params.get('lang');
    if (lang && messages[lang]) return lang;

    for (const preferred of navigator.languages || [navigator.language]) {
        const base = preferred.split('-')[0];
        if (messages[base]) return base;
    }
    return 'ja';
}

const currentLang = detectLanguage();

export function t(key) {
    return (messages[currentLang] && messages[currentLang][key]) || messages.ja[key] || key;
}

export function getLang() {
    return currentLang;
}
