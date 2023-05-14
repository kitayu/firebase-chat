# firebase-chat

## 概要
このアプリケーションは、書籍「Testable Firebase接続可能なFirebaseプロジェクトを目指して」の学習で作成した、
Firebaseを使ったウェブアプリケーションです。

## 実行手順
1. `yarn install`
2. `yarn dev`

```
% yarn install
yarn install v1.22.19
warning ../../package.json: No license field
info No lockfile found.
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Saved lockfile.
✨  Done in 20.66s.

% yarn dev
yarn run v1.22.19
warning ../../package.json: No license field
$ vite

  VITE v4.3.1  ready in 798 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```


## テスト実行手順
エミュレーターを起動してから、テストを実行してください。

### エミュレーターの起動
```
% yarn emulators:start:firestore
```

### テスト実行
```
% yarn test
```

### カバレッジの確認
エミュレーターを起動した状態で、以下のURLにアクセスすることで確認できます。
http://127.0.0.1:8080/emulator/v1/projects/firebase-chat-test:ruleCoverage.html