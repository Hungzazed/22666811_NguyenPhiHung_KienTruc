import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/users/login', form);
      onLogin(response.data.data);
      setMessage('Login successful. Redirecting...');
      setTimeout(() => navigate('/foods'), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-copy">
        <p className="eyebrow">Welcome back</p>
        <h1>Login to continue</h1>
        <p>Use the gateway-backed auth flow to get a token and user profile.</p>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label>
          Username
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        {message ? <p className="status-text">{message}</p> : null}
      </form>
    </section>
  );
}
