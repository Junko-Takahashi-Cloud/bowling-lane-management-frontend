import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';

function Checkin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reservationIdFromUrl = searchParams.get('reservation_id') || '';
  const laneSetIdFromUrl = searchParams.get('lane_set_id') || '';

  const [reservationId, setReservationId] = useState(reservationIdFromUrl);
  const [laneSetId, setLaneSetId] = useState(laneSetIdFromUrl);
  const [isTrial, setIsTrial] = useState(false);
  const [shoesRental, setShoesRental] = useState(false);
  const [ballRental, setBallRental] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCheckin = () => {
    if (!laneSetId) {
      setError('レーンセットは必須です');
      return;
    }
    setError('');

    client
      .post('/api/v1/checkins/pair', {
        reservation_id: reservationId ? Number(reservationId) : null,
        lane_set_id: laneSetId,
        is_trial: isTrial,
        shoes_rental: shoesRental,
        ball_rental: ballRental,
      })
      .then((res) => {
        const laneNumbers = res.data.map((c) => c.lane_id).join('・');
        setMessage(`チェックイン完了: セット${laneSetId}(レーンID ${laneNumbers})`);
      })
      .catch((err) => {
        const detail = err.response?.data?.detail || 'チェックインに失敗しました';
        setError(detail);
      });
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>来店受付</h2>

      <div style={{ maxWidth: '360px', marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '12px' }}>
          予約ID
          <input
            type="number"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '12px' }}>
          レーンセット(A or B)
          <input
            type="text"
            value={laneSetId}
            onChange={(e) => setLaneSetId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={isTrial}
            onChange={(e) => setIsTrial(e.target.checked)}
          />{' '}
          体験利用
        </label>

        <label style={{ display: 'block', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={shoesRental}
            onChange={(e) => setShoesRental(e.target.checked)}
          />{' '}
          靴レンタル
        </label>

        <label style={{ display: 'block', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={ballRental}
            onChange={(e) => setBallRental(e.target.checked)}
          />{' '}
          ボールレンタル
        </label>

        <button onClick={handleCheckin} style={{ padding: '10px 20px' }}>
          チェックイン
        </button>

        {message && <p style={{ marginTop: '16px', color: '#2e7d32' }}>{message}</p>}
        {error && <p style={{ marginTop: '16px', color: '#d00' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Checkin;