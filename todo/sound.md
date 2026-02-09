# 効果音・BGM移植タスク

## 現状

オリジナルゲームは J-PHONE (2003) 向けで、Yamaha SMAF フォーマットを使用。
ブラウザでは直接再生不可のため、WAV/MP3/OGG等への変換が必要。

## 使用されている音声ファイル

### SPF形式（SMAF-Phrase: ゲーム効果音向け）
- `bgm.spf` (2.2KB) - メインBGM
- `boss_bgm.spf` (20KB) - ボスBGM
- `Gun1.spf`, `Gun2.spf`, `Gun3.spf` - 発射音
- `Hit1.spf` ~ `Hit5.spf` - ヒット音
- `explos1.spf`, `explos2.spf`, `explos3.spf` - 爆発音
- `Click10.spf` - クリック音

### MMF形式（SMAF-Audio: 着メロ向け）
- `clear.mmf` (258 bytes) - クリア音

**計15ファイル**（BGM 2, 効果音 13）

## SMAFフォーマットについて

### SMAF (Synthetic music Mobile Application Format)
- **開発**: Yamaha
- **用途**: 携帯電話・PDA向け音楽データ（1999-2005年に主流）
- **特徴**: MIDIライクだがFM合成・PCM再生・グラフィックもサポート
- **利点**: MP3より小サイズ・低消費電力

### SMAF-Phrase (SPF)
- **MIME type**: `application/vnd.yamaha.smaf-phrase`
- **登録**: 2003年7月9日
- **用途**: リアルタイムマルチトラックゲーム効果音専用
- **構造**: 複数の独立シーケンスを同時再生可能

### ファイル構造
- マジックナンバー: `MMMD` (4D 4D 4D 44)
- チャンク構成: `CNTI` (コンテンツ情報), `MMMG` (メタ), `VOIC` (音色), `SEQU` (シーケンス)

