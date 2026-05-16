import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadFoods() {
      try {
        const response = await api.get('/foods');
        setFoods(response.data.data || []);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to load foods');
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Catalog</p>
        <h1>Fresh meals from the gateway</h1>
        <p>The food service exposes synchronous REST endpoints through the API Gateway.</p>
      </div>

      {loading ? <p className="status-text">Loading food list...</p> : null}
      {message ? <p className="status-text error">{message}</p> : null}

      <div className="grid cards-grid">
        {foods.map((food) => (
          <article key={food.id} className="card food-card">
            <div>
              <p className="food-kicker">#{food.id}</p>
              <h3>{food.name}</h3>
              <p>{food.description}</p>
            </div>
            <div className="food-footer">
              <strong>{Number(food.price).toLocaleString('vi-VN')} đ</strong>
              <Link className="secondary-button" to={`/orders?foodId=${food.id}`}>Order</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
