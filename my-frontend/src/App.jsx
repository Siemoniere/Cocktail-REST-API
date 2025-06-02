import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./views/Login";
import Home from "./views/Home";
function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [endpoint, setEndpoint] = useState("ingredients");
  const [value, setValue] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3006/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Błąd logowania");

      const result = await res.json();
      setToken(result.token);
      setEmail(email);
      setError("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Niepoprawne dane logowania.");
    }
  };

  const fetchData = async () => {
    const url = value
      ? `http://localhost:3006/${endpoint}/${value}`
      : `http://localhost:3006/${endpoint}`;

    const headers = {};
    if (endpoint === "cocktails" && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, { headers });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [endpoint, token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Cocktails API</h1>

      {!token ? (
        <Login onLogin={handleLogin} error={error} />
      ) : (
        <>
          <p>Zalogowano jako: <strong>{email}</strong></p>
          <button onClick={() => setToken(null)}>Wyloguj</button>

          <hr />

          <div>
            <button onClick={() => setEndpoint("ingredients")}>Pobierz składniki</button>
            <button onClick={() => setEndpoint("cocktails")}>Pobierz koktajle</button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>ID (opcjonalne):</label><br />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="np. 123"
            />
            <button onClick={fetchData}>Pobierz dane</button>
          </div>

          <h2>Dane z: {endpoint}{value ? `/${value}` : ""}</h2>
          <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
        </>
      )}
    </div>
  );
}

export default App;
