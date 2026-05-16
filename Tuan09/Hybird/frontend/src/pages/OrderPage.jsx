import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';

export default function OrderPage({ auth }) {
  const [searchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ userId: auth?.user?.id || '', foodId: searchParams.get('foodId') || '', quantity: 1 });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedFood = useMemo(() => foods.find((food) => String(food.id) === String(form.foodId)), [foods, form.foodId]);

  useEffect(() => {
    async function loadData() {
      try {
        const [foodResponse, orderResponse] = await Promise.all([
          api.get('/foods'),
          api.get('/orders'),
        ]);

        setFoods(foodResponse.data.data || []);
        setOrders(orderResponse.data.data || []);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to load order page data');
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (auth?.user?.id && !form.userId) {
      setForm((current) => ({ ...current, userId: auth.user.id }));
    }
  }, [auth, form.userId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/orders', {
        userId: Number(form.userId),
        foodId: Number(form.foodId),
        quantity: Number(form.quantity),
      });

      setOrders((current) => [response.data.data, ...current]);
      setMessage('Order created successfully. Payment service will process it asynchronously.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Create order failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="order-layout">
      <div className="panel panel-accent">
        <div className="panel-copy">
          <p className="eyebrow">Order</p>
          <h1>Place an order</h1>
          <p>The order service persists immediately, then publishes an event for payment processing.</p>
        </div>

        <form className="card form-card order-form" onSubmit={handleSubmit}>
          <label>
            User ID
            <input value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} />
          </label>
          <label>
            Food
            <select value={form.foodId} onChange={(event) => setForm({ ...form, foodId: event.target.value })}>
              <option value="">Select food</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>{food.name}</option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
          </label>
          {selectedFood ? (
            <div className="selection-box">
              <strong>{selectedFood.name}</strong>
              <span>{Number(selectedFood.price).toLocaleString('vi-VN')} đ / item</span>
            </div>
          ) : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Placing order...' : 'Create order'}
          </button>
          {message ? <p className="status-text">{message}</p> : null}
        </form>
      </div>

      <div className="orders-panel">
        <div className="section-header">
          <p className="eyebrow">Orders</p>
          <h2>Recent orders</h2>
        </div>
        <div className="stack">
          {orders.map((order) => (
            <article className="card order-card" key={order.id}>
              <div>
                <strong>Order #{order.id}</strong>
                <p>User {order.userId} • Food {order.foodId} • Qty {order.quantity}</p>
              </div>
              <div className="food-footer">
                <strong>{Number(order.totalPrice).toLocaleString('vi-VN')} đ</strong>
                <span className={`status-pill ${String(order.status || '').toLowerCase()}`}>{order.status}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
