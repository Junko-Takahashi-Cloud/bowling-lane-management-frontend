import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function StaffLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  const handleLogin = () => {
    if (pin.length !== 4) {
      setError('4桁のPINを入力してください');
      return;
    }

    client
      .post('/api/v1/staff/login', { pin_code: pin })
      .then((res) => {
        localStorage.setItem('staffToken', res.data.access_token);
        navigate('/home');
      })
      .catch((err) => {
        const detail = err.response?.data?.detail || 'ログインに失敗しました';
        setError(detail);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>スタッフログイン</h2>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={handlePinChange}
          placeholder="4桁PIN"
          maxLength={4}
          className="pin-input"
        />
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleLogin} className="login-button">
          ログイン
        </button>
      </div>
    </div>
  );
}

export default StaffLogin;