import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const today = new Date().toISOString().slice(0, 10);

function Sales() {
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [groupBy, setGroupBy] = useState('day');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFetch = () => {
    client
      .get('/api/v1/staff/sales', {
        params: { start_date: startDate, end_date: endDate, group_by: groupBy },
      })
      .then((res) => {
        setResult(res.data);
        setError('');
      })
      .catch((err) => {
        const detail = err.response?.data?.detail || '取得に失敗しました';
        setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        setResult(null);
      });
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>売上・利用履歴</h2>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', marginTop: '20px' }}>
        <label>
          開始日
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ display: 'block', padding: '6px' }}
          />
        </label>
        <label>
          終了日
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ display: 'block', padding: '6px' }}
          />
        </label>
        <label>
          集計単位
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            style={{ display: 'block', padding: '6px' }}
          >
            <option value="day">日</option>
            <option value="week">週</option>
            <option value="month">月</option>
          </select>
        </label>
        <button onClick={handleFetch} style={{ padding: '8px 16px' }}>
          集計する
        </button>
      </div>

      {error && <p style={{ color: '#d00', marginTop: '16px' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '24px' }}>
          <h3>合計: ¥{result.total_amount.toLocaleString()}</h3>
          <table style={{ borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '6px 12px' }}>期間</th>
                <th style={{ border: '1px solid #ccc', padding: '6px 12px' }}>金額</th>
                <th style={{ border: '1px solid #ccc', padding: '6px 12px' }}>件数</th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map((b) => (
                <tr key={b.period}>
                  <td style={{ border: '1px solid #ccc', padding: '6px 12px' }}>{b.period}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 12px' }}>
                    ¥{b.amount.toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '6px 12px' }}>{b.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Sales;