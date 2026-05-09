import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userApi } from "../api/client";
import { useApp } from "../context/AppContext";

const initialAuthForm = {
  name: "",
  email: "",
  password: "",
};

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setSession, currentUser } = useApp();

  if (currentUser) {
    return <Navigate to="/foods" replace />;
  }

  function updateAuthField(field, value) {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "register") {
        await userApi.post("/register", {
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
        });
        toast.success("Dang ky thanh cong, vui long dang nhap.");
        setMode("login");
        setAuthForm(initialAuthForm);
        return;
      }

      const res = await userApi.post("/login", {
        email: authForm.email,
        password: authForm.password,
      });

      setSession(res.data.user, res.data.token);
      toast.success(`Xin chao ${res.data.user.name}`);
      navigate("/foods", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Xay ra loi, vui long thu lai.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>Mini Food Ordering</h1>
        <p className="hint">Dang nhap de dung cac page mon an / gio hang / checkout</p>

        <div className="tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form">
          {mode === "register" && (
            <input
              placeholder="Ho ten"
              value={authForm.name}
              onChange={(e) => updateAuthField("name", e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => updateAuthField("email", e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mat khau"
            value={authForm.password}
            onChange={(e) => updateAuthField("password", e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Dang xu ly..." : mode === "login" ? "Dang nhap" : "Dang ky"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
