import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const dayOptions = [
  { value: 'monday', label: '月' },
  { value: 'tuesday', label: '火' },
  { value: 'wednesday', label: '水' },
  { value: 'thursday', label: '木' },
  { value: 'friday', label: '金' },
  { value: 'saturday', label: '土' },
  { value: 'sunday', label: '日' },
];

const instructorTypeOptions = [
  { value: 'staff', label: '店舗スタッフ兼務' },
  { value: 'external', label: '外部プロ' },
  { value: 'temporary', label: '臨時' },
];

function CoachShifts() {
  const navigate = useNavigate();

  const [instructors, setInstructors] = useState([]);
  const [instructorId, setInstructorId] = useState('');
  const [shifts, setShifts] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('monday');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('external');
  const [addError, setAddError] = useState('');

  const fetchInstructors = () => {
    client
      .get('/api/v1/instructors')
      .then((res) => {
        setInstructors(res.data);
        if (res.data.length > 0 && !instructorId) {
          setInstructorId(String(res.data[0].id));
        }
      })
      .catch(() => setError('コーチ一覧の取得に失敗しました'));
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    if (instructorId) fetchShifts(instructorId);
  }, [instructorId]);

  const fetchShifts = (id) => {
    client
      .get('/api/v1/coach-shifts', { params: { instructor_id: Number(id) } })
      .then((res) => {
        setShifts(res.data);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.detail || '取得に失敗しました'));
  };

  const handleAddInstructor = () => {
    if (!newName.trim()) {
      setAddError('名前を入力してください');
      return;
    }
    client
      .post('/api/v1/instructors', { name: newName, instructor_type: newType })
      .then((res) => {
        setAddError('');
        setNewName('');
        fetchInstructors();
        setInstructorId(String(res.data.id));
      })
      .catch((err) => {
        const detail = err.response?.data?.detail;
        const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map((d) => d.msg).join(' / ') : '登録に失敗しました';
        setAddError(message);
      });
  };

  const handleAddShift = () => {
    client
      .post('/api/v1/coach-shifts', {
        instructor_id: Number(instructorId),
        day_of_week: dayOfWeek,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
      })
      .then(() => {
        setError('');
        fetchShifts(instructorId);
      })
      .catch((err) => setError(err.response?.data?.detail || '登録に失敗しました'));
  };

  const handleDeleteShift = (shiftId) => {
    client
      .delete(`/api/v1/coach-shifts/${shiftId}`)
      .then(() => fetchShifts(instructorId))
      .catch((err) => setError(err.response?.data?.detail || '削除に失敗しました'));
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>コーチシフト管理</h2>

      {/* 新規コーチ登録 */}
      <div style={{ marginTop: '20px', maxWidth: '480px' }}>
        <h3>新規コーチ登録</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label>
            氏名
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            />
          </label>
          <label>
            種別
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            >
              {instructorTypeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleAddInstructor} style={{ padding: '8px 16px' }}>
            登録
          </button>
        </div>
        {addError && <p style={{ color: '#d00' }}>{addError}</p>}
        {newType === 'staff' && (
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            ※店舗スタッフ兼務は現在このフォームからは紐付けできません(staff_idは空登録になります)
          </p>
        )}
      </div>

      {/* シフト一覧・登録 */}
      <div style={{ marginTop: '32px', maxWidth: '480px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          コーチを選択
          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          >
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </label>

        {error && <p style={{ color: '#d00' }}>{error}</p>}

        {shifts.length > 0 && (
          <ul style={{ paddingLeft: '18px', marginBottom: '16px' }}>
            {shifts.map((s) => (
              <li key={s.id} style={{ marginBottom: '6px' }}>
                {dayOptions.find((d) => d.value === s.day_of_week)?.label}曜 {s.start_time}-
                {s.end_time}
                <button
                  onClick={() => handleDeleteShift(s.id)}
                  style={{ marginLeft: '8px', fontSize: '12px' }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3>新規シフト登録</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label>
            曜日
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            >
              {dayOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            開始
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            />
          </label>
          <label>
            終了
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ display: 'block', padding: '6px' }}
            />
          </label>
          <button onClick={handleAddShift} style={{ padding: '8px 16px' }}>
            登録
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoachShifts;