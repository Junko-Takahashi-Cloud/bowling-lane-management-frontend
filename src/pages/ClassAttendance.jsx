import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const statusOptions = [
  { value: 'all_present', label: '全員出席' },
  { value: 'partial_absent_continue', label: '一部欠席・継続開催' },
  { value: 'partial_absent_slide', label: '一部欠席・スライド(振替)' },
];

function ClassAttendance() {
  const [sessions, setSessions] = useState([]);
  const [recorded, setRecorded] = useState({}); // class_session_id -> attendance_status
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get('/api/v1/dashboard/today')
      .then((res) => setSessions(res.data.today_class_sessions))
      .catch(() => setError('データの取得に失敗しました'));
  }, []);

  const handleRecord = (classSessionId, attendanceStatus) => {
    client
      .post(`/api/v1/class_sessions/${classSessionId}/attendance`, {
        class_session_id: classSessionId,
        attendance_status: attendanceStatus,
      })
      .then(() => {
        setRecorded((prev) => ({ ...prev, [classSessionId]: attendanceStatus }));
      })
      .catch((err) => {
        const detail = err.response?.data?.detail || '記録に失敗しました';
        setError(detail);
      });
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>教室出席管理</h2>
      {error && <p style={{ color: '#d00' }}>{error}</p>}

      {sessions.length === 0 ? (
        <p style={{ color: '#888', marginTop: '20px' }}>本日の教室セッションはありません</p>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sessions.map((s) => (
            <div
              key={s.class_session_id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '16px',
                maxWidth: '480px',
              }}
            >
              <h3>第{s.session_number}回(コースID: {s.course_id})</h3>
              <p>
                {s.start_time}-{s.end_time}｜レーンペア: {s.lane_pair ?? '未設定'}｜{s.status}
              </p>

              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleRecord(s.class_session_id, opt.value)}
                    style={{
                      backgroundColor:
                        recorded[s.class_session_id] === opt.value ? '#4caf50' : '#eee',
                      color: recorded[s.class_session_id] === opt.value ? '#fff' : '#333',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {recorded[s.class_session_id] && (
                <p style={{ marginTop: '8px', color: '#666' }}>記録済み</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClassAttendance;