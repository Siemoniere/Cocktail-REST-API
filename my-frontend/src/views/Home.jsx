import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ email, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Witaj, {email}</h2>
      <button onClick={handleLogout}>Wyloguj</button>
    </div>
  );
}

export default Home;
