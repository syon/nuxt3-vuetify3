# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Nuxt 3 + Vuetify 3 を使用したSPAアプリケーション。認証機能付きのセキュアなWebアプリケーションとして設計されています。

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
- **Vuetify**: カスタムテーマ「calmPink」を設定、Material Design Icons使用

## 技術スタック

### フレームワーク・ライブラリ
- **Nuxt 3**: Vue.js 3ベースのフルスタックフレームワーク（SPAモード）
- **Vuetify 3**: マテリアルデザインコンポーネントライブラリ
- **Pinia**: Vue.js向け状態管理ライブラリ
- **VeeValidate**: Vue.js向けフォームバリデーションライブラリ
- **Day.js**: 軽量日時ライブラリ

### UI・スタイリング
- **Material Design Icons**: アイコンセット
- **Sass**: CSSプリプロセッサ
- **Vuetifyカスタムテーマ**: calmPinkテーマでピンク系カラーパレット

### 開発ツール
- **ESLint**: コード品質とスタイルのチェック
- **Stylistic ESLint Plugin**: コードフォーマット
- **Simple Import Sort**: インポート文の自動ソート

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
4. **認証ガードミドルウェア** (`middleware/auth-guard.js`): セキュアページへのアクセス制御

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

### セキュリティ機能
- **認証ガード**: `/secure/*` ページへの未認証アクセスを防止
- **自動トークンリフレッシュ**: アクセストークン期限切れ時の自動更新
- **セッション永続化**: localStorage使用
- **リダイレクト機能**: ログイン後の元ページ復帰

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
- **vuetify.js**: Vuetifyの設定とテーマ定義

### ページ構成
ページは一貫したパターンに従います:
```
pages/[page-name]/
├── duty.js      # ビジネスロジッククラス
├── store.js     # Piniaストア
└── index.vue    # Vueコンポーネント
```

### コンポーネント
- **GlobalHeader.vue**: セキュアエリア共通ヘッダー（認証状態表示・ログアウト機能）

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
- **自動リダイレクト**: ログイン成功時の `/secure/profile` ページへの自動遷移
- **エラーハンドリング**: DummyJSON APIのエラーレスポンスを適切に処理
- **セキュアルーティング**: `pages/secure.vue` でレイアウト定義、認証ガードミドルウェア適用

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
└── index.vue   # VeeValidate使用のログインフォームUI

pages/secure/
├── secure.vue  # セキュアエリアレイアウト（認証ガード + GlobalHeader）
├── hello/      # デモページ（カウンター機能）
└── profile/    # ユーザープロフィール表示ページ

pages/global/auth/
├── duty.js     # 認証業務ロジック
└── store.js    # グローバル認証ストア

middleware/auth-guard.js  # 認証チェックミドルウェア
components/GlobalHeader.vue  # セキュアエリア共通ヘッダー
app/Endpoints.js         # API エンドポイント定義
```

## UIの特徴

### Vuetifyテーマ
カスタムテーマ「calmPink」を使用:
- **Primary**: #D48CA0 (落ち着いたピンク)
- **Secondary**: #E8B4CD (薄いピンク)
- **Background**: #FDF8F9 (極薄いピンク)
- **Material Design Icons**: mdi-アイコンセット使用

### フォーム
- **VeeValidate**: フォームバリデーション（日本語対応）
- **Vuetifyコンポーネント**: v-text-field、v-btn等使用
- **アクセシビリティ**: proper form labels、error states

### レスポンシブデザイン
- **Vuetify Grid System**: v-container、v-row、v-col使用
- **モバイル対応**: ブレークポイント対応レイアウト

## 開発パターン

### ESLint設定
- **Stylistic**: インデント2、シングルクォート、セミコロンなし
- **Import Sort**: 自動インポート文ソート
- **Vue Rules**: 緩和されたテンプレート規則

### ログイン後の動作
1. `/secure/profile` ページにデフォルトリダイレクト
2. `redirect` クエリパラメータがある場合は指定ページに遷移
3. 既にログイン済みの場合は自動的にセキュアエリアへ

## 現在の実装状況

### 完成している機能
- ✅ Vuetify 3の完全設定とカスタムテーマ
- ✅ 認証システム（ログイン・ログアウト・トークンリフレッシュ）
- ✅ セキュアページの認証ガード
- ✅ VeeValidateによるフォームバリデーション
- ✅ グローバルヘッダーコンポーネント
- ✅ Dutyパターンによるアーキテクチャ
- ✅ ESLint設定

### 不足している要素
- テストフレームワークの設定なし
- 標準的なbuild/lintスクリプトなし
- CI/CD設定なし
- APIモック・開発用データなし