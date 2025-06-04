import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={{ marginBottom: "1rem" }}>
      <Link to="/">Dashboard</Link> |{" "}
      <Link to="/ingredients">Składniki</Link> |{" "}
      <Link to="/cocktails">Koktajle</Link> |{" "}
      <Link to="/manage">Zarządzanie</Link>
    </nav>
  );
}
