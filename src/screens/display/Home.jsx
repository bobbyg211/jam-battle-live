import logo from "../../assets/jam-battle-logo.png";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="home container">
      <div className="content">
        <img src={logo} alt="Jam Battle Logo" />
        <h1>8 Artists. 3 Judges. 1 Winner.</h1>
        <Link to="/display/stages" className="start-btn">
          Press Start
        </Link>
      </div>
    </div>
  );
}
