import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartSummary,
    latestOrder,
    createOrder,
    payLatestOrder,
    updateCartQuantity,
    removeFromCart,
    ordering,
    paying,
  } = useApp();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (latestOrder?.paymentMethod) {
      setPaymentMethod(latestOrder.paymentMethod);
    }
  }, [latestOrder]);

  async function handleCreateOrder() {
    const order = await createOrder();
    if (order?.id) {
      navigate("/checkout", { replace: true });
    }
  }

  async function handlePay() {
    await payLatestOrder(paymentMethod);
    navigate("/foods", { replace: true });
  }

  return (
    <section className="card page-card">
      <div className="section-header">
        <div>
          <h3>Checkout / Thanh toan</h3>
          <p>Trang rieng de tao don va thanh toan.</p>
        </div>
        <button type="button" onClick={() => navigate("/foods")}>Quay lai mon an</button>
      </div>

      <div className="checkout-grid">
        <div className="checkout-panel">
          <h4>Gio hang</h4>
          {cart.length === 0 && <p>Gio hang trong.</p>}
          {cart.map((item) => (
            <div className="checkout-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>{Number(item.price).toLocaleString()} VND</p>
              </div>
              <div className="qty">
                <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                <button type="button" className="danger" onClick={() => removeFromCart(item.id)}>
                  Xoa
                </button>
              </div>
            </div>
          ))}

          <div className="checkout-total">
            <p>Tong: {cartSummary.total.toLocaleString()} VND</p>
            <button type="button" onClick={handleCreateOrder} disabled={ordering || cart.length === 0}>
              {ordering ? "Dang tao don..." : "Tao don hang"}
            </button>
          </div>
        </div>

        <div className="checkout-panel">
          <h4>Thanh toan</h4>
          <p>
            Don gan nhat: {latestOrder ? `#${latestOrder.id} - ${latestOrder.status}` : "Chua co"}
          </p>
          {latestOrder && (
            <>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  COD
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANKING"
                    checked={paymentMethod === "BANKING"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Banking
                </label>
              </div>

              <button
                type="button"
                className="primary-payment"
                onClick={handlePay}
                disabled={paying || latestOrder.status !== "PENDING"}
              >
                {paying ? "Dang thanh toan..." : "Thanh toan"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
