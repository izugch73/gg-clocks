# じじいの時計置き場

OBS のブラウザソースに URL を貼るだけで使える時計のカタログ。
公開先: https://clocks.thegg.jp

Astro 5 の静的サイトです。

## 開発

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check（型チェック）
npm run build    # dist/ に静的出力
```

時計の一覧は `src/data/clocks.ts`、各時計の見た目は `src/components/clocks/*.astro`、
時刻取得・タイマー・針の回転などの共通処理は `src/lib/clock-runtime.ts` にあります。

## デプロイ（FTPS）

`npm run deploy` でビルドしてから `dist/` の中身をサーバーに FTPS でアップロードします。

1. プロジェクト直下に `.env` を作る（`.gitignore` 済み。コミットされません）:

   ```
   FTP_HOST=ftp.example.com
   FTP_USER=your-ftp-user
   FTP_PASSWORD=your-ftp-password
   FTP_REMOTE_DIR=/public_html
   ```

   任意の設定:

   ```
   FTP_PORT=21
   FTP_SECURE=true      # true: 明示的FTPS（既定） / implicit: 暗黙的FTPS / false: 平文FTP
   FTP_VERBOSE=1        # 通信ログを出す
   ```

2. 実行:

   ```sh
   npm run deploy:dry   # 接続せずにアップロード対象の一覧だけ表示
   npm run deploy       # ビルド → アップロード
   npm run deploy:only  # ビルド済みの dist/ をそのままアップロード
   ```

アップロードは上書きのみで、サーバー側の余分なファイルは削除しません。
