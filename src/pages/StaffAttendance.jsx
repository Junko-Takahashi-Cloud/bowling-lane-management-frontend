import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { formatErrorMessage } from '../utils/errorMessage';

function formatJST(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString + 'Z'); // UTCであることを明示
  return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

function getStaffIdFromToken() {
  const token = localStorage.getItem('staffToken');
  if (!token) return null;
  try {
    let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const payload = JSON.parse(atob(base64));
    return payload.staff_id ? Number(payload.staff_id) : null;
  } catch {
    return null;
  }
}

function StaffAttendance() {
  const navigate = useNavigate();
  const myStaffId = getStaffIdFromToken();

  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState('');

  const handleClockIn = () => {
    if (!myStaffId) {
      setError('ログイン情報からスタッフIDを取得できませんでした。再ログインしてください');
      return;
    }
    client
      .post('/api/v1/staff-attendance/clock-in', { staff_id: myStaffId })
      .then((res) => {
        setAttendance(res.data);
        setError('');
      })
      .catch((err) => setError(formatErrorMessage(err, '出勤打刻に失敗しました')));
  };

  const handleClockOut = () => {
    if (!attendance) return;
    client
      .patch(`/api/v1/staff-attendance/${attendance.id}/clock-out`, {})
      .then((res) => {
        setAttendance(res.data);
        setError('');
      })
      .catch((err) => setError(formatErrorMessage(err, '退勤打刻に失敗しました')));
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>スタッフ出退勤(タイムカード)</h2>

      <div style={{ marginTop: '20px', maxWidth: '360px' }}>
        <button onClick={handleClockIn} style={{ padding: '10px 20px', marginRight: '8px' }}>
          出勤
        </button>
        <button onClick={handleClockOut} style={{ padding: '10px 20px' }} disabled={!attendance}>
          退勤
        </button>

        {error && <p style={{ color: '#d00', marginTop: '16px' }}>{error}</p>}
        {attendance && (
          <p style={{ marginTop: '16px' }}>
            記録ID:{attendance.id}
            <br />
            出勤:{formatJST(attendance.clock_in)}
            {attendance.clock_out && (
              <>
                <br />
                退勤:{formatJST(attendance.clock_out)}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default StaffAttendance;