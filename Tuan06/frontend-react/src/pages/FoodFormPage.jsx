import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

const initialForm = {
  name: "",
  description: "",
  price: "",
};

function FoodFormPage({ mode }) {
  const navigate = useNavigate();
  const { foodId } = useParams();
  const isEdit = mode === "edit";
  const {
    foods,
    loadFoods,
    saveFood,
    deleteFood,
    savingFood,
  } = useApp();
  const [form, setForm] = useState(initialForm);
  const [ready, setReady] = useState(!isEdit);

  useEffect(() => {
    async function prepare() {
      if (!isEdit) {
        setReady(true);
        return;
      }

      let nextFoods = foods;
      if (nextFoods.length === 0) {
        nextFoods = await loadFoods();
      }

      const currentFood = nextFoods.find((item) => String(item.id) === String(foodId));
      if (currentFood) {
        setForm({
          name: currentFood.name || "",
          description: currentFood.description || "",
          price: currentFood.price ?? "",
        });
      }
      setReady(true);
    }

    prepare().catch(() => setReady(true));
  }, [foodId]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      return;
    }

    await saveFood({ id: isEdit ? Number(foodId) : null, payload });
    navigate("/foods", { replace: true });
  }

  async function handleDelete() {
    await deleteFood(Number(foodId));
    navigate("/foods", { replace: true });
  }

  if (!ready) {
    return (
      <section className="card page-card">
        <p>Dang tai form...</p>
      </section>
    );
  }

  return (
    <section className="card page-card">
      <div className="section-header">
        <div>
          <h3>{isEdit ? `Sua mon #${foodId}` : "Them mon moi"}</h3>
          <p>Day la page rieng cho CRUD mon an.</p>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          placeholder="Ten mon"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
        <input
          placeholder="Mo ta"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <input
          type="number"
          placeholder="Gia"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          required
          min="0"
        />

        <div className="admin-actions">
          <button type="submit" disabled={savingFood}>
            {savingFood ? "Dang xu ly..." : isEdit ? "Cap nhat mon" : "Them mon"}
          </button>
          <button type="button" onClick={() => navigate("/foods")}>Quay lai</button>
          {isEdit && (
            <button type="button" className="danger" onClick={handleDelete} disabled={savingFood}>
              Xoa mon
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default FoodFormPage;
