# テニスボールの奇妙なシューティング

![](screenshot.png)

**Live Demo:** <https://msakai.github.io/GameProgramming-2003s-MiniPro/>

## 概要 / About This Project

慶應義塾大学SFCの2003年春学期「ゲームプログラミング」（担当：和田 理彦、杉山 雄一）の課題（ミニプロ）として作成した縦スクロールシューティングゲームです。

当時のJ-PHONE（現ソフトバンク）の携帯電話向けに、Java ME (MIDP 1.0) で開発した本作を、2026年にClaude Codeを用いてHTML5 Canvas + JavaScriptへと移植しました。オリジナルのゲームロジックと演出を可能な限り忠実に再現していますが、BGMについては別のものに差し替えています。

This is a vertical-scrolling shoot-'em-up game created as a mini-project assignment for the "Game Programming" course (Spring 2003, taught by Masahiko Wada and Yuichi Sugiyama) at Keio University SFC.

Originally developed for J-PHONE mobile phones using Java ME (MIDP 1.0), this game was ported to HTML5 Canvas + JavaScript in 2026 using Claude Code. The port faithfully recreates the original game logic and visual effects, though the background music was replaced with a different track.

## 遊び方 / How to Play

### 起動方法 / How to Run

#### ライブデモ / Live Demo

GitHub Pages で公開しているので、環境を準備せずに遊ぶことが可能です。

It's published on GitHub Pages, so you can play around with it without setting up any environment.

<https://msakai.github.io/GameProgramming-2003s-MiniPro/>

#### ローカルでの起動 / Local Setup

```bash
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 を開いてください。

Open http://localhost:8000 in your browser

### 操作方法 / Controls

- **矢印キー**: 移動
- **スペース / Z / Enter**: ショット（自動連射）

- **Arrow keys**: Move
- **Space / Z / Enter**: Shoot (auto-fire)

## 技術仕様

- **解像度**: 120×160 ピクセル（オリジナルのJ-PHONE画面サイズ）
- **スケーリング**: CSS で 4倍に拡大表示（480×640）
- **実装**: Vanilla JavaScript（ES6モジュール）、ビルドステップなし
- **描画**: HTML5 Canvas 2D API
- **コルーチン**: Java MEの`Thread`+`wait/notify`パターンをJavaScriptのGenerator関数で実装
- **固定小数点演算**: オリジナルの三角関数テーブル（256倍スケール）をそのまま使用

## プロジェクト構成

```
index.html          — エントリーポイント
js/                 — ゲームコードすべて（ESモジュール）
  main.js           — ゲームループ、オブジェクト管理
  player.js         — プレイヤー制御
  enemy.js          — 敵キャラクター（5種類）
  boss.js           — ボスキャラクター（3体）
  bullet.js         — 弾丸クラス
  stage.js          — ステージ構成（3ステージ）
  ...
res/                — 画像リソース
orig/               — オリジナルのJava MEソースコード（参照用）
```

詳細な設計方針については [CLAUDE.md](CLAUDE.md) および [DESIGN.md](DESIGN.md) を参照してください。

## 参考文献 / References

- [当時の授業ページのアーカイブ](https://web.archive.org/web/20030803232942/web.sfc.keio.ac.jp/~wadari/game/) （Internet Archive、文字化けあり）
- [シラバス](https://web.sfc.keio.ac.jp/~wadari/game/syl03.txt)
- [最終課題の表彰者リスト](https://web.sfc.keio.ac.jp/~wadari/game/best/gp03best.html) （文字化けあり）
- [表彰作品をダウンロード（700KB）](https://web.sfc.keio.ac.jp/~wadari/game/best/gp03best.zip)

## ライセンス / License

### コード / Code

- **Original version (2003)**: © Masahiro Sakai 2003
- **Ported version (2026)**: © Masahiro Sakai 2026

### アセット / Assets

#### 移植版に含まれるファイル / Files included in the ported version

- `ball.png` — From the "Game Programming" course sample materials
- Other image files (`*.png`) — © Masahiro Sakai 2003
- Sound effects (`Click10.*`, `Gun3.*`, `Hit4.*`) — Copyright © 2002 YAMAHA CORPORATION
- BGM (`bgm.mp3`) - [レトロシューティング](https://dova-s.jp/bgm/play11590.html) composed by ハヤシユウ

#### オリジナル版のみに含まれるファイル（`orig/` ディレクトリ） / Files only in the original version (`orig/` directory)

- Sound effects (`Click10.spf`, `explos*.spf`, `Gun*.spf`, `Hit*.spf`) — Copyright © 2002 YAMAHA CORPORATION
- BGM and sound effects (`bgm.spf`, `boss_bgm.spf`, `clear.mmf`) — Rights unclear
