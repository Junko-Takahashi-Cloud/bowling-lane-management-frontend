import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const laneStatusLabel = {
  available: '空き',
  in_use: '使用中',
  broken: '故障',
  maintenance: 'メンテナンス中',
};

const laneStatusColor = {
  available: '#e6f4ea',
  in_use: '#fff4e5',
  broken: '#fde8e8',
  maintenance: '#eee',
};

function Reservations() {
  const [lanes, setLanes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get('/api/v1/dashboard/today')
      .then((res) => {
        setLanes(res.data.lanes);
        setReservations(res.data.today_reservations);
        setClassSessions(res.data.today_class_sessions);
      })
      .catch(() => setError('データの取得に失敗しました'));
  }, []);

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>当日予約ダッシュボード</h2>
      {error && <p style={{ color: '#d00' }}>{error}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginTop: '20px',
          maxWidth: '700px',
        }}
      >
        {lanes.map((lane) => {
          const laneReservations = reservations.filter(
            (r) => r.lane_set_id === lane.lane_set_id
          );
          return (
            <div
              key={lane.id}
              style={{
                backgroundColor: laneStatusColor[lane.status],
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h3>
                レーン{lane.lane_number}(セット{lane.lane_set_id})
              </h3>
              <p style={{ fontWeight: 'bold' }}>{laneStatusLabel[lane.status]}</p>
              {laneReservations.length === 0 ? (
                <p style={{ color: '#888' }}>予約なし</p>
              ) : (
                <ul style={{ paddingLeft: '18px' }}>
                  {laneReservations.map((r) => (
                    <li key={r.reservation_id} style={{ marginBottom: '8px' }}>
                      {r.start_time}-{r.end_time}｜利用者ID:{r.user_id}｜{r.status}
                      <button
                        onClick={() =>
                          navigate(
                            `/checkin?reservation_id=${r.reservation_id}&lane_set_id=${r.lane_set_id}`
                          )
                        }
                        style={{ marginLeft: '8px', fontSize: '12px' }}
                      >
                        受付へ
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <h3 style={{ marginTop: '32px' }}>当日教室セッション</h3>
      {classSessions.length === 0 ? (
        <p style={{ color: '#888' }}>本日の教室セッションはありません</p>
      ) : (
        <ul style={{ paddingLeft: '18px' }}>
          {classSessions.map((cs) => (
            <li key={cs.class_session_id} style={{ marginBottom: '8px' }}>
              第{cs.session_number}回｜{cs.start_time}-{cs.end_time}｜レーンペア:
              {cs.lane_pair}｜{cs.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reservations;