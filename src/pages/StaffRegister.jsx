import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { formatErrorMessage } from '../utils/errorMessage';

function StaffRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePinChange = (e) => {
    setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4));
  };

  const handleRegister = () => {
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    if (pin.length !== 4) {
      setError('PINは4桁で入力してください');
      return;
    }
    client
      .post('/api/v1/staff', { name, pin_code: pin })
      .then((res) => {
        setResult(res.data);
        setError('');
        setName('');
        setPin('');
      })
      .catch((err) => setError(formatErrorMessage(err, '登録に失敗しました')));
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px' }}>
        ← ホームに戻る
      </button>
      <h2>スタッフ登録</h2>

      <div style={{ maxWidth: '360px', marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '12px' }}>
          氏名
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: '12px' }}>
          4桁PIN
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <button onClick={handleRegister} style={{ padding: '10px 20px' }}>
          登録する
        </button>

        {error && <p style={{ color: '#d00', marginTop: '16px' }}>{error}</p>}
        {result && (
          <p style={{ marginTop: '16px', color: '#2e7d32' }}>
            スタッフ「{result.name}」(ID:{result.staff_id})を登録しました
          </p>
        )}
      </div>
    </div>
  );
}

export default StaffRegister;