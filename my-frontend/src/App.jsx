import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "./views/LoginView";
import Info from "./views/Info";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard"; // <-- tutaj

function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");

  const handleLogin = async (email, password) => {
  try {
    const res = await fetch("http://localhost:3006/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    const result = await res.json();
    setToken(result.token);
    setEmail(email);
    return true;
  } catch (err) {
    console.error("Błąd logowania:", err);
    return false;
  }
};


  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/info" element={<Info />} />
      <Route
        path="/login"
        element={<LoginView onLogin={handleLogin} />}
      />
      <Route
        path="/dashboard"
        element={
          token ? (
            <Dashboard token={token} email={email} onLogout={() => setToken(null)} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
