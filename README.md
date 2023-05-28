# firebase-chat

## 概要
このアプリケーションは、書籍「Testable Firebase接続可能なFirebaseプロジェクトを目指して」の学習で作成した、
Firebaseを使ったウェブアプリケーションです。

## 実行手順
1. プロジェクト直下に.env.development.localファイルを作成
2. `yarn install`
3. `yarn dev`

.env.development.localのファイル内容
```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```
設定する値については、Firebaseのプロジェクトページのプロジェクトの概要の横の歯車からプロジェクトの設定 > マイアプリ から確認できます。アプリがない場合は`</>`のアイコンをクリックしてアプリを登録してください。名前は好きな前で良いです。

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