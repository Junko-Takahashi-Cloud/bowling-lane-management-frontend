/**
 * バックエンドのエラーレスポンスを、画面表示用の文字列に整形する
 *
 * FastAPI(Pydantic)のバリデーションエラーは detail が配列で返ってくることがあり、
 * そのまま表示しようとするとクラッシュする。この関数で吸収する。
 *
 * 想定される detail の形:
 * 1. 文字列                → そのまま使う
 * 2. 配列(バリデーションエラー) → 各要素の msg を取り出して結合
 * 3. オブジェクト(単一エラー)   → msg があれば使う
 * 4. null/undefined        → デフォルトメッセージ
 */
export function formatErrorMessage(error, fallback = 'エラーが発生しました') {
  const detail = error?.response?.data?.detail;

  if (!detail) {
    return error?.message || fallback;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item?.msg) {
          // FastAPI の loc (例: ["body", "pin_code"]) があればフィールド名も添える
          const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null;
          return field ? `${field}: ${item.msg}` : item.msg;
        }
        return null;
      })
      .filter(Boolean);

    return messages.length > 0 ? messages.join(' / ') : fallback;
  }

  if (typeof detail === 'object' && detail.msg) {
    return detail.msg;
  }

  return fallback;
}