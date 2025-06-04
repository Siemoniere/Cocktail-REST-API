// Dashboard.jsx
import { useEffect, useState } from "react";

function Dashboard({ token, email, onLogout }) {
  const [endpoint, setEndpoint] = useState("ingredients");
  const [value, setValue] = useState("");
  const [data, setData] = useState(null);
  const [postData, setPostData] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchData = async () => {
    const url = value
      ? `http://localhost:3006/${endpoint}/${value}`
      : `http://localhost:3006/${endpoint}?page=${page}&limit=${limit}`;

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

  const handleDelete = async () => {
    if (!value.trim()) {
      alert("Podaj prawidłowe ID rekordu do usunięcia");
      return;
    }

    try {
      const url = `http://localhost:3006/${endpoint}/${value}`;
      const headers = {};
      if (endpoint === "cocktails" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });

      const json = await res.json();

      if (!res.ok) {
        alert("Błąd DELETE: " + (json?.message || `Status ${res.status}`));
        return;
      }

      alert("Usunięto rekord poprawnie");
      setData(null);
    } catch (err) {
      console.error("Błąd wysyłania DELETE:", err);
      alert("Błąd podczas usuwania");
    }
  };


  const handlePost = async () => {
    if (!postData) {
      alert("Podaj dane do wysłania w formacie JSON");
      return;
    }
    try {
      const url = `http://localhost:3006/${endpoint}`;
      const headers = { "Content-Type": "application/json" };
      if (endpoint === "cocktails" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: postData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert("Błąd POST: " + (json?.message || "nieznany błąd"));
        return;
      }

      setData(json);
      alert("POST wykonany poprawnie");

    } catch (err) {
      console.error("Błąd wysyłania POST:", err);
      alert("Błąd podczas POST");
    }
  };

  const handlePut = async () => {
    if (!value) {
      alert("Podaj ID rekordu do aktualizacji");
      return;
    }
    if (!postData) {
      alert("Podaj dane do wysłania w formacie JSON");
      return;
    }

    try {
      const url = `http://localhost:3006/${endpoint}/${value}`;
      const headers = { "Content-Type": "application/json" };
      if (endpoint === "cocktails" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "PUT",
        headers,
        body: postData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert("Błąd PUT: " + (json?.message || `Status ${res.status}`));
        return;
      }

      setData(json);
      alert("PUT wykonany poprawnie");
    } catch (err) {
      console.error("Błąd wysyłania PUT:", err);
      alert("Błąd podczas PUT");
    }
  };
  useEffect(() => {
    if (token) fetchData();
  }, [endpoint, token, page]);

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Cocktails API</h1>
        <p>Zalogowano jako: <strong>{email}</strong></p>
        <button onClick={onLogout}>Wyloguj</button>
        <hr />

        <div>
          <button onClick={() => setEndpoint("ingredients")}>Pobierz składniki</button>
          <button onClick={() => setEndpoint("cocktails")}>Pobierz koktajle</button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>ID (opcjonalne):</label><br />
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="np. 123" />
          <button onClick={fetchData}>Pobierz dane</button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Dane JSON do POST/PUT:</label><br />
          <textarea rows={6} cols={40} value={postData} onChange={(e) => setPostData(e.target.value)} placeholder='{"name": "Moj składnik", "quantity": 3}' />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button onClick={handlePost}>Wyślij POST</button>
          <button onClick={handlePut} style={{ marginLeft: "1rem" }}>Wyślij PUT</button>
          <button onClick={handleDelete} style={{ marginLeft: "1rem" }}>Usuń (DELETE)</button>
        </div>

        <h2>Dane z: {endpoint}{value ? `/${value}` : ""}</h2>
        <p>Strona: {page}</p>

        <pre><code>{JSON.stringify(data, null, 2)}</code></pre>

        {!value && (
          <div style={{ marginTop: "1rem" }}>
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Wróć</button>
            <button onClick={() => setPage(prev => prev + 1)} style={{ marginLeft: "1rem" }}>Pokaż więcej</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