**参考リンク:**
- [SMAF Phrase - IANA](https://www.iana.org/assignments/media-types/application/vnd.yamaha.smaf-phrase)
- [Synthetic music mobile application format - Wikipedia](https://en.wikipedia.org/wiki/Synthetic_music_mobile_application_format)

## 変換方法の調査と試行結果

### 1. FFmpeg ❌ 失敗

**期待**: MMF/SMAFをネイティブサポート（[libavformat/mmf.c](https://github.com/FFmpeg/FFmpeg/blob/master/libavformat/mmf.c)）

**試行**:
```bash
brew install ffmpeg
ffmpeg -i Gun1.spf Gun1.wav
```

**結果**: エラー
```
[mmf @ 0x12ce05f50] Unsupported SMAF chunk 474d4d4d
[in#0 @ 0x12ce05840] Error opening input: Not yet implemented in FFmpeg, patches welcome
```

**原因**:
- `474d4d4d` = "MMMG" チャンク
- FFmpegは標準MMF（SMAF-Audio）には対応
- **SMAF-Phrase（SPF）には未対応**
- [該当コード](https://github.com/FFmpeg/FFmpeg/blob/5f84a7263e34ed8aa3dba30bec791a297c7140cc/libavformat/mmf.c#L227-L230)

### 2. オンラインコンバータ ❌ ほぼ全滅

| サービス | 結果 |
|---------|------|
| [Change My File](https://changemyfile.com/mmf-converter) | 変換失敗 |
| [RunConvert](https://www.runconvert.com/mmf-converter) | 404 Not Found |
| [Audio-Convert.com](https://audio-convert.com/mmf-converter/mmf-to-wav) | 変換失敗 |
| [Playback.fm](https://playback.fm/audio-converter/mmf-to-wav) | 未検証 |

**理由**: SMAF-Phraseに対応していないと思われる

### 3. mmftool (GitHub) ❌ 失敗

**リポジトリ**: [Pusungwi/mmftool](https://github.com/Pusungwi/mmftool)

**結果**:
```
MIDI Track Count : 0
WAVE Track Count : 0
```

**理由**: SMAF-Phraseの構造に未対応の可能性

### 4. Yamaha公式ツール ⏸️ 未検証

- [SMAF Tools Downloads](https://www.smaf-yamaha.com/tools/downloads.html) - 公式ページ
- [Mobile Contents Player](https://archive.org/details/mcp-ma-7-162-e) - 再生専用（Internet Archive）

**課題**:
- 多くのツールが廃止済み
- Windows専用の可能性
- ダウンロードリンク切れの懸念

## 問題の本質

**SMAF-Phrase (SPF) は特殊フォーマット**
- ゲーム向けリアルタイム再生用に設計
- 2003年登録の比較的マイナーな variant
- 一般的なMMF（着メロ）とは内部構造が異なる
- 対応ツールがほとんど存在しない

## 今後の選択肢

### A. Yamaha公式ツールの徹底調査
- smaf-yamaha.com のツール全検証
- Internet Archive で古いバージョン探索
- Windows仮想環境での実行

### B. 代替音源の作成
- Web Audio API で効果音を合成
  - 発射音: ホワイトノイズ + エンベロープ
  - 爆発音: 低周波パルス + ディストーション
  - ヒット音: 短いビープ音
- 効果音ジェネレータ ([jsfxr](https://sfxr.me/), [ChipTone](https://sfbgames.itch.io/chiptone))
- フリー素材サイト ([Freesound](https://freesound.org/))

### C. BGMは諦める / 簡易版
- 効果音のみ実装（優先度高）
- BGMは無音またはフリーBGMで代替

### D. SMAF-Phraseデコーダの自作
- バイナリ解析してシーケンスデータ抽出
- MIDI風の再生エンジンをJSで実装
- **工数大**（現実的でない）

### E. 古いフィーチャーフォンで録音
- J-PHONE互換機でゲーム実行
- オーディオ出力をライン録音
- **実機入手が困難**

## 推奨アプローチ

**優先度順:**
1. **Yamaha公式ツールの調査**（2-3時間）
   - ダメなら次へ
2. **効果音は代替音源で作成**
   - jsfxr で レトロゲーム風の音を生成
   - シンプルで雰囲気が合う
3. **BGMは諦める or フリー素材**
   - ゲームプレイに必須ではない
   - 無音でも十分遊べる

## メモ

- オリジナルの音源はアーカイブとして保存
- 代替音源も「2003年のゲーム風」を意識
- Web Audio API の実装は audio.js に追加
- 効果音の発動タイミングは既存コードから確認済み:
  - `sound[0]`: bgm (ループ)
  - `sound[1]`: Gun3.spf (発射音)
  - `sound[2]`: Click10.spf (クリア音)
  - `sound[3]`: Hit4.spf (ヒット音)

## 参考リンク

- [SMAF / What is SMAF? / Outline of SMAF Specification / About Each Chunk](https://web.archive.org/web/20150707144613/http://smaf-yamaha.com/what/s50.html)
- [SMAF Phrase - IANA Registry](https://www.iana.org/assignments/media-types/application/vnd.yamaha.smaf-phrase)
- [SMAF Audio - IANA Registry](https://www.iana.org/assignments/media-types/application/vnd.yamaha.smaf-audio)
- [Yamaha SMAF - Wikipedia](https://en.wikipedia.org/wiki/Synthetic_music_mobile_application_format)
- [Yamaha SMAF - Legacy Portable Computing Wiki](https://lpcwiki.miraheze.org/wiki/Yamaha_SMAF)
- [FFmpeg MMF Demuxer Source](https://github.com/FFmpeg/FFmpeg/blob/master/libavformat/mmf.c)
- [jsfxr - 8-bit Sound Generator](https://sfxr.me/)
- [ChipTone - Sound Effect Generator](https://sfbgames.itch.io/chiptone)
