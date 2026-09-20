import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const paymentMethodOptions = [
  { value: 'cash', label: '現金' },
  { value: 'card', label: 'カード' },
  { value: 'e_payment', label: '電子決済' },
];

function Payments() {
  const navigate = useNavigate();

  // 料金概算計算
  const [laneId, setLaneId] = useState('');
  const [durationHours, setDurationHours] = useState('1');
  const [shoesCount, setShoesCount] = useState('0');
  const [ballCount, setBallCount] = useState('0');
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState('');

  // 決済登録
  const [checkinId, setCheckinId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentTiming, setPaymentTiming] = useState('postpaid');
  const [payerType, setPayerType] = useState('checkin');
  const [createdPayment, setCreatedPayment] = useState(null);
  const [createError, setCreateError] = useState('');

  // 精算実行
  const [payPaymentId, setPayPaymentId] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
  const [payResult, setPayResult] = useState(null);
  const [payError, setPayError] = useState('');

  const handleCalculate = () => {
    client
      .post('/api/v1/payments/calculate', {
        lane_id: Number(laneId),
        duration_hours: Number(durationHours),
        shoes_rental_count: Number(shoesCount),
        ball_rental_count: Number(ballCount),
      })
      .then((res) => {
        setCalcResult(res.data);
        setCalcError('');
        setAmount(String(res.data.total_amount));
      })
      .catch((err) => setCalcError(err.response?.data?.detail || '計算に失敗しました'));
  };

  const handleCreatePayment = () => {
    client
      .post('/api/v1/payments', {
        payer_type: payerType,
        checkin_id: checkinId ? Number(checkinId) : null,
        payment_timing: paymentTiming,
        amount: Number(amount),
        payment_method: 'unpaid',
        is_paid: false,
      })
      .then((res) => {
        setCreatedPayment(res.data);
        setCreateError('');
        setPayPaymentId(String(res.data.id));
      })
      .catch((err) => setCreateError(err.response?.data?.detail || '登録に失敗しました'));
  };

  const handlePay = () => {
    client
      .post(`/api/v1/payments/${payPaymentId}/pay`, { payment_method: payMethod })
      .then((res) => {
        setPayResult(res.data);
        setPayError('');
      })
      .catch((err) => setPayError(err.response?.data?.detail || '精算に失敗しました'));
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>決済確認</h2>

      {/* 料金概算計算 */}
      <div style={{ maxWidth: '480px', marginTop: '20px' }}>
        <h3>① 料金概算</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label>
            レーンID
            <input
              type="number"
              value={laneId}
              onChange={(e) => setLaneId(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '80px' }}
            />
          </label>
          <label>
            利用時間(h)
            <input
              type="number"
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '80px' }}
            />
          </label>
          <label>
            靴レンタル数
            <input
              type="number"
              value={shoesCount}
              onChange={(e) => setShoesCount(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '80px' }}
            />
          </label>
          <label>
            ボールレンタル数
            <input
              type="number"
              value={ballCount}
              onChange={(e) => setBallCount(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '80px' }}
            />
          </label>
          <button onClick={handleCalculate} style={{ padding: '8px 16px' }}>
            計算する
          </button>
        </div>
        {calcError && <p style={{ color: '#d00' }}>{calcError}</p>}
        {calcResult && (
          <p style={{ marginTop: '12px' }}>
            レーン代:¥{calcResult.lane_fee.toLocaleString()}｜靴:¥
            {calcResult.shoes_fee.toLocaleString()}｜ボール:¥
            {calcResult.ball_fee.toLocaleString()}｜
            <strong>合計:¥{calcResult.total_amount.toLocaleString()}</strong>
          </p>
        )}
      </div>

      {/* 決済登録 */}
      <div style={{ maxWidth: '480px', marginTop: '32px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>② 決済登録(未払いとして記録)</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label>
            チェックインID
            <input
              type="number"
              value={checkinId}
              onChange={(e) => setCheckinId(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '100px' }}
            />
          </label>
          <label>
            金額
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '100px' }}
            />
          </label>
          <label>
            支払いタイミング
            <select
              value={paymentTiming}
              onChange={(e) => setPaymentTiming(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            >
              <option value="postpaid">後払い</option>
              <option value="prepaid">先払い</option>
            </select>
          </label>
          <button onClick={handleCreatePayment} style={{ padding: '8px 16px' }}>
            登録する
          </button>
        </div>
        {createError && <p style={{ color: '#d00' }}>{createError}</p>}
        {createdPayment && (
          <p style={{ marginTop: '12px' }}>
            決済ID:{createdPayment.id}を登録しました(未払い)
          </p>
        )}
      </div>

      {/* 精算実行 */}
      <div style={{ maxWidth: '480px', marginTop: '32px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>③ 精算する</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label>
            決済ID
            <input
              type="number"
              value={payPaymentId}
              onChange={(e) => setPayPaymentId(e.target.value)}
              style={{ display: 'block', padding: '6px', width: '100px' }}
            />
          </label>
          <label>
            支払い方法
            <select
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            >
              {paymentMethodOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handlePay} style={{ padding: '8px 16px' }}>
            精算する
          </button>
        </div>
        {payError && <p style={{ color: '#d00' }}>{payError}</p>}
        {payResult && (
          <p style={{ marginTop: '12px', color: '#2e7d32' }}>
            決済ID:{payResult.id}の精算が完了しました({paymentMethodOptions.find((m) => m.value === payResult.payment_method)?.label})
          </p>
        )}
      </div>
    </div>
  );
}

export default Payments;