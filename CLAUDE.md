# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## コマンド

### 開発
```bash
npm run dev          # localhost:3000で開発サーバーを起動
npm run generate     # 静的サイトを生成
npm run postinstall  # Nuxtの準備（npm install後に自動実行）
```

注意: このプロジェクトには標準的な `build`、`lint`、`test` スクリプトがありません。必要な場合はpackage.jsonに追加してください。

### 主要設定
- **SPAモード**: SSRは無効 (`ssr: false` in nuxt.config.ts)
- **ベースURL**: デプロイ用に `/nuxt3-vuetify3/`
- **APIプロキシ**: `/api/*` ルートを `http://localhost:8080` にプロキシ
- **ロケール**: 日本語 (`lang: 'ja'`)

## アーキテクチャ概要

### Dutyパターン
このコードベースは、ビジネスロジックを整理するための独自の**Dutyパターン**を実装しています：

1. **Dutyクラス** (`pages/*/duty.js`): ビジネスロジックとAPI連携を担当
2. **Piniaストア** (`pages/*/store.js`): Dutyインスタンスを統合し状態を管理
3. **Vueコンポーネント** (`pages/*/index.vue`): UIとユーザーインタラクションを処理

構造例:
```javascript
// duty.js - ビジネスロジック
export default class Duty {
  constructor(id) { this.id = id }
  setup(nuxtApp) { return Object.assign(this, { $api: nuxtApp.$api }) }
  async init() { /* ビジネスロジック */ }
}

// store.js - 状態管理
const duty = new Duty(id)
export const usePageStore = defineStore(id, {
  state: () => ({ duty: duty.setup(useNuxtApp()) }),
  actions: { async init() { await duty.init() } }
})
```

### 認証システム
**階層化されたストア構造**を採用し、認証状態を管理：

1. **グローバル認証ストア** (`pages/global/auth/store.js`): アプリ全体の認証状態
2. **ページ固有ストア** (`pages/login/store.js`): ページ専用のUI状態
3. **委譲パターン**: ページストアからグローバルストアのメソッドを呼び出し

```javascript
// ページストアからグローバルストアへの委譲
export const useStore = defineStore(id, {
  state: () => ({ $auth: useAuthStore() }),
  actions: {
    async login(credentials) {
      await this.$auth.login(credentials)
    }
  }
})
```

### エンドポイント管理
**外部化されたAPI定義** (`app/Endpoints.js`):
```javascript
export const DummyJSON = {
  AuthLogin: { method: 'POST', url: 'https://dummyjson.com/auth/login' },
  AuthRefresh: { method: 'POST', url: 'https://dummyjson.com/auth/refresh' },
  AuthMe: { method: 'GET', url: 'https://dummyjson.com/auth/me' }
}
```

### プラグインシステム
`/plugins/`の包括的なプラグイン:
- **api.js**: ログ、CSRF、エラーハンドリング付きのカスタム`$fetch`ラッパー
- **dayjs.js**: 日本語ロケールとタイムゾーン対応の日時ライブラリ
- **vee-validate.js**: 日本語ローカライゼーション付きフォームバリデーション
- **hooks.js**: ページナビゲーションフック

### ページ構成
ページは一貫したパターンに従います:
```
pages/[page-name]/
├── duty.js      # ビジネスロジッククラス
├── store.js     # Piniaストア
└── index.vue    # Vueコンポーネント
```

### ユーティリティ
- **Logger.js**: 名前空間サポート付きデバッグログユーティリティ（開発専用）
- ログは開発モードでのみ有効

## 主要パターン

1. **Duty統合**: Dutyインスタンスは常にPiniaストアに注入し、コンポーネントに直接注入しない
2. **APIアクセス**: DutyクラスでHTTPリクエストには `this.$api` を使用、エンドポイントは `app/Endpoints.js` から読み込み
3. **初期化**: ストアアクションから `duty.init()` を呼び出し、通常はコンポーネントの `onMounted` で実行
4. **ログ**: 一貫したデバッグ出力には `Logger('namespace')` を使用
5. **認証フロー**: ページストア → グローバル認証ストア → Duty → API の順で委譲
6. **エンドポイント定義**: `app/Endpoints.js` でAPI URLとメソッドを管理し、Dutyクラスで参照

### 認証関連パターン
- **トークン管理**: `localStorage` でAccessToken/RefreshTokenを永続化
- **ストア委譲**: ページストアからグローバル認証ストアのメソッドを呼び出し
- **自動リダイレクト**: ログイン成功時の `/secure` ページへの自動遷移
- **エラーハンドリング**: DummyJSON APIのエラーレスポンスを適切に処理

## 認証機能の詳細

### DummyJSON認証API
- **ベースURL**: `https://dummyjson.com/auth/*`
- **デモアカウント**: username: `emilys`, password: `emilyspass`
- **機能**: ログイン、トークンリフレッシュ、ユーザー情報取得

### ファイル構成
```
pages/login/
├── duty.js     # 基底Dutyクラス（最小限の実装）
├── store.js    # ページストア（グローバル認証ストアへの委譲）
└── index.vue   # ログインフォームUI

pages/global/auth/
├── duty.js     # 認証業務ロジック
└── store.js    # グローバル認証ストア

app/Endpoints.js # API エンドポイント定義
```

## 不足している要素
- Vuetify 3の設定なし（プロジェクト名にも関わらず）
- テストフレームワークの設定なし
- 標準的なbuild/lintスクリプトなし
- CI/CD設定なし