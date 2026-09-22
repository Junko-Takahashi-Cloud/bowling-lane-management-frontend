# bowling-lane-management-system(フロントエンド)

スポーツボウリング場運営システム構想・第三弾「店舗・スタッフ管理システム」のフロントエンドです。React(Vite)で構築しています。

## 概要

第三弾のバックエンド([bowling-lane-management-system](https://github.com/Junko-Takahashi-Cloud/bowling-lane-management-system))が提供するAPIと接続し、店舗スタッフが日々の業務を行うための操作画面を実装しています。

## 画面構成

- **スタッフログイン**:4桁PINによる認証
- **ホーム**:各機能への導線となるメニュー画面
- **予約ダッシュボード**:当日の予約状況を一覧表示。各予約から来店受付画面へ遷移できる
- **来店受付・チェックイン**:アメリカン方式(2レーン同時使用)に対応したペア単位でのチェックイン
- **レーン状態管理**:空き/使用中/故障中/メンテナンス中のステータス変更
- **コーチシフト管理**:コーチの選択(プルダウン)・シフト登録・新規コーチ登録
- **教室出席管理**:本日の教室セッションを取得し、出席ステータス(全員出席/一部欠席で継続/一部欠席でスライド)を記録
- **スタッフ出退勤(タイムカード)**:ログイン中スタッフの出退勤を記録。打刻はUTCで保存されるためJSTに変換して表示
- **決済確認**:料金概算計算 → 決済登録(未払い記録) → 精算実行の3ステップ構成
- **スタッフ登録**:2人目以降のスタッフをログイン済みスタッフが登録(最初の1人は開業時にAPIへ直接登録)
- **売上履歴**:期間・単位(日/週/月)を指定した売上集計を表示

## 技術スタック

- React + Vite
- react-router-dom(画面遷移)
- axios(API通信、`src/api/client.js`でPOST/GET/PATCH/DELETEを共通化。インターセプターでトークンを自動付与)
- Recharts(売上履歴の可視化)
- 状態管理はReact標準のuseState/useEffectのみ(Redux等は未使用)
- UIライブラリは未使用、インラインstyleで実装

## エラー処理

バックエンド(FastAPI/Pydantic)のバリデーションエラーは文字列・配列の両形式で返ってくるため、`src/utils/errorMessage.js`の`formatErrorMessage`関数で1つの読みやすい文章に統一しています。決済確認・来店受付・教室出席管理・レーン状況・コーチシフト管理・スタッフ出退勤・スタッフ登録の各画面に適用済みです。

## セットアップ

```
npm install
npm run dev
```

`http://localhost:5173` で起動します。バックエンド([bowling-lane-management-system](https://github.com/Junko-Takahashi-Cloud/bowling-lane-management-system))を別途起動しておく必要があります。

## 関連リポジトリ

- [bowling-lane-management-system](https://github.com/Junko-Takahashi-Cloud/bowling-lane-management-system)(バックエンド)
