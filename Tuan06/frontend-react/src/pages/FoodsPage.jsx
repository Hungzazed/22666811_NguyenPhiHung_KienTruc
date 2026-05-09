import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function FoodsPage() {
  const navigate = useNavigate();
  const { foods, loadFoods, loadingFoods, addToCart, deleteFood } = useApp();

  useEffect(() => {
    if (foods.length === 0) {
      loadFoods().catch(() => undefined);
    }
  }, []);

  return (
    <section className="card page-card">
      <div className="section-header">
        <div>
          <h3>Danh sach mon an</h3>
          <p>Day la page rieng de xem mon va them vao gio.</p>
        </div>
        <button type="button" onClick={() => loadFoods()}>
          Refresh Mon
        </button>
      </div>

      {loadingFoods && <p>Dang tai mon...</p>}
      {!loadingFoods && foods.length === 0 && <p>Chua co du lieu mon an.</p>}

      <div className="food-grid">
        {foods.map((food) => (
          <article className="food-item" key={food.id}>
            <h4>{food.name}</h4>
            <p>{food.description || "Khong co mo ta"}</p>
            <p className="price">{Number(food.price || 0).toLocaleString()} VND</p>
            <button type="button" onClick={() => addToCart(food)}>
              Them vao gio
            </button>
            <div className="food-actions">
              <button type="button" onClick={() => navigate(`/foods/${food.id}/edit`)}>
                Sua
              </button>
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  const confirmed = window.confirm(`Xoa mon #${food.id}?`);
                  if (!confirmed) {
                    return;
                  }
                  await deleteFood(food.id);
                }}
              >
                Xoa
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FoodsPage;
