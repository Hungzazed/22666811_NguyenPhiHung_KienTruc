import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { foodApi, orderApi, paymentApi, setAuthToken } from "../api/client";
import { toast } from "react-toastify";

const AppContext = createContext(null);

function getApiErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.statusText ||
    error.message ||
    fallback
  );
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [savingFood, setSavingFood] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setCurrentUser(parsedUser);
      setAuthToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadFoods();
    } else {
      setFoods([]);
      setCart([]);
      setLatestOrder(null);
    }
  }, [currentUser]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const cartSummary = useMemo(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { count, total };
  }, [cart]);

  function setSession(user, nextToken) {
    setCurrentUser(user);
    setToken(nextToken);
    setAuthToken(nextToken);
    setCart([]);
    setLatestOrder(null);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function logout() {
    setCurrentUser(null);
    setToken("");
    setAuthToken("");
    setFoods([]);
    setCart([]);
    setLatestOrder(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Da dang xuat");
  }

  async function loadFoods() {
    setLoadingFoods(true);
    try {
      const res = await foodApi.get("/foods");
      const nextFoods = Array.isArray(res.data) ? res.data : [];
      setFoods(nextFoods);
      return nextFoods;
    } catch (error) {
      const message = getApiErrorMessage(error, "Khong tai duoc danh sach mon an");
      toast.error(message);
      throw error;
    } finally {
      setLoadingFoods(false);
    }
  }

  function addToCart(food) {
    setCart((prev) => {
      const found = prev.find((item) => item.id === food.id);
      if (found) {
        toast.success(`Da tang so luong mon: ${food.name}`);
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      toast.success(`Da them vao gio: ${food.name}`);
      return [...prev, { ...food, quantity: 1 }];
    });
  }

  function updateCartQuantity(foodId, nextQty) {
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== foodId));
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === foodId ? { ...item, quantity: nextQty } : item
      )
    );
  }

  function removeFromCart(foodId) {
    setCart((prev) => prev.filter((item) => item.id !== foodId));
  }

  async function saveFood({ id, payload }) {
    setSavingFood(true);
    try {
      const response = id
        ? await foodApi.put(`/foods/${id}`, payload)
        : await foodApi.post("/foods", payload);

      await loadFoods();
      toast.success(id ? "Cap nhat mon thanh cong" : "Them mon thanh cong");
      return response.data;
    } catch (error) {
      const message = getApiErrorMessage(error, "Khong xu ly duoc mon an");
      toast.error(message);
      throw new Error(message);
    } finally {
      setSavingFood(false);
    }
  }

  async function deleteFood(id) {
    setSavingFood(true);
    try {
      const response = await foodApi.delete(`/foods/${id}`);
      await loadFoods();
      toast.success("Da xoa mon thanh cong");
      return response.data;
    } catch (error) {
      const message = getApiErrorMessage(error, "Khong xoa duoc mon an");
      toast.error(message);
      throw new Error(message);
    } finally {
      setSavingFood(false);
    }
  }

  async function createOrder() {
    if (!currentUser) {
      throw new Error("Ban chua dang nhap");
    }

    if (cart.length === 0) {
      throw new Error("Gio hang dang trong");
    }

    setOrdering(true);
    try {
      const response = await orderApi.post("/orders", {
        userId: currentUser.id,
        items: cart.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),
      });

      const orderId = response.data?.id || response.data?.orderId || "?";
      const totalAmount = Number(response.data?.totalAmount || 0);
      const items = response.data?.items || cart;

      setLatestOrder({
        id: orderId,
        status: "PENDING",
        totalAmount,
        items,
      });
      setCart([]);
      toast.success(`Tao don hang thanh cong, ma don #${orderId}`);
      return response.data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Khong tao duoc order. Kiem tra ORDER_SERVICE_URL hoac payload"
      );
      toast.error(message);
      throw new Error(message);
    } finally {
      setOrdering(false);
    }
  }

  async function payLatestOrder(paymentMethod) {
    if (!latestOrder) {
      throw new Error("Chua co don hang de thanh toan");
    }

    setPaying(true);
    try {
      const response = await paymentApi.post("/payments", {
        orderId: latestOrder.id,
        paymentMethod,
        userName: currentUser?.name,
      });

      setLatestOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "PAID",
              paymentMethod,
            }
          : prev
      );
      toast.success(
        response.data?.message ||
          `Thanh toan thanh cong (${paymentMethod}) cho don #${latestOrder.id}`
      );
      return response.data;
    } catch (error) {
      const message = getApiErrorMessage(error, "Thanh toan that bai");
      toast.error(message);
      throw new Error(message);
    } finally {
      setPaying(false);
    }
  }

  const value = {
    currentUser,
    token,
    foods,
    cart,
    latestOrder,
    cartSummary,
    loadingFoods,
    savingFood,
    ordering,
    paying,
    setSession,
    logout,
    loadFoods,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    saveFood,
    deleteFood,
    createOrder,
    payLatestOrder,
    setLatestOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
