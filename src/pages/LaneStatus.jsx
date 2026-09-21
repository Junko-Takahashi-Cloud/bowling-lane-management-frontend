import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { formatErrorMessage } from '../utils/errorMessage';

const statusOptions = [
  { value: 'available', label: '空き' },
  { value: 'in_use', label: '使用中' },
  { value: 'broken', label: '故障' },
  { value: 'maintenance', label: 'メンテナンス中' },
];

const statusLabel = {
  available: '空き',
  in_use: '使用中',
  broken: '故障',
  maintenance: 'メンテナンス中',
};

const statusColor = {
  available: '#e6f4ea',
  in_use: '#fff4e5',
  broken: '#fde8e8',
  maintenance: '#eee',
};

function LaneStatus() {
  const [lanes, setLanes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLanes = () => {
    client
      .get('/api/v1/lanes')
      .then((res) => setLanes(res.data))
      .catch(() => setError('データの取得に失敗しました'));
  };

  useEffect(() => {
    fetchLanes();
  }, []);

  const handleStatusChange = (laneId, newStatus) => {
    client
      .patch(`/api/v1/lanes/${laneId}/status`, { status: newStatus })
      .then(() => {
        setError('');
        fetchLanes();
      })
      .catch((err) => {
        setError(formatErrorMessage(err, '更新に失敗しました'));
      });
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>レーン状況</h2>
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
        {lanes.map((lane) => (
          <div
            key={lane.id}
            style={{
              backgroundColor: statusColor[lane.status],
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <h3>
              レーン{lane.lane_number}(セット{lane.lane_set_id})
            </h3>
            <p style={{ fontWeight: 'bold' }}>{statusLabel[lane.status]}</p>
            {lane.notes && <p style={{ fontSize: '13px', color: '#666' }}>備考: {lane.notes}</p>}

            <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  disabled={lane.status === opt.value}
                  onClick={() => handleStatusChange(lane.id, opt.value)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: lane.status === opt.value ? '#ccc' : '#fff',
                    boxShadow: '0 0 0 1px #ccc',
                    cursor: lane.status === opt.value ? 'default' : 'pointer',
                  }}
                >
                  {opt.label}に変更
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LaneStatus;