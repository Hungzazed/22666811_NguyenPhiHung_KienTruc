import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/users/register', form);
      setMessage('Register successful. You can login now.');
      setTimeout(() => navigate('/login'), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel panel-accent">
      <div className="panel-copy">
        <p className="eyebrow">Create account</p>
        <h1>Register a new user</h1>
        <p>One account is enough to explore the food catalog and place an order.</p>
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
          {loading ? 'Creating...' : 'Register'}
        </button>
        {message ? <p className="status-text">{message}</p> : null}
      </form>
    </section>
  );
}
