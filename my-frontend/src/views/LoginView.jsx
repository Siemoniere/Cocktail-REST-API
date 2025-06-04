import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginView({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await onLogin(email, password);
      if (result !== false) {
        navigate("/dashboard");
      } else {
        setError("Niepoprawne dane logowania");
      }
    } catch (err) {
      setError("Błąd logowania");
    }
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/info">Info</Link></li>
            <li><Link to="/login">Zaloguj</Link></li>
          </ul>
        </nav>
      </header>
      <div className="centered">
        <form onSubmit={handleSubmit}>
          <h2>Zaloguj się</h2>
          <div>
            <label>Email:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Hasło:</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Zaloguj</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        </div>
    </>
  );
}

export default LoginView;
