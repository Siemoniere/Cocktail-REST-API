import { Link } from "react-router-dom";

function Home() {
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
            <h1>Witaj w panelu głównym</h1>
            <p>Tutaj możesz przeglądać koktajle i składniki.</p>
        </div>
    </>
    
  );
}

export default Home;
