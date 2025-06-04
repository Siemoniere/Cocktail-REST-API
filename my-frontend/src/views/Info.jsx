import { Link } from "react-router-dom";

function Info() {
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
        <h1>Informacje o aplikacji</h1>
        <h3>To jest podstrona /info</h3>
        <p>
          Ta aplikacja jest przykładem prostego panelu do zarządzania koktajlami i składnikami.
          Możesz przeglądać dostępne koktajle, dodawać nowe składniki i zarządzać istniejącymi.
        </p>
      </div>
    </>
  );
}

export default Info;
